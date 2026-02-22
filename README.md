# 🏥 QazCode Medical AI Assistant

> An AI-powered Clinical Decision Support System (CDSS) that maps patient symptoms to official Kazakhstan Clinical Protocols and ICD-10 codes with high precision.

---

## 🧠 AI Core: Hybrid Clinical RAG System

Our solution uses a **multi-stage reasoning pipeline** designed to bridge the gap between patient complaints (unstructured text) and official clinical protocols (structured medical knowledge).

### 🏗 Architecture Breakdown

#### 1. Input Processing & Clinical NER
The user's raw text is processed by an LLM (**Gemini 3 Flash Preview**) to extract specific clinical entities (symptoms, duration, negations).
*   **Goal:** Transform *"my tummy hurts on the right"* $\to$ `"abdominal pain, right upper quadrant, acute onset"`.

#### 2. Dual-Path Retrieval (Hybrid Search)
We perform two parallel vector searches in **Qdrant**:
*   **Path A:** Query using the **Raw User Text** (captures context and emotion).
*   **Path B:** Query using the **Medical Summary** (captures strict terminology).
*   **Embedding Model:** `intfloat/multilingual-e5-small` (optimized for Russian language).

#### 3. Heuristic Re-ranking (Boosting Engine)
Search results are re-ranked based on a custom scoring algorithm:
*   🔥 **Title Match:** Heavy boost if protocol title words appear in the query.
*   🎯 **ICD-10 Match:** Critical boost if a specific ICD code is mentioned.
*   *Result:* This ensures that protocols like "HELLP Syndrome" rank higher than generic "Pregnancy Complications" when symptoms match perfectly.

#### 4. Reasoning & Validation
*   The **Top-4 unique protocols** are assembled into a context window.
*   The LLM acts as a **Clinical Coder**, selecting the most appropriate diagnosis and explaining the reasoning based *only* on the provided context.
*   🛡 **Self-Correction:** If the LLM fails to output a strict JSON or hallucinates an ICD code, a robust fallback mechanism extracts the most probable code directly from the protocol metadata.

---

## 📊 Performance & Examples

*Tested configuration: Gemini 1.5 Flash (via API).*  
*Note: Due to API Rate Limits, validation was performed on subsets of the dataset.*

| Input Query (Snippet) | Clinical NER Extraction | Retrieved Protocol (Top-1) | Final Diagnosis |
| :--- | :--- | :--- | :--- |
| *"сильные боли в животе справа, тошнота, 34 неделя беременности..."* | Беременность 34 нед, интенсивный болевой синдром в правой половине живота, тошнота. | **HELLP-СИНДРОМ** | **O14.2** — HELLP-синдром |
| *"Сыну 6 лет... шунт из-за жидкости... рвёт натощак... косит глазиком..."* | Гидроцефалия, шунт, рвота натощак, фоточувствительность, парез взгляда, атаксия. | **ГИДРОЦЕФАЛИЯ І** | **G91.1** — Обструктивная гидроцефалия |
| *"Вчера вечером резко знобить начало, температура 39... голову распирает..."* | Острое начало, гипертермия 39°C, цефалгия, рвота, фотофобия, ригидность мышц. | **Менингококковая инфекция** | **A39.0** — Менингококковый менингит |

---

## 🚀 Getting Started

### Prerequisites
*   Python 3.11+
*   `uv` package manager (recommended)
*   Docker (optional)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourTeam/medical-ai.git
    cd medical-ai
    ```

2.  **Install dependencies:**
    ```bash
    uv sync
    source .venv/bin/activate
    ```

3.  **Setup Environment:**
    Create a `.env` file in the root directory:
    ```text
    GPT_OSS_API_KEY=your_key_here
    ```

### Running the System

1.  **Build the Knowledge Base (Ingest):**
    This script parses protocols and builds the local Qdrant index.
    ```bash
    uv run python src/ai/ingest.py
    ```

2.  **Start the AI Server:**
    ```bash
    uv run python src/ai/main.py
    ```
    *Server will start at `http://0.0.0.0:8000`*

3.  **Test with a Query:**
    ```bash
    curl -X POST http://localhost:8000/diagnose \
         -H "Content-Type: application/json" \
         -d '{"text": "сильные боли в животе, 34 неделя"}'
    ```

### 🐳 Docker Deployment

The Docker image automatically downloads models and builds the vector database upon build.

```bash
# Build the image
docker build -t medical-ai .

# Run the container (pass your API keys!)
docker run -p 8000:8000 --env-file .env medical-ai

```


Запуск Фронтенда 
```
cd frontend
npm run dev
```

Запуск Бэкенда 
```
cd backend
cd main-server
./mnvw spring-boot:run
```



