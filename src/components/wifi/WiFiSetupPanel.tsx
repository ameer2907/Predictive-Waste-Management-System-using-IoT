import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Copy, CheckCircle2, ExternalLink, Terminal, Cpu, Shield, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function WiFiSetupPanel() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const endpointUrl = `${SUPABASE_URL}/functions/v1/esp32-classify`;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const arduinoCode = `#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32CAM.h>
#include <ArduinoJson.h>
#include <Servo.h>

// === WiFi Configuration ===
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// === API Endpoint ===
const char* apiUrl = "${endpointUrl}";
const char* deviceId = "esp32-cam-01";

// === Hardware Pins ===
#define SERVO_PIN 12
#define TRIG_PIN 13
#define ECHO_PIN 14

Servo sortServo;

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nConnected! IP: " + WiFi.localIP().toString());
  
  // Initialize servo
  sortServo.attach(SERVO_PIN);
  sortServo.write(90); // neutral
  
  // Initialize camera
  camera_config_t config;
  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 12;
  esp_camera_init(&config);
}

float getBinFillLevel() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  float distance = pulseIn(ECHO_PIN, HIGH) * 0.034 / 2;
  float binHeight = 30.0; // cm
  return constrain((1.0 - distance / binHeight) * 100.0, 0, 100);
}

void classifyAndSort() {
  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) { Serial.println("Camera fail"); return; }
  
  // Base64 encode image
  String base64 = base64::encode(fb->buf, fb->len);
  esp_camera_fb_return(fb);
  
  // Build JSON payload
  StaticJsonDocument<256> doc;
  doc["imageBase64"] = base64;
  doc["device_id"] = deviceId;
  doc["bin_fill_level"] = (int)getBinFillLevel();
  
  String payload;
  serializeJson(doc, payload);
  
  // Send to API
  HTTPClient http;
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(payload);
  
  if (code == 200) {
    String response = http.getString();
    StaticJsonDocument<512> res;
    deserializeJson(res, response);
    
    const char* servo = res["servo"];
    float confidence = res["confidence"];
    
    Serial.printf("Category: %s | Conf: %.1f%% | Servo: %s\\n",
      res["category"].as<const char*>(), confidence * 100, servo);
    
    // Control servo based on response
    if (strcmp(servo, "RECYCLABLE") == 0) {
      sortServo.write(0);   // Left bin
    } else if (strcmp(servo, "NON_RECYCLABLE") == 0) {
      sortServo.write(180); // Right bin
    } else {
      sortServo.write(90);  // Neutral (uncertain)
    }
    delay(2000);
    sortServo.write(90); // Reset
  } else {
    Serial.printf("HTTP Error: %d\\n", code);
    sortServo.write(90); // Safe position on error
  }
  http.end();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    classifyAndSort();
  } else {
    Serial.println("WiFi disconnected, reconnecting...");
    WiFi.reconnect();
  }
  delay(3000); // Classify every 3 seconds
}`;

  return (
    <div className="space-y-6">
      {/* Connection Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-elevated p-6 rounded-2xl"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Wifi className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">ESP32-CAM WiFi Connection</h3>
            <p className="text-sm text-muted-foreground">Connect your hardware to the AI classification system</p>
          </div>
        </div>
      </motion.div>

      {/* API Endpoint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5 rounded-xl"
      >
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-primary" />
          API Endpoint
        </h4>
        <div className="flex items-center gap-2">
          <code className="flex-1 p-3 rounded-lg bg-muted text-xs font-mono break-all">
            POST {endpointUrl}
          </code>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => copyToClipboard(endpointUrl, 'endpoint')}
          >
            {copiedField === 'endpoint' ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </motion.div>

      {/* Request Format */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-5 rounded-xl"
      >
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          Request / Response Format
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">REQUEST (POST JSON)</p>
            <pre className="p-3 rounded-lg bg-muted text-xs font-mono overflow-x-auto">
{`{
  "imageBase64": "<base64_string>",
  "device_id": "esp32-cam-01",
  "bin_fill_level": 45
}`}
            </pre>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">RESPONSE</p>
            <pre className="p-3 rounded-lg bg-muted text-xs font-mono overflow-x-auto">
{`{
  "category": "Biodegradable",
  "confidence": 0.95,
  "servo": "RECYCLABLE",
  "inference_ms": 420
}`}
            </pre>
          </div>
        </div>
      </motion.div>

      {/* Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5 rounded-xl"
      >
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          Hardware Requirements
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: 'ESP32-CAM Module', desc: 'With OV2640 camera, WiFi enabled' },
            { label: 'SG90 Servo Motor', desc: '180° rotation for sorting mechanism' },
            { label: 'HC-SR04 Ultrasonic', desc: 'Bin fill level measurement' },
            { label: 'Power Supply', desc: '5V 2A adapter or USB power bank' },
            { label: 'WiFi Network', desc: '2.4GHz WPA2, stable internet' },
            { label: 'Arduino IDE', desc: 'With ESP32 board package installed' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Wiring Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-5 rounded-xl"
      >
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Wiring Connections
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Component</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Pin</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">ESP32 GPIO</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {[
                ['Servo Signal', 'Orange wire', 'GPIO 12'],
                ['Servo VCC', 'Red wire', '5V'],
                ['Servo GND', 'Brown wire', 'GND'],
                ['HC-SR04 TRIG', 'Trigger', 'GPIO 13'],
                ['HC-SR04 ECHO', 'Echo', 'GPIO 14'],
                ['HC-SR04 VCC', 'VCC', '5V'],
                ['HC-SR04 GND', 'GND', 'GND'],
              ].map(([comp, pin, gpio], i) => (
                <tr key={i} className="border-b border-border/10">
                  <td className="py-2 px-3">{comp}</td>
                  <td className="py-2 px-3 text-muted-foreground">{pin}</td>
                  <td className="py-2 px-3 text-primary">{gpio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Arduino Code */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5 rounded-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            Arduino Sketch (ESP32-CAM)
          </h4>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => copyToClipboard(arduinoCode, 'code')}
            className="gap-2"
          >
            {copiedField === 'code' ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            {copiedField === 'code' ? 'Copied!' : 'Copy Code'}
          </Button>
        </div>
        <pre className="p-4 rounded-lg bg-muted text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto leading-relaxed">
          {arduinoCode}
        </pre>
      </motion.div>

      {/* Safety Note */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="p-4 rounded-xl bg-warning/10 border border-warning/30"
      >
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-warning text-sm">Security Note</p>
            <p className="text-xs text-muted-foreground mt-1">
              The ESP32 endpoint does not require authentication for easy hardware integration.
              For production deployment, consider adding an API key header for device authentication.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
