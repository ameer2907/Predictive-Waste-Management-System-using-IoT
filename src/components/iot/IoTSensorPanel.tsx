import { motion } from 'framer-motion';
import { Radio, Thermometer, Droplets, MapPin, AlertTriangle, CheckCircle2, Weight, Bell } from 'lucide-react';
import { useSensorReadings } from '@/hooks/use-dashboard-data';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { toast } from 'sonner';

function getStatus(fillLevel: number) {
  if (fillLevel >= 90) return { label: 'Overflow', color: 'destructive' as const };
  if (fillLevel >= 80) return { label: 'Full', color: 'destructive' as const };
  if (fillLevel >= 50) return { label: 'Half', color: 'warning' as const };
  return { label: 'Empty', color: 'success' as const };
}

function estimateWeight(fillLevel: number, capacityLiters: number) {
  // Rough estimate: 0.3 kg per liter of fill
  return ((fillLevel / 100) * capacityLiters * 0.3).toFixed(1);
}

export function IoTSensorPanel() {
  const { data: readings, isLoading } = useSensorReadings();

  // Alert when fill > 80%
  useEffect(() => {
    if (!readings) return;
    const critical = readings.filter(r => r.fill_level >= 80);
    critical.forEach(r => {
      toast.warning(`⚠️ Bin "${r.sensor.location_name}" at ${r.fill_level}% - needs collection!`, {
        id: `alert-${r.sensor_id}`,
        duration: 8000,
      });
    });
  }, [readings]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-5 rounded-xl animate-pulse">
            <div className="h-40 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-muted-foreground">Live sensor data</span>
          <span className="text-xs text-muted-foreground/50">• Updates every 5s</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Bell className="w-4 h-4 text-warning" />
          <span className="text-muted-foreground">Auto-alert at 80% fill</span>
        </div>
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {readings?.map((reading, index) => {
          const status = getStatus(reading.fill_level);
          const weight = estimateWeight(reading.fill_level, reading.sensor.capacity_liters);
          return (
            <motion.div
              key={reading.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "glass-card p-5 rounded-xl",
                reading.fill_level >= 80 && "border border-destructive/40"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Radio className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono text-muted-foreground">{reading.sensor.sensor_id}</span>
                  </div>
                  <h3 className="font-semibold">{reading.sensor.location_name}</h3>
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                  `bg-${status.color}/10 text-${status.color}`
                )}>
                  {status.label === 'Overflow' || status.label === 'Full' ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                  {status.label}
                </div>
              </div>

              {/* Fill Level */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Fill Level</span>
                  <span className={cn(
                    "font-mono font-semibold",
                    reading.fill_level >= 80 ? "text-destructive" :
                    reading.fill_level >= 60 ? "text-warning" : "text-success"
                  )}>{reading.fill_level}%</span>
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

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{weight} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-warning" />
                  <span className="text-muted-foreground">{reading.temperature}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-info" />
                  <span className="text-muted-foreground">{reading.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">
                    {reading.sensor.latitude?.toFixed(3)}, {reading.sensor.longitude?.toFixed(3)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
