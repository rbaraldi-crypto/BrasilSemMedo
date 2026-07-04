import { motion } from 'framer-motion';
import { Scan, Eye, Activity, Smartphone, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BiometricMultimodalOverlayProps {
  targetName: string;
  deviceInfo?: {
    model: string;
    imei: string;
    status: string;
  };
}

/**
 * Medida 9: Multimodal Biometric Overlay
 * Simulação de Gait Analysis (Marcha) e Iris Scan.
 */
export function BiometricMultimodalOverlay({ targetName, deviceInfo }: BiometricMultimodalOverlayProps) {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
      {/* 1. Gait Analysis (Análise de Marcha) - Malha Esquelética */}
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 400">
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Linhas de Articulação Simuladas */}
          <motion.path
            d="M200 100 L200 250 M200 150 L150 200 M200 150 L250 200 M200 250 L170 350 M200 250 L230 350"
            stroke="#22D3EE"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ 
              d: [
                "M200 100 L200 250 M200 150 L140 210 M200 150 L260 190 M200 250 L160 350 M200 250 L240 340",
                "M200 100 L200 250 M200 150 L160 190 M200 150 L240 210 M200 250 L180 340 M200 250 L220 350",
                "M200 100 L200 250 M200 150 L140 210 M200 150 L260 190 M200 250 L160 350 M200 250 L240 340"
              ]
            }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
          {/* Pontos de Articulação */}
          {[
            { cx: 200, cy: 100 }, { cx: 200, cy: 150 }, { cx: 150, cy: 200 }, 
            { cx: 250, cy: 200 }, { cx: 200, cy: 250 }, { cx: 170, cy: 350 }, { cx: 230, cy: 350 }
          ].map((pt, i) => (
            <circle key={i} cx={pt.cx} cy={pt.cy} r="3" fill="#22D3EE" />
          ))}
        </motion.g>
      </svg>

      {/* 2. Iris Scan (Escaneamento de Íris) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-24 border border-cyan-400/20 rounded-full flex items-center justify-around px-8">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative"
        >
          <div className="h-8 w-8 rounded-full border-2 border-cyan-400 flex items-center justify-center">
            <div className="h-2 w-2 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[6px] font-mono text-cyan-400">IRIS_L</div>
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          className="relative"
        >
          <div className="h-8 w-8 rounded-full border-2 border-cyan-400 flex items-center justify-center">
            <div className="h-2 w-2 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[6px] font-mono text-cyan-400">IRIS_R</div>
        </motion.div>
      </div>

      {/* 3. IMEI Correlation Panel (P12 Integration) */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute top-10 right-10 w-64 space-y-3"
      >
        <div className="bg-black/60 backdrop-blur-md border border-red-500/50 p-4 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.2)]">
          <div className="flex items-center gap-2 text-red-500 mb-3">
            <Smartphone className="h-4 w-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Correlação IMEI-Face</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[8px] text-slate-400 uppercase">Dispositivo:</span>
              <span className="text-[9px] font-bold text-white">{deviceInfo?.model || "iPhone 15 Pro Max"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[8px] text-slate-400 uppercase">IMEI:</span>
              <span className="text-[9px] font-mono text-red-400">{deviceInfo?.imei || "358294/10/284756/0"}</span>
            </div>
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 bg-red-600/20 px-2 py-1 rounded">
                <ShieldAlert className="h-3 w-3 text-red-500" />
                <span className="text-[8px] font-black text-red-500 uppercase">STATUS: ROUBADO (P12)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-md border border-cyan-400/30 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Activity className="h-3.5 w-3.5" />
            <span className="text-[9px] font-black uppercase">Telemetria Biométrica</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[7px] font-mono text-slate-400">
              <span>GAIT_MATCH:</span>
              <span className="text-cyan-400">94.2%</span>
            </div>
            <div className="flex justify-between text-[7px] font-mono text-slate-400">
              <span>IRIS_VERIFIED:</span>
              <span className="text-cyan-400">TRUE</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tickers de Identificação */}
      <div className="absolute bottom-10 left-10 space-y-1">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-red-600 rounded-full animate-ping" />
          <span className="text-xl font-black text-white uppercase tracking-tighter italic">{targetName}</span>
        </div>
        <div className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.3em]">
          Target_Lock_Active // UID: SIP-8821-P1
        </div>
      </div>
    </div>
  );
}
