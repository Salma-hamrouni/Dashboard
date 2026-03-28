import { BarChart3, LineChart, PieChart, AreaChart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ChartType } from '../../types/dashboard';

interface WidgetPaletteProps {
  onAddWidget: (type: ChartType, dataKey: string) => void;
}

const WIDGET_OPTIONS: { type: ChartType; label: string; icon: typeof BarChart3; dataKey: string }[] = [
  { type: 'bar', label: 'Barres', icon: BarChart3, dataKey: 'revenue' },
  { type: 'line', label: 'Lignes', icon: LineChart, dataKey: 'users' },
  { type: 'area', label: 'Aire', icon: AreaChart, dataKey: 'performance' },
  { type: 'pie', label: 'Secteurs', icon: PieChart, dataKey: 'categories' },
];

const WidgetPalette = ({ onAddWidget }: WidgetPaletteProps) => {
  return (
    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
      {WIDGET_OPTIONS.map((opt, i) => (
        <motion.button
          key={opt.type}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onAddWidget(opt.type, opt.dataKey)}
          className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card hover:border-primary hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-all"
        >
          <opt.icon className="w-4 h-4" />
          <span>{opt.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default WidgetPalette;
