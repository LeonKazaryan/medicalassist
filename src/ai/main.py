import os
import uvicorn
import re
import json
import asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from .providers import GPTOSSProvider
from .config import GPT_OSS_API_KEY, MODEL_PATH, DB_PATH, COLLECTION_NAME, BASE_URL

app = FastAPI(title="QazCode Medical AI - Dual RAG")

encoder, qdrant, llm = None, None, None

@app.on_event("startup")
async def startup_event():
    global encoder, qdrant, llm
    print("⌛ Загрузка AI компонентов...")
    encoder = SentenceTransformer(MODEL_PATH)
    qdrant = QdrantClient(path=DB_PATH)
    llm = GPTOSSProvider(GPT_OSS_API_KEY, BASE_URL)
    print("✅ Система готова.")

class DiagnosisRequest(BaseModel):
    text: str

async def get_clinical_keywords(user_text: str):
    prompt = (
        f"Выступи в роли опытного врача. Перепиши жалобы пациента в короткое, сухое медицинское саммари (анамнез). "
        f"Используй профессиональные термины. Убери эмоции.\n\n"
        f"Текст пациента: {user_text}\n\n"
        f"Верни ТОЛЬКО текст саммари."
    )
    try:
        response = await llm.client.chat.completions.create(
            model=llm.model, # Используем основную модель (flash)
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )
        return response.choices[0].message.content
    except Exception as e:
        if "429" in str(e):
            print("⏳ Лимит на NER, жду 15 сек...")
            await asyncio.sleep(15)
            response = await llm.client.chat.completions.create(
                model=llm.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1
            )
            return response.choices[0].message.content
        print(f"⚠️ Ошибка NER: {e}")
        return user_text

@app.post("/diagnose")
async def diagnose(request: DiagnosisRequest):
    unique_protocols = [] # Инициализация для Fallback
    try:
        query_text_raw = request.text
        print(f"\n📥 Вход: {query_text_raw[:100]}...")
        
        # 1. ШАГ: Извлекаем клинические термины (Medical Summary)
        med_summary = await get_clinical_keywords(query_text_raw)
        print(f"📋 Саммари: {med_summary}")

        await asyncio.sleep(4.1)

        # 2. ШАГ: ДВОЙНОЙ ПОИСК
        vector_raw = encoder.encode(f"query: {query_text_raw[:1000]}").tolist()
        res_raw = qdrant.query_points(collection_name=COLLECTION_NAME, query=vector_raw, limit=30).points
        
        vector_med = encoder.encode(f"query: {med_summary[:1000]}").tolist()
        res_med = qdrant.query_points(collection_name=COLLECTION_NAME, query=vector_med, limit=30).points

        # Объединяем результаты
        all_results_dict = {p.id: p for p in res_raw + res_med}
        all_results = list(all_results_dict.values())

        # 3. ШАГ: Heavy Boosting с защитой от Стоп-слов
        scored_results = []
        q_lower = query_text_raw.lower()

        for point in all_results:
            p = point.payload
            score = point.score # Берем чистый векторный скор
            icd_codes = [str(c).upper().replace('О', 'O') for c in p.get('icd_codes', [])]

            # БУСТИНГ ПО КОДАМ МКБ (Оставляем, это хард-факты)
            for code in icd_codes:
                if len(code) > 2 and code.lower() in q_lower:
                    score += 10.0 # Поднимаем, только если юзер реально ввел код

            scored_results.append((score, point))

        scored_results.sort(key=lambda x: x[0], reverse=True)
        
        seen_ids = set()
        for s, p in scored_results:
            pid = p.payload['protocol_id']
            if pid not in seen_ids:
                unique_protocols.append(p)
                seen_ids.add(pid)
            if len(unique_protocols) >= 5: break
            
        if not unique_protocols:
            raise ValueError("No protocols found.")

        # 4. ШАГ: Сборка контекста
        context_parts = []
        for p in unique_protocols:
            payload = p.payload
            context_parts.append(
                f"ПРОТОКОЛ: {payload['title']}\n"
                f"КОДЫ: {', '.join(payload['icd_codes'])}\n"
                f"ТЕКСТ: {payload['content'][:1500]}"
            )
        context = "\n\n---\n\n".join(context_parts)

        # 5. ШАГ: Генерация ответа через LLM
        print(f"🧠 LLM анализирует Топ-1: {unique_protocols[0].payload['title']}")
        try:
            result = await llm.get_diagnosis(query_text_raw, context)
            
            # Проверяем, не вернул ли провайдер ошибку
            if isinstance(result, dict) and result.get("error"):
                raise ValueError(result["error"])

            if isinstance(result, dict) and "diagnoses" in result:
                diagnoses_list = result["diagnoses"]
                if not diagnoses_list:
                    raise ValueError("LLM вернула пустой список диагнозов")

                # АВТО-ФИКС КОДОВ, ЕСЛИ LLM ВЕРНУЛА NULL ИЛИ UNKNOWN
                for i, d in enumerate(diagnoses_list):
                    if not d.get("icd_code") or d.get("icd_code") == "Unknown" or d.get("icd_code") is None:
                        ref_p = unique_protocols[min(i, len(unique_protocols)-1)]
                        
                        # --- ТОЧЕЧНЫЙ ФИКС ВЫБОРА КОДА ---
                        codes = ref_p.payload.get('icd_codes', [])
                        best_code = "Unknown"
                        if codes:
                            # Ищем код с точкой (он точнее)
                            specific_codes = [c for c in codes if '.' in c]
                            best_code = specific_codes[0] if specific_codes else codes[-1]
                        
                        d["icd_code"] = best_code
                
                print("✅ LLM ответила успешно!")
                return result
            else:
                raise ValueError(f"LLM вернула битый JSON или неверный формат: {str(result)[:100]}")
                
        except Exception as e:
            print(f"❌❌ ОШИБКА LLM: {str(e)}")
            raise e # Уходим в Fallback

    except Exception as e:
        print(f"⚠️ Работает Fallback: {e}")
        fallback = []
        # Fallback берет топ-3 из найденных протоколов
        for i, p in enumerate(unique_protocols[:3] if 'unique_protocols' in locals() else []):
            
            # --- ТОТ ЖЕ УМНЫЙ ВЫБОР КОДА ДЛЯ ФОЛЛБЕКА ---
            codes = p.payload.get('icd_codes', [])
            best_code = "Unknown"
            if codes:
                specific_codes = [c for c in codes if '.' in c]
                best_code = specific_codes[0] if specific_codes else codes[-1]

            fallback.append({
                "rank": i + 1,
                "icd_code": best_code,
                "name": p.payload['title'],
                "explanation": f"Диагноз подобран на основе семантического поиска РК: {p.payload['title']}."
            })
            
        # Если unique_protocols пустой (ошибка в поиске)
        if not fallback:
             fallback = [{"rank": 1, "icd_code": "Unknown", "name": "Error", "explanation": "System Failure"}]
             
        return {"diagnoses": fallback, "confidence": 0.5}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)