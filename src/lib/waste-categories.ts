export const WASTE_CATEGORIES = [
  { 
    id: 'plastic',
    name: 'Plastic', 
    color: 'hsl(200 98% 50%)',
    subcategories: ['PET', 'HDPE', 'LDPE', 'Single-use plastic'],
    recyclable: true,
    biodegradable: false,
    icon: '♻️',
    description: 'Synthetic polymers made from petroleum'
  },
  { 
    id: 'paper',
    name: 'Paper', 
    color: 'hsl(35 95% 55%)',
    subcategories: ['Newspaper', 'Cardboard', 'Mixed paper'],
    recyclable: true,
    biodegradable: true,
    icon: '📄',
    description: 'Wood pulp-based materials'
  },
  { 
    id: 'glass',
    name: 'Glass', 
    color: 'hsl(280 85% 65%)',
    subcategories: ['Clear glass', 'Colored glass', 'Tempered glass'],
    recyclable: true,
    biodegradable: false,
    icon: '🫙',
    description: 'Silica-based transparent material'
  },
  { 
    id: 'metal',
    name: 'Metal', 
    color: 'hsl(220 15% 55%)',
    subcategories: ['Aluminum', 'Steel', 'Tin', 'Copper'],
    recyclable: true,
    biodegradable: false,
    icon: '🔩',
    description: 'Metallic elements and alloys'
  },
  { 
    id: 'organic',
    name: 'Organic', 
    color: 'hsl(142 76% 40%)',
    subcategories: ['Food waste', 'Garden waste', 'Compostable'],
    recyclable: false,
    biodegradable: true,
    icon: '🍂',
    description: 'Biodegradable organic matter'
  },
  { 
    id: 'ewaste',
    name: 'E-waste', 
    color: 'hsl(0 72% 51%)',
    subcategories: ['Electronics', 'Batteries', 'Cables', 'Circuit boards'],
    recyclable: true,
    biodegradable: false,
    icon: '🔌',
    description: 'Electronic and electrical waste'
  },
  { 
    id: 'hazardous',
    name: 'Hazardous', 
    color: 'hsl(340 82% 52%)',
    subcategories: ['Chemicals', 'Medical waste', 'Toxic materials'],
    recyclable: false,
    biodegradable: false,
    icon: '☣️',
    description: 'Dangerous materials requiring special handling'
  },
  { 
    id: 'mixed',
    name: 'Mixed/Non-recyclable', 
    color: 'hsl(217 33% 40%)',
    subcategories: ['Mixed materials', 'Contaminated', 'Non-recyclable'],
    recyclable: false,
    biodegradable: false,
    icon: '🗑️',
    description: 'Items that cannot be easily recycled'
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
