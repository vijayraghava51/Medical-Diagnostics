from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load the model
model = tf.keras.models.load_model("backend/model/xray_model.h5")

# Preprocess image to fit model input
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("L")  # Grayscale
    image = image.resize((150, 150))  # Match model input shape
    image_array = np.array(image) / 255.0  # Normalize
    image_array = image_array.reshape(1, 150, 150, 1)  # Add batch & channel
    return image_array

@app.route("/")
def home():
    return "Medical X-ray Classifier API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        image_bytes = file.read()
        img = preprocess_image(image_bytes)
        prediction = model.predict(img)[0]

        predicted_class = "Pneumonia" if prediction[0] > 0.5 else "Normal"

        return jsonify({
            "prediction": predicted_class,
            "confidence": float(prediction[0])
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
