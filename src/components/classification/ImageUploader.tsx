import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Image, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWasteClassification } from '@/hooks/use-waste-classification';
import { ClassificationResult } from './ClassificationResult';
import { cn } from '@/lib/utils';

export function ImageUploader() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { classifyImage, isClassifying, result, error, reset } = useWasteClassification();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClassify = async () => {
    if (selectedFile) {
      await classifyImage(selectedFile);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!selectedImage ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
              dragActive
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            )}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-4">
              <div className={cn(
                "w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300",
                dragActive ? "bg-primary/20" : "bg-muted"
              )}>
                <Upload className={cn(
                  "w-10 h-10 transition-colors",
                  dragActive ? "text-primary" : "text-muted-foreground"
                )} />
              </div>

              <div>
                <p className="text-lg font-medium">
                  {dragActive ? "Drop your image here" : "Upload waste image"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports JPG, PNG, WEBP up to 10MB
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 pt-4">
                <Button variant="outline" className="gap-2">
                  <Image className="w-4 h-4" />
                  Browse Files
                </Button>
                <Button variant="outline" className="gap-2">
                  <Camera className="w-4 h-4" />
                  Use Camera
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* Image Preview */}
            <div className="relative glass-card-elevated p-4 rounded-2xl">
              <button
                onClick={handleReset}
                className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <img
                  src={selectedImage}
                  alt="Uploaded waste"
                  className="w-full h-full object-contain"
                />

                {isClassifying && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                      <p className="text-sm font-medium">Analyzing waste image...</p>
                      <p className="text-xs text-muted-foreground">
                        Running EfficientNet-B4 + Vision Transformer ensemble
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!result && !isClassifying && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    {selectedFile?.name}
                  </div>
                  <Button onClick={handleClassify} className="gap-2 shadow-glow">
                    <CheckCircle2 className="w-4 h-4" />
                    Classify Waste
                  </Button>
                </div>
              )}
            </div>

            {/* Results */}
            {result && <ClassificationResult result={result} />}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 border border-destructive/30 bg-destructive/5"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Classification Failed</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
