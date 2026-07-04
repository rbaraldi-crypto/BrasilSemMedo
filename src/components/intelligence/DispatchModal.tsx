import { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Siren, Crosshair, Zap, FileDown, 
  AlertTriangle, Activity, Navigation, Loader2, WifiOff,
  Cctv, Layers, History, TrendingUp, MessageSquare
} from 'lucide-react';
import { useIntelligence } from '@/contexts/IntelligenceContext';
import { cn } from '@/lib/utils';
import { tacticalAudio } from '@/lib/audioUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { reportService } from '@/services/reportService';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer, GridAlgorithm } from '@googlemaps/markerclusterer';
import { WatermarkOverlay } from '@/components/ui/WatermarkOverlay';
import { FieldChat } from './FieldChat';
import { fieldCommunicationService } from '@/services/fieldCommunicationService';
import { FieldMessage } from '@/types/intelligence';

const TARGET_COORDS = { lat: -23.4306, lng: -46.4730 };

const generateMockCameras = () => {
  return Array.from({ length: 150 }).map((_, i) => ({
    id: `cam-${i}`,
    lat: TARGET_COORDS.lat + (Math.random() - 0.5) * 0.05,
    lng: TARGET_COORDS.lng + (Math.random() - 0.5) * 0.05,
    type: 'Camera'
  }));
};

