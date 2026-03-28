import { memo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { GripVertical, X } from 'lucide-react';
import type { DashboardWidget } from '../../../src/types/dashboard';
import { CHART_COLORS } from '../../../src/types/dashboard';

interface ChartWidgetProps {
  widget: DashboardWidget;
  onRemove: (id: string) => void;
}

const ChartWidget = memo(({ widget, onRemove }: ChartWidgetProps) => {
  const renderChart = () => {
    const commonProps = { data: widget.data, margin: { top: 5, right: 10, left: -10, bottom: 0 } };
    const axisStyle = { fontSize: 11, fill: 'hsl(215, 20%, 55%)' };

    switch (widget.type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
            <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(222, 30%, 16%)', borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="value" fill={widget.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
            <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(222, 30%, 16%)', borderRadius: 8, fontSize: 12 }}
            />
            <Line type="monotone" dataKey="value" stroke={widget.color} strokeWidth={2} dot={{ r: 3, fill: widget.color }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`gradient-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={widget.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={widget.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
            <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(222, 30%, 16%)', borderRadius: 8, fontSize: 12 }}
            />
            <Area type="monotone" dataKey="value" stroke={widget.color} strokeWidth={2} fill={`url(#gradient-${widget.id})`} />
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Tooltip
              contentStyle={{ background: 'hsl(222, 47%, 9%)', border: '1px solid hsl(222, 30%, 16%)', borderRadius: 8, fontSize: 12 }}
            />
            <Pie
              data={widget.data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              dataKey="value"
              paddingAngle={3}
              strokeWidth={0}
            >
              {widget.data.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
    }
  };

  return (
    <div className="h-full flex flex-col rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing drag-handle" />
          <h3 className="text-sm font-medium text-foreground truncate">{widget.title}</h3>
        </div>
        <button
          onClick={() => onRemove(widget.id)}
          className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex-1 p-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
});

ChartWidget.displayName = 'ChartWidget';
export default ChartWidget;
