import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-14 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">Operator</p>
          <p className="text-xs text-muted-foreground">System Admin</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </motion.header>
  );
}
