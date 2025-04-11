import os
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from data_preprocessing import preprocess_dataset

# ✅ Dataset path from kagglehub
base_path = r"C:\Users\medhu\.cache\kagglehub\datasets\paultimothymooney\chest-xray-pneumonia\versions\2\chest_xray"

print("📦 Loading dataset...")
data = preprocess_dataset(base_path)
X_train, y_train = data['train']
X_test, y_test = data['test']
X_val, y_val = data['val']

print("📊 Data shapes:")
print("Train:", X_train.shape, y_train.shape)
print("Test:", X_test.shape, y_test.shape)
print("Val:", X_val.shape, y_val.shape)

# 🧠 Build CNN Model
model = Sequential([
    Conv2D(32, (3,3), activation='relu', input_shape=(150,150,1)),
    MaxPooling2D(pool_size=(2,2)),

    Conv2D(64, (3,3), activation='relu'),
    MaxPooling2D(pool_size=(2,2)),

    Conv2D(128, (3,3), activation='relu'),
    MaxPooling2D(pool_size=(2,2)),

    Flatten(),
    Dropout(0.5),
    Dense(64, activation='relu'),
    Dense(1, activation='sigmoid')  # Binary classification: Normal or Pneumonia
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# 🚀 Train the model
print("🚀 Training model...")
history = model.fit(X_train, y_train, validation_data=(X_val, y_val), epochs=10, batch_size=32)

# 💾 Save the model
model_dir = r"D:\Projects\Medical image classifier\backend\model"
model_path = os.path.join(model_dir, "xray_model.h5")

# Ensure model directory exists
os.makedirs(model_dir, exist_ok=True)

model.save(model_path)
print(f"✅ Model successfully saved to: {model_path}")
