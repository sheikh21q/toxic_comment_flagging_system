import gdown
import os
import torch
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F

# === CONFIGURATION ===
MODEL_PATH = "./final_toxic_model"
if not os.path.exists(MODEL_PATH):
    gdown.download_folder("https://drive.google.com/drive/folders/1MwfRkW3pyCCys3OzccfdTBGzGbrXhltB?usp=sharing ", quiet=False)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === LOAD MODEL + TOKENIZER ===
print("[INFO] Loading model from:", MODEL_PATH)

try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
    model.to(DEVICE)
    model.eval()
    print("[INFO] Model and tokenizer loaded successfully.")
except Exception as e:
    print("[ERROR] Failed to load model or tokenizer:\n")
    print(e)
    exit(1)

# === FLASK APP ===
app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    comment = data.get("comment", "")
    if not comment:
        return jsonify({"error": "No comment provided"}), 400

    try:
        inputs = tokenizer(
            comment,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=512
        ).to(DEVICE)

        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probs = F.softmax(logits, dim=1)
            predicted_class = torch.argmax(probs, dim=1).item()
            confidence = round(probs[0][predicted_class].item(), 2)

        label = "TOXIC" if predicted_class == 1 else "NON-TOXIC"
        print(f"[PREDICTION] Comment: {comment}")
        print(f"[PREDICTION] Label: {label}, Confidence: {confidence}")

        return jsonify({
            "prediction": predicted_class,
            "label": label,
            "confidence": confidence
        })

    except Exception as e:
        print("[ERROR] Prediction failed:\n", e)
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500

# === RUN SERVER ===
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
