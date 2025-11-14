# 🚗 Vehicle Type Prediction

A full-stack machine learning application that predicts vehicle types from images using a Convolutional Neural Network (CNN). The project features a Flask backend for model inference and a modern Next.js frontend for user interaction.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.0+-orange.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Model Information](#model-information)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)


## 🎯 Overview

This project implements a deep learning solution for classifying different types of vehicles from images. It uses a custom CNN architecture trained on vehicle images and provides a user-friendly web interface for real-time predictions.

## ✨ Features

- **Real-time Vehicle Classification**: Upload images and get instant predictions
- **Deep Learning Model**: Custom CNN architecture for accurate vehicle type detection
- **RESTful API**: Flask-based backend with easy-to-use endpoints
- **Modern UI**: Responsive Next.js frontend with TypeScript
- **Image Preprocessing**: Automatic image normalization and resizing
- **Multiple Vehicle Types**: Supports classification of various vehicle categories
- **Environment Configuration**: Easy setup with environment variables

## 📁 Project Structure

```
Vehicle-Type-Prediction/
├── backend/
│   ├── Vehicles/              # Vehicle images dataset
│   ├── models/                # Trained model files
│   ├── app.py                 # Flask application
│   ├── cnn_model.py           # CNN model architecture
│   ├── preprocess.py          # Image preprocessing utilities
│   ├── preprocessing.ipynb    # Data exploration notebook
│   ├── config.py              # Configuration settings
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example           # Environment variables template
│   └── .gitignore
│
└── frontend/
    ├── src/                   # Next.js source files
    ├── public/                # Static assets
    ├── components.json        # UI components configuration
    ├── package.json           # Node dependencies
    ├── tsconfig.json          # TypeScript configuration
    ├── next.config.ts         # Next.js configuration
    ├── .env.example           # Environment variables template
    └── README.md
```

## 🛠️ Technology Stack

### Backend
- **Python 3.8+**
- **Flask**: Web framework for API
- **TensorFlow/Keras**: Deep learning framework
- **OpenCV/PIL**: Image processing
- **NumPy**: Numerical computations
- **python-dotenv**: Environment management

### Frontend
- **Next.js 14+**: React framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Styling
- **React**: UI library
- **Axios**: HTTP client

## 🚀 Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 18+ and npm
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shashank-143/Vehicle-Type-Prediction.git
   cd Vehicle-Type-Prediction/backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the Flask server**
   ```bash
   python app.py
   ```
   The backend server will start at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

## 💻 Usage

1. **Start both servers** (backend and frontend)
2. **Open your browser** and navigate to `http://localhost:3000`
3. **Upload a vehicle image** using the provided interface
4. **View the prediction** with confidence scores for different vehicle types

### Example API Request

```bash
curl -X POST http://localhost:5000/predict \
  -F "file=@path/to/vehicle/image.jpg"
```

### Example API Response

```json
{
  "prediction": "car",
  "confidence": 0.95,
  "all_predictions": {
    "car": 0.95,
    "truck": 0.03,
    "motorcycle": 0.02
  }
}
```

## 🧠 Model Information

The CNN model architecture includes:
- **Input Layer**: Accepts preprocessed vehicle images
- **Convolutional Layers**: Multiple conv layers with ReLU activation
- **Pooling Layers**: Max pooling for dimensionality reduction
- **Dropout Layers**: For regularization and preventing overfitting
- **Dense Layers**: Fully connected layers for classification
- **Output Layer**: Softmax activation for multi-class classification

### Preprocessing Pipeline
- Image resizing to standard dimensions
- Normalization of pixel values
- Data augmentation during training

## 📡 API Documentation

### Endpoints

#### `POST /predict`
Predict the vehicle type from an uploaded image.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**
```json
{
  "prediction": "string",
  "confidence": "float",
  "all_predictions": "object"
}
```

#### `GET /health`
Check API health status.

**Response:**
```json
{
  "status": "healthy"
}
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
FLASK_ENV=development
MODEL_PATH=models/vehicle_model.h5
UPLOAD_FOLDER=uploads
```

### Frontend Configuration

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Vehicle Type Prediction
```


Made with ❤️ by Shashank-143
