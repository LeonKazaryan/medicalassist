import argparse
import json
import time
import requests
from pathlib import Path
from tqdm import tqdm
import random

def run_evaluation(endpoint, data_dir, team_name):
    data_path = Path(data_dir)
    test_files = list(data_path.glob("*.json"))

    random.shuffle(test_files)
    test_files = test_files[:20]
    
    if not test_files:
        print(f"❌ Ошибка: В директории {data_dir} не найдено JSON файлов.")
        return

    results = []
    metrics = {
        "accuracy_at_1": 0,
        "recall_at_3": 0,
        "total_latency": 0,
        "count": 0
    }

    print(f"🚀 Начинаю валидацию для команды: {team_name}")
    print(f"📈 Всего тестов: {len(test_files)}")

    for test_file in tqdm(test_files, desc="Eval"):
        with open(test_file, 'r', encoding='utf-8') as f:
            test_case = json.load(f)
        
        query = test_case.get("query")
        ground_truth = test_case.get("gt") # Ожидаемый код МКБ-10

        start_time = time.time()
        try:
            response = requests.post(endpoint, json={"text": query}, timeout=120)
            response.raise_for_status()
            prediction = response.json()
        except Exception as e:
            print(f"\n❌ Ошибка на файле {test_file.name}: {e}")
            continue

        latency = (time.time() - start_time) * 1000 # в мс
        
        # Извлекаем предсказанные коды
        # Ожидаем формат: {"diagnoses": [{"icd_code": "O14.2"}, ...]}
        predicted_diagnoses = prediction.get("diagnoses", [])
        predicted_codes = [d.get("icd_code") for d in predicted_diagnoses]

        # Метрики
        metrics["count"] += 1
        metrics["total_latency"] += latency

        # Accuracy@1: Первый код совпал с GT
        if predicted_codes and str(predicted_codes[0]).strip() == str(ground_truth).strip():
            metrics["accuracy_at_1"] += 1

        # Recall@3: GT есть среди топ-3 предсказанных
        if any(str(code).strip() == str(ground_truth).strip() for code in predicted_codes[:3]):
            metrics["recall_at_3"] += 1

        results.append({
            "file": test_file.name,
            "gt": ground_truth,
            "pred": predicted_codes[:3],
            "latency": round(latency, 2)
        })

    # Итоговые расчеты
    count = metrics["count"]
    if count > 0:
        final_acc = metrics["accuracy_at_1"] / count
        final_recall = metrics["recall_at_3"] / count
        avg_latency = metrics["total_latency"] / count

        print("\n" + "="*30)
        print(f"🏁 РЕЗУЛЬТАТЫ: {team_name}")
        print(f"✅ Accuracy@1: {final_acc:.4f}")
        print(f"🎯 Recall@3:   {final_recall:.4f}")
        print(f"⚡ Avg Latency: {avg_latency:.2f} ms")
        print("="*30)

        # Сохранение результатов в папку data/evals
        output_dir = Path("data/evals")
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file = output_dir / f"{team_name}_results.json"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                "team": team_name,
                "metrics": {
                    "accuracy_at_1": final_acc,
                    "recall_at_3": final_recall,
                    "avg_latency": avg_latency
                },
                "details": results
            }, f, indent=2, ensure_ascii=False)
        print(f"📄 Подробный отчет сохранен в {output_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-e", "--endpoint", required=True, help="URL вашего API /diagnose")
    parser.add_argument("-d", "--data_dir", required=True, help="Путь к папке test_set")
    parser.add_argument("-n", "--team_name", required=True, help="Имя вашей команды")
    
    args = parser.parse_args()
    run_evaluation(args.endpoint, args.data_dir, args.team_name)