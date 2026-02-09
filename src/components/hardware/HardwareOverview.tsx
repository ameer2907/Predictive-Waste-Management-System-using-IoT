import { motion } from 'framer-motion';
import { Cpu, Wifi, Camera, Thermometer, Weight, Radio, Cloud, BarChart3, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const components = [
  { icon: Radio, label: 'Ultrasonic Sensor', desc: 'HC-SR04 — Measures bin fill level via distance detection', color: 'text-primary' },
  { icon: Weight, label: 'Load Cell + HX711', desc: 'Measures waste weight in the bin (0–50 kg range)', color: 'text-warning' },
  { icon: Thermometer, label: 'Gas Sensor (MQ-135)', desc: 'Detects methane and harmful gases from organic waste', color: 'text-destructive' },
  { icon: Camera, label: 'Camera Module', desc: 'ESP32-CAM — Captures images for AI waste classification', color: 'text-info' },
  { icon: Cpu, label: 'ESP32 / Arduino', desc: 'Microcontroller hub collecting and transmitting all sensor data', color: 'text-primary' },
  { icon: Wifi, label: 'WiFi Module', desc: 'ESP32 built-in WiFi for cloud data transmission', color: 'text-success' },
];

const dataFlowSteps = [
  { icon: Radio, label: 'Sensors', desc: 'Ultrasonic, Load Cell, Gas, Camera collect real-time data' },
  { icon: Cpu, label: 'Controller', desc: 'ESP32/Arduino processes and aggregates sensor readings' },
  { icon: Cloud, label: 'Cloud', desc: 'Data transmitted via WiFi to cloud backend (API)' },
  { icon: BarChart3, label: 'AI + Dashboard', desc: 'ML models classify waste; dashboard shows insights' },
];

export function HardwareOverview() {
  return (
    <div className="space-y-6">
      {/* System Diagram */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-base">Smart Bin System Components</CardTitle>
          <p className="text-xs text-muted-foreground">Hardware components in each IoT-enabled waste bin</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map((comp, i) => (
              <motion.div
                key={comp.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-4 rounded-xl flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <comp.icon className={`w-5 h-5 ${comp.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{comp.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{comp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Flow */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-base">Data Flow Pipeline</CardTitle>
          <p className="text-xs text-muted-foreground">From sensors to actionable insights</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-6">
            {dataFlowSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-4"
              >
                <div className="glass-card p-5 rounded-xl text-center min-w-[160px]">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-sm">{step.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                </div>
                {i < dataFlowSteps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Structure */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-base">API Endpoint Structure</CardTitle>
          <p className="text-xs text-muted-foreground">Ready for real hardware integration (ESP32/Arduino)</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 font-mono text-sm">
            {[
              { method: 'POST', path: '/api/sensors/readings', desc: 'Submit sensor data (fill_level, weight, temperature, gas)' },
              { method: 'GET', path: '/api/sensors/:id/status', desc: 'Get current bin status and alerts' },
              { method: 'POST', path: '/api/classify', desc: 'Upload image for AI classification' },
              { method: 'GET', path: '/api/analytics/predictions', desc: 'Get waste volume forecasts' },
              { method: 'GET', path: '/api/reports/export', desc: 'Export CSV reports' },
            ].map((endpoint, i) => (
              <motion.div
                key={endpoint.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
              >
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  endpoint.method === 'POST' ? 'bg-primary/20 text-primary' : 'bg-info/20 text-info'
                }`}>
                  {endpoint.method}
                </span>
                <span className="text-foreground">{endpoint.path}</span>
                <span className="text-xs text-muted-foreground ml-auto hidden sm:block">{endpoint.desc}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
