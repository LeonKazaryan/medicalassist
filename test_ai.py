import asyncio
from src.ai.providers import GPTOSSProvider
from src.ai.config import GPT_OSS_API_KEY, BASE_URL

async def test():
    llm = GPTOSSProvider(GPT_OSS_API_KEY, BASE_URL)
    symptoms = "Сильная головная боль, тошнота, светобоязнь"
    context = "ПРОТОКОЛ: Мигрень без ауры\nКОДЫ: G43.0\nТЕКСТ: Острое состояние, характеризующееся пульсирующей головной болью...\n\nПРОТОКОЛ: Напряженная головная боль\nКОДЫ: G44.2\nТЕКСТ: Давящая боль по типу каски..."
    
    result = await llm.get_diagnosis(symptoms, context)
    print("AI Response:")
    import json
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(test())
