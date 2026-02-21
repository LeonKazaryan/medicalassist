from src.ai.providers import GPTOSSProvider
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

class DiagnosisEngine:
    def __init__(self, api_key, hub_url, vector_db_path, model_path):
        self.llm = GPTOSSProvider(api_key, hub_url)
        self.encoder = SentenceTransformer(model_path)
        self.vector_db = QdrantClient(path=vector_db_path)
        self.collection_name = "protocols"

    async def diagnose_patient(self, user_text: str):
        query_vector = self.encoder.encode(user_text).tolist()
        search_results = self.vector_db.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=5  
        )

        context_parts = []
        for res in search_results:
            part = (
                f"Протокол: {res.payload['title']}\n"
                f"Раздел: {res.payload['section']}\n"
                f"Содержание: {res.payload['content']}\n"
                f"Коды МКБ: {res.payload['icd_codes']}\n"
            )
            context_parts.append(part)
        
        context = "\n---\n".join(context_parts)

        print(f"Найдено {len(search_results)} релевантных кусков протоколов. Отправляю в LLM...")
        final_response = await self.llm.get_diagnosis(user_text, context)
        
        return final_response