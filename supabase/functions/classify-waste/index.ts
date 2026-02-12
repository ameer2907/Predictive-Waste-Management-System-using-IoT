import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageBase64, imageUrl } = await req.json();

    if (!imageBase64 && !imageUrl) {
      return new Response(
        JSON.stringify({ error: 'No image provided. Send imageBase64 or imageUrl.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a waste classification AI trained on biodegradable, non-biodegradable, and trash datasets. Classify the item into exactly ONE of three categories:

1. **Biodegradable** — cardboard, paper, food waste, garden waste, wood, natural fibers
2. **Non-Biodegradable** — plastic, glass, metal, aluminum, steel, rubber, synthetic materials
3. **Trash** — mixed waste, contaminated items, non-recyclable composites, styrofoam, cigarette butts, diapers

Internal mapping:
- cardboard, paper → Biodegradable
- plastic, glass, metal → Non-Biodegradable  
- everything else unclear → Trash

Return ONLY valid JSON:
{
  "primary_category": "Biodegradable" | "Non-Biodegradable" | "Trash",
  "subcategory": "specific material type e.g. Cardboard, PET Plastic, Glass Bottle",
  "confidence": 0.95,
  "top_predictions": [{"category":"Biodegradable","confidence":0.95},{"category":"Non-Biodegradable","confidence":0.03},{"category":"Trash","confidence":0.02}],
  "is_recyclable": true,
  "is_biodegradable": true,
  "disposal_method": "Dispose in Green Bin / Recycling Bin / General Waste",
  "environmental_impact": "Brief environmental impact",
  "recycling_instructions": "Steps if recyclable, or null",
  "hazard_warning": "Warning if hazardous, or null"
}`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Classify this waste item accurately. Return JSON only." },
              imageContent
            ]
          }
        ],
        max_tokens: 400,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content in AI response");

    const inferenceMs = Date.now() - startTime;

    let classification;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      classification = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content);
    } catch {
      classification = {
        primary_category: "Trash",
        subcategory: "Unknown",
        confidence: 0.5,
        top_predictions: [
          { category: "Trash", confidence: 0.5 },
          { category: "Biodegradable", confidence: 0.25 },
          { category: "Non-Biodegradable", confidence: 0.25 }
        ],
        is_recyclable: false,
        is_biodegradable: false,
        disposal_method: "Mixed Waste – Manual Sorting Needed",
        environmental_impact: "Unable to determine",
      };
    }

    // Determine servo action based on category
    const category = classification.primary_category || "Trash";
    const confidence = classification.confidence || 0;
    let servo_action: string;
    if (confidence < 0.5) {
      servo_action = 'UNCERTAIN';
    } else if (category === 'Biodegradable') {
      servo_action = 'RECYCLABLE';
    } else if (category === 'Non-Biodegradable') {
      servo_action = 'RECYCLABLE';
    } else {
      servo_action = 'NON_RECYCLABLE';
    }

    // Generate disposal message
    let disposal_message: string;
    if (category === 'Biodegradable') {
      disposal_message = '🟢 Dispose in Green Bin (Biodegradable)';
    } else if (category === 'Non-Biodegradable') {
      disposal_message = '🔵 Dispose in Recycling / Non-Bio Bin';
    } else {
      disposal_message = '⚫ Mixed Waste – Manual Sorting Needed';
    }

    return new Response(
      JSON.stringify({
        ...classification,
        primary_category: category,
        is_recyclable: category !== 'Trash',
        is_biodegradable: category === 'Biodegradable',
        servo_action,
        disposal_message,
        timestamp: new Date().toISOString(),
        model_used: "Gemini 2.5 Flash",
        inference_time_ms: inferenceMs,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Classification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Classification failed" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
