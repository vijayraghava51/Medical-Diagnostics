import os
from PIL import Image
import numpy as np
from tqdm import tqdm

def load_images_from_folder(folder, image_size=(150, 150)):
    images = []
    labels = []
    label_map = {"NORMAL": 0, "PNEUMONIA": 1}
    
    for label_name in ["NORMAL", "PNEUMONIA"]:
        path = os.path.join(folder, label_name)
        if not os.path.exists(path):
            print(f"Warning: {path} not found.")
            continue
        for filename in tqdm(os.listdir(path), desc=f"Loading {label_name}"):
            try:
                img_path = os.path.join(path, filename)
                img = Image.open(img_path).convert("L")  # convert to grayscale
                img = img.resize(image_size)
                images.append(np.array(img) / 255.0)  # normalize
                labels.append(label_map[label_name])
            except Exception as e:
                print(f"Error loading {filename}: {e}")
    
    return np.array(images).reshape(-1, 150, 150, 1), np.array(labels)

def preprocess_dataset(base_dir):
    dataset = {}
    for split in ["train", "test", "val"]:
        split_path = os.path.join(base_dir, split)
        X, y = load_images_from_folder(split_path)
        dataset[split] = (X, y)
    return dataset

# === MAIN EXECUTION ===

if __name__ == "__main__":
    # ✅ Replace this with your downloaded dataset path
    base_path = r"C:\Users\medhu\.cache\kagglehub\datasets\paultimothymooney\chest-xray-pneumonia\versions\2\chest_xray"

    data = preprocess_dataset(base_path)

    print("✅ Dataset loaded successfully!")
    print(f"Training samples: {len(data['train'][0])}")
    print(f"Testing samples: {len(data['test'][0])}")
    print(f"Validation samples: {len(data['val'][0])}")
