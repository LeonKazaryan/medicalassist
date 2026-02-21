import os
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from providers import GPTOSSProvider
from src.ai.config import GPT_OSS_API_KEY, MODEL_PATH, DB_PATH, COLLECTION_NAME, BASE_URL


app = FastAPI(title="QazCode Medical AI")

print("Загрузка AI компонентов...")
encoder = SentenceTransformer(MODEL_PATH)
qdrant = QdrantClient(path=DB_PATH)
llm = GPTOSSProvider(GPT_OSS_API_KEY, BASE_URL)
print("AI сервис готов к работе на порту 8000")

class DiagnosisRequest(BaseModel):
    text: str

@app.post("/diagnose")
async def diagnose(request: DiagnosisRequest):
    try:
        query_vector = encoder.encode(request.text).tolist()

        search_result = qdrant.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            limit=5
        ).points

        context_parts = []
        for point in search_result:
            p = point.payload
            chunk = f"ПРОТОКОЛ: {p['title']}\nРАЗДЕЛ: {p['section']}\nСОДЕРЖАНИЕ: {p['content']}\nМКБ: {p.get('icd_codes', [])}"
            context_parts.append(chunk)
        
        context = "\n\n---\n\n".join(context_parts)

        print(f"🧠 Запрос к GPT-OSS для: {request.text[:50]}...")
        result = await llm.get_diagnosis(request.text, context)
        
        return result

    except Exception as e:
        print(f"❌ Ошибка: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)