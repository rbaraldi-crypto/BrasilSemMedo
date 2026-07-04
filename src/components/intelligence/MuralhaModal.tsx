import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Camera, MapPin, ShieldCheck, 
  Scan, Database, Zap, Activity, AlertTriangle, 
  Filter, Shirt, Briefcase, Search,
  XCircle, CheckCircle2, Loader2, Cpu,
  Fingerprint, Eye, Move, Cloud, Smartphone, Radio,
  History, TrendingUp, Crosshair, MousePointer2
} from 'lucide-react';
import { useIntelligence } from '@/contexts/IntelligenceContext';
import { intelligenceService } from '@/services/intelligenceService';
import { cn } from '@/lib/utils';
import { tacticalAudio } from '@/lib/audioUtils';
import { WatermarkOverlay } from '@/components/ui/WatermarkOverlay';
import { useShake } from '@/hooks/useShake';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarWaves } from './RadarWaves';
import { AnatomiaDigital } from './AnatomiaDigital';
import { TelemetryOverlay } from './TelemetryOverlay';
import { TacticalVideoFeed } from './TacticalVideoFeed';

interface GhostTarget {
  id: string;
  top: number;
  left: number;
  confidence: number;
  status: 'TRACKING' | 'DISCARDED' | 'LOCKED';
  label: string;
}

interface ValidationPoint {
  id: number;
  x: number;
  y: number;
  label: string;
}

export function MuralhaModal({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const { activeModal, closeModal, setActiveModal, addLogEntry, muralhaScanTrigger, setTargetTrajectory } = useIntelligence();
  const [scanPhase, setScanPhase] = useState<'IDLE' | 'FILTERING' | 'RADAR' | 'MULTI_SCAN' | 'MATCH'>('IDLE');
  const [scanResult, setScanResult] = useState<any>(null);
  const [ghosts, setGhosts] = useState<GhostTarget[]>([]);
  const [processedCams, setProcessedCount] = useState(0);
  const [rfFrequency, setRfFrequency] = useState("2.400 GHz");
  const { triggerShake, shakeClass } = useShake();
  
  const [isValidating, setIsValidating] = useState(false);
  const [validationPoints, setValidationPoints] = useState<ValidationPoint[]>([]);
  const [isEvidenceValidated, setIsEvidenceValidated] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    clothing: 'Qualquer',
    accessory: 'Nenhum'
  });

  const isOpen = (activeModal === 'MURALHA');

  const generateGhosts = () => {
    const labels = ["CIVIL_NON_TARGET", "BYSTANDER", "UNKNOWN_ID", "LOW_CONFIDENCE"];
    return Array.from({ length: 8 }).map((_, i) => ({
      id: `ghost-${i}`,
      top: Math.random() * 60 + 10,
      left: Math.random() * 70 + 10,
      confidence: Math.floor(Math.random() * 45) + 5,
      status: 'TRACKING' as const,
      label: labels[Math.floor(Math.random() * labels.length)]
    }));
  };

  const runTacticalScan = useCallback(async () => {
    setScanResult(null);
    setValidationPoints([]);
    setIsEvidenceValidated(false);
    setIsValidating(false);
    setScanPhase('RADAR');
    setProcessedCount(0);
    tacticalAudio.playScan();
    
    const camInterval = setInterval(() => {
      setProcessedCount(prev => Math.min(prev + 18452, 1000000));
      setRfFrequency(`${(Math.random() * (2.5 - 2.4) + 2.4).toFixed(3)} GHz`);
    }, 30);

    await new Promise(resolve => setTimeout(resolve, 2500));
    clearInterval(camInterval);
    setProcessedCount(1000000);
    
    setScanPhase('MULTI_SCAN');
    const initialGhosts = generateGhosts();
    setGhosts(initialGhosts);

    for (let i = 0; i < initialGhosts.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setGhosts(prev => prev.map((g, idx) => 
        idx === i ? { ...g, status: 'DISCARDED' as const } : g
      ));
      tacticalAudio.playScan();
    }

    await new Promise(resolve => setTimeout(resolve, 400));
    
    const result = await intelligenceService.searchMuralha(filters);
    
    tacticalAudio.playMatch();
    triggerShake(600); 
    setScanResult(result);
    
    if (result.trajectory) {
      setTargetTrajectory(result.trajectory);
    }
    
    setScanPhase('MATCH');
  }, [addLogEntry, triggerShake, filters, setTargetTrajectory]);

  const handleImageClick = (e: React.MouseEvent) => {
    if (!isValidating || isEvidenceValidated || validationPoints.length >= 4) return;

    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const labels = ["Olho Esquerdo", "Olho Direito", "Nariz", "Boca"];
    const newPoint = {
      id: Date.now(),
      x,
      y,
      label: labels[validationPoints.length]
    };

    tacticalAudio.playScan();
    setValidationPoints(prev => [...prev, newPoint]);

    if (validationPoints.length === 3) {
      setTimeout(() => {
        setIsEvidenceValidated(true);
        setIsValidating(false);
        tacticalAudio.playSuccess();
        addLogEntry('MURALHA', scanResult.name, `Evidência Validada pelo Operador (HITL) | Match: ${scanResult.match}`);
      }, 500);
    }
  };

  useEffect(() => {
    if ((isOpen || isEmbedded) && scanPhase === 'IDLE') {
      setScanPhase('FILTERING');
    }
  }, [isOpen, isEmbedded, scanPhase]);

  useEffect(() => {
    if (muralhaScanTrigger > 0) setScanPhase('FILTERING');
  }, [muralhaScanTrigger]);

  const MainContent = (
    <div className={cn(
      "flex flex-col items-center bg-slate-950 relative z-10 w-full h-full", 
      isEmbedded ? "p-2" : "p-8"
    )}>
      <div className={cn(
        "w-full aspect-video bg-black rounded-xl border border-white/10 overflow-hidden relative shadow-2xl",
        isEmbedded ? "max-w-full" : "max-w-4xl",
        shakeClass
      )}>
        <AnimatePresence mode="wait">
          {scanPhase === 'FILTERING' && (
            <motion.div key="filter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
              <div className="max-w-md w-full space-y-6">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/40">
                    <Filter className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter">Parâmetros de Busca (P9)</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Consulta GSI: 1.000.000+ Dispositivos</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   <FilterOption 
                     icon={<Shirt className="h-4 w-4" />} 
                     label="Vestimenta" 
                     options={['Qualquer', 'Jaqueta Preta', 'Camisa Branca', 'Uniforme']} 
                     value={filters.clothing}
                     onChange={(v: string) => setFilters(f => ({...f, clothing: v}))}
                   />
                   <FilterOption 
                     icon={<Briefcase className="h-4 w-4" />} 
                     label="Acessório" 
                     options={['Nenhum', 'Mochila', 'Maleta', 'Boné']} 
                     value={filters.accessory}
                     onChange={(v: string) => setFilters(f => ({...f, accessory: v}))}
                   />
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 font-black uppercase text-[11px] tracking-[0.2em] h-12 shadow-lg shadow-primary/20" onClick={runTacticalScan}>
                  <Search className="h-4 w-4 mr-2" /> Iniciar Varredura AWS_GSI
                </Button>
              </div>
            </motion.div>
          )}

          {scanPhase === 'RADAR' && (
            <motion.div key="radar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40">
              <RadarWaves />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center space-y-2 z-50">
                 <div className="flex items-center gap-3 bg-black/60 px-6 py-2 rounded-full border border-cyan-400/30 backdrop-blur-xl">
                    <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
                    <span className="text-xl font-mono text-cyan-400 font-black tabular-nums">
                      {processedCams.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Câmeras Processadas</span>
                 </div>
              </div>
            </motion.div>
          )}

          {(scanPhase === 'MULTI_SCAN' || scanPhase === 'MATCH') && (
            <TacticalVideoFeed isLocking={scanPhase === 'MULTI_SCAN'}>
              <TelemetryOverlay />
              
              {scanPhase === 'MULTI_SCAN' && (
                <motion.div key="multi-scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 bg-slate-900/40">
                  {ghosts.map((ghost) => (
                    <motion.div key={ghost.id} className={cn("absolute border-2 transition-all duration-300", ghost.status === 'DISCARDED' ? "border-red-500/20" : "border-primary/60")} style={{ top: `${ghost.top}%`, left: `${ghost.left}%`, width: '70px', height: '70px' }}>
                        <div className={cn("absolute -top-5 left-0 px-1.5 py-0.5 text-[7px] font-black uppercase whitespace-nowrap", ghost.status === 'DISCARDED' ? "bg-red-500/10 text-red-400/40" : "bg-primary/20 text-primary")}>
                          {ghost.status === 'DISCARDED' ? "REJEITADO" : `${ghost.label}`}
                        </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {scanPhase === 'MATCH' && scanResult && (
                <motion.div key="match" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 bg-slate-900">
                  <div 
                    ref={imageRef}
                    className={cn("relative w-full h-full", isValidating ? "cursor-crosshair" : "cursor-default")}
                    onClick={handleImageClick}
                  >
                    <img src="https://i.pravatar.cc/800?u=target-sip-882" className={cn("w-full h-full object-cover transition-all duration-700", isEvidenceValidated ? "opacity-60 grayscale-0" : "opacity-40 grayscale")} alt="Target" />
                    
                    {!isValidating && !isEvidenceValidated && <AnatomiaDigital />}

                    {/* Pontos de Validação Humana */}
                    {validationPoints.map(point => (
                      <motion.div 
                        key={point.id}
                        initial={{ scale: 2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-[60]"
                        style={{ top: `${point.y}%`, left: `${point.x}%` }}
                      >
                        <div className="h-6 w-6 border-2 border-cyan-400 rounded-full flex items-center justify-center bg-cyan-400/20 shadow-[0_0_10px_#22D3EE]">
                          <Crosshair className="h-3 w-3 text-cyan-400" />
                        </div>
                        <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-[7px] font-black px-1 rounded whitespace-nowrap uppercase">
                          {point.label}
                        </span>
                      </motion.div>
                    ))}

                    {/* Overlay de Instrução HITL */}
                    <AnimatePresence>
                      {isValidating && (
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 20, opacity: 0 }}
                          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-black/80 border border-cyan-400/50 px-6 py-3 rounded-xl backdrop-blur-md flex items-center gap-4"
                        >
                          <div className="h-10 w-10 bg-cyan-400/20 rounded-full flex items-center justify-center border border-cyan-400/40">
                            <MousePointer2 className="h-5 w-5 text-cyan-400 animate-bounce" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Protocolo de Revisão Humana</p>
                            <p className="text-[9px] text-white font-medium">Marque o ponto: <span className="text-cyan-400 font-black underline">
                              {validationPoints.length === 0 ? "Olho Esquerdo" : 
                               validationPoints.length === 1 ? "Olho Direito" : 
                               validationPoints.length === 2 ? "Nariz" : "Boca"}
                            </span></p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Status de Validação */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center pointer-events-none">
                       {!isValidating && !isEvidenceValidated && (
                         <motion.div initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-600 text-white px-10 py-4 font-black text-3xl italic tracking-tighter shadow-[0_0_50px_rgba(220,38,38,0.9)] border-2 border-white/30">
                           MATCH CONFIRMADO
                         </motion.div>
                       )}
                       
                       {isEvidenceValidated && (
                         <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-success text-white px-10 py-4 font-black text-2xl tracking-tighter shadow-[0_0_50px_rgba(34,197,94,0.6)] border-2 border-white/30 flex items-center gap-3">
                           <ShieldCheck className="h-8 w-8" /> EVIDÊNCIA VALIDADA
                         </motion.div>
                       )}
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 flex flex-col gap-2 z-50">
                     <MultimodalScore label="FACE" score={scanResult.multimodal.face} icon={<Scan className="h-3 w-3" />} />
                     <MultimodalScore label="GAIT" score={scanResult.multimodal.gait} icon={<Move className="h-3 w-3" />} />
                     <MultimodalScore label="IRIS" score={scanResult.multimodal.iris} icon={<Eye className="h-3 w-3" />} />
                  </div>

                  <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-50">
                     <Badge variant="outline" className="bg-slate-950/90 border-cyan-400/30 text-cyan-400 font-mono text-[9px] font-black px-3 py-1.5 flex items-center gap-2">
                       <Cloud className="h-3 w-3 animate-pulse" /> ORIGEM: {scanResult.origin}
                     </Badge>
                  </div>
                </motion.div>
              )}
            </TacticalVideoFeed>
          )}
        </AnimatePresence>
      </div>

      {scanPhase === 'MATCH' && scanResult && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={cn("w-full mt-6 grid grid-cols-1 gap-4", isEmbedded ? "max-w-full" : "max-w-4xl md:grid-cols-3")}>
          <div className={cn("bg-slate-900 border border-white/10 rounded-xl p-5 space-y-2 shadow-2xl", !isEmbedded && "md:col-span-2")}>
            <div className="flex justify-between items-start">
               <h4 className="text-xl font-bold text-white tracking-tight">{scanResult.name}</h4>
               <span className="text-[10px] font-mono text-slate-500">ID: {scanResult.id}</span>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-slate-300 flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500" /> {scanResult.location}</p>
              <Badge className="bg-red-600 text-[9px] font-black uppercase">NÍVEL: {scanResult.threatLevel}</Badge>
            </div>
            {!isEvidenceValidated && (
              <div className="pt-2 mt-2 border-t border-white/5 flex items-center gap-2 text-amber-500">
                <AlertTriangle className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase">Aguardando Revisão Humana Obrigatória (LGPD)</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {!isEvidenceValidated ? (
              <Button 
                className={cn(
                  "w-full h-full font-black uppercase text-[11px] tracking-widest shadow-xl transition-all duration-300",
                  isValidating ? "bg-cyan-600 text-white animate-pulse" : "bg-slate-800 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/10"
                )}
                onClick={() => setIsValidating(true)}
                disabled={isValidating}
              >
                <Fingerprint className="h-5 w-5 mr-2" /> 
                {isValidating ? "Validando Pontos..." : "Validar Evidência"}
              </Button>
            ) : (
              <Button 
                className="w-full h-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-red-900/20" 
                onClick={() => setActiveModal('DISPATCH')}
              >
                <Zap className="h-5 w-5 mr-2" /> Acionar Equipe de Campo
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );

  if (isEmbedded) return <div className="h-full w-full overflow-hidden bg-slate-950">{MainContent}</div>;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-5xl bg-slate-950 border-white/10 p-0 overflow-hidden shadow-2xl">
        <WatermarkOverlay />
        <DialogHeader className="p-6 border-b border-white/10 bg-slate-900/50 flex flex-row items-center justify-between space-y-0 relative z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={closeModal}><ArrowLeft className="h-5 w-5" /></Button>
            <div className="text-left">
              <DialogTitle className="text-xl font-bold text-white uppercase tracking-tight">Muralha Paulista</DialogTitle>
              <DialogDescription className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocolo HITL: Double-Check de Evidência Ativo</DialogDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-cyan-400/30 text-cyan-400 font-mono text-[10px] font-bold px-3 py-1">LGPD_COMPLIANCE: ENABLED</Badge>
        </DialogHeader>
        {MainContent}
      </DialogContent>
    </Dialog>
  );
}

function FilterOption({ icon, label, options, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all",
              value === opt 
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultimodalScore({ label, score, icon }: { label: string, score: number, icon: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-lg flex flex-col gap-1 min-w-[80px]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="text-cyan-400">{icon}</div>
      </div>
      <div className="text-xs font-mono font-black text-white">{score}%</div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="h-full bg-cyan-500"
        />
      </div>
    </motion.div>
  );
}
