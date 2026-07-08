import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface VictimListProps {
  records: any[];
  onOpenFlow: (record: any) => void;
  onOpenPortal: () => void;
}

export function VictimList({ records, onOpenFlow, onOpenPortal }: VictimListProps) {
  return (
    <motion.div 
      key="list"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 space-y-6 overflow-y-auto custom-scrollbar"
    >
      {/* Call to Action para o Portal da Vítima */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="p-6 bg-gradient-to-br from-success/20 to-primary/10 border-2 border-success/30 rounded-[2rem] relative overflow-hidden group cursor-pointer shadow-xl" 
        onClick={onOpenPortal}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-ping" />
              <h5 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" /> Área do Familiar
              </h5>
            </div>
            <p className="text-sm text-slate-300 font-medium max-w-[280px] leading-relaxed">
              Acesso restrito para famílias acompanharem o fluxo de reparações em tempo real via Token Ministerial.
            </p>
          </div>
          <Button size="sm" className="bg-success hover:bg-success/90 text-xs font-black uppercase h-10 px-6 rounded-xl shadow-lg">
            Acessar Portal <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl shadow-inner group hover:border-success/20 transition-colors">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total Redirecionado</p>
          <p className="text-2xl font-black text-white tracking-tighter">R$ 442.800,00</p>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-success font-bold">
            <Activity className="h-3 w-3" /> ROI SOCIAL: +14.2%
          </div>
        </div>
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl shadow-inner group hover:border-primary/20 transition-colors">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Famílias Atendidas</p>
          <p className="text-2xl font-black text-white tracking-tighter">1.240</p>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-primary font-bold">
            <Users className="h-3 w-3" /> PROTOCOLO P10 ATIVO
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Activity className="h-4 w-4 text-success" /> Monitoramento de Repasses
          </span>
          <Badge variant="outline" className="text-[10px] border-white/10 text-slate-500">ORDEM: RECENTES</Badge>
        </div>
        
        <div className="grid gap-3">
          {records.map((record) => (
            <motion.div 
              key={record.id}
              whileHover={{ x: 5 }}
              className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl hover:border-success/30 transition-all group cursor-pointer"
              onClick={() => onOpenFlow(record)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-success/10 group-hover:border-success/20 transition-colors">
                    <Users className="h-5 w-5 text-slate-400 group-hover:text-success" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-tight">{record.victim}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Origem: {record.inmate}</p>
                  </div>
                </div>
                <Badge variant="outline" className={cn(
                  "text-[10px] font-black px-2 py-0.5", 
                  record.status === 'ACTIVE' ? "border-success text-success bg-success/5" : 
                  record.status === 'COMPLETED' ? "border-primary text-primary bg-primary/5" :
                  "border-warning text-warning bg-warning/5"
                )}>
                  {record.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500 uppercase">Progresso da Reparação</span>
                  <span className="text-success font-bold">{record.progress}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={record.progress} className="h-1.5 flex-1 bg-slate-800" indicatorClassName="bg-success" />
                  <span className="text-sm font-black text-white font-mono">R$ {record.amount.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
