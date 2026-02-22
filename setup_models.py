from sentence_transformers import SentenceTransformer
import os

model_path = "./src/ai/models/multilingual-e5-small"
os.makedirs(model_path, exist_ok=True)

print("📥 Скачиваю модель эмбеддингов...")
model = SentenceTransformer('intfloat/multilingual-e5-small')
model.save(model_path)
print(f"✅ Модель сохранена в {model_path}")