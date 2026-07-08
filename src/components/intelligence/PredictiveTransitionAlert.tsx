import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, ShieldCheck, Building2, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface PredictiveTransitionAlertProps {
  transitionDate: string;
  thresholdAge: 16 | 18;
}

/**
 * Medida 2: Predictive Transition Alerts
 * Dashboard de contagem regressiva com alerta ao MP e reserva TREVA.
 */
export function PredictiveTransitionAlert({ transitionDate, thresholdAge }: PredictiveTransitionAlertProps) {
  const [daysRemaining, setDaysRemaining] = useState(0);
  
  useEffect(() => {
    const target = new Date(transitionDate);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    setDaysRemaining(diff);
  }, [transitionDate]);

  const isCritical = daysRemaining <= 90;
  const progress = Math.max(0, Math.min(100, 100 - (daysRemaining / 365) * 100));

  return (
    <div className={cn(
      "p-5 rounded-2xl border transition-all duration-500 relative overflow-hidden",
      isCritical ? "bg-red-950/20 border-red-600/50 shadow-[0_0_30px_rgba(220,38,38,0.15)]" : "bg-slate-900 border-white/5"
    )}>
      {/* Background Pulse for Critical State */}
      {isCritical && (
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-red-600 pointer-events-none"
        />
      )}

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center border",
            isCritical ? "bg-red-600/20 border-red-500/30" : "bg-primary/10 border-primary/20"
          )}>
            <Clock className={cn("h-5 w-5", isCritical ? "text-red-500 animate-pulse" : "text-primary")} />
          </div>
          <div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Gatilho de Transição {thresholdAge}a</span>
            <h4 className="text-sm font-bold text-white uppercase tracking-tighter">Cronograma de Custódia</h4>
          </div>
        </div>
        <div className="text-right">
          <div className={cn(
            "text-2xl font-black tracking-tighter",
            isCritical ? "text-red-500" : "text-primary"
          )}>
            {daysRemaining} <span className="text-xs uppercase">Dias</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Restantes para Transição</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
            <span>Início do Ciclo</span>
            <span>Transferência Obrigatória</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-slate-800" 
            indicatorClassName={isCritical ? "bg-gradient-to-r from-red-600 to-orange-500" : "bg-primary"} 
          />
        </div>

        {isCritical ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-3 bg-red-600/10 border border-red-600/30 rounded-xl flex items-start gap-3">
              <BellRing className="h-4 w-4 text-red-500 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Alerta Ministério Público (T-90)</p>
                <p className="text-xs text-slate-200 leading-tight font-medium mt-0.5">
                  Notificação enviada ao MP para manifestação prévia. Protocolo de transição aberto.
                </p>
              </div>
            </div>
            
            <div className="p-3 bg-slate-950/60 border border-white/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Reserva TREVA:</span>
              </div>
              <Badge className="bg-success text-[10px] font-black px-2 py-0.5">VAGA_RESERVADA_N01</Badge>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-xl">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Monitoramento Preventivo: STATUS_OK</span>
          </div>
        )}
      </div>
    </div>
  );
}
