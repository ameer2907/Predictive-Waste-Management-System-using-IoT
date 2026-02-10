import { motion } from 'framer-motion';
import { 
  Recycle, Leaf, AlertTriangle, CheckCircle2, XCircle, Info, 
  Sparkles, Shield, Trash2
} from 'lucide-react';
import { ClassificationResult as ClassificationResultType, WASTE_CATEGORIES } from '@/lib/waste-categories';
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
  const isHighConfidence = confidencePercent >= 90;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Uncertainty Warning */}
      {isUncertain && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-warning/10 border border-warning/30"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
            <div>
              <p className="font-semibold text-warning text-sm">Uncertain – Please try a clearer image</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Confidence is below 60%. A clearer, well-lit photo will improve accuracy.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Primary Result Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card-elevated rounded-2xl overflow-hidden"
      >
        {/* Top bar with category color */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${category.color}, transparent)` }} />
        
        <div className="p-6">
          <div className="flex items-start gap-5">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{ backgroundColor: `${category.color}15`, border: `1px solid ${category.color}30` }}
            >
              {category.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isHighConfidence && <Sparkles className="w-4 h-4 text-primary" />}
                <h3 className="text-xl font-bold">{result.primary_category}</h3>
              </div>
              {result.subcategory && (
                <span 
                  className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  {result.subcategory}
                </span>
              )}

              {/* Confidence */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className={cn(
                    "font-mono font-bold text-base",
                    isUncertain ? "text-warning" : isHighConfidence ? "text-primary" : "text-foreground"
                  )}>
                    {confidencePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${confidencePercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      isUncertain ? "bg-warning" : "bg-gradient-to-r from-primary to-accent"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top 3 Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5 rounded-xl"
      >
        <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Top Predictions
        </h4>
        <div className="space-y-3">
          {result.top_predictions.slice(0, 3).map((pred, index) => {
            const predCategory = WASTE_CATEGORIES.find(
              c => c.name.toLowerCase() === pred.category.toLowerCase()
            );
            const predConfidence = pred.confidence * 100;
            return (
              <div key={index} className="flex items-center gap-3">
                <span 
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ 
                    backgroundColor: index === 0 ? `${predCategory?.color}20` : 'hsl(var(--muted))',
                    color: index === 0 ? predCategory?.color : 'hsl(var(--muted-foreground))',
                    border: index === 0 ? `1px solid ${predCategory?.color}40` : 'none'
                  }}
                >
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{pred.category}</span>
                    <span className="text-xs font-mono font-semibold" style={{ color: predCategory?.color }}>
                      {predConfidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${predConfidence}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: predCategory?.color || 'hsl(var(--primary))' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Properties Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "glass-card p-4 rounded-xl border",
            result.is_recyclable ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
          )}
        >
          <div className="flex items-center gap-3">
            {result.is_recyclable ? (
              <CheckCircle2 className="w-7 h-7 text-success" />
            ) : (
              <XCircle className="w-7 h-7 text-destructive" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">Recyclable</p>
              <p className={cn("font-bold", result.is_recyclable ? "text-success" : "text-destructive")}>
                {result.is_recyclable ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className={cn(
            "glass-card p-4 rounded-xl border",
            result.is_biodegradable ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"
          )}
        >
          <div className="flex items-center gap-3">
            {result.is_biodegradable ? (
              <Leaf className="w-7 h-7 text-success" />
            ) : (
              <Shield className="w-7 h-7 text-warning" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">Biodegradable</p>
              <p className={cn("font-bold", result.is_biodegradable ? "text-success" : "text-warning")}>
                {result.is_biodegradable ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Disposal Method */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <Recycle className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold">Disposal Method</h4>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {result.disposal_method || 'Follow local waste management guidelines for proper disposal.'}
        </p>

        {result.recycling_instructions && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-info" />
              <h4 className="text-sm font-semibold">Recycling Instructions</h4>
            </div>
            <p className="text-sm text-muted-foreground">{result.recycling_instructions}</p>
          </div>
        )}
      </motion.div>

      {/* Hazard Warning */}
      {result.hazard_warning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-4 rounded-xl bg-destructive/10 border border-destructive/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h4 className="text-sm font-bold text-destructive">Hazard Warning</h4>
          </div>
          <p className="text-sm text-destructive/80">{result.hazard_warning}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