export function DispatchModal() {
  const { activeModal, setActiveModal, addLogEntry, isOnline, fieldUnits, targetTrajectory } = useIntelligence();
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSuccess] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useStaticFallback, setUseStaticFallback] = useState(false);
  const [showCameras, setShowCameras] = useState(true);
  
  // Field Communication State
  const [fieldMessages, setFieldMessages] = useState<FieldMessage[]>([]);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const trajectoryRef = useRef<google.maps.Polyline | null>(null);
  const trendVectorRef = useRef<google.maps.Polyline | null>(null);
  const unitMarkersRef = useRef<Record<string, google.maps.Marker>>({});

  const isOpen = (activeModal === 'DISPATCH');
  const mockCameras = useMemo(() => generateMockCameras(), []);

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

  useEffect(() => {
    if (googleMapRef.current && fieldUnits.length > 0) {
      fieldUnits.forEach(unit => {
        const marker = unitMarkersRef.current[unit.id];
        if (marker) {
          marker.setPosition({ lat: unit.lat, lng: unit.lng });
          if (selectedUnit?.id === unit.id && polylineRef.current) {
            polylineRef.current.setPath([{ lat: unit.lat, lng: unit.lng }, TARGET_COORDS]);
          }
        }
      });
    }
  }, [fieldUnits, selectedUnit]);

  useEffect(() => {
    if (isOpen && mapRef.current && !googleMapRef.current && !useStaticFallback && isOnline) {
      const loader = new Loader({ 
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '', 
        version: "weekly" 
      });

      loader.load().then(() => {
        const map = new google.maps.Map(mapRef.current!, {
          center: TARGET_COORDS,
          zoom: 14,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
          ],
          disableDefaultUI: true,
        });

        googleMapRef.current = map;

        new google.maps.Marker({ 
          position: TARGET_COORDS, 
          map, 
          zIndex: 100,
          icon: { 
            path: google.maps.SymbolPath.CIRCLE, 
            fillColor: "#ef4444", 
            fillOpacity: 1, 
            strokeColor: "#ffffff", 
            strokeWeight: 2, 
            scale: 12 
          } 
        });

        if (targetTrajectory && targetTrajectory.length > 0) {
           const pathCoords = targetTrajectory.map(t => ({ lat: t.lat, lng: t.lng }));
           trajectoryRef.current = new google.maps.Polyline({
             path: pathCoords,
             geodesic: true,
             strokeColor: "#328CC1",
             strokeOpacity: 0.5,
             strokeWeight: 2,
             strokeDasharray: "4,4",
             map: map
           });

           targetTrajectory.forEach((loc, i) => {
             if (i < targetTrajectory.length - 1) {
               new google.maps.Marker({
                 position: { lat: loc.lat, lng: loc.lng },
                 map,
                 icon: {
                   path: google.maps.SymbolPath.CIRCLE,
                   fillColor: "#328CC1",
                   fillOpacity: 0.6,
                   strokeWeight: 0,
                   scale: 4
                 }
               });
             }
           });

           const last = pathCoords[pathCoords.length - 1];
           const prev = pathCoords[pathCoords.length - 2];
           const trendLat = last.lat + (last.lat - prev.lat);
           const trendLng = last.lng + (last.lng - prev.lng);

           trendVectorRef.current = new google.maps.Polyline({
             path: [last, { lat: trendLat, lng: trendLng }],
             geodesic: true,
             strokeColor: "#22D3EE",
             strokeOpacity: 0.8,
             strokeWeight: 3,
             icons: [{
               icon: { path: google.maps.SymbolPath.FORWARD_OPEN_ARROW, scale: 3, strokeColor: "#22D3EE" },
               offset: '100%'
             }],
             map: map
           });
        }

        const markers: google.maps.Marker[] = [];
        mockCameras.forEach(cam => {
          const marker = new google.maps.Marker({
            position: { lat: cam.lat, lng: cam.lng },
            icon: {
              path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
              fillColor: "#328CC1",
              fillOpacity: 0.4,
              strokeWeight: 0,
              scale: 0.5
            }
          });
          markers.push(marker);
        });

        clustererRef.current = new MarkerClusterer({
          map,
          markers,
          algorithm: new GridAlgorithm({}),
          renderer: {
            render: ({ count, position }) => {
              return new google.maps.Marker({
                position,
                label: { text: String(count), color: "white", fontSize: "10px", fontWeight: "bold" },
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: "#0B3C5D",
                  fillOpacity: 0.9,
                  strokeColor: "#328CC1",
                  strokeWeight: 2,
                  scale: 15 + Math.min(count / 10, 10),
                },
                zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
              });
            }
          }
        });

        fieldUnits.forEach(unit => {
          const marker = new google.maps.Marker({ 
            position: { lat: unit.lat, lng: unit.lng }, 
            map, 
            zIndex: 50,
            title: unit.callsign,
            icon: { 
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, 
              fillColor: unit.status === 'patrolling' ? "#22c55e" : "#ef4444", 
              fillOpacity: 1, 
              strokeColor: "#ffffff", 
              strokeWeight: 1, 
              scale: 7 
            } 
          });
          marker.addListener('click', () => handleSelectUnit(unit));
          unitMarkersRef.current[unit.id] = marker;
        });

        setMapLoaded(true);
      }).catch(() => setUseStaticFallback(true));
    }
  }, [isOpen, useStaticFallback, isOnline, fieldUnits, mockCameras, targetTrajectory]);

  const handleSelectUnit = (unit: any) => {
    if (unit.status === 'busy') {
      tacticalAudio.playScan();
      toast.error("Unidade ocupada em outra ocorrência.");
      return;
    }
    tacticalAudio.playScan();
    setSelectedUnit(unit);
    
    if (googleMapRef.current && !useStaticFallback) {
      if (polylineRef.current) polylineRef.current.setMap(null);
      
      polylineRef.current = new google.maps.Polyline({
        path: [{ lat: unit.lat, lng: unit.lng }, TARGET_COORDS],
        geodesic: true,
        strokeColor: "#328CC1",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        icons: [{ 
          icon: { path: google.maps.SymbolPath.CIRCLE, scale: 4, fillColor: "#328CC1", fillOpacity: 1 }, 
          offset: "0%" 
        }],
        map: googleMapRef.current
      });

      let count = 0;
      const interval = setInterval(() => {
        count = (count + 1) % 200;
        const icons = polylineRef.current?.get('icons');
        if (icons && icons[0]) {
          icons[0].offset = (count / 2) + '%';
          polylineRef.current?.set('icons', icons);
        }
      }, 20);
    }
  };

  const toggleCameras = () => {
    setShowCameras(!showCameras);
    if (clustererRef.current) {
      if (showCameras) {
        clustererRef.current.setMap(null);
      } else {
        clustererRef.current.setMap(googleMapRef.current);
      }
    }
  };

  const handleDispatch = async () => {
    if (!selectedUnit) return;
    setIsSending(true);
    setFieldMessages([]); // Reseta chat
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

    // Inicia simulação de rádio de campo (I3)
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
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => setActiveModal('MURALHA')}><ArrowLeft className="h-5 w-5" /></Button>
            <div className="text-left">
              <DialogTitle className="text-lg font-bold text-white uppercase tracking-tighter flex items-center gap-2">
                <Crosshair className={cn("h-5 w-5", useStaticFallback ? "text-amber-500" : "text-red-500")} />
                {useStaticFallback ? "Modo de Contingência Âmbar" : "Sincronização GPS Real-time (I4)"}
              </DialogTitle>
              <DialogDescription className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Monitoramento de Frota Legado: AVL/GPRS</DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button 
               variant="outline" 
               size="sm" 
               className={cn("h-8 text-[9px] font-black uppercase tracking-widest gap-2", showCameras ? "bg-primary/20 border-primary" : "border-white/10")}
               onClick={toggleCameras}
             >
               <Cctv className="h-3 w-3" /> {showCameras ? "Ocultar Câmeras" : "Mostrar Câmeras"}
             </Button>
             <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full border", useStaticFallback ? "bg-amber-500/10 border-amber-500/20" : "bg-primary/10 border-primary/20")}>
                {useStaticFallback ? <WifiOff className="h-3 w-3 text-amber-500" /> : <Activity className="h-3 w-3 text-primary animate-pulse" />}
                <span className={cn("text-[9px] font-black uppercase tracking-widest", useStaticFallback ? "text-amber-500" : "text-primary")}>
                  {useStaticFallback ? "OFFLINE" : "LINK SATELITAL: ATIVO"}
                </span>
             </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
          <div className="flex-1 relative bg-slate-900 border-r border-white/5 overflow-hidden">
             {useStaticFallback ? (
               <div className="relative w-full h-full bg-slate-950">
                  <img src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-30 grayscale" alt="Satellite Fallback" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                     <div className="h-6 w-6 bg-amber-600 rounded-full border-2 border-white animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.8)]" />
                     <Badge className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-amber-600 text-[8px] whitespace-nowrap uppercase font-black">Alvo Detectado</Badge>
                  </div>
                  {fieldUnits.map(unit => (
                    <div key={unit.id} className="absolute cursor-pointer transition-all duration-1000" style={{ top: `${((unit.lat + 23.5) * 1000) % 100}%`, left: `${((unit.lng + 46.5) * 1000) % 100}%` }} onClick={() => handleSelectUnit(unit)}>
                       <div className={cn("h-4 w-4 rounded-full border border-white shadow-lg", unit.status === 'patrolling' ? "bg-green-500" : "bg-red-600")} />
                    </div>
                  ))}
               </div>
             ) : (
               <div ref={mapRef} className="w-full h-full" />
             )}

             <div className="absolute bottom-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-cyan-400/30 rounded-xl z-50">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                   <TrendingUp className="h-4 w-4 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Análise Preditiva</span>
                </div>
                <p className="text-[9px] text-slate-300 font-bold uppercase">Tendência: Deslocamento Norte-Oeste</p>
                <p className="text-[8px] text-slate-500 mt-1">Baseado em 3 avistamentos (Muralha P9)</p>
             </div>
          </div>

          <div className="w-full md:w-80 bg-slate-900/80 backdrop-blur-xl p-6 flex flex-col gap-6">
             <div className="flex-1 overflow-hidden flex flex-col gap-4">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2"><Navigation className="h-3 w-3" /> Unidade Selecionada</span>
                
                {selectedUnit ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 border border-primary/30 rounded-xl space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center"><Siren className="h-7 w-7 text-primary" /></div>
                          <div>
                            <p className="text-sm font-bold text-white uppercase tracking-tighter">{selectedUnit.callsign || 'N/A'}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{selectedUnit.type || 'Viatura'}</p>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[8px] text-slate-500 uppercase font-black">Coordenadas Atuais</p>
                          <p className="text-[10px] font-mono text-white">
                            {selectedUnit.lat?.toFixed(6) || '0.000000'}, {selectedUnit.lng?.toFixed(6) || '0.000000'}
                          </p>
                       </div>
                       {!isSent && (
                         <Button className="w-full font-black uppercase text-[10px] tracking-widest h-12 bg-red-600 hover:bg-red-700" disabled={isSending} onClick={handleDispatch}>
                            {isSending ? 'TRANSMITINDO...' : 'DESPACHAR AGORA'}
                         </Button>
                       )}
                    </div>

                    {/* Terminal de Rádio Digital (I3) */}
                    <AnimatePresence>
                      {isSent && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="h-[300px]"
                        >
                          <FieldChat messages={fieldMessages} unitCallsign={selectedUnit.callsign} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isSent && (
                       <Button 
                         variant="outline" 
                         className="w-full border-primary/30 text-primary hover:bg-primary/10 font-bold uppercase text-[9px] h-10" 
                         onClick={() => reportService.generateCaptureDossier(targetData, selectedUnit)}
                       >
                         <FileDown className="h-3 w-3 mr-2" /> Dossiê ICP-Brasil
                       </Button>
                    )}
                  </div>
                ) : (
                  <div className="h-48 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-6 bg-black/20">
                     <p className="text-[10px] text-slate-500 font-bold uppercase">Selecione uma unidade no mapa para ver a posição real.</p>
                  </div>
                )}
             </div>

             {/* HISTÓRICO DE AVISTAMENTO (Oculto se chat estiver ativo para economizar espaço) */}
             {!isSent && (
               <div className="space-y-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><History className="h-3 w-3" /> Trajetória do Alvo</span>
                  <div className="space-y-2">
                     {targetTrajectory?.map((loc, i) => (
                       <div key={loc.id} className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                             <div className={cn("h-2 w-2 rounded-full", i === targetTrajectory.length - 1 ? "bg-red-500 animate-pulse" : "bg-primary/40")} />
                             {i < targetTrajectory.length - 1 && <div className="h-4 w-px bg-white/10" />}
                          </div>
                          <div className="flex-1">
                             <p className="text-[9px] font-bold text-white uppercase">{loc.name}</p>
                             <p className="text-[8px] text-slate-500">{loc.time}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             )}

             <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black text-slate-500 uppercase">Ativos Monitorados</span>
                   <span className="text-[9px] font-mono text-primary">150+</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black text-slate-500 uppercase">Sincronização AVL</span>
                   <span className="text-[9px] font-mono text-success">REAL-TIME</span>
                </div>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
