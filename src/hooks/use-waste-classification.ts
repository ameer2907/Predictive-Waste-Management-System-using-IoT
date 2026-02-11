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
        payload.imageUrl = imageSource;
      } else {
        const base64 = await fileToBase64(imageSource);
        payload.imageBase64 = base64;
      }

      let data: any = null;
      let lastError: Error | null = null;

      // Retry once on network failure
      for (let attempt = 0; attempt < 2; attempt++) {
        const { data: d, error: fnError } = await supabase.functions.invoke('classify-waste', {
          body: payload
        });

        if (fnError) {
          lastError = new Error(fnError.message);
          if (attempt === 0) { await new Promise(r => setTimeout(r, 1000)); continue; }
          throw lastError;
        }

        if (d?.error) {
          throw new Error(d.error);
        }

        data = d;
        break;
      }

      if (!data) throw lastError || new Error('Classification failed');

      setResult(data as ClassificationResult);
      
      await storeClassification(data, typeof imageSource === 'string' ? imageSource : 'uploaded-image');
      
      toast.success('Classification complete!', {
        description: `Identified as ${data.primary_category} with ${(data.confidence * 100).toFixed(1)}% confidence`
      });

      return data as ClassificationResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Classification failed';
      setError(message);
      
      if (message.includes('Rate limit')) {
        toast.error('Rate limit exceeded', { description: 'Please wait a moment and try again.' });
      } else if (message.includes('Payment')) {
        toast.error('Credits required', { description: 'Please add credits to continue.' });
      } else {
        toast.error('Classification failed', { description: message });
      }
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
