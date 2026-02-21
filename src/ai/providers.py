import json
from openai import AsyncOpenAI

class GPTOSSProvider:
    def __init__(self, api_key: str, base_url: str):
        self.client = AsyncOpenAI(
            base_url=base_url,
            api_key=api_key
        )
        self.model = "oss-120b"

    async def get_diagnosis(self, symptoms: str, context: str = None):
        """
        symptoms: текст от пользователя
        context: найденные куски протоколов (пока можем тестить без них)
        """
        
        system_prompt = (
            "Ты — профессиональный медицинский ассистент, специализирующийся на клинических протоколах Республики Казахстан. "
            "Твоя задача: проанализировать симптомы и сопоставить их с официальными рекомендациями. "
            "Отвечай строго в формате JSON."
        )

        user_content = f"Симптомы пациента: {symptoms}\n\n"
        if context:
            user_content += f"Используй этот контекст из протоколов РК для точности:\n{context}"
        else:
            user_content += "У меня пока нет доступа к конкретному протоколу, ответь на основе своих общих медицинских знаний, но укажи, что это предварительно."

        user_content += (
            "\n\nВерни JSON объект с полями:\n"
            "- diagnoses: список из 3 объектов (rank, icd_code, name, explanation)\n"
            "- confidence: число от 0 до 1 (твоя уверенность)"
        )

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                temperature=0.2, # Низкая температура для стабильности
                max_tokens=1500
            )
            
            # Парсим JSON из ответа
            content = response.choices[0].message.content
            # Иногда модели добавляют лишний текст вокруг JSON, чистим его
            json_str = content.strip()
            if "```json" in json_str:
                json_str = json_str.split("```json")[1].split("```")[0].strip()
            
            return json.loads(json_str)
        
        except Exception as e:
            return {"error": f"Ошибка при вызове Hub API: {str(e)}", "raw_response": content if 'content' in locals() else None}