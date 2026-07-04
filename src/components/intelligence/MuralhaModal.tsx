import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, MapPin, Scan, Shirt, 
  Zap, Radio, AlertCircle
} from 'lucide-react';
import { useIntelligence } from '@/contexts/IntelligenceContext';
import { intelligenceService } from '@/services/intelligenceService';
import { cn } from '@/lib/utils';
import { tacticalAudio } from '@/lib/audioUtils';
import { WatermarkOverlay } from '@/components/ui/WatermarkOverlay';
import { useShake } from '@/hooks/useShake';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarWaves } from './RadarWaves';
import { TelemetryOverlay } from './TelemetryOverlay';
import { TacticalVideoFeed } from './TacticalVideoFeed';

export function MuralhaModal({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const { 
    activeModal, closeModal, setActiveModal, 
    muralhaScanTrigger, setTargetTrajectory, addLogEntry 
  } = useIntelligence();
  
  const [scanPhase, setScanPhase] = useState<'IDLE' | 'FILTERING' | 'RADAR' | 'MATCH'>('IDLE');
  const [scanResult, setScanResult] = useState<any>(null);
  const { triggerShake, shakeClass } = useShake();
  const [filters, setFilters] = useState({ clothing: 'Qualquer', accessory: 'Nenhum' });
  const [wsStatus, setWsStatus] = useState<'CONNECTING' | 'CONNECTED'>('CONNECTING');

  // Medida 1: Reagir ao gatilho manual do Dashboard
  useEffect(() => {
    if (muralhaScanTrigger > 0) {
      handleManualPriorityScan();
    }
  }, [muralhaScanTrigger]);

  const handleManualPriorityScan = async () => {
    setScanPhase('RADAR');
    setWsStatus('CONNECTING');
    tacticalAudio.playScan();
    
    // Simula Handshake de WebSocket
    setTimeout(() => setWsStatus('CONNECTED'), 1000);

    const result = await intelligenceService.searchMuralha(filters, true);
    
    setTimeout(() => {
      tacticalAudio.playMatch();
      triggerShake(800);
      setScanResult(result);
      if (result.trajectory) setTargetTrajectory(result.trajectory);
      setScanPhase('MATCH');
      
      addLogEntry('NARCO_ALERT', result.name, 'DETECÇÃO PRIORITÁRIA P1 - MURALHA PAULISTA');
    }, 2500);
  };

  const runTacticalScan = useCallback(async () => {
    setScanPhase('RADAR');
    setWsStatus('CONNECTING');
    tacticalAudio.playScan();
    
    setTimeout(() => setWsStatus('CONNECTED'), 1000);
    
    const result = await intelligenceService.searchMuralha(filters);
    
    setTimeout(() => {
      tacticalAudio.playMatch();
      triggerShake(600); 
      setScanResult(result);
      if (result.trajectory) setTargetTrajectory(result.trajectory);
      setScanPhase('MATCH');
    }, 2500);
  }, [filters, triggerShake, setTargetTrajectory]);

  useEffect(() => {
    if ((activeModal === 'MURALHA' || isEmbedded) && scanPhase === 'IDLE' && muralhaScanTrigger === 0) {
      setScanPhase('FILTERING');
    }
  }, [activeModal, isEmbedded, scanPhase, muralhaScanTrigger]);

  const MainContent = (
    <div className={cn("flex flex-col items-center bg-slate-950 relative z-10 w-full h-full", isEmbedded ? "p-2" : "p-8")}>
      <div className={cn("w-full aspect-video bg-black rounded-xl border border-white/10 overflow-hidden relative shadow-2xl", isEmbedded ? "max-w-full" : "max-w-4xl", shakeClass)}>
        <AnimatePresence mode="wait">
          {scanPhase === 'FILTERING' && (
            <motion.div key="filter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
              <div className="max-w-md w-full space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter">Parâmetros de Busca (P9)</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">AWS DynamoDB GSI Search</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                   <FilterOption icon={<Shirt className="h-4 w-4" />} label="Vestimenta" options={['Qualquer', 'Jaqueta Preta', 'Camisa Branca']} value={filters.clothing} onChange={(v: string) => setFilters(f => ({...f, clothing: v}))} />
                </div>
                <Button className="w-full bg-primary font-black uppercase text-[11px] h-12" onClick={runTacticalScan}>
                  Iniciar Varredura AWS_GSI
                </Button>
              </div>
            </motion.div>
          )}

          {scanPhase === 'RADAR' && (
            <motion.div key="radar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-40">
              <RadarWaves />
              <div className="absolute top-6 right-6">
                <Badge variant="outline" className={cn("bg-black/60 border-cyan-400/30 text-cyan-400 font-mono text-[9px] px-3 py-1.5 flex items-center gap-2", wsStatus === 'CONNECTED' ? "border-success text-success" : "animate-pulse")}>
                  <Radio className="h-3 w-3" /> STREAM_WS: {wsStatus}
                </Badge>
              </div>
            </motion.div>
          )}

          {scanPhase === 'MATCH' && scanResult && (
            <TacticalVideoFeed>
              <TelemetryOverlay />
              <div className="absolute inset-0 bg-slate-900">
                <img src="https://i.pravatar.cc/800?u=target-sip-882" className="w-full h-full object-cover opacity-40 grayscale" alt="Target" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center">
                   <motion.div 
                     initial={{ scale: 2, opacity: 0 }} 
                     animate={{ scale: 1, opacity: 1 }} 
                     className="bg-red-600 text-white px-10 py-4 font-black text-3xl italic tracking-tighter shadow-[0_0_50px_rgba(220,38,38,0.9)]"
                   >
                     MATCH P1 CONFIRMADO
                   </motion.div>
                   <div className="mt-4 bg-black/80 px-4 py-2 rounded-lg border border-red-500 animate-pulse">
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Liderança Narcoterrorista Detectada</p>
                   </div>
                </div>
              </div>
            </TacticalVideoFeed>
          )}
        </AnimatePresence>
      </div>

      {scanPhase === 'MATCH' && scanResult && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full mt-6 max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-white/10 rounded-xl p-5 md:col-span-2 flex justify-between items-center">
            <div>
              <h4 className="text-xl font-bold text-white tracking-tight">{scanResult.name}</h4>
              <p className="text-xs text-slate-300 flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500" /> {scanResult.location}</p>
            </div>
            <div className="text-right">
               <Badge className="bg-red-600 font-black text-[10px]">{scanResult.classification}</Badge>
               <p className="text-[8px] text-slate-500 mt-1 font-mono">AWS_TRACE: {scanResult.aws_metadata.region}</p>
            </div>
          </div>
          <Button className="w-full h-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[11px] tracking-widest" onClick={() => setActiveModal('DISPATCH')}>
            <Zap className="h-5 w-5 mr-2" /> Acionar Equipe
          </Button>
        </motion.div>
      )}
    </div>
  );

  if (isEmbedded) return <div className="h-full w-full overflow-hidden bg-slate-950">{MainContent}</div>;

  return (
    <Dialog open={activeModal === 'MURALHA'} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-5xl bg-slate-950 border-white/10 p-0 overflow-hidden shadow-2xl">
        <WatermarkOverlay />
        <DialogHeader className="p-6 border-b border-white/10 bg-slate-900/50 flex flex-row items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400" onClick={closeModal}><ArrowLeft className="h-5 w-5" /></Button>
            <div className="text-left">
              <DialogTitle className="text-xl font-bold text-white uppercase tracking-tight">Muralha Paulista (P9)</DialogTitle>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Sincronização AWS DynamoDB GSI</p>
            </div>
          </div>
          <Badge variant="outline" className="border-cyan-400 text-cyan-400 font-mono text-[10px]">WEBSOCKET_LIVE: ACTIVE</Badge>
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
          <button key={opt} onClick={() => onChange(opt)} className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all", value === opt ? "bg-primary border-primary text-white" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10")}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
