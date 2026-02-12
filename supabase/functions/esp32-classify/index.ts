import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { imageBase64, imageUrl, device_id, bin_fill_level } = body;

    if (!imageBase64 && !imageUrl) {
      return new Response(
        JSON.stringify({ error: 'NO_IMAGE', servo: 'UNCERTAIN' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'SERVER_CONFIG', servo: 'UNCERTAIN' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imageContent = imageBase64
      ? { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      : { type: "image_url", image_url: { url: imageUrl } };

    const startTime = Date.now();

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `Classify waste into: Biodegradable, Non-Biodegradable, Trash. Mapping: cardboard/paper→Biodegradable, plastic/glass/metal→Non-Biodegradable, mixed/unknown→Trash. Return JSON: {"category":"...","confidence":0.95,"is_recyclable":true}`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Classify this waste. JSON only." },
              imageContent
            ]
          }
        ],
        max_tokens: 150,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      await response.text();
      return new Response(
        JSON.stringify({ error: status === 429 ? 'RATE_LIMIT' : status === 402 ? 'PAYMENT' : 'AI_ERROR', servo: 'UNCERTAIN' }),
        { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    const inferenceMs = Date.now() - startTime;

    let classification;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      classification = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content);
    } catch {
      classification = { category: "Trash", confidence: 0.3, is_recyclable: false };
    }

    const confidence = classification.confidence || 0;
    const category = classification.category || "Trash";

    let servo: string;
    if (confidence < 0.5) {
      servo = 'UNCERTAIN';
    } else if (category === 'Biodegradable' || category === 'Non-Biodegradable') {
      servo = 'RECYCLABLE';
    } else {
      servo = 'NON_RECYCLABLE';
    }

    // Log to database
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      await supabase.from('device_logs').insert({
        device_id: device_id || 'esp32-default',
        category,
        confidence,
        servo_action: servo,
        bin_fill_level: bin_fill_level ?? null,
      });
    } catch (e) {
      console.error('Failed to log:', e);
    }

    return new Response(
      JSON.stringify({ category, confidence, servo, inference_ms: inferenceMs }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("ESP32 classify error:", error);
    return new Response(
      JSON.stringify({ error: 'INTERNAL', servo: 'UNCERTAIN' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
