import json
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from config import MODEL_PATH, DB_PATH, COLLECTION_NAME

# Инициализация
encoder = SentenceTransformer(MODEL_PATH)
client = QdrantClient(path=DB_PATH)

def inspect_database():
    print(f"--- ИНСПЕКЦИЯ БАЗЫ: {COLLECTION_NAME} ---")
    
    # 1. Проверка количества
    count = client.count(collection_name=COLLECTION_NAME).count
    print(f"📊 Всего векторов: {count}")

    # 2. Выборка 3 случайных точек
    print("\n🔍 ПРИМЕРЫ ДАННЫХ В БАЗЕ:")
    points, _ = client.scroll(collection_name=COLLECTION_NAME, limit=3, with_payload=True)
    
    for p in points:
        payload = p.payload
        print(f"ID: {p.id}")
        print(f"Название: {payload.get('title')}")
        print(f"Коды МКБ: {payload.get('icd_codes')}")
        print(f"Раздел: {payload.get('section')}")
        print(f"Текст (первые 200 симв): {payload.get('content')[:200]}...")
        print("-" * 30)

    # 3. ТЕСТОВЫЙ ПОИСК (Давай проверим, почему вылезает психиатрия)
    # Попробуем запрос, который у нас провалился (например, про опухоль)
    test_query = "Опухоль головного мозга, головная боль, тошнота"
    print(f"\n🧪 ТЕСТОВЫЙ ПОИСК ПО ЗАПРОСУ: '{test_query}'")
    
    query_vector = encoder.encode(f"query: {test_query}").tolist()
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=5
    ).points

    for i, res in enumerate(results):
        print(f"{i+1}. [{res.score:.4f}] {res.payload['title']} | ICD: {res.payload['icd_codes']}")

if __name__ == "__main__":
    inspect_database()