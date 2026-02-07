import { motion } from 'framer-motion';
import { ArrowRight, Recycle, Sparkles, CheckCircle2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WASTE_CATEGORIES } from '@/lib/waste-categories';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Classification</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-primary">WasteAI</span>
              <span className="block text-foreground mt-2">Smart Waste Classification System</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              An advanced AI-driven waste classification platform that uses deep learning 
              to accurately identify and categorize waste materials, promoting sustainable 
              waste management and environmental conservation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="gap-2 px-8 h-12 text-base"
                onClick={() => onNavigate('classify')}
              >
                Start Classification
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 px-8 h-12 text-base"
                onClick={() => onNavigate('dashboard')}
              >
                <BarChart3 className="w-5 h-5" />
                View Dashboard
              </Button>
            </div>

            {/* Accuracy Highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-success/10 border border-success/30"
            >
              <CheckCircle2 className="w-6 h-6 text-success" />
              <div className="text-left">
                <p className="text-2xl font-bold text-success">96.1%</p>
                <p className="text-xs text-muted-foreground">Model Accuracy</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-6 py-12 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-8">Supported Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WASTE_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className="glass-card p-4 rounded-xl text-center hover:bg-muted/40 transition-colors"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {category.icon}
                </div>
                <p className="font-medium text-sm">{category.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {category.recyclable ? 'Recyclable' : 'Non-recyclable'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-12 border-t border-border/50 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Deep Learning</h3>
              <p className="text-sm text-muted-foreground">
                EfficientNet-B4 architecture with transfer learning for high accuracy classification
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Sustainability</h3>
              <p className="text-sm text-muted-foreground">
                Promotes proper waste disposal and recycling practices for environmental conservation
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-info" />
              </div>
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive dashboard with real-time insights and classification statistics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
