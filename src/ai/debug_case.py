import json
import re
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from config import MODEL_PATH, DB_PATH, COLLECTION_NAME

# Инициализация
encoder = SentenceTransformer(MODEL_PATH)
qdrant = QdrantClient(path=DB_PATH)

def debug_test_case(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        test_case = json.load(f)
    
    query = test_case['query']
    gt_code = test_case['gt']
    
    print(f"📝 ТЕСТОВЫЙ КЕЙС: {file_path}")
    print(f"❓ ЗАПРОС: {query}")
    print(f"🎯 ОЖИДАЕМЫЙ КОД (GT): {gt_code}")
    print("-" * 50)

    # 1. Поиск
    query_vector = encoder.encode(f"query: {query}").tolist()
    results = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=20
    ).points

    print(f"🔎 РЕЗУЛЬТАТЫ ПОИСКА (Top 10):")
    found_correct_protocol = False
    
    for i, res in enumerate(results[:10]):
        p = res.payload
        is_hit = gt_code in p['icd_codes']
        if is_hit: found_correct_protocol = True
        
        marker = "✅ [МЭТЧ!]" if is_hit else "❌"
        print(f"{i+1}. {marker} Score: {res.score:.4f} | Title: {p['title']} | ICD: {p['icd_codes']}")
        # print(f"   Текст: {p['content'][:150]}...") # Раскомментируй, если хочешь видеть текст

    if not found_correct_protocol:
        print("\n🆘 КРИТИЧЕСКАЯ ОШИБКА: Правильный протокол ДАЖЕ НЕ НАЙДЕН в Top-10!")
        print("Это значит, что проблема в ЭМБЕДДИНГАХ или ИНДЕКСАЦИИ.")
    else:
        print("\n✅ Протокол найден в поиске, но LLM выбрала не его.")
        print("Это значит, что проблема в ПРОМПТЕ или РАНЖИРОВАНИИ.")

if __name__ == "__main__":
    # Выбери любой файл из data/test_set, который завалился
    debug_test_case("data/test_set/p_00f19c934c_718_17022026.json")