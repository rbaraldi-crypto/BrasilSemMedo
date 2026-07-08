import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crosshair, Activity, Cctv, WifiOff } from 'lucide-react';
import { useSystem } from '@/contexts/SystemContext';
import { useTactical } from '@/contexts/TacticalContext';
import { useUI } from '@/contexts/UIContext';
import { cn } from '@/lib/utils';
import { tacticalAudio } from '@/lib/audioUtils';
import { WatermarkOverlay } from '@/components/ui/WatermarkOverlay';
import { fieldCommunicationService } from '@/services/fieldCommunicationService';
import { FieldMessage } from '@/types/intelligence';
import { DispatchMapContainer } from './DispatchMapContainer';
import { UnitDetailsPanel } from './UnitDetailsPanel';

export function DispatchModal() {
  const { activeModal, setActiveModal } = useUI();
  const { addLogEntry, isOnline } = useSystem();
  const { fieldUnits, targetTrajectory } = useTactical();
  
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSuccess] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useStaticFallback, setUseStaticFallback] = useState(false);
  const [showCameras, setShowCameras] = useState(true);
  const [fieldMessages, setFieldMessages] = useState<FieldMessage[]>([]);

  const isOpen = (activeModal === 'DISPATCH');

  const targetData = {
    match: "99.8%",
    location: "Aeroporto de Guarulhos - Terminal 3",
    timestamp: new Date().toLocaleString(),
    status: "ALVO IDENTIFICADO",
    id: "SIP-TARGET-882",
    name: "CARLOS EDUARDO DA SILVA"
  };

  useEffect(() => {
    if (isOpen && !mapLoaded) {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey || apiKey === "YOUR_API_KEY" || !isOnline) {
        setUseStaticFallback(true);
      }
    }
  }, [isOpen, mapLoaded, isOnline]);

  const handleSelectUnit = (unit: any) => {
    if (unit.status === 'busy') {
      tacticalAudio.playScan();
      toast.error("Unidade ocupada em outra ocorrência.");
      return;
    }
    tacticalAudio.playScan();
    setSelectedUnit(unit);
  };

  const handleDispatch = async () => {
    if (!selectedUnit) return;
    setIsSending(true);
    setFieldMessages([]);
    tacticalAudio.playScan(); 
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    tacticalAudio.playSuccess();
    setIsSending(false);
    setIsSuccess(true);
    
    const details = `Ordem enviada para ${selectedUnit.callsign} em ${targetData.location}`;
    addLogEntry('DISPATCH', 'EQUIPE DE CAMPO', details);
    
    if (!isOnline) {
      toast.info("Ordem enfileirada para envio automático (Offline).");
    } else {
      toast.success("Ordem transmitida via link satelital.");
    }

    fieldCommunicationService.simulateUnitResponse(selectedUnit, (msg) => {
      setFieldMessages(prev => [...prev, msg]);
      addLogEntry('RADIO', selectedUnit.callsign, msg.text);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setActiveModal('MURALHA')}>
      <DialogContent className={cn(
        "max-w-6xl h-[90vh] bg-slate-950 p-0 overflow-hidden shadow-2xl flex flex-col border-2 transition-colors duration-500",
        useStaticFallback ? "border-amber-500/50" : "border-white/10"
      )}>
        <WatermarkOverlay />
        
        <DialogHeader className={cn(
          "p-5 border-b flex flex-row items-center justify-between space-y-0 z-50 relative",
          useStaticFallback ? "bg-amber-950/20 border-amber-500/30" : "bg-slate-900/80 border-white/10"
        )}>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => setActiveModal('MURALHA')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-left">
              <DialogTitle className="text-lg font-bold text-white uppercase tracking-tighter flex items-center gap-2">
                <Crosshair className={cn("h-5 w-5", useStaticFallback ? "text-amber-500" : "text-red-500")} />
                {useStaticFallback ? "Modo de Contingência Âmbar" : "Sincronização GPS Real-time (I4)"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                Monitoramento de Frota Legado: AVL/GPRS
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button 
               variant="outline" 
               size="sm" 
               className={cn("h-8 text-[10px] font-black uppercase tracking-widest gap-2", showCameras ? "bg-primary/20 border-primary" : "border-white/10")}
               onClick={() => setShowCameras(!showCameras)}
             >
               <Cctv className="h-3 w-3" /> {showCameras ? "Ocultar Câmeras" : "Mostrar Câmeras"}
             </Button>
             <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full border", useStaticFallback ? "bg-amber-500/10 border-amber-500/20" : "bg-primary/10 border-primary/20")}>
                {useStaticFallback ? <WifiOff className="h-3 w-3 text-amber-500" /> : <Activity className="h-3 w-3 text-primary animate-pulse" />}
                <span className={cn("text-[10px] font-black uppercase tracking-widest", useStaticFallback ? "text-amber-500" : "text-primary")}>
                  {useStaticFallback ? "OFFLINE" : "LINK SATELITAL: ATIVO"}
                </span>
             </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
          <DispatchMapContainer 
            useStaticFallback={useStaticFallback}
            isOnline={isOnline}
            fieldUnits={fieldUnits}
            targetTrajectory={targetTrajectory}
            showCameras={showCameras}
            selectedUnit={selectedUnit}
            onSelectUnit={handleSelectUnit}
            onMapLoaded={() => setMapLoaded(true)}
          />

          <UnitDetailsPanel 
            selectedUnit={selectedUnit}
            isSent={isSent}
            isSending={isSending}
            targetData={targetData}
            fieldMessages={fieldMessages}
            targetTrajectory={targetTrajectory}
            onDispatch={handleDispatch}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
