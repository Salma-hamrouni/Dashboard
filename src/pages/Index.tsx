import { useState, useCallback } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '../components/ui/sidebar';
import { LayoutDashboard, PanelRightClose, PanelRightOpen, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardCanvas from '../components/dashboard/DashboardCanvas';
import WidgetPalette from '../components/dashboard/WidgetPalette';
import ChatPanel from '../components/dashboard/ChatPanel';
import type { DashboardWidget, ChartType } from '../types/dashboard';
import { SAMPLE_DATA, CHART_COLORS } from '../types/dashboard';

const TITLE_MAP: Record<string, string> = {
  revenue: 'Revenus mensuels',
  users: 'Croissance utilisateurs',
  categories: 'Répartition par plateforme',
  performance: 'Score de performance',
};

const Index = () => {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [chatOpen, setChatOpen] = useState(true);

  const addWidget = useCallback((type: ChartType, dataKey: string) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      title: TITLE_MAP[dataKey] || `Graphique ${type}`,
      data: SAMPLE_DATA[dataKey] || SAMPLE_DATA.revenue,
      color: CHART_COLORS[widgets.length % CHART_COLORS.length],
    };
    setWidgets((prev) => [...prev, newWidget]);
  }, [widgets.length]);

  const addWidgets = useCallback((newWidgets: DashboardWidget[]) => {
    setWidgets((prev) => [...prev, ...newWidgets]);
  }, []);

  const clearAll = useCallback(() => {
    setWidgets([]);
  }, []);

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex h-screen overflow-hidden bg-background">
          {/* Main area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="flex items-center justify-between px-5 py-3 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="-mb-1 ml-2" />
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-foreground">Dashboard Builder</h1>
                  <p className="text-xs text-muted-foreground font-mono">
                    {widgets.length} widget{widgets.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <WidgetPalette onAddWidget={addWidget} />
                {widgets.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="p-2 rounded-md border border-border hover:bg-destructive/10 hover:border-destructive/50 text-muted-foreground hover:text-destructive transition-colors"
                    title="Tout supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setChatOpen(!chatOpen)}
                  className="p-2 rounded-md border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title={chatOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
                >
                  {chatOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                </button>
              </div>
            </header>

            {/* Canvas + Chat */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              <div className="flex-1 overflow-hidden">
                <DashboardCanvas widgets={widgets} setWidgets={setWidgets} />
              </div>

              {/* Chat panel */}
              {chatOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 384, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 border-l border-border overflow-hidden"
                >
                  <ChatPanel onAddWidget={addWidget} onAddWidgets={addWidgets} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Index;