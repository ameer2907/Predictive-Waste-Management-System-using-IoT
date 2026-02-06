import { motion } from 'framer-motion';
import { 
  Recycle, 
  Leaf, 
  AlertTriangle, 
  Clock, 
  Zap, 
  CheckCircle2, 
  XCircle,
  Info
} from 'lucide-react';
import { ClassificationResult as ClassificationResultType, WASTE_CATEGORIES } from '@/lib/waste-categories';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ClassificationResultProps {
  result: ClassificationResultType;
}

export function ClassificationResult({ result }: ClassificationResultProps) {
  const category = WASTE_CATEGORIES.find(
    c => c.name.toLowerCase() === result.primary_category.toLowerCase()
  ) || WASTE_CATEGORIES[7];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Primary Classification */}
      <div className="glass-card-elevated p-6 rounded-2xl">
        <div className="flex items-start gap-6">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
            style={{ backgroundColor: `${category.color}20` }}
          >
            {category.icon}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold">{result.primary_category}</h3>
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: category.color }}
              >
                {result.subcategory}
              </span>
            </div>

            {/* Confidence Bar */}
            <div className="space-y-1 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-mono font-semibold text-primary">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={result.confidence * 100} 
                className="h-2"
              />
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{result.inference_time_ms}ms</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span>{result.model_used}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Predictions */}
      <div className="glass-card p-5 rounded-xl">
        <h4 className="text-sm font-medium text-muted-foreground mb-4">Top 3 Predictions</h4>
        <div className="space-y-3">
          {result.top_predictions.slice(0, 3).map((pred, index) => {
            const predCategory = WASTE_CATEGORIES.find(
              c => c.name.toLowerCase() === pred.category.toLowerCase()
            );
            return (
              <div key={index} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{pred.category}</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {(pred.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={pred.confidence * 100} 
                    className="h-1.5"
                    style={{ 
                      '--progress-background': predCategory?.color 
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className={cn(
          "glass-card p-4 rounded-xl border",
          result.is_recyclable ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
        )}>
          <div className="flex items-center gap-3">
            {result.is_recyclable ? (
              <CheckCircle2 className="w-8 h-8 text-success" />
            ) : (
              <XCircle className="w-8 h-8 text-destructive" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">Recyclable</p>
              <p className={cn(
                "font-semibold",
                result.is_recyclable ? "text-success" : "text-destructive"
              )}>
                {result.is_recyclable ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        <div className={cn(
          "glass-card p-4 rounded-xl border",
          result.is_biodegradable ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"
        )}>
          <div className="flex items-center gap-3">
            {result.is_biodegradable ? (
              <Leaf className="w-8 h-8 text-success" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-warning" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">Biodegradable</p>
              <p className={cn(
                "font-semibold",
                result.is_biodegradable ? "text-success" : "text-warning"
              )}>
                {result.is_biodegradable ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disposal Information */}
      <div className="glass-card p-5 rounded-xl space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Recycle className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-medium">Disposal Method</h4>
          </div>
          <p className="text-sm text-muted-foreground">{result.disposal_method}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-success" />
            <h4 className="text-sm font-medium">Environmental Impact</h4>
          </div>
          <p className="text-sm text-muted-foreground">{result.environmental_impact}</p>
        </div>

        {result.recycling_instructions && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-info" />
              <h4 className="text-sm font-medium">Recycling Instructions</h4>
            </div>
            <p className="text-sm text-muted-foreground">{result.recycling_instructions}</p>
          </div>
        )}

        {result.hazard_warning && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <h4 className="text-sm font-medium text-destructive">Hazard Warning</h4>
            </div>
            <p className="text-sm text-destructive/80">{result.hazard_warning}</p>
          </div>
        )}
      </div>

      {/* Material Details */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="glass-card p-4 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">Material</p>
          <p className="text-sm font-medium truncate">{result.material_composition}</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">Contamination</p>
          <p className="text-sm font-medium capitalize">{result.contamination_level}</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">Processing</p>
          <p className="text-sm font-medium capitalize">{result.processing_difficulty}</p>
        </div>
      </div>
    </motion.div>
  );
}
