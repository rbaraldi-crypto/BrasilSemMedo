import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Database, Wifi, Activity, Cpu } from 'lucide-react';

/**
 * RadarWaves: Simulação de busca por radar com círculos concêntricos celestes.
 * Otimizado para preenchimento total do container e estética militar.
 */
export function RadarWaves({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center overflow-hidden bg-slate-950", className)}>
      {/* Grade Tática de Fundo */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: `
          linear-gradient(to right, #22D3EE 1px, transparent 1px),
          linear-gradient(to bottom, #22D3EE 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />

      {/* Círculos Concêntricos Celestes (Expansão Infinita) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 3], 
            opacity: [0, 0.5, 0],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            delay: i * 0.6,
            ease: "easeOut" 
          }}
          className="absolute rounded-full border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          style={{ width: '50%', aspectRatio: '1/1' }}
        />
      ))}

      {/* Varredura Rotativa (Sweep) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute w-[250%] h-[250%] origin-center z-10"
        style={{ 
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(34, 211, 238, 0.15) 48%, rgba(34, 211, 238, 0.3) 50%, transparent 52%)' 
        }}
      />

      {/* Status AWS DynamoDB */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 z-30">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-cyan-400/20 px-3 py-1 rounded-md">
          <Database className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono text-cyan-400 font-black uppercase tracking-tighter">AWS_DYNAMODB: SYNCING</span>
        </div>
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-cyan-400/20 px-3 py-1 rounded-md">
          <Cpu className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-[10px] font-mono text-cyan-400 font-black uppercase tracking-tighter">GSI_INDEX: CLOTHING_META</span>
        </div>
      </div>

      {/* Núcleo do Radar */}
      <div className="relative z-30 flex flex-col items-center">
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            boxShadow: ["0 0 10px #22D3EE", "0 0 30px #22D3EE", "0 0 10px #22D3EE"]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="h-4 w-4 bg-cyan-400 rounded-full border-2 border-white"
        />
        <div className="mt-4 bg-cyan-400/10 border border-cyan-400/30 px-4 py-1 rounded-full backdrop-blur-sm">
          <span className="text-xs font-black text-cyan-400 font-mono animate-pulse uppercase tracking-[0.2em]">
            Cruzando_Dados_Biometricos...
          </span>
        </div>
      </div>
    </div>
  );
}
