import { motion } from 'framer-motion';
import { ImageUploader } from '@/components/classification/ImageUploader';
import { WASTE_CATEGORIES } from '@/lib/waste-categories';

export function ClassifyTab() {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="glass-card p-4 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            Upload an image and the AI will classify it as <strong>Biodegradable</strong>, <strong>Non-Biodegradable</strong>, or <strong>Trash</strong>
          </p>
        </div>

        <ImageUploader />

        <div className="glass-card p-5 rounded-xl">
          <h3 className="font-semibold mb-4">Classification Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {WASTE_CATEGORIES.map(category => (
              <div key={category.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-xl">{category.icon}</span>
                <div>
                  <p className="text-sm font-medium">{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.binLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
