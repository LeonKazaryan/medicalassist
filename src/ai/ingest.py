import json
import re
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
from tqdm import tqdm
from config import MODEL_PATH, DB_PATH, COLLECTION_NAME

# Загружаем модель
model = SentenceTransformer(MODEL_PATH)
client = QdrantClient(path=DB_PATH)

def clean_medical_text(text):
    if not text: return ""
    text = re.sub(r'\[\d+[\d\s,\-]*\]', '', text)
    text = re.sub(r'\(\s*УД\s*-\s*[A-ZА-Я]\s*\)', '', text)
    text = re.sub(r'\b\d+(\.\d+)+\b', '', text)
    text = re.sub(r'[•\t\-_–—]', ' ', text)
    text = text.replace('\n', ' ').replace('\r', ' ')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def chunk_text(text, chunk_size=1000, overlap=200):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += (chunk_size - overlap)
    return chunks

def clean_title(title):
    t = title.replace("ДИАГНОСТИКИ И ЛЕЧЕНИЯ", "").replace("КЛИНИЧЕСКИЙ ПРОТОКОЛ", "")
    t = re.sub(r'\s+[IVX1-9]$', '', t) 
    return t.strip()

def extract_all_codes(item):
    # Собираем текст из первых 2000 символов (там обычно основные коды)
    intro_text = " ".join([s.get("content", "") for s in item.get("sections", [])])[:2000]
    intro_text += " " + " ".join(item.get("icd_codes", []))
    
    intro_text = intro_text.upper().translate(str.maketrans("ОАВСКМЕ", "OABCKME"))
    
    # Регулярка для кодов
    codes = re.findall(r'[A-Z]\d{2}(?:\.\d{1,2})?', intro_text)
    
    # Убираем "витаминные" и шумовые коды, если есть другие
    clean_codes = [c for c in codes if not c.startswith(('B12', 'E55', 'D64'))]
    if not clean_codes: clean_codes = codes
    
    return list(dict.fromkeys(clean_codes))

def ingest_from_json(file_path):
    print(f"🔄 Пересоздаю коллекцию {COLLECTION_NAME}...")
    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=384, distance=Distance.COSINE),
    )

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f) 

    points = []
    idx = 0

    for item in tqdm(data, desc="Индексация"):
        protocol_id = item.get("protocol_id")
        raw_title = item.get("true_title", "Unknown")
        title = clean_title(raw_title)
        
        # ВЫТАСКИВАЕМ ВСЕ КОДЫ ДЛЯ ВСЕГО ПРОТОКОЛА ОДИН РАЗ
        all_protocol_codes = extract_all_codes(item)
        icd_str = ", ".join(all_protocol_codes)
        
        for section in item.get("sections", []):
            sec_type = section.get("type", "unknown")
            # Индексируем только важные секции для Accuracy
            if sec_type not in ["complaints", "criteria", "definition"]:
                continue

            content = clean_medical_text(section.get("content", ""))
            if len(content) < 30: continue
            
            chunks = chunk_text(content)
            for chunk in chunks:
                # ВЕКТОР ТЕПЕРЬ ВКЛЮЧАЕТ ВСЕ КОДЫ!
                text_to_vector = f"passage: ПРОТОКОЛ: {title}. КОДЫ МКБ: {icd_str}. ТЕКСТ: {chunk}"
                
                vector = model.encode(text_to_vector).tolist()
                
                points.append(PointStruct(
                    id=idx,
                    vector=vector,
                    payload={
                        "protocol_id": protocol_id,
                        "title": title,
                        "icd_codes": all_protocol_codes, # ТУТ ТЕПЕРЬ СПИСОК КОДОВ
                        "section": sec_type,
                        "content": chunk
                    }
                ))
                idx += 1
                
                if len(points) >= 100:
                    client.upsert(COLLECTION_NAME, points)
                    points = []
                
    if points:
        client.upsert(COLLECTION_NAME, points)
    print(f"✅ Готово! Создано {idx} векторов.")

if __name__ == "__main__":
    ingest_from_json("processed_protocols.json")