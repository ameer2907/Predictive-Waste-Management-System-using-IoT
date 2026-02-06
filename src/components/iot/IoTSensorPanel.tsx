import { motion } from 'framer-motion';
import { Radio, Thermometer, Droplets, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useSensorReadings, useIoTSensors } from '@/hooks/use-dashboard-data';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function IoTSensorPanel() {
  const { data: readings, isLoading } = useSensorReadings();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-5 rounded-xl animate-pulse">
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Status Indicator */}
      <div className="flex items-center gap-2 text-sm">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-muted-foreground">Live sensor data</span>
        <span className="text-xs text-muted-foreground/50">• Updates every 5s</span>
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {readings?.map((reading, index) => (
          <motion.div
            key={reading.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-5 rounded-xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Radio className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono text-muted-foreground">
                    {reading.sensor.sensor_id}
                  </span>
                </div>
                <h3 className="font-semibold">{reading.sensor.location_name}</h3>
              </div>
              <StatusIndicator fillLevel={reading.fill_level} />
            </div>

            {/* Fill Level */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Fill Level</span>
                <span className={cn(
                  "font-mono font-semibold",
                  reading.fill_level >= 80 ? "text-destructive" :
                  reading.fill_level >= 60 ? "text-warning" : "text-success"
                )}>
                  {reading.fill_level}%
                </span>
              </div>
              <Progress 
                value={reading.fill_level} 
                className={cn(
                  "h-3 rounded-full",
                  reading.fill_level >= 80 ? "[&>div]:bg-destructive" :
                  reading.fill_level >= 60 ? "[&>div]:bg-warning" : "[&>div]:bg-success"
                )}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-warning" />
                <span className="text-muted-foreground">{reading.temperature}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-info" />
                <span className="text-muted-foreground">{reading.humidity}%</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="truncate">
                {reading.sensor.latitude?.toFixed(4)}, {reading.sensor.longitude?.toFixed(4)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatusIndicator({ fillLevel }: { fillLevel: number }) {
  if (fillLevel >= 80) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
        <AlertTriangle className="w-3 h-3" />
        Critical
      </div>
    );
  }
  if (fillLevel >= 60) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
        <AlertTriangle className="w-3 h-3" />
        Warning
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
      <CheckCircle2 className="w-3 h-3" />
      Normal
    </div>
  );
}
