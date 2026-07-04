import { motion } from 'framer-motion';
import { Skull, Landmark, Scan, Zap, Activity, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * UX Polish: Dynamic HUD Ticker
 * Feed de inteligência global em tempo real (Ponto 2 do polimento).
 */
export function GlobalIntelligenceTicker() {
  const [items] = useState([
    { id: 1, type: 'ARREST', text: 'ALVO P1 CUSTODIADO: SETOR DE CARGAS GRU', icon: Skull, color: 'text-red-500' },
    { id: 2, type: 'BLOCK', text: 'SISBAJUD: R$ 1.2M BLOQUEADOS - SINTONIA FINANCEIRA', icon: Landmark, color: 'text-primary' },
    { id: 3, type: 'MATCH', text: 'MURALHA P9: MATCH BIOMÉTRICO 99.8% DETECTADO EM SANTOS', icon: Scan, color: 'text-cyan-400' },
    { id: 4, type: 'OPS', text: 'OPERAÇÃO TREVA: TRANSFERÊNCIA DE 12 LIDERANÇAS INICIADA', icon: Zap, color: 'text-warning' },
    { id: 5, type: 'INTEL', text: 'AWS_DYNAMODB: SINCRONIZAÇÃO DE GSI_MURALHA CONCLUÍDA', icon: Activity, color: 'text-success' },
  ]);

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-64 h-8 bg-black/80 backdrop-blur-md border-t border-white/10 z-[60] flex items-center overflow-hidden pointer-events-auto">
      <div className="flex items-center px-4 bg-primary/20 border-r border-white/10 h-full z-10 shrink-0">
        <ShieldAlert className="h-3 w-3 text-primary mr-2 animate-pulse" />
        <span className="text-[8px] font-black text-white uppercase tracking-widest">Global_Intel_Feed</span>
      </div>
      
      <div className="flex-1 relative flex items-center h-full">
        <motion.div 
          animate={{ x: [0, -1500] }}
          transition={{ 
            repeat: Infinity, 
            duration: 40, 
            ease: "linear" 
          }}
          className="flex items-center gap-12 whitespace-nowrap pl-8"
        >
          {[...items, ...items].map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center gap-3">
              <item.icon className={`h-3 w-3 ${item.color}`} />
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">
                {item.text}
              </span>
              <div className="h-1 w-1 rounded-full bg-white/10" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="px-4 bg-slate-900 border-l border-white/10 h-full flex items-center gap-4 shrink-0 z-10">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[8px] font-mono text-slate-500 uppercase">SYS_STABLE</span>
        </div>
        <span className="text-[8px] font-mono text-slate-600 uppercase">v2.6.5_STABLE</span>
      </div>
    </div>
  );
}
