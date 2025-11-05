import os
import pickle
import numpy as np
import tensorflow as tf
from PIL import Image
from config import MODEL_PATH, CLASS_MAPPING_PATH, IMAGE_SIZE

# Load model and class mapping once
model = tf.keras.models.load_model(MODEL_PATH)
with open(CLASS_MAPPING_PATH, 'rb') as f:
    mapping = pickle.load(f)
    label_to_class = mapping['label_to_class']


def preprocess_image(image_path, target_size=IMAGE_SIZE):
    img = Image.open(image_path).convert('RGB')
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0  
    return np.expand_dims(img_array, axis=0)  # Add batch dimension


def predict_vehicle_type_with_confidence(image_path):
    img_array = preprocess_image(image_path)
    predictions = model.predict(img_array, verbose=0)
    
    pred_label = np.argmax(predictions[0])
    confidence = float(predictions[0][pred_label])
    vehicle_type = label_to_class[pred_label]
    
    return {
        'vehicle_type': vehicle_type,
        'confidence': confidence,
        'all_predictions': {
            label_to_class[i]: float(predictions[0][i])
            for i in range(len(predictions[0]))
        }
    }