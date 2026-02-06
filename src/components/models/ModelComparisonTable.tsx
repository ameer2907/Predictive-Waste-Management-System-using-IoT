import { motion } from 'framer-motion';
import { Trophy, Zap, Target, Clock } from 'lucide-react';
import { useModelMetrics } from '@/hooks/use-dashboard-data';
import { MODEL_NAMES } from '@/lib/waste-categories';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function ModelComparisonTable() {
  const { data: metrics, isLoading } = useModelMetrics();

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-xl animate-pulse">
        <div className="h-64 bg-muted rounded-lg" />
      </div>
    );
  }

  const bestModel = metrics?.[0];

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Model Performance Comparison</h3>
            <p className="text-sm text-muted-foreground">Real-time accuracy metrics across all models</p>
          </div>
          {bestModel && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Trophy className="w-4 h-4" />
              Best: {bestModel.model_name}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Model</th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Accuracy</th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Precision</th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Recall</th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">F1 Score</th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Inference</th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Predictions</th>
            </tr>
          </thead>
          <tbody>
            {metrics?.map((model, index) => {
              const isBest = index === 0;
              const modelInfo = MODEL_NAMES.find(m => 
                model.model_name.toLowerCase().includes(m.id.toLowerCase())
              );

              return (
                <motion.tr
                  key={model.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "border-b border-border transition-colors hover:bg-muted/30",
                    isBest && "bg-primary/5 border-l-2 border-l-primary"
                  )}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {isBest && <Trophy className="w-4 h-4 text-primary" />}
                      <div>
                        <p className="font-medium">{model.model_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {modelInfo?.description || 'Deep learning model'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <MetricCell value={model.accuracy} />
                  </td>
                  <td className="p-4">
                    <MetricCell value={model.precision} />
                  </td>
                  <td className="p-4">
                    <MetricCell value={model.recall} />
                  </td>
                  <td className="p-4">
                    <MetricCell value={model.f1_score} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="font-mono text-sm">{model.inference_time_ms}ms</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm">{model.total_predictions?.toLocaleString()}</span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCell({ value }: { value: number }) {
  const percentage = value * 100;
  return (
    <div className="space-y-1">
      <span className={cn(
        "font-mono font-semibold text-sm",
        percentage >= 95 ? "text-success" :
        percentage >= 90 ? "text-primary" :
        percentage >= 80 ? "text-warning" : "text-destructive"
      )}>
        {percentage.toFixed(1)}%
      </span>
      <Progress 
        value={percentage} 
        className="h-1 w-16"
      />
    </div>
  );
}
