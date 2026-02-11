

# Upgrade Plan: Full IoT + ESP32 Integration with Real-Time AI Classification

## Overview

This upgrade transforms the existing waste management system into a production-ready IoT platform with ESP32-CAM hardware integration, real-time device monitoring, pattern-based analytics, and robust error handling -- all while keeping the current working features intact.

## Changes

### 1. ESP32 Device API Endpoint (New Edge Function)

Create a new edge function `esp32-classify` that accepts images directly from ESP32-CAM hardware over WiFi:
- Accepts raw image bytes or base64 from the device via POST
- Performs classification using the existing Gemini 2.5 Flash pipeline
- Returns a compact JSON response with category, confidence, and servo command (`RECYCLABLE` / `NON_RECYCLABLE`)
- Logs every detection to a new `device_logs` table (timestamp, category, confidence, device_id, bin_status)
- Handles invalid images, low-confidence fallback (confidence < 0.5 returns `UNCERTAIN` servo command), and network errors gracefully
- No JWT required (hardware device calls)

### 2. New Database Table: `device_logs`

Store every ESP32 detection for pattern analysis:
- `id` (uuid, primary key)
- `device_id` (text) -- identifies the ESP32 unit
- `category` (text) -- predicted waste category
- `confidence` (numeric) -- prediction confidence
- `servo_action` (text) -- RECYCLABLE / NON_RECYCLABLE / UNCERTAIN
- `bin_fill_level` (integer, nullable) -- ultrasonic reading if provided
- `created_at` (timestamptz, default now())

RLS: public read + insert (matches existing pattern for this project).

### 3. Optimize Classification Edge Function

Improve the existing `classify-waste` function:
- Trim the system prompt to reduce token count and latency
- Remove unnecessary output fields (`material_composition`, `contamination_level`, `processing_difficulty`) from the prompt -- these are already removed from the UI
- Reduce `max_tokens` from 800 to 500 since the response is smaller
- Use `google/gemini-2.5-flash-lite` model for even faster inference when called from ESP32 (the web UI keeps `gemini-2.5-flash`)

### 4. Device Monitoring Dashboard Section

Add an "ESP32 Devices" card to the existing Dashboard tab showing:
- Connection status (based on last `device_logs` entry timestamp -- green if < 60s ago, yellow if < 5min, red otherwise)
- Last activity time (human-readable "2 seconds ago")
- Total detections today
- Latest bin fill level percentage (from ultrasonic data sent by ESP32)
- Alert badge when bin fill > 85%

This uses real data from the `device_logs` table -- no fake/simulated data.

### 5. Pattern Analysis and Insights

Add a new "Insights" section to the Dashboard that queries `device_logs` and `classifications` to show:
- **Daily waste trend** (line chart): classification count per day for the last 7 days
- **Peak disposal hours** (bar chart): hourly distribution of classifications
- **Recyclable vs Non-recyclable ratio** over time
- All charts only render when real data exists; otherwise show a "No data yet -- start classifying to see patterns" placeholder

### 6. Improve Classification Result UI

Streamline the `ClassificationResult` component:
- Remove `material_composition`, `contamination_level`, `processing_difficulty` fields from the `ClassificationResult` TypeScript interface (already not shown in UI but still in types)
- Add a "Servo Action" indicator showing whether the item would be sorted as recyclable or non-recyclable by the hardware
- Add inference time display

### 7. Enhanced 3D Hardware Model

Improve the SmartBin3D component:
- Add a servo motor component near the bin opening (the sorting mechanism)
- Add subtle particle effects for the WiFi signal
- Improve material quality with environment map reflections
- Add click-to-highlight interaction: clicking a component highlights it and shows its description in an overlay panel

### 8. Error Handling and Resilience

- Edge functions: catch and return structured error responses for network failures, invalid images, rate limits (429), payment required (402)
- Frontend: display clear toast notifications for each error type
- ESP32 endpoint: return minimal error JSON that the microcontroller can parse
- Add retry logic in the `useWasteClassification` hook (1 automatic retry on network failure)

### 9. Hook for Device Logs

Create `useDeviceLogs` hook that queries the `device_logs` table:
- Latest 50 logs for the activity feed
- Aggregated daily/hourly counts for charts
- Real-time subscription using Supabase Realtime (enable realtime on `device_logs` table)

## Files to Create
- `supabase/functions/esp32-classify/index.ts` -- Hardware API endpoint
- `src/hooks/use-device-logs.ts` -- Device logs data hook

## Files to Modify
- `supabase/functions/classify-waste/index.ts` -- Optimize prompt and response
- `supabase/config.toml` -- Add esp32-classify function config
- `src/lib/waste-categories.ts` -- Clean up ClassificationResult interface
- `src/components/dashboard/DashboardTab.tsx` -- Add device monitoring + insights sections
- `src/components/hardware/SmartBin3D.tsx` -- Add servo motor, click interaction
- `src/components/classification/ClassificationResult.tsx` -- Add servo action indicator
- `src/hooks/use-waste-classification.ts` -- Add retry logic
- `src/hooks/use-dashboard-data.ts` -- Add device log queries

## Database Migration
- Create `device_logs` table with RLS policies
- Enable realtime on `device_logs`

