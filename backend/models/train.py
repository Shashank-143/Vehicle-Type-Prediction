import os
import sys
import pickle
import numpy as np
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping
from ..config import IMAGE_SIZE, BATCH_SIZE, EPOCHS, DATA_DIR, MODEL_PATH, CLASS_MAPPING_PATH
from ..preprocess import get_images_and_classes, preprocess_images


def create_cnn_model(input_shape, num_classes):

    model = models.Sequential()
    model.add(layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_shape))
    model.add(layers.MaxPooling2D((2, 2)))
    model.add(layers.Conv2D(64, (3, 3), activation='relu'))
    model.add(layers.MaxPooling2D((2, 2)))
    model.add(layers.Conv2D(128, (3, 3), activation='relu'))
    model.add(layers.MaxPooling2D((2, 2)))
    model.add(layers.Flatten())
    model.add(layers.Dense(128, activation='relu'))
    model.add(layers.Dense(num_classes, activation='softmax'))
    
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model


if __name__ == "__main__":

    images, classes = get_images_and_classes(DATA_DIR)
    print(f"Loaded {len(images)} images")
    
    X = preprocess_images(images)
    print(f"Preprocessed shape: {X.shape}")
    
    unique_classes = sorted(set(classes))
    class_to_label = {class_name: idx for idx, class_name in enumerate(unique_classes)}
    print(f"Classes: {list(class_to_label.keys())}")
    
    y = np.array([class_to_label[c] for c in classes])
    num_classes = len(class_to_label)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"Train: {X_train.shape}, Test: {X_test.shape}")

    input_shape = (IMAGE_SIZE[0], IMAGE_SIZE[1], 3)
    model = create_cnn_model(input_shape, num_classes)
    
    early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
    model.fit(X_train, y_train, epochs=EPOCHS, batch_size=BATCH_SIZE, validation_split=0.2, callbacks=[early_stopping])

    # Evaluate
    loss_train, acc_train = model.evaluate(X_train, y_train, verbose=0)
    loss_test, acc_test = model.evaluate(X_test, y_test, verbose=0)
    
    print(f'Training accuracy: {acc_train:.4f}')
    print(f'Test accuracy: {acc_test:.4f}')
    
    # Save model
    os.makedirs('models', exist_ok=True)
    model.save(MODEL_PATH)
    print(f"Model saved: {MODEL_PATH}")
    
    # Save class mapping
    label_to_class = {idx: class_name for class_name, idx in class_to_label.items()}
    with open(CLASS_MAPPING_PATH, 'wb') as f:
        pickle.dump({'class_to_label': class_to_label, 'label_to_class': label_to_class}, f)
    print(f"Class mapping saved: {CLASS_MAPPING_PATH}")