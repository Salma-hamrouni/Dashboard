export type ChartType = 'bar' | 'line' | 'area' | 'pie';

export interface DashboardWidget {
  id: string;
  type: ChartType;
  title: string;
  data: DataPoint[];
  color: string;
}

export interface DataPoint {
  name: string;
  value: number;
  value2?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const CHART_COLORS = [
  'hsl(187, 72%, 52%)',   // cyan
  'hsl(262, 72%, 62%)',   // purple
  'hsl(142, 60%, 50%)',   // green
  'hsl(38, 92%, 60%)',    // orange
  'hsl(350, 72%, 60%)',   // rose
];

export const SAMPLE_DATA: Record<string, DataPoint[]> = {
  revenue: [
    { name: 'Jan', value: 4200 },
    { name: 'Fév', value: 5800 },
    { name: 'Mar', value: 4900 },
    { name: 'Avr', value: 7200 },
    { name: 'Mai', value: 6800 },
    { name: 'Jun', value: 8400 },
  ],
  users: [
    { name: 'Jan', value: 120 },
    { name: 'Fév', value: 280 },
    { name: 'Mar', value: 450 },
    { name: 'Avr', value: 620 },
    { name: 'Mai', value: 890 },
    { name: 'Jun', value: 1240 },
  ],
  categories: [
    { name: 'Desktop', value: 45 },
    { name: 'Mobile', value: 35 },
    { name: 'Tablet', value: 15 },
    { name: 'Autre', value: 5 },
  ],
  performance: [
    { name: 'Lun', value: 92 },
    { name: 'Mar', value: 88 },
    { name: 'Mer', value: 95 },
    { name: 'Jeu', value: 91 },
    { name: 'Ven', value: 87 },
    { name: 'Sam', value: 78 },
    { name: 'Dim', value: 72 },
  ],
};
