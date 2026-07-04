import { motion, AnimatePresence } from 'framer-motion';
import { Skull, AlertCircle, Zap, ShieldAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tacticalAudio } from '@/lib/audioUtils';
import { useEffect } from 'react';

interface NarcoterroristAlertProps {
  message: string;
  onClose: () => void;
}

/**
 * Medida 1: Alerta de Alta Prioridade (System Override)
 * Acionado quando uma liderança narcoterrorista é detectada.
 */
export function NarcoterroristAlert({ message, onClose }: NarcoterroristAlertProps) {
  useEffect(() => {
    tacticalAudio.playScan();
    const interval = setInterval(() => tacticalAudio.playScan(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-red-950/40 backdrop-blur-md"
    >
      <div className="max-w-xl w-full bg-slate-950 border-2 border-red-600 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.4)] relative">
        {/* Efeito de Scanline de Fundo */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(220,38,38,0)_50%,rgba(220,38,38,0.5)_50%)] bg-[length:100%_4px]" />
        
        <div className="p-8 space-y-6 relative z-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-24 w-24 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.8)]"
            >
              <Skull className="h-12 w-12 text-white" />
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-red-500 uppercase tracking-tighter italic">Alerta de Prioridade P1</h2>
              <p className="text-[10px] text-red-400 font-black uppercase tracking-[0.3em] animate-pulse">Detecção de Liderança Narcoterrorista</p>
            </div>
          </div>

          <div className="bg-red-600/10 border border-red-600/30 p-6 rounded-2xl text-center">
            <p className="text-lg font-bold text-white leading-tight">{message}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
              <p className="text-[8px] font-black text-slate-500 uppercase">Protocolo</p>
              <p className="text-xs font-mono text-red-400">ASFIXIA_IMEDIATA</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
              <p className="text-[8px] font-black text-slate-500 uppercase">Origem</p>
              <p className="text-xs font-mono text-red-400">MURALHA_P9</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-red-600/20"
              onClick={onClose}
            >
              <ShieldAlert className="h-4 w-4 mr-2" /> Confirmar Ciência
            </Button>
            <Button 
              variant="outline"
              className="h-14 border-white/10 text-slate-400 hover:bg-white/5 font-black uppercase text-[10px]"
              onClick={onClose}
            >
              <X className="h-4 w-4" /> Ignorar
            </Button>
          </div>
        </div>

        {/* Tickers de Coordenadas */}
        <div className="absolute bottom-2 left-6 text-[7px] font-mono text-red-600/40">
          SYS_OVERRIDE_ACTIVE // TRACE_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>
      </div>
    </motion.div>
  );
}
