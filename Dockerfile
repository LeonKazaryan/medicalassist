# Используем легкий Python образ
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем системные зависимости (если нужны)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Копируем файлы зависимостей
COPY pyproject.toml uv.lock ./

# Устанавливаем uv и зависимости
RUN pip install uv && uv sync --frozen

# Копируем весь исходный код и данные
COPY src/ ./src/
COPY processed_protocols.json ./
COPY setup_models.py ./
COPY .env.example ./.env 
# ВАЖНО: .env копируем как заглушку, реальные ключи жюри прокинет через docker run -e

# --- СТАДИЯ СБОРКИ (BUILD TIME) ---

# 1. Скачиваем модель эмбеддингов (чтобы не качать в рантайме)
# Активируем виртуальное окружение uv для выполнения команд
ENV PATH="/app/.venv/bin:$PATH"
RUN python setup_models.py

# 2. Собираем векторную базу данных (Qdrant) из JSON
# Это гарантирует, что база свежая и соответствует коду
RUN python src/ai/ingest.py

# --- СТАДИЯ ЗАПУСКА (RUNTIME) ---

# Открываем порт
EXPOSE 8000

# Запускаем FastAPI сервер
CMD ["uv", "run", "uvicorn", "src.ai.main:app", "--host", "0.0.0.0", "--port", "8000"]