import os

# Model configuration
IMAGE_SIZE = (128, 128)
NUM_CHANNELS = 3
BATCH_SIZE = 32
EPOCHS = 20
TEST_SPLIT = 0.2
VALIDATION_SPLIT = 0.2
RANDOM_STATE = 42

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'Vehicles')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
MODEL_PATH = os.path.join(MODELS_DIR, 'vehicle_classification_model.keras')
CLASS_MAPPING_PATH = os.path.join(MODELS_DIR, 'class_mapping.pkl')
os.makedirs(MODELS_DIR, exist_ok=True)

VEHICLE_CLASSES = [
    'Auto Rickshaws',
    'Bikes',
    'Cars',
    'Motorcycles',
    'Planes',
    'Ships',
    'Trains'
]
