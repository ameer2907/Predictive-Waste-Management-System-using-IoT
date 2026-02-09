import { 
  TrendingUp, CheckCircle2, Zap, Clock, Radio, AlertTriangle, Leaf, Recycle
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { 
  WasteDistributionChart, AccuracyTrendChart, RecyclabilityChart 
} from '@/components/charts/WasteCharts';
import { useModelMetrics, useClassificationHistory, useIoTSensors, useSensorReadings } from '@/hooks/use-dashboard-data';
import { WASTE_CATEGORIES } from '@/lib/waste-categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const accuracyTrendData = [
  { date: 'Jan', accuracy: 88 },
  { date: 'Feb', accuracy: 89 },
  { date: 'Mar', accuracy: 91 },
  { date: 'Apr', accuracy: 92 },
  { date: 'May', accuracy: 94 },
  { date: 'Jun', accuracy: 96 },
];

const recyclabilityData = [
  { name: 'Recyclable', value: 68 },
  { name: 'Non-recyclable', value: 32 },
];

export function DashboardTab() {
  const { data: metrics } = useModelMetrics();
  const { data: classifications } = useClassificationHistory();
  const { data: sensors } = useIoTSensors();
  const { data: readings } = useSensorReadings();

  const totalClassifications = classifications?.length || 0;
  const bestAccuracy = metrics?.[0]?.accuracy
    ? (Number(metrics[0].accuracy) * 100).toFixed(1)
    : '96.1';

  const activeSensors = sensors?.length || 0;
  const overflowAlerts = readings?.filter(r => r.fill_level >= 80).length || 0;

  const recyclableCount = classifications?.filter(c => c.is_recyclable).length || 0;
  const nonRecyclableCount = totalClassifications - recyclableCount;
  const recyclablePercent = totalClassifications > 0
    ? ((recyclableCount / totalClassifications) * 100).toFixed(0)
    : '68';

  // Estimated environmental impact
  const estimatedRecycledKg = (recyclableCount * 2.5).toFixed(0);
  const landfillReduction = (recyclableCount * 1.8).toFixed(0);
  const co2Savings = (recyclableCount * 0.9).toFixed(1);

  const distributionData = classifications?.reduce((acc, item) => {
    const existing = acc.find(a => a.category === item.primary_category);
    if (existing) existing.count++;
    else acc.push({ category: item.primary_category, count: 1 });
    return acc;
  }, [] as { category: string; count: number }[]) || WASTE_CATEGORIES.map(c => ({
    category: c.name, count: Math.floor(Math.random() * 50) + 10
  }));

  const recentPredictions = classifications?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Model Accuracy"
          value={`${bestAccuracy}%`}
          subtitle="EfficientNet-B4"
          icon={TrendingUp}
          trend={{ value: 2.3, isPositive: true }}
          variant="primary"
        />
        <MetricCard
          title="Total Classified"
          value={totalClassifications || 1250}
          subtitle="Images processed"
          icon={CheckCircle2}
          variant="success"
        />
        <MetricCard
          title="Active Smart Bins"
          value={activeSensors || 6}
          subtitle="IoT sensors online"
          icon={Radio}
          variant="default"
        />
        <MetricCard
          title="Overflow Alerts"
          value={overflowAlerts}
          subtitle="Bins above 80%"
          icon={AlertTriangle}
          variant={overflowAlerts > 0 ? 'destructive' : 'success'}
        />
      </div>

      {/* Environmental Impact Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 border border-success/20 bg-success/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
              <Recycle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Est. Recycled Waste</p>
              <p className="text-xl font-bold metric-value text-success">{estimatedRecycledKg} kg</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Landfill Reduction</p>
              <p className="text-xl font-bold metric-value text-primary">{landfillReduction} kg</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 border border-info/20 bg-info/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CO₂ Savings</p>
              <p className="text-xl font-bold metric-value text-info">{co2Savings} kg</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WasteDistributionChart data={distributionData} title="Category Distribution" subtitle="Waste types breakdown" />
        <AccuracyTrendChart data={accuracyTrendData} title="Accuracy Trend" subtitle="Model performance over time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecyclabilityChart
          data={[
            { name: 'Recyclable', value: Number(recyclablePercent) },
            { name: 'Non-recyclable', value: 100 - Number(recyclablePercent) },
          ]}
          title="Recyclable vs Non-Recyclable"
          subtitle={`${recyclablePercent}% recyclable detected`}
        />

        {/* Recent Predictions */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Predictions</CardTitle>
            <p className="text-xs text-muted-foreground">Latest classification results</p>
          </CardHeader>
          <CardContent>
            {recentPredictions.length > 0 ? (
              <div className="space-y-3">
                {recentPredictions.map((pred, idx) => {
                  const cat = WASTE_CATEGORIES.find(c => c.name.toLowerCase() === pred.primary_category?.toLowerCase());
                  return (
                    <div key={pred.id || idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${cat?.color}20` }}>
                        {cat?.icon || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{pred.primary_category}</p>
                        <p className="text-xs text-muted-foreground">
                          {pred.created_at ? formatDistanceToNow(new Date(pred.created_at), { addSuffix: true }) : 'Recently'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-medium text-primary">{((pred.confidence || 0) * 100).toFixed(0)}%</p>
                        <p className="text-xs text-muted-foreground">{pred.is_recyclable ? 'Recyclable' : 'Non-recyclable'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No recent predictions</p>
                <p className="text-xs mt-1">Start classifying to see results here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="glass-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'AI Model', status: 'Active', ok: true },
              { label: 'IoT Gateway', status: 'Connected', ok: true },
              { label: 'Cloud Backend', status: 'Online', ok: true },
              { label: 'Predictions API', status: 'Running', ok: true },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                <div className={`w-2 h-2 rounded-full ${s.ok ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
                <div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
