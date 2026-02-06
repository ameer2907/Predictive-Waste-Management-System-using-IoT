import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Recycle, 
  TrendingUp, 
  Radio, 
  Cpu, 
  Trash2, 
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Clock,
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
  ModelBarChart,
  FillLevelTrendChart,
  RecyclabilityChart
} from '@/components/charts/WasteCharts';
import { useModelMetrics, useClassificationHistory, useSensorReadings } from '@/hooks/use-dashboard-data';
import { WASTE_CATEGORIES } from '@/lib/waste-categories';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Real-time waste management analytics' },
  classify: { title: 'Waste Classification', subtitle: 'AI-powered waste image analysis' },
  iot: { title: 'IoT Sensors', subtitle: 'Real-time smart bin monitoring' },
  analytics: { title: 'Analytics', subtitle: 'Comprehensive waste insights' },
  models: { title: 'ML Models', subtitle: 'Model performance comparison' },
  dataset: { title: 'Dataset Management', subtitle: 'Training data and versioning' },
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

const biodegradableData = [
  { name: 'Biodegradable', value: 42 },
  { name: 'Non-biodegradable', value: 58 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data: metrics } = useModelMetrics();
  const { data: classifications } = useClassificationHistory();
  const { data: sensorReadings } = useSensorReadings();

  const tabInfo = TAB_TITLES[activeTab] || TAB_TITLES.dashboard;

  // Calculate stats
  const totalClassifications = classifications?.length || 0;
  const avgConfidence = classifications?.length 
    ? (classifications.reduce((acc, c) => acc + Number(c.confidence), 0) / classifications.length * 100).toFixed(1)
    : '0';
  const bestAccuracy = metrics?.[0]?.accuracy 
    ? (Number(metrics[0].accuracy) * 100).toFixed(1) 
    : '0';
  const activeSensors = sensorReadings?.length || 0;
  const criticalBins = sensorReadings?.filter(r => r.fill_level >= 80).length || 0;

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

  // Model accuracy data for bar chart
  const modelAccuracyData = metrics?.map(m => ({
    name: m.model_name,
    accuracy: Number(m.accuracy) * 100
  })) || [];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Classifications"
                value={totalClassifications}
                subtitle="All-time processed images"
                icon={Recycle}
                trend={{ value: 12.5, isPositive: true }}
                variant="primary"
              />
              <MetricCard
                title="Model Accuracy"
                value={`${bestAccuracy}%`}
                subtitle="Ensemble model performance"
                icon={TrendingUp}
                trend={{ value: 2.3, isPositive: true }}
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
                title="Critical Bins"
                value={criticalBins}
                subtitle="Require immediate attention"
                icon={AlertTriangle}
                variant={criticalBins > 0 ? 'destructive' : 'success'}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WasteDistributionChart 
                data={distributionData}
                title="Waste Distribution"
                subtitle="Classification breakdown by category"
              />
              <AccuracyTrendChart
                data={accuracyTrendData}
                title="Accuracy Trend"
                subtitle="Model performance over time"
              />
            </div>

            {/* Second Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <FillLevelTrendChart
                data={fillLevelData}
                title="Fill Level Trends"
                subtitle="Bin fill levels over 24 hours"
              />
              <RecyclabilityChart
                data={recyclabilityData}
                title="Recyclability"
                subtitle="Recyclable vs non-recyclable"
              />
              <RecyclabilityChart
                data={biodegradableData}
                title="Biodegradability"
                subtitle="Biodegradable breakdown"
              />
            </div>

            {/* Model Comparison */}
            <ModelComparisonTable />
          </div>
        );

      case 'classify':
        return (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Instructions Card */}
              <div className="glass-card p-5 rounded-xl">
                <h3 className="font-semibold mb-3">How it works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-semibold">1</div>
                    <div>
                      <p className="font-medium text-sm">Upload Image</p>
                      <p className="text-xs text-muted-foreground">Drag & drop or browse</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-semibold">2</div>
                    <div>
                      <p className="font-medium text-sm">AI Analysis</p>
                      <p className="text-xs text-muted-foreground">Ensemble model processing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-semibold">3</div>
                    <div>
                      <p className="font-medium text-sm">Get Results</p>
                      <p className="text-xs text-muted-foreground">Disposal recommendations</p>
                    </div>
                  </div>
                </div>
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
                      <span className="text-xl">{category.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{category.name}</p>
                        <div className="flex gap-1">
                          {category.recyclable && (
                            <span className="text-[10px] text-success">♻️</span>
                          )}
                          {category.biodegradable && (
                            <span className="text-[10px] text-success">🌿</span>
                          )}
                        </div>
                      </div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                title="Avg. Confidence"
                value={`${avgConfidence}%`}
                subtitle="Classification confidence"
                icon={CheckCircle2}
                variant="success"
              />
              <MetricCard
                title="Inference Speed"
                value="185ms"
                subtitle="Average processing time"
                icon={Zap}
                variant="primary"
              />
              <MetricCard
                title="Daily Volume"
                value="2,450"
                subtitle="Images processed today"
                icon={Trash2}
              />
              <MetricCard
                title="Recycling Rate"
                value="68%"
                subtitle="Recyclable items detected"
                icon={Leaf}
                variant="success"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WasteDistributionChart 
                data={distributionData}
                title="Category Distribution"
                subtitle="Waste types breakdown"
              />
              <ModelBarChart
                data={modelAccuracyData}
                title="Model Accuracy Comparison"
                subtitle="Performance across all models"
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
                subtitle="24-hour fill level analysis"
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
                subtitle="All models combined"
                icon={CheckCircle2}
              />
            </div>

            {/* Comparison Table */}
            <ModelComparisonTable />

            {/* Model Accuracy Chart */}
            <ModelBarChart
              data={modelAccuracyData}
              title="Model Performance Comparison"
              subtitle="Accuracy across all implemented models"
            />
          </div>
        );

      case 'dataset':
        return (
          <div className="space-y-6">
            {/* Dataset Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                title="Total Images"
                value="24,580"
                subtitle="Training dataset size"
                icon={Trash2}
                variant="primary"
              />
              <MetricCard
                title="Categories"
                value="8"
                subtitle="Waste classifications"
                icon={Recycle}
              />
              <MetricCard
                title="Augmented"
                value="98,320"
                subtitle="After data augmentation"
                icon={TrendingUp}
                variant="success"
              />
              <MetricCard
                title="Last Updated"
                value="Today"
                subtitle="Dataset version 2.4"
                icon={Clock}
              />
            </div>

            {/* Dataset Info Card */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Dataset Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Class Distribution</h4>
                  <div className="space-y-2">
                    {WASTE_CATEGORIES.map(category => {
                      const count = Math.floor(Math.random() * 4000) + 1500;
                      const percentage = ((count / 24580) * 100).toFixed(1);
                      return (
                        <div key={category.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{count.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground">({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Data Augmentation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Rotation (±15°)</span>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Horizontal Flip</span>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Brightness Adjustment</span>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Random Crop</span>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Color Jitter</span>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Gaussian Blur</span>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload New Dataset */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-semibold mb-2">Upload New Dataset</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a ZIP file containing labeled waste images organized by category folders.
              </p>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Trash2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">Drop your dataset ZIP here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
              </div>
            </div>
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
