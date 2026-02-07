import { motion } from 'framer-motion';
import { 
  Leaf, 
  BarChart3, 
  Cpu, 
  Radio, 
  Upload, 
  Settings,
  Database,
  Activity,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'classify', label: 'Image Classification', icon: Upload },
  { id: 'iot', label: 'IoT Monitoring', icon: Radio },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'models', label: 'Model Management', icon: Cpu },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">WasteAI</h1>
            <p className="text-xs text-muted-foreground">Smart City Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "animate-pulse-glow")} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Status Card */}
      <div className="p-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">System Status</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">ML Engine</span>
              <span className="text-success font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">IoT Network</span>
              <span className="text-success font-medium">6 Sensors</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Accuracy</span>
              <span className="text-primary font-mono font-medium">96.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </motion.aside>
  );
}
