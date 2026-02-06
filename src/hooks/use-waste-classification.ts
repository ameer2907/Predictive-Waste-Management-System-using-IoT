import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClassificationResult } from '@/lib/waste-categories';
import { toast } from 'sonner';

export function useWasteClassification() {
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const classifyImage = useCallback(async (imageSource: File | string) => {
    setIsClassifying(true);
    setError(null);
    setResult(null);

    try {
      let payload: { imageBase64?: string; imageUrl?: string } = {};

      if (typeof imageSource === 'string') {
        // It's a URL
        payload.imageUrl = imageSource;
      } else {
        // It's a File - convert to base64
        const base64 = await fileToBase64(imageSource);
        payload.imageBase64 = base64;
      }

      const { data, error: fnError } = await supabase.functions.invoke('classify-waste', {
        body: payload
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data as ClassificationResult);
      
      // Store classification in database
      await storeClassification(data, typeof imageSource === 'string' ? imageSource : 'uploaded-image');
      
      toast.success('Classification complete!', {
        description: `Identified as ${data.primary_category} with ${(data.confidence * 100).toFixed(1)}% confidence`
      });

      return data as ClassificationResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Classification failed';
      setError(message);
      toast.error('Classification failed', { description: message });
      return null;
    } finally {
      setIsClassifying(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    classifyImage,
    isClassifying,
    result,
    error,
    reset
  };
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function storeClassification(data: ClassificationResult, imageUrl: string) {
  try {
    await supabase.from('classifications').insert({
      image_url: imageUrl,
      primary_category: data.primary_category,
      confidence: data.confidence,
      top_predictions: data.top_predictions,
      is_recyclable: data.is_recyclable,
      is_biodegradable: data.is_biodegradable,
      disposal_method: data.disposal_method,
      environmental_impact: data.environmental_impact
    });
  } catch (error) {
    console.error('Failed to store classification:', error);
  }
}
