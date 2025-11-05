import os
import numpy as np
from PIL import Image
from config import IMAGE_SIZE, DATA_DIR

def get_images_and_classes(data_dir):
    images = []
    classes = []
    
    for class_dir in os.listdir(data_dir):
        class_path = os.path.join(data_dir, class_dir)
        if os.path.isdir(class_path):
            for img_file in os.listdir(class_path):
                if img_file.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
                    images.append(os.path.join(class_path, img_file))
                    classes.append(class_dir)
    
    return images, classes


def preprocess_images(image_paths, target_size=IMAGE_SIZE):
    processed_images = []
    for img_path in image_paths:
        img = Image.open(img_path).convert('RGB')
        img = img.resize(target_size)
        img_array = np.array(img) / 255.0  # Normalize to [0, 1]
        processed_images.append(img_array)
    return np.array(processed_images)