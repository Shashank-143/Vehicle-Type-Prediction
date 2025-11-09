from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import tempfile
import os
from cnn_model import predict_vehicle_type_with_confidence


class PredictionResponse(BaseModel):
    vehicle_type: str
    confidence: float
    all_predictions: dict


app = FastAPI(
    title="Vehicle Type Prediction API",
    description="Predict vehicle types from images",
    version="1.0.0"
)

origins = [
    "https://vehicle.shashankgoel.tech",
    "https://vehicle-type-prediction.vercel.app",
    "https://vehicle-type-prediction-shashank-143s-projects.vercel.app",
    "http://localhost:3000"  # For local development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Vehicle Type Prediction API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/predict-upload", response_model=PredictionResponse)
async def predict_from_upload(file: UploadFile = File(...)):
    try:
        valid_ext = {'.png', '.jpg', '.jpeg', '.bmp', '.gif'}
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in valid_ext:
            raise HTTPException(status_code=400, detail=f"Invalid file type. Use: {valid_ext}")
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        try:
            result = predict_vehicle_type_with_confidence(tmp_path)
            return PredictionResponse(
                vehicle_type=result['vehicle_type'],
                confidence=result['confidence'],
                all_predictions=result['all_predictions']
            )
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)