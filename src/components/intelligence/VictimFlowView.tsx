import { motion } from 'framer-motion';
import { ShieldEllipsis, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DirectFinancialLink } from './DirectFinancialLink';

interface VictimFlowViewProps {
  selectedRecord: any;
}

export function VictimFlowView({ selectedRecord }: VictimFlowViewProps) {
  return (
    <motion.div 
      key="flow"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 h-full flex flex-col"
    >
      <DirectFinancialLink 
        inmateName={selectedRecord.inmate}
        victimFamily={selectedRecord.victim}
        amount={selectedRecord.monthly}
        protocolId={selectedRecord.protocol}
      />
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <div className="p-6 bg-slate-900 border border-white/5 rounded-[2rem] space-y-5">
          <span className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
            <ShieldEllipsis className="h-5 w-5" /> Telemetria de Repasse
          </span>
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-mono border-b border-white/5 pb-2">
              <span className="text-slate-500 uppercase">BLOQUEIO_JUDICIAL:</span>
              <span className="text-success font-bold">CONFIRMADO</span>
            </div>
            <div className="flex justify-between text-xs font-mono border-b border-white/5 pb-2">
              <span className="text-slate-500 uppercase">REPASSE_MINISTERIAL:</span>
              <span className="text-primary font-bold">AGENDADO (T+1)</span>
            </div>
            <div className="flex justify-between text-xs font-mono border-b border-white/5 pb-2">
              <span className="text-slate-500 uppercase">IDENTIDADE_ICP:</span>
              <span className="text-success font-bold">VALIDADA</span>
            </div>
            <div className="pt-2 flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-600">HASH: SHA256:8F4B...A9C3</span>
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">SECURE_LINK</Badge>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-white/5 rounded-[2rem] flex flex-col justify-center items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Info className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h6 className="text-sm font-black text-white uppercase">Ação do Operador</h6>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[200px]">
              O repasse mensal é processado automaticamente pelo motor de regras SISBAJUD.
            </p>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-xs font-black uppercase h-11 rounded-xl">
            Forçar Reiteração de Bloqueio
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
