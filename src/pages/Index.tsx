import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  CheckCircle2,
  Zap,
  Clock
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ImageUploader } from '@/components/classification/ImageUploader';
import { HomePage } from '@/components/home/HomePage';
import { 
  WasteDistributionChart, 
  AccuracyTrendChart, 
  RecyclabilityChart
} from '@/components/charts/WasteCharts';
import { useModelMetrics, useClassificationHistory } from '@/hooks/use-dashboard-data';
import { WASTE_CATEGORIES } from '@/lib/waste-categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  home: { title: 'Home', subtitle: 'Welcome to WasteAI' },
  dashboard: { title: 'Dashboard', subtitle: 'Classification analytics and insights' },
  classify: { title: 'Image Classification', subtitle: 'Upload and classify waste images' },
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

const recyclabilityData = [
  { name: 'Recyclable', value: 68 },
  { name: 'Non-recyclable', value: 32 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { data: metrics } = useModelMetrics();
  const { data: classifications } = useClassificationHistory();

  const tabInfo = TAB_TITLES[activeTab] || TAB_TITLES.home;

  // Calculate stats
  const totalClassifications = classifications?.length || 0;
  const bestAccuracy = metrics?.[0]?.accuracy 
    ? (Number(metrics[0].accuracy) * 100).toFixed(1) 
    : '96.1';

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

  // Recent predictions
  const recentPredictions = classifications?.slice(0, 5) || [];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;

      case 'dashboard':
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
                title="Avg. Inference"
                value="185ms"
                subtitle="Processing time"
                icon={Zap}
                variant="default"
              />
              <MetricCard
                title="Recycling Rate"
                value="68%"
                subtitle="Recyclable detected"
                icon={TrendingUp}
                variant="success"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WasteDistributionChart 
                data={distributionData}
                title="Category Distribution"
                subtitle="Waste types breakdown"
              />
              <AccuracyTrendChart
                data={accuracyTrendData}
                title="Accuracy Trend"
                subtitle="Model performance over time"
              />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecyclabilityChart
                data={recyclabilityData}
                title="Recyclability Analysis"
                subtitle="Recyclable vs non-recyclable"
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
                        const cat = WASTE_CATEGORIES.find(
                          c => c.name.toLowerCase() === pred.primary_category?.toLowerCase()
                        );
                        return (
                          <div 
                            key={pred.id || idx}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                              style={{ backgroundColor: `${cat?.color}20` }}
                            >
                              {cat?.icon || '📦'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{pred.primary_category}</p>
                              <p className="text-xs text-muted-foreground">
                                {pred.created_at 
                                  ? formatDistanceToNow(new Date(pred.created_at), { addSuffix: true })
                                  : 'Recently'
                                }
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-mono font-medium text-primary">
                                {((pred.confidence || 0) * 100).toFixed(0)}%
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {pred.is_recyclable ? 'Recyclable' : 'Non-recyclable'}
                              </p>
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
              <div className="glass-card p-4 rounded-xl text-center">
                <p className="text-sm text-muted-foreground">
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

      default:
        return null;
    }
  };

  // Home page has its own full layout
  if (activeTab === 'home') {
    return (
      <DashboardLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        title=""
        subtitle=""
      >
        <HomePage onNavigate={setActiveTab} />
      </DashboardLayout>
    );
  }

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
