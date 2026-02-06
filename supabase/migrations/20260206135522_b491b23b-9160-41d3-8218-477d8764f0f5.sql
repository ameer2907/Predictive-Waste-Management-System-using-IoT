-- Create classifications table for storing waste classification results
CREATE TABLE public.classifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  primary_category TEXT NOT NULL,
  confidence DECIMAL(5,4) NOT NULL,
  top_predictions JSONB NOT NULL DEFAULT '[]',
  is_recyclable BOOLEAN,
  is_biodegradable BOOLEAN,
  disposal_method TEXT,
  environmental_impact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create IoT sensors table for simulated sensor data
CREATE TABLE public.iot_sensors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sensor_id TEXT NOT NULL UNIQUE,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  bin_type TEXT NOT NULL DEFAULT 'general',
  capacity_liters INTEGER NOT NULL DEFAULT 120,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sensor readings table for fill level data
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sensor_id UUID REFERENCES public.iot_sensors(id) ON DELETE CASCADE,
  fill_level INTEGER NOT NULL CHECK (fill_level >= 0 AND fill_level <= 100),
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create model metrics table for tracking ML performance
CREATE TABLE public.model_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT NOT NULL,
  accuracy DECIMAL(5,4),
  precision DECIMAL(5,4),
  recall DECIMAL(5,4),
  f1_score DECIMAL(5,4),
  inference_time_ms INTEGER,
  total_predictions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dataset uploads table for tracking uploaded datasets
CREATE TABLE public.dataset_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_size BIGINT,
  total_images INTEGER,
  class_distribution JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_uploads ENABLE ROW LEVEL SECURITY;

-- Create public read/write policies (for demo purposes - production would use auth)
CREATE POLICY "Allow public read access on classifications" ON public.classifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on classifications" ON public.classifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on iot_sensors" ON public.iot_sensors FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on iot_sensors" ON public.iot_sensors FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on sensor_readings" ON public.sensor_readings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on sensor_readings" ON public.sensor_readings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on model_metrics" ON public.model_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update access on model_metrics" ON public.model_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on model_metrics" ON public.model_metrics FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on dataset_uploads" ON public.dataset_uploads FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on dataset_uploads" ON public.dataset_uploads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on dataset_uploads" ON public.dataset_uploads FOR UPDATE USING (true);

-- Insert sample IoT sensors
INSERT INTO public.iot_sensors (sensor_id, location_name, latitude, longitude, bin_type, capacity_liters) VALUES
('SENSOR-001', 'Central Park Zone A', 40.7829, -73.9654, 'recyclable', 240),
('SENSOR-002', 'Downtown District B', 40.7580, -73.9855, 'organic', 120),
('SENSOR-003', 'Industrial Area C', 40.7484, -73.9857, 'hazardous', 360),
('SENSOR-004', 'Residential Zone D', 40.7614, -73.9776, 'general', 180),
('SENSOR-005', 'Commercial Hub E', 40.7527, -73.9772, 'e-waste', 120),
('SENSOR-006', 'University Campus F', 40.7295, -73.9965, 'recyclable', 240);

-- Insert sample model metrics
INSERT INTO public.model_metrics (model_name, accuracy, precision, recall, f1_score, inference_time_ms, total_predictions) VALUES
('ResNet50', 0.8745, 0.8612, 0.8823, 0.8716, 145, 12450),
('EfficientNet-B4', 0.9234, 0.9156, 0.9312, 0.9233, 210, 8920),
('MobileNetV3', 0.8512, 0.8423, 0.8601, 0.8511, 85, 15670),
('Vision Transformer', 0.9456, 0.9378, 0.9534, 0.9455, 320, 5430),
('Ensemble Model', 0.9612, 0.9545, 0.9678, 0.9611, 450, 3210);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for model_metrics
CREATE TRIGGER update_model_metrics_updated_at
BEFORE UPDATE ON public.model_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();