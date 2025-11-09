"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { config } from "@/config";
import { 
  Upload, 
  ImageIcon, 
  Zap, 
  Camera, 
  Brain, 
  CheckCircle, 
  Eye,
  Github,
  Heart,
  ChevronRight,
  Sparkles,
  Target
} from "lucide-react";

interface PredictionResult {
  vehicle_type: string;
  confidence: number;
  all_predictions: Record<string, number>;
}

const vehicleTypes = [
  "Auto Rickshaws",
  "Bikes", 
  "Cars",
  "Motorcycles",
  "Planes",
  "Ships",
  "Trains"
];

const exampleImages = [
  { src: "/Cars.jpg", type: "Car", name: "car-example.jpg" },
  { src: "/Motorcycle.jpg", type: "Motorcycle", name: "motorcycle-example.jpg" },
  { src: "/Plane.jpg", type: "Plane", name: "plane-example.jpg" }
];

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setError(null);
    setPrediction(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const predictVehicle = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${config.apiBaseUrl}/predict-upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }

      const result: PredictionResult = await response.json();
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to predict vehicle type');
    } finally {
      setIsLoading(false);
    }
  };

  const tryExampleImage = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], imageName, { type: blob.type });
      handleFileSelect(file);
    } catch (err) {
      setError('Failed to load example image');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/30" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-accent border border-primary/20 rounded-full px-4 py-2 mb-8"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                Advanced Vehicle Detection
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-foreground mb-6"
            >
              Detect Vehicle Type{" "}
              <span className="text-primary">Instantly</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Upload a photo and our advanced model will predict the vehicle type with remarkable accuracy in seconds.
            </motion.p>

            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                    isDragOver 
                      ? 'border-primary bg-accent/50 scale-105' 
                      : 'border-border hover:border-primary/50 hover:bg-accent/30'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!previewUrl ? (
                    <>
                      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Drop your image here, or{" "}
                        <span className="text-primary">browse</span>
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Supports PNG, JPG, JPEG, BMP, GIF up to 10MB
                      </p>
                    </>
                  ) : (
                    <div className="relative">
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile?.name}
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />

                {selectedFile && (
                  <div className="mt-6">
                    <Button
                      onClick={predictVehicle}
                      disabled={isLoading}
                      className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Analyzing Image...
                        </>
                      ) : (
                        <>
                          <Brain className="h-5 w-5 mr-2" />
                          Detect Vehicle Type
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Section - Results */}
      {prediction && (
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-16"
        >
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-card">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Detection Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Result */}
                <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                  <h3 className="text-3xl font-bold text-primary mb-2">
                    {prediction.vehicle_type}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                  <div className="w-full bg-primary/20 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.confidence * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-primary h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* All Predictions */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-muted-foreground">All Predictions</h4>
                  {vehicleTypes
                    .map(type => ({
                      type,
                      confidence: prediction.all_predictions[type] || 0
                    }))
                    .sort((a, b) => b.confidence - a.confidence)
                    .map(({ type, confidence }) => (
                      <div key={type} className="flex justify-between items-center py-2">
                        <span className={`${type === prediction.vehicle_type ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                          {type}
                        </span>
                        <div className="flex items-center gap-3 flex-1 ml-4">
                          <Progress value={confidence * 100} className="flex-1 h-2" />
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {(confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      )}

      {/* Example Images Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Try These Examples</h2>
            <p className="text-muted-foreground">
              Click on any image below to test our detection system
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {exampleImages.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer transition-all duration-300 border-0 bg-card group overflow-hidden"
                  onClick={() => tryExampleImage(example.src, example.name)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      <Image 
                        src={example.src} 
                        alt={`Example ${example.type} for vehicle detection`}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        priority={index === 0}
                      />
                    </div>
                    <p className="font-medium text-center group-hover:text-primary transition-colors">
                      {example.type} Example
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our system uses advanced deep learning to analyze and classify vehicle types with precision
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Upload,
                title: "1. Upload",
                description: "Simply drag and drop or click to upload your vehicle image. We support all common image formats."
              },
              {
                icon: Brain,
                title: "2. Analyze", 
                description: "Our advanced CNN model processes the image, extracting key visual features to identify the vehicle type."
              },
              {
                icon: Target,
                title: "3. Predict",
                description: "Get instant results with confidence scores for all vehicle categories, helping you understand the prediction."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-8 border-0 bg-card shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">About Our Technology</h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Built with cutting-edge machine learning technology, our vehicle detection system uses a 
              Convolutional Neural Network trained on thousands of vehicle images to achieve exceptional accuracy.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  icon: Zap,
                  title: "Fast & Accurate",
                  description: "Get predictions in seconds with industry-leading accuracy rates across all vehicle categories."
                },
                {
                  icon: Eye,
                  title: "7 Vehicle Types", 
                  description: "Supports detection of cars, motorcycles, bikes, planes, ships, trains, and auto rickshaws."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 border-0 bg-card h-full">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-primary" />
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-medium">Built with</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Next.js</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">TailwindCSS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">TensorFlow</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Made with{" "}
              <Heart className="inline h-4 w-4 text-red-500" />{" "}
              for the community
            </p>
            <a
              href="https://github.com/Shashank-143/Vehicle-Type-Prediction.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}