import os
from dotenv import load_dotenv

load_dotenv()
GPT_OSS_API_KEY = os.getenv("GPT_OSS_API_KEY")

MODEL_PATH = "./src/ai/models/multilingual-e5-small"
DB_PATH = "./src/ai/vector_db"
COLLECTION_NAME = "protocols"

# Use the environment variable for the base URL, defaulting to the one provided by the user
# Added /v1 as it is commonly required for OpenAI-compatible APIs
BASE_URL = os.getenv("GPT_OSS_BASE_URL", "https://hub.qazcode.ai/v1")