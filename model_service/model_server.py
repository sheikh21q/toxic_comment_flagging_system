from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = Flask(__name__)
CORS(app)

# Load tokenizer and model from local folder
model_path = "./final_toxic_model"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    comment = data.get("comment", "")
    inputs = tokenizer(comment, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()

    return jsonify({"prediction": predicted_class})

if __name__ == "__main__":
    app.run(port=5000)
