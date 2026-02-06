import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { IoTSensor, SensorReading, ModelMetrics } from '@/lib/waste-categories';

// Generate simulated real-time sensor readings
function generateSimulatedReading(sensor: IoTSensor): SensorReading {
  const baseLevel = Math.random() * 100;
  const temp = 18 + Math.random() * 15;
  const humidity = 40 + Math.random() * 40;
  
  return {
    id: crypto.randomUUID(),
    sensor_id: sensor.id,
    fill_level: Math.round(baseLevel),
    temperature: Math.round(temp * 10) / 10,
    humidity: Math.round(humidity * 10) / 10,
    timestamp: new Date().toISOString()
  };
}

export function useIoTSensors() {
  return useQuery({
    queryKey: ['iot-sensors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('iot_sensors')
        .select('*')
        .order('location_name');

      if (error) throw error;
      return data as IoTSensor[];
    }
  });
}

export function useSensorReadings(sensorId?: string) {
  const { data: sensors } = useIoTSensors();
  
  return useQuery({
    queryKey: ['sensor-readings', sensorId],
    queryFn: async () => {
      if (!sensors) return [];
      
      // Generate simulated readings for all sensors
      const readings: (SensorReading & { sensor: IoTSensor })[] = sensors.map(sensor => ({
        ...generateSimulatedReading(sensor),
        sensor
      }));
      
      return sensorId 
        ? readings.filter(r => r.sensor_id === sensorId)
        : readings;
    },
    enabled: !!sensors,
    refetchInterval: 5000 // Refresh every 5 seconds for real-time effect
  });
}

export function useModelMetrics() {
  return useQuery({
    queryKey: ['model-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('model_metrics')
        .select('*')
        .order('accuracy', { ascending: false });

      if (error) throw error;
      return data as ModelMetrics[];
    }
  });
}

export function useClassificationHistory() {
  return useQuery({
    queryKey: ['classification-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });
}

export function useWasteDistribution() {
  const { data: classifications } = useClassificationHistory();
  
  return useQuery({
    queryKey: ['waste-distribution', classifications],
    queryFn: async () => {
      if (!classifications) return [];
      
      const distribution = classifications.reduce((acc, item) => {
        const category = item.primary_category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(distribution).map(([category, count]) => ({
        category,
        count,
        percentage: ((count / classifications.length) * 100).toFixed(1)
      }));
    },
    enabled: !!classifications
  });
}
