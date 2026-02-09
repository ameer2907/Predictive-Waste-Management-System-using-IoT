import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HomePage } from '@/components/home/HomePage';
import { DashboardTab } from '@/components/dashboard/DashboardTab';
import { ClassifyTab } from '@/components/classification/ClassifyTab';
import { HardwareOverview } from '@/components/hardware/HardwareOverview';
import { ReportsPanel } from '@/components/reports/ReportsPanel';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  home: { title: '', subtitle: '' },
  dashboard: { title: 'Dashboard', subtitle: 'Real-time analytics and environmental impact' },
  classify: { title: 'Image Classification', subtitle: 'Upload and classify waste images' },
  hardware: { title: '3D Hardware Model', subtitle: 'Interactive smart bin system architecture' },
  reports: { title: 'Reports', subtitle: 'Export data and summaries' },
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const tabInfo = TAB_TITLES[activeTab] || TAB_TITLES.home;

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage onNavigate={setActiveTab} />;
      case 'dashboard': return <DashboardTab />;
      case 'classify': return <ClassifyTab />;
      case 'hardware': return <HardwareOverview />;
      case 'reports': return <ReportsPanel />;
      default: return null;
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
