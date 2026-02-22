FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync --frozen

# Кешируем тяжелые операции: модели и индексацию
COPY setup_models.py ./
COPY src/ai/config.py ./src/ai/
COPY processed_protocols.json ./
ENV PATH="/app/.venv/bin:$PATH"
RUN python setup_models.py

COPY src/ai/ingest.py ./src/ai/
RUN python src/ai/ingest.py

# Копируем остальной код (это быстро)
COPY src/ ./src/
RUN touch .env

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "src.ai.main:app", "--host", "0.0.0.0", "--port", "8000"]