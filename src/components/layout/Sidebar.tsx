import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Home,
  Camera,
  BarChart3,
  Recycle,
  Cpu,
  FileText
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'classify', label: 'Classification', icon: Camera },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'hardware', label: '3D Hardware Model', icon: Cpu },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Recycle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-sidebar-foreground leading-tight">Waste Management</h1>
            <p className="text-xs text-sidebar-foreground/60">AI + IoT System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 relative z-10",
                    isActive && "text-primary-foreground"
                  )} />
                  <span className="font-medium relative z-10">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="glass-card p-4 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">Model Version</p>
          <p className="text-sm font-medium">EfficientNet-B4 v2.1</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-success">Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
