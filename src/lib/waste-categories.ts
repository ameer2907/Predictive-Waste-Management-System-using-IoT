export const WASTE_CATEGORIES = [
  { 
    id: 'biodegradable',
    name: 'Biodegradable', 
    color: 'hsl(142 76% 40%)',
    subcategories: ['Cardboard', 'Paper', 'Food waste', 'Garden waste', 'Wood'],
    recyclable: true,
    biodegradable: true,
    icon: '🟢',
    binLabel: 'Green Bin',
    description: 'Organic and paper-based materials that decompose naturally'
  },
  { 
    id: 'non-biodegradable',
    name: 'Non-Biodegradable', 
    color: 'hsl(200 98% 50%)',
    subcategories: ['Plastic', 'Glass', 'Metal', 'Aluminum', 'Rubber'],
    recyclable: true,
    biodegradable: false,
    icon: '🔵',
    binLabel: 'Recycling Bin',
    description: 'Synthetic and inorganic recyclable materials'
  },
  { 
    id: 'trash',
    name: 'Trash', 
    color: 'hsl(217 33% 40%)',
    subcategories: ['Mixed waste', 'Contaminated', 'Styrofoam', 'Composite'],
    recyclable: false,
    biodegradable: false,
    icon: '⚫',
    binLabel: 'General Waste',
    description: 'Mixed or non-recyclable items requiring manual sorting'
  }
] as const;

export type WasteCategory = typeof WASTE_CATEGORIES[number];

export interface ClassificationResult {
  primary_category: string;
  subcategory: string;
  confidence: number;
  top_predictions: Array<{ category: string; confidence: number }>;
  is_recyclable: boolean;
  is_biodegradable: boolean;
  disposal_method: string;
  disposal_message?: string;
  environmental_impact: string;
  recycling_instructions?: string;
  hazard_warning?: string;
  servo_action?: 'RECYCLABLE' | 'NON_RECYCLABLE' | 'UNCERTAIN';
  timestamp: string;
  model_used: string;
  inference_time_ms: number;
}

export interface IoTSensor {
  id: string;
  sensor_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  bin_type: string;
  capacity_liters: number;
  created_at: string;
}

export interface SensorReading {
  id: string;
  sensor_id: string;
  fill_level: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}

export interface ModelMetrics {
  id: string;
  model_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  inference_time_ms: number;
  total_predictions: number;
  created_at: string;
  updated_at: string;
}

export const MODEL_NAMES = [
  { id: 'resnet50', name: 'ResNet50', description: 'Deep residual network baseline' },
  { id: 'efficientnet', name: 'EfficientNet-B4', description: 'Accuracy-optimized CNN' },
  { id: 'mobilenet', name: 'MobileNetV3', description: 'Edge/IoT optimized' },
  { id: 'vit', name: 'Vision Transformer', description: 'Attention-based architecture' },
  { id: 'ensemble', name: 'Ensemble Model', description: 'Combined CNN + Transformer' }
] as const;
