import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, AlertTriangle, ShieldAlert, 
  TrendingUp, Info, Activity, Skull, 
  Target, FileWarning, CircleCheck
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { penalService } from '@/services/penalService';
import { RecidivismRisk } from '@/types/intelligence';
import { TacticalSkeleton } from '@/components/ui/TacticalSkeleton';

interface RecidivismRiskAnalysisProps {
  inmateId: string;
  className?: string;
}

export function RecidivismRiskAnalysis({ inmateId, className }: RecidivismRiskAnalysisProps) {
  const [risk, setRisk] = useState<RecidivismRisk | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRisk = async () => {
      setIsLoading(true);
      const data = await penalService.getRecidivismRisk(inmateId);
      setRisk(data);
      setIsLoading(false);
    };
    fetchRisk();
  }, [inmateId]);

  if (isLoading) {
    return (
      <Card className={cn("bg-slate-900 border-white/10 overflow-hidden", className)}>
        <CardHeader className="pb-2 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Processando Risco Preditivo</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <TacticalSkeleton lines={8} />
        </CardContent>
      </Card>
    );
  }

  if (!risk) return null;

  const isCritical = risk.level === 'CRÍTICO' || risk.level === 'ALTO';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl", className)}
    >
      <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Análise de Risco de Reincidência</span>
        </div>
        <div className={cn(
          "px-2 py-0.5 rounded text-[8px] font-black uppercase border",
          isCritical ? "bg-red-600 border-red-500 text-white" : "bg-success/20 border-success/40 text-success"
        )}>
          {risk.level}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Radar Chart de Pilares de Risco */}
          <div className="w-full md:w-1/2 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={risk.factors}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 8, fontWeight: 'bold' }} />
                <Radar
                  name="Risco"
                  dataKey="value"
                  stroke={isCritical ? "#ef4444" : "#0ea5e9"}
                  fill={isCritical ? "#ef4444" : "#0ea5e9"}
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Score Global */}
          <div className="w-full md:w-1/2 space-y-4">
             <div className="text-center md:text-left">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Índice de Periculosidade</span>
                <div className={cn(
                  "text-4xl font-black tracking-tighter",
                  isCritical ? "text-red-500" : "text-success"
                )}>
                  {risk.score}%
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-medium leading-tight">
                  Probabilidade calculada de retorno à atividade criminosa em 24 meses.
                </p>
             </div>
             
             <div className="space-y-2">
                <div className="flex justify-between text-[8px] font-black uppercase">
                   <span className="text-slate-500">Conformidade Preditiva</span>
                   <span className={isCritical ? "text-red-400" : "text-success"}>{100 - risk.score}%</span>
                </div>
                <Progress value={100 - risk.score} className="h-1.5" indicatorClassName={isCritical ? "bg-red-600" : "bg-success"} />
             </div>
          </div>
        </div>

        {/* Sinais de Alerta (Red Flags) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
             <FileWarning className="h-3 w-3" /> Fatores Determinantes da Decisão
          </div>
          <div className="grid grid-cols-1 gap-2">
            {risk.redFlags.map((flag, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-2.5 rounded-xl border flex items-start gap-3 transition-all",
                  isCritical ? "bg-red-500/5 border-red-500/20" : "bg-success/5 border-success/20"
                )}
              >
                {isCritical ? (
                  <ShieldAlert className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <CircleCheck className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                )}
                <span className={cn(
                  "text-[10px] font-bold leading-tight",
                  isCritical ? "text-red-200" : "text-success"
                )}>
                  {flag}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-black/20 rounded-xl border border-white/5">
           <div className="flex items-center gap-2 text-primary mb-1">
              <Activity className="h-3 w-3" />
              <span className="text-[8px] font-black uppercase">Fundamentação de Inteligência</span>
           </div>
           <p className="text-[9px] text-slate-500 italic leading-relaxed">
             "A análise preditiva indica que a progressão de regime neste estágio apresenta risco elevado à segurança pública devido à manutenção de canais de comunicação com a Sintonia Geral."
           </p>
        </div>
      </div>
    </motion.div>
  );
}
