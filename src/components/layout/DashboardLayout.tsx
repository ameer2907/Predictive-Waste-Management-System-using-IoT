import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({
  children,
  activeTab,
  onTabChange,
  title,
  subtitle
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex-1 flex flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
