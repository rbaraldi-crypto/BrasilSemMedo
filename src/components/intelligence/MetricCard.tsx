import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  className?: string;
  onClick?: () => void;
}

export function MetricCard({ title, value, icon, trend, className, onClick }: MetricCardProps) {
  return (
    <Card 
      className={cn(
        "bg-slate-900 border-white/10 hover:border-primary/30 transition-colors", 
        onClick && "cursor-pointer active:scale-95",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="mt-2 text-[10px] font-medium text-slate-400 flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-primary" /> {trend}
        </div>
      </CardContent>
    </Card>
  );
}
