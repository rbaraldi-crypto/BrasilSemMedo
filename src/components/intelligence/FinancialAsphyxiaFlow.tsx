import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, ShieldAlert, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FinancialAsphyxiaFlowProps {
  asphyxiaLevel: number;
  orgAcronym: string;
  className?: string;
}

/**
 * Medida 1: Visualização de Asfixia Financeira
 * Mostra o impacto do SISBAJUD no capital operacional da facção.
 */
export function FinancialAsphyxiaFlow({ asphyxiaLevel, orgAcronym, className }: FinancialAsphyxiaFlowProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Asfixia: {orgAcronym}</span>
        </div>
        <span className="text-xs font-mono text-red-500 font-bold">{asphyxiaLevel}% BLOQUEADO</span>
      </div>

      <div className="relative h-12 bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center px-4">
        {/* Camada de Fluxo (Animação) */}
        <motion.div 
          animate={{ x: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, #ef4444 20px, #ef4444 22px)'
          }}
        />

        <div className="flex-1 space-y-1.5 relative z-10">
          <Progress 
            value={asphyxiaLevel} 
            className="h-2 bg-slate-800" 
            indicatorClassName="bg-gradient-to-r from-red-600 to-orange-500" 
          />
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
            <span>Capital Operacional</span>
            <span className="text-red-500">Fluxo SISBAJUD</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-red-600/5 border border-red-600/20 rounded-lg flex items-center gap-2">
          <TrendingDown className="h-3 w-3 text-red-500" />
          <span className="text-[10px] font-bold text-red-200 uppercase">Drenagem Ativa</span>
        </div>
        <div className="p-2 bg-primary/5 border border-primary/20 rounded-lg flex items-center gap-2">
          <Zap className="h-3 w-3 text-primary" />
          <span className="text-[10px] font-bold text-primary-foreground uppercase">ROI: 11.5%</span>
        </div>
      </div>
    </div>
  );
}
