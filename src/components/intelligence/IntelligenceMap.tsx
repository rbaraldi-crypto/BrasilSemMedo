import { useMemo, useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, UserCircle, MapPin, Scan, ShieldAlert, 
  Waves, Fence, Skull, Plus, Minus,
  ShieldCheck, Activity, Flame, Network, DollarSign,
  Building2, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntelligence } from '@/contexts/IntelligenceContext';
import { motion, useMotionValue, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import { strategicMarkers as initialMarkers } from '@/data/mockData';
import { StrategicMarker } from '@/types/intelligence';
import { HierarchyNode } from './HierarchyNode';
import { WatermarkOverlay } from '@/components/ui/WatermarkOverlay';
import { TrevaDigitalTwin } from './TrevaDigitalTwin';
import { tacticalAudio } from '@/lib/audioUtils';

/**
 * Medida 4: Megaprisões (TREVA)
 * Suporte para unidades massivas (100k+) e padrões arquitetônicos TREVA.
 */
const strategicMarkers: StrategicMarker[] = [
  ...initialMarkers,
  { 
    id: 'treva-massive-01', 
    type: 'treva', 
    name: 'MEGA-TREVA NORTE', 
    top: '20%', 
    left: '40%', 
    status: 'OPERACIONAL', 
    capacity: 120000, 
    occupancy: 98000,
    isMassive: true,
    floors: initialMarkers.find(m => m.id === 'prison-treva-1')?.floors
  }
];

function HeatmapLayer({ markers }: { markers: StrategicMarker[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    markers.forEach(m => {
      if (m.type === 'treva' || m.type === 'port' || m.type === 'muralha') {
        const x = (parseFloat(m.left) / 100) * canvas.width;
        const y = (parseFloat(m.top) / 100) * canvas.height;
        
        const radius = m.isMassive ? 120 : 60;
        const intensity = m.isMassive ? 0.7 : 0.5;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(239, 68, 68, ${intensity})`);
        gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.2)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [markers]);

  return <canvas ref={canvasRef} width={1200} height={800} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-70" />;
}

export function IntelligenceMap({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const { 
    selectedOrg, selectedNode, setSelectedNode, activeTab, 
    setActiveTab, activeModal, closeModal, setActiveModal,
  } = useIntelligence();
  
  const [visibleLayers] = useState<string[]>(['treva', 'port', 'muralha', 'border']);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [activeTrevaTwin, setActiveTrevaTwin] = useState<StrategicMarker | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapX = useMotionValue(0);
  const mapY = useMotionValue(0);
  const mapScale = useMotionValue(1);

  const filteredMarkers = useMemo(() => strategicMarkers.filter(m => visibleLayers.includes(m.type)), [visibleLayers]);

  const handleMarkerClick = (marker: StrategicMarker) => {
    if (marker.type === 'treva') {
      tacticalAudio.playScan();
      setActiveTrevaTwin(marker);
    }
  };

  const MapContent = (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col md:flex-row overflow-hidden relative">
      <div className="flex-1 relative bg-slate-950 overflow-hidden">
        <TabsContent value="territory" className="h-full m-0 p-0 relative overflow-hidden" ref={mapContainerRef}>
           <motion.div drag dragConstraints={mapContainerRef} style={{ x: mapX, y: mapY, scale: mapScale }} className="absolute inset-0 cursor-grab active:cursor-grabbing flex items-center justify-center origin-center">
            <div className="relative w-[120%] h-[120%] border border-white/10 rounded-2xl overflow-hidden bg-slate-900/40 backdrop-blur-sm">
              <img src="https://diariocarioca.com/wp-content/uploads/2025/05/174440622467f986d0729ee_1744406224_3x2_lg.webp" className="w-full h-full object-cover opacity-40 grayscale mix-blend-lighten pointer-events-none" alt="Tactical Map" />
              {showHeatmap && <HeatmapLayer markers={filteredMarkers} />}
              {filteredMarkers.map((marker) => (
                <div key={marker.id} className="absolute group" style={{ top: marker.top, left: marker.left }}>
                  <motion.div 
                    onClick={() => handleMarkerClick(marker)}
                    className={cn(
                    "rounded-full border-2 border-white/40 flex items-center justify-center shadow-2xl transition-all hover:scale-125 cursor-pointer z-10", 
                    marker.isMassive ? 'h-16 w-16 bg-red-900 border-red-500 shadow-red-500/80' : 'h-10 w-10 bg-primary shadow-primary/50',
                    marker.type === 'treva' && 'animate-pulse'
                  )}>
                    {marker.isMassive ? <Building2 className="h-8 w-8 text-white" /> : marker.type === 'port' ? <Waves className="h-4 w-4 text-white" /> : marker.type === 'treva' ? <ShieldAlert className="h-4 w-4 text-white" /> : <Scan className="h-4 w-4 text-white" />}
                  </motion.div>
                  {marker.isMassive && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded border border-red-500/50 whitespace-nowrap z-50">
                      <p className="text-[8px] font-black text-red-500 uppercase">TREVA MASSIVE: {marker.capacity?.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
           </motion.div>
        </TabsContent>
        
        {/* Medida 4: Digital Twin Overlay com AnimatePresence Corrigido */}
        <AnimatePresence>
          {activeTrevaTwin && activeTrevaTwin.floors && (
            <TrevaDigitalTwin 
              unitName={activeTrevaTwin.name}
              floors={activeTrevaTwin.floors}
              onClose={() => setActiveTrevaTwin(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </Tabs>
  );

  if (isEmbedded) return <div className="h-full">{MapContent}</div>;

  return (
    <Dialog open={activeModal === 'MAP'} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-950 border-white/10 shadow-2xl">
        <WatermarkOverlay />
        <div className="p-5 border-b border-white/10 bg-slate-900/50 relative z-10">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={closeModal}><ArrowLeft className="h-5 w-5" /></Button>
              <div className="text-left">
                <DialogTitle className="text-xl font-bold text-white uppercase tracking-tighter">Mapa de Inteligência</DialogTitle>
                <DialogDescription className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Monitoramento Geoespacial (TREVA Integration)</DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={showHeatmap ? "default" : "outline"} 
                size="sm" 
                className={cn("h-8 text-[9px] font-black uppercase", showHeatmap ? "bg-red-600 border-red-600" : "border-white/10")}
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                <Flame className="h-3 w-3 mr-2" /> Heatmap (Massive Scale)
              </Button>
            </div>
          </DialogHeader>
        </div>
        {MapContent}
      </DialogContent>
    </Dialog>
  );
}
