import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Radio, 
  Cpu, 
  AlertTriangle,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ImageUploader } from '@/components/classification/ImageUploader';
import { IoTSensorPanel } from '@/components/iot/IoTSensorPanel';
import { ModelComparisonTable } from '@/components/models/ModelComparisonTable';
import { 
  WasteDistributionChart, 
  AccuracyTrendChart, 
  FillLevelTrendChart,
  RecyclabilityChart
} from '@/components/charts/WasteCharts';
import { useModelMetrics, useClassificationHistory, useSensorReadings } from '@/hooks/use-dashboard-data';
import { WASTE_CATEGORIES } from '@/lib/waste-categories';
import { Progress } from '@/components/ui/progress';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Real-time waste management analytics' },
  classify: { title: 'Image Classification', subtitle: 'AI-powered waste image analysis' },
  iot: { title: 'IoT Monitoring', subtitle: 'Real-time smart bin monitoring' },
  analytics: { title: 'Analytics', subtitle: 'Comprehensive waste insights' },
  models: { title: 'Model Management', subtitle: 'Model performance comparison' },
};

// Mock data for charts
const accuracyTrendData = [
  { date: 'Jan', accuracy: 88 },
  { date: 'Feb', accuracy: 89 },
  { date: 'Mar', accuracy: 91 },
  { date: 'Apr', accuracy: 92 },
  { date: 'May', accuracy: 94 },
  { date: 'Jun', accuracy: 96 },
];

const fillLevelData = [
  { time: '00:00', zone_a: 20, zone_b: 35, zone_c: 15 },
  { time: '04:00', zone_a: 25, zone_b: 40, zone_c: 20 },
  { time: '08:00', zone_a: 45, zone_b: 55, zone_c: 40 },
  { time: '12:00', zone_a: 65, zone_b: 70, zone_c: 55 },
  { time: '16:00', zone_a: 80, zone_b: 85, zone_c: 70 },
  { time: '20:00', zone_a: 55, zone_b: 45, zone_c: 60 },
];

const recyclabilityData = [
  { name: 'Recyclable', value: 68 },
  { name: 'Non-recyclable', value: 32 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data: metrics } = useModelMetrics();
  const { data: classifications } = useClassificationHistory();
  const { data: sensorReadings } = useSensorReadings();

  const tabInfo = TAB_TITLES[activeTab] || TAB_TITLES.dashboard;

  // Calculate stats
  const totalClassifications = classifications?.length || 0;
  const bestAccuracy = metrics?.[0]?.accuracy 
    ? (Number(metrics[0].accuracy) * 100).toFixed(1) 
    : '96.1';
  const activeSensors = sensorReadings?.length || 6;
  const criticalBins = sensorReadings?.filter(r => r.fill_level >= 85).length || 0;

  // Distribution data for pie chart
  const distributionData = classifications?.reduce((acc, item) => {
    const existing = acc.find(a => a.category === item.primary_category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ category: item.primary_category, count: 1 });
    }
    return acc;
  }, [] as { category: string; count: number }[]) || WASTE_CATEGORIES.map(c => ({
    category: c.name,
    count: Math.floor(Math.random() * 50) + 10
  }));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Model Accuracy"
                value={`${bestAccuracy}%`}
                subtitle="Ensemble model"
                icon={TrendingUp}
                trend={{ value: 2.3, isPositive: true }}
                variant="primary"
              />
              <MetricCard
                title="Images Processed"
                value={totalClassifications || 1250}
                subtitle="Total classifications"
                icon={CheckCircle2}
                variant="success"
              />
              <MetricCard
                title="Active Sensors"
                value={activeSensors}
                subtitle="IoT devices online"
                icon={Radio}
                variant="default"
              />
              <MetricCard
                title="Critical Alerts"
                value={criticalBins}
                subtitle="Bins > 85% full"
                icon={AlertTriangle}
                variant={criticalBins > 0 ? 'destructive' : 'success'}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WasteDistributionChart 
                data={distributionData}
                title="Waste Distribution"
                subtitle="Classification breakdown"
              />
              <AccuracyTrendChart
                data={accuracyTrendData}
                title="Accuracy Trend"
                subtitle="Model performance over time"
              />
            </div>

            {/* Bin Fill Levels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FillLevelTrendChart
                data={fillLevelData}
                title="Fill Level Trends"
                subtitle="24-hour bin monitoring"
              />
              <div className="glass-card p-5 rounded-xl">
                <h3 className="font-semibold mb-2">Bin Fill Status</h3>
                <p className="text-xs text-muted-foreground mb-4">Current fill levels</p>
                <div className="space-y-4">
                  {(sensorReadings || []).slice(0, 4).map((reading, idx) => (
                    <div key={reading.id || idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{reading.sensor?.location_name || `Zone ${idx + 1}`}</span>
                        <span className={reading.fill_level >= 85 ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                          {reading.fill_level}%
                        </span>
                      </div>
                      <Progress 
                        value={reading.fill_level} 
                        className={`h-2 ${reading.fill_level >= 85 ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'classify':
        return (
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Simple Instructions */}
              <div className="glass-card p-4 rounded-xl">
                <p className="text-sm text-muted-foreground text-center">
                  Upload an image and the AI will automatically classify the waste type
                </p>
              </div>

              {/* Uploader */}
              <ImageUploader />

              {/* Categories Reference */}
              <div className="glass-card p-5 rounded-xl">
                <h3 className="font-semibold mb-4">Supported Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {WASTE_CATEGORIES.map(category => (
                    <div 
                      key={category.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'iot':
        return <IoTSensorPanel />;

      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Inference Speed"
                value="185ms"
                subtitle="Avg processing time"
                icon={Zap}
                variant="primary"
              />
              <MetricCard
                title="Recycling Rate"
                value="68%"
                subtitle="Recyclable detected"
                icon={CheckCircle2}
                variant="success"
              />
              <MetricCard
                title="Daily Volume"
                value="2,450"
                subtitle="Images today"
                icon={TrendingUp}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WasteDistributionChart 
                data={distributionData}
                title="Category Distribution"
                subtitle="Waste types breakdown"
              />
              <RecyclabilityChart
                data={recyclabilityData}
                title="Recyclability Analysis"
                subtitle="Recyclable vs non-recyclable"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AccuracyTrendChart
                data={accuracyTrendData}
                title="Accuracy Over Time"
                subtitle="Monthly accuracy trend"
              />
              <FillLevelTrendChart
                data={fillLevelData}
                title="Bin Fill Patterns"
                subtitle="24-hour analysis"
              />
            </div>
          </div>
        );

      case 'models':
        return (
          <div className="space-y-6">
            {/* Model Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                title="Best Model"
                value="Ensemble"
                subtitle="Highest accuracy"
                icon={Cpu}
                variant="primary"
              />
              <MetricCard
                title="Top Accuracy"
                value={`${bestAccuracy}%`}
                subtitle="Ensemble model"
                icon={TrendingUp}
                variant="success"
              />
              <MetricCard
                title="Fastest Model"
                value="MobileNetV3"
                subtitle="85ms inference"
                icon={Zap}
              />
              <MetricCard
                title="Total Predictions"
                value="45.7K"
                subtitle="All models"
                icon={CheckCircle2}
              />
            </div>

            {/* Comparison Table */}
            <ModelComparisonTable />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title={tabInfo.title}
      subtitle={tabInfo.subtitle}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;
