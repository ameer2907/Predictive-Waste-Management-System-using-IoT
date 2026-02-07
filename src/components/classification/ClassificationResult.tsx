import { motion } from 'framer-motion';
import { 
  Recycle, 
  Leaf, 
  AlertTriangle, 
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

  const confidencePercent = result.confidence * 100;
  const isUncertain = confidencePercent < 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Uncertainty Warning */}
      {isUncertain && (
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <div>
              <p className="font-medium text-warning">Uncertain Classification</p>
              <p className="text-sm text-muted-foreground">
                Please try uploading a clearer image for better accuracy
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Classification */}
      <div className="glass-card-elevated p-6 rounded-2xl">
        <div className="flex items-start gap-5">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
            style={{ backgroundColor: `${category.color}20` }}
          >
            {category.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold">{result.primary_category}</h3>
              {result.subcategory && (
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {result.subcategory}
                </span>
              )}
            </div>

            {/* Confidence Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <span className={cn(
                  "font-mono font-semibold",
                  isUncertain ? "text-warning" : "text-primary"
                )}>
                  {confidencePercent.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={confidencePercent} 
                className={cn(
                  "h-2.5",
                  isUncertain && "[&>div]:bg-warning"
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Predictions */}
      <div className="glass-card p-5 rounded-xl">
        <h4 className="text-sm font-medium text-muted-foreground mb-4">Top 3 Predictions</h4>
        <div className="space-y-3">
          {result.top_predictions.slice(0, 3).map((pred, index) => {
            const predCategory = WASTE_CATEGORIES.find(
              c => c.name.toLowerCase() === pred.category.toLowerCase()
            );
            const predConfidence = pred.confidence * 100;
            return (
              <div key={index} className="flex items-center gap-3">
                <span 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{ 
                    backgroundColor: index === 0 ? `${predCategory?.color}30` : 'hsl(var(--muted))',
                    color: index === 0 ? predCategory?.color : undefined
                  }}
                >
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{pred.category}</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {predConfidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${predConfidence}%`,
                        backgroundColor: predCategory?.color || 'hsl(var(--primary))'
                      }}
                    />
                  </div>
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
              <CheckCircle2 className="w-7 h-7 text-success" />
            ) : (
              <XCircle className="w-7 h-7 text-destructive" />
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
              <Leaf className="w-7 h-7 text-success" />
            ) : (
              <AlertTriangle className="w-7 h-7 text-warning" />
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

      {/* Disposal Method */}
      <div className="glass-card p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Recycle className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-medium">Disposal Method</h4>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {result.disposal_method || 'Follow local waste management guidelines for proper disposal.'}
        </p>

        {result.recycling_instructions && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-info" />
              <h4 className="text-sm font-medium">Recycling Instructions</h4>
            </div>
            <p className="text-sm text-muted-foreground">{result.recycling_instructions}</p>
          </div>
        )}
      </div>

      {/* Hazard Warning */}
      {result.hazard_warning && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h4 className="text-sm font-semibold text-destructive">Hazard Warning</h4>
          </div>
          <p className="text-sm text-destructive/80">{result.hazard_warning}</p>
        </div>
      )}
    </motion.div>
  );
}
