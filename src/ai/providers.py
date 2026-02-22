import json
from openai import AsyncOpenAI

class GPTOSSProvider:
    def __init__(self, api_key: str, base_url: str):
        self.client = AsyncOpenAI(
            base_url=base_url,
            api_key=api_key
        )
        self.model = "gemini-3-flash-preview"
        

    async def get_diagnosis(self, symptoms: str, context: str = None):
        """
        symptoms: текст от пользователя
        context: найденные куски протоколов (пока можем тестить без них)
        """
        
        system_prompt = """
            Ты — эксперт по кодированию МКБ-10. Твоя главная задача: выдать правильный код.

        ПРАВИЛА:
        1. В поле "icd_code" пиши ТОЛЬКО код (например, G91.1). 
        2. Обязательно бери код из предоставленного контекста протоколов. Если в протоколе "ГИДРОЦЕФАЛИЯ" указан код G91.1 — пиши его!
        3. Никогда не оставляй "icd_code" пустым или null.
        """

        user_content = f"Симптомы пациента: {symptoms}\n\n"
        if context:
            user_content += f"Используй этот контекст из протоколов РК для точности:\n{context}"
        else:
            user_content += "У меня пока нет доступа к конкретному протоколу, ответь на основе своих общих медицинских знаний, но укажи, что это предварительно."

        user_content += (
            "\n\nВерни JSON объект с полями:\n"
            "- diagnoses: список из 3 наиболее вероятных диагнозов. Для каждого укажи:\n"
            "  - rank: порядковый номер (от 1 до 3)\n"
            "  - icd_code: код МКБ-10\n"
            "  - name: название диагноза\n"
            "  - explanation: краткое обоснование\n"
            "  - confidence: твоя уверенность в этом конкретном диагнозе (число от 0.1 до 1.0)\n"
            "- overall_confidence: общая уверенность в ответе (число от 0.1 до 1.0)\n"
        )

        user_content += (
            "Ответь СТРОГО в формате JSON:\n"
            "{\n"
            "  \"diagnoses\": [\n"
            "    {\n"
            "      \"rank\": 1, \n"
            "      \"icd_code\": \"G43.0\", \n"
            "      \"name\": \"Мигрень без ауры\", \n"
            "      \"explanation\": \"Описание...\",\n"
            "      \"confidence\": 0.95\n"
            "    }\n"
            "  ],\n"
            "  \"overall_confidence\": 0.9\n"
            "}"
        )

        try:
            # Если у тебя логика пула ключей, тут должно быть self.client (или diag_client)
            # Я оставляю твой вызов, как он был
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                temperature=0.1, # Низкая температура для стабильности
                # УБРАЛИ response_format, так как он иногда ломает выдачу
            )
            
            content = response.choices[0].message.content
            
            # --- ТОЧЕЧНЫЙ ФИКС ПАРСИНГА ---
            import re
            # Ищем кусок текста, который начинается на { и заканчивается на }
            match = re.search(r'\{[\s\S]*\}', content)
            
            if match:
                json_str = match.group(0)
                return json.loads(json_str)
            else:
                # Если регулярка не нашла скобки, пробуем твой старый метод как запасной
                json_str = content.strip()
                if "```json" in json_str:
                    json_str = json_str.split("```json")[1].split("```")[0].strip()
                return json.loads(json_str)
        
        except Exception as e:
            # Возвращаем СТРОКУ или СЛОВАРЬ с ошибкой, чтобы main.py мог это поймать
            print(f"❌ Ошибка LLM API: {str(e)}")
            return {"error": f"Ошибка LLM: {str(e)}", "raw_response": content if 'content' in locals() else None}