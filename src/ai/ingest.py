import json
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
from tqdm import tqdm
from src.ai.config import MODEL_PATH, DB_PATH, COLLECTION_NAME
import re

model = SentenceTransformer(MODEL_PATH)
client = QdrantClient(path=DB_PATH)

def clean_medical_text(text):
    text = re.sub(r'\[\d+[\d\s,\-]*\]', '', text)
    text = text.replace('\n', ' ').replace('\r', ' ')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def ingest_from_json(file_path):
    if not client.collection_exists(COLLECTION_NAME):
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f) 

    points = []
    idx = 0

    for item in tqdm(data, desc="Индексация"):
        protocol_id = item.get("protocol_id")
        title = item.get("true_title", "Unknown")
        icd_codes = item.get("icd_codes", [])
        
        for section in item.get("sections", []):
            content = clean_medical_text(section.get("content", ""))
            sec_type = section.get("type", "unknown")
            
            if len(content) < 50: 
                continue
                
            text_to_vector = f"Протокол: {title}. Раздел: {sec_type}. Содержание: {content}"
            
            vector = model.encode(text_to_vector).tolist()
            
            points.append(PointStruct(
                id=idx,
                vector=vector,
                payload={
                    "protocol_id": protocol_id,
                    "title": title,
                    "icd_codes": icd_codes,
                    "section": sec_type,
                    "content": content
                }
            ))
            idx += 1
            
            if len(points) >= 50:
                client.upsert(COLLECTION_NAME, points)
                points = []
                
    if points:
        client.upsert(COLLECTION_NAME, points)
    print(f"Индексация завершена! Создано {idx} векторов.")

if __name__ == "__main__":
    ingest_from_json("processed_protocols.json")