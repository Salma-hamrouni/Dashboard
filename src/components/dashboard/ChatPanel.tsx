import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../src/integration/supabase/client';
import type { ChatMessage, ChartType, DashboardWidget } from '../../../src/types/dashboard';
import { CHART_COLORS } from '../../../src/types/dashboard';

interface ChatPanelProps {
  onAddWidget: (type: ChartType, dataKey: string) => void;
  onAddWidgets: (widgets: DashboardWidget[]) => void;
}

const SUGGESTIONS = [
  'Crée un dashboard e-commerce',
  'Dashboard de performance web',
  'Tableau de bord RH',
  'Analytics marketing',
];

const ChatPanel = ({ onAddWidget, onAddWidgets }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Décrivez le dashboard que vous souhaitez et je le génère avec l\'IA. 📊\n\nExemple : *"Crée un dashboard e-commerce avec les ventes, le trafic et les conversions"*',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-dashboard', {
        body: { message: msg },
      });

      if (error) throw error;

      if (data?.error) {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: `⚠️ ${data.error}`, timestamp: new Date() },
        ]);
        setIsLoading(false);
        return;
      }

      const widgets: any[] = data?.widgets || [];

      if (widgets.length === 0) {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: "Je n'ai pas pu générer de widgets. Essayez d'être plus précis dans votre demande.", timestamp: new Date() },
        ]);
      } else {
        const newWidgets: DashboardWidget[] = widgets.map((w: any, i: number) => ({
          id: `widget-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          type: (['bar', 'line', 'area', 'pie'].includes(w.type) ? w.type : 'bar') as ChartType,
          title: w.title || `Widget ${i + 1}`,
          data: Array.isArray(w.data) ? w.data.map((d: any) => ({ name: String(d.name || ''), value: Number(d.value || 0) })) : [],
          color: CHART_COLORS[i % CHART_COLORS.length],
        }));

        onAddWidgets(newWidgets);

        const widgetList = newWidgets.map((w) => `• **${w.title}** (${w.type})`).join('\n');
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `✅ Dashboard généré avec ${newWidgets.length} widget(s) :\n\n${widgetList}\n\nVous pouvez les réorganiser par drag & drop !`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (e: any) {
      console.error('AI error:', e);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: `❌ Erreur : ${e.message || 'Impossible de contacter l\'IA'}`, timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Assistant IA</h2>
          <p className="text-xs text-muted-foreground">Générez des dashboards par commande</p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex gap-1.5 px-3 py-2 border-b border-border overflow-x-auto">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSend(s)}
            disabled={isLoading}
            className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex gap-2 items-center px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Génération en cours...
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 focus-within:border-primary transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Décrivez votre dashboard idéal..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-1.5 rounded-md bg-primary text-primary-foreground disabled:opacity-30 hover:opacity-90 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
