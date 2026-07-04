import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, Shield, MapPin, Zap, 
  Clock, TrendingUp, 
  Route, Truck, Loader2,
  Radio, ShieldCheck, ShieldAlert, Plane, Radar,
  ChevronRight, AlertTriangle, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { tacticalAudio } from '@/lib/audioUtils';
import { useIntelligence } from '@/contexts/IntelligenceContext';

/**
 * Medida 4: Otimizador de Logística Tática (P4)
 * CORREÇÃO: Barra de comando fixa no topo para garantir visibilidade do botão de cálculo.
 */
export function TacticalRoutePlanner({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const { addLogEntry } = useIntelligence();
  const [isCalculating, setIsCalculating] = useState(false);
  const [route, setRoute] = useState<any | null>(null);

  const calculateTacticalRoute = async () => {
    setIsCalculating(true);
    setRoute(null);
    tacticalAudio.playScan();
    
    // Simulação de processamento de IA Logística AWS (us-east-1)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setRoute({
      id: 'TR-8821',
      origin: 'Presídio Comum - SP',
      destination: 'TREVA-01 (Norte)',
      riskScore: 8,
      estimatedTime: '4h 15m',
      distance: '342km',
      checkpoints: [
        { name: 'CP-ALPHA (Rodoanel)', status: 'SECURE', lat: 20, lng: 30 },
        { name: 'CP-BRAVO (Fronteira)', status: 'SECURE', lat: 50, lng: 45 },
        { name: 'CP-CHARLIE (Acesso TREVA)', status: 'SECURE', lat: 80, lng: 70 }
      ],
      escortUnits: 6,
      airSupport: true,
      threatZones: [
        { id: 'tz-1', x: 40, y: 50, radius: 15, intensity: 'HIGH' }
      ]
    });
    
    addLogEntry('LOGISTICS', 'Transferência P1', 'Rota tática otimizada via Protocolo Brasil Sem Medo.');
    setIsCalculating(false);
    tacticalAudio.playSuccess();
  };

  const Header = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/80 border-b border-white/10 relative z-50 shrink-0">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
          <Truck className="h-4 w-4 text-primary" />
        </div>
        <div className="text-left">
          <h4 className="text-xs font-black text-white uppercase tracking-tighter italic">Logística Tática (P4)</h4>
          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Otimização de Escolta P1</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!route && !isCalculating && (
          <Button 
            onClick={calculateTacticalRoute}
            size="sm"
            className="bg-sky-600 hover:bg-sky-500 text-white font-black uppercase text-[9px] tracking-widest h-8 px-4 rounded-md shadow-[0_0_15px_rgba(14,165,233,0.3)] border-t border-white/10 transition-all active:scale-95 group overflow-hidden"
          >
            <Radio className="h-3 w-3 mr-2 text-white animate-pulse" />
            <span>📡 INICIAR CÁLCULO DE ROTA P1</span>
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
          </Button>
        )}
        
        {route && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[9px] font-black uppercase border-white/10 text-slate-400 hover:bg-white/5"
            onClick={() => setRoute(null)}
          >
            <RefreshCw className="h-3 w-3 mr-1.5" /> Recalcular
          </Button>
        )}

        <Badge variant="outline" className="hidden sm:flex border-sky-500/30 text-sky-400 font-mono text-[8px] h-6">
          AWS_LOGISTICS_V2
        </Badge>
      </div>
    </div>
  );

  const Content = (
    <div className="flex-1 flex flex-col w-full overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!route && !isCalculating && (
          <motion.div 
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="relative mb-6">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute inset-0 bg-primary rounded-full blur-3xl"
              />
              <Route className="h-20 w-20 text-slate-800 relative z-10 stroke-[1]" />
            </div>
            <h5 className="text-sm font-bold text-slate-600 uppercase tracking-[0.2em]">Aguardando Comando</h5>
            <p className="text-[9px] text-slate-700 mt-2 max-w-[200px] font-medium uppercase">Utilize o botão superior para iniciar a análise de trajetória AWS us-east-1</p>
          </motion.div>
        )}

        {isCalculating && (
          <motion.div 
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 space-y-6"
          >
            <div className="relative h-24 w-24">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-sky-500/30 rounded-full"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin mb-2" />
                <span className="text-[7px] font-mono text-sky-500 font-black">COMPUTING...</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-[9px] font-black text-sky-400 uppercase tracking-[0.2em] animate-pulse">Otimizando Rota de Escolta Blindada</p>
              <div className="p-2 bg-black/40 border border-white/5 rounded-lg font-mono text-[7px] text-slate-500">
                <p>REGION: us-east-1 // TACTICAL_COMPUTE_NODE_04</p>
              </div>
            </div>
          </motion.div>
        )}

        {route && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden"
          >
            {/* Mapa Tático SVG */}
            <div className="relative h-32 w-full bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-xl shrink-0">
               <svg className="w-full h-full opacity-50" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="none" stroke="rgba(14,165,233,0.05)" strokeWidth="0.5" />
                  <motion.path 
                    d="M 10 85 Q 30 75 45 55 T 85 15" 
                    fill="none" 
                    stroke="#0ea5e9" 
                    strokeWidth="2" 
                    strokeDasharray="4 2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <circle cx="10" cy="85" r="2" fill="#94a3b8" />
                  <motion.circle 
                    cx="85" cy="15" r="3" 
                    fill="#ef4444" 
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
               </svg>
               <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="bg-black/80 border-sky-500/30 text-sky-400 font-mono text-[7px] px-1.5 py-0.5 uppercase">
                    ID: {route.id}
                  </Badge>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-2 shrink-0">
              <div className="p-2 bg-slate-900 border border-white/5 rounded-lg text-center">
                <span className="text-[6px] font-black text-slate-500 uppercase block">Risco</span>
                <p className="text-sm font-black text-success">{route.riskScore}%</p>
              </div>
              <div className="p-2 bg-slate-900 border border-white/5 rounded-lg text-center">
                <span className="text-[6px] font-black text-slate-500 uppercase block">ETA</span>
                <p className="text-sm font-black text-white">{route.estimatedTime}</p>
              </div>
              <div className="p-2 bg-slate-900 border border-white/5 rounded-lg text-center">
                <span className="text-[6px] font-black text-slate-500 uppercase block">Distância</span>
                <p className="text-sm font-black text-white">{route.distance}</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 space-y-2">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" /> Checkpoints de Escolta
              </span>
              <div className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                {route.checkpoints.map((cp: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 border border-white/5 rounded-lg">
                    <div className="h-4 w-4 rounded bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                      <span className="text-[7px] font-bold text-sky-500">{idx + 1}</span>
                    </div>
                    <span className="text-[8px] font-bold text-slate-300 uppercase flex-1 truncate">{cp.name}</span>
                    <Badge className="bg-success/20 text-success text-[5px] font-black h-3 border-none px-1">SECURE</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 shrink-0">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[9px] h-9 shadow-lg">
                <ShieldCheck className="h-3 w-3 mr-1.5" /> Efetivar Plano de Transferência
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isEmbedded) return (
    <div className="h-full w-full overflow-hidden bg-slate-950 flex flex-col">
      {Header}
      {Content}
    </div>
  );

  return (
    <Card className="bg-slate-900 border-white/10 shadow-2xl overflow-hidden h-full flex flex-col">
      {Header}
      <CardContent className="p-0 flex-1 overflow-hidden">
        {Content}
      </CardContent>
    </Card>
  );
}
