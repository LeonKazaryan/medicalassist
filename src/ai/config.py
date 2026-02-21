import os
from dotenv import load_dotenv

load_dotenv()
GPT_OSS_API_KEY = os.getenv("GPT_OSS_API_KEY")

MODEL_PATH = "./src/ai/models/multilingual-e5-small"
DB_PATH = "./src/ai/vector_db"
COLLECTION_NAME = "protocols"

BASE_URL = "https://hub.qazcode.ai" 