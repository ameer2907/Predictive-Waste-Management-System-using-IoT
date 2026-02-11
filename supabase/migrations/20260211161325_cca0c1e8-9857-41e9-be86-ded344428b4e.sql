
-- Create device_logs table for ESP32 detection history
CREATE TABLE public.device_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  category TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  servo_action TEXT NOT NULL,
  bin_fill_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.device_logs ENABLE ROW LEVEL SECURITY;

-- Public read + insert (matches existing pattern)
CREATE POLICY "Allow public read access on device_logs"
ON public.device_logs FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on device_logs"
ON public.device_logs FOR INSERT WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.device_logs;
