import { useState, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import ChartWidget from './ChartWidget';
import { useIsMobile } from '../../hooks/use-mobile';
import type { DashboardWidget, ChartType } from '../../types/dashboard';
import { SAMPLE_DATA, CHART_COLORS } from '../../types/dashboard';

const ResponsiveGridLayout = WidthProvider(Responsive) as React.ComponentType<any>;


const TITLE_MAP: Record<string, string> = {
  revenue: 'Revenus mensuels',
  users: 'Croissance utilisateurs',
  categories: 'Répartition par plateforme',
  performance: 'Score de performance',
};

interface DashboardCanvasProps {
  widgets: DashboardWidget[];
  setWidgets: React.Dispatch<React.SetStateAction<DashboardWidget[]>>;
}

const DashboardCanvas = ({ widgets, setWidgets }: DashboardCanvasProps) => {
  const isMobile = useIsMobile();
  const [layouts, setLayouts] = useState<Record<string, any[]>>({});

  const handleRemove = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, [setWidgets]);

  const handleLayoutChange = useCallback((_: any, allLayouts: any) => {
    setLayouts(allLayouts);
  }, []);

  const generateLayout = () => {
    return widgets.map((w, i) => ({
      i: w.id,
      x: (i * 6) % 12,
      y: Math.floor(i / 2) * 4,
      w: 6,
      h: 4,
      minW: 3,
      minH: 3,
    }));
  };

  if (widgets.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
          </div>
          <div>
            <p className="text-foreground font-medium">Aucun widget</p>
            <p className="text-sm text-muted-foreground">Utilisez la barre d'outils ou le chatbot pour ajouter des graphiques</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: generateLayout(), ...layouts }}
        breakpoints={{ xxl: 1536, xl: 1280, lg: 1200, md: 996, sm: 768, xs: 480, xxs: 320 }}
        cols={{ xxl: 16, xl: 14, lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={isMobile ? 45 : 60}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        isResizable
        isDraggable
        compactType="vertical"
        margin={[12, 12]}
      >
        {widgets.map((widget) => (
          <div key={widget.id}>
            <ChartWidget widget={widget} onRemove={handleRemove} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardCanvas;
