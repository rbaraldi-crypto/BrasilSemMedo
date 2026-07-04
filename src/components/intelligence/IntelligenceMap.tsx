import { useMemo, useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, UserCircle, MapPin, Scan, ShieldAlert, 
  Waves, Fence, Skull, Plus, Minus,
  ShieldCheck, Activity, Flame, Network, DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntelligence } from '@/contexts/IntelligenceContext';
import { motion, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { strategicMarkers } from '@/data/mockData';
import { StrategicMarker } from '@/types/intelligence';
import { HierarchyNode } from './HierarchyNode';
import { WatermarkOverlay } from '@/components/ui/WatermarkOverlay';

/**
 * FinancialFlowLine (I2): Renderiza o fluxo de capital entre os nós.
 */
function FinancialFlowLine({ x1, y1, x2, y2, delay = 0 }: any) {
  const path = `M ${x1} ${y1} L ${x2} ${y2}`;
  return (
    <g>
      <motion.path
        d={path}
        fill="transparent"
        stroke="#EAB308"
        strokeWidth="2"
        strokeDasharray="5,5"
        initial={{ strokeDashoffset: 100, opacity: 0 }}
        animate={{ strokeDashoffset: 0, opacity: 0.4 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear", delay }}
      />
      <motion.circle
        r="2.5"
        fill="#EAB308"
        style={{ 
          offsetPath: `path('${path}')`,
          offsetDistance: "var(--motion-offset)",
          WebkitOffsetDistance: "var(--motion-offset)"
        } as any}
        initial={{ "--motion-offset": "0%" } as any}
        animate={{ "--motion-offset": "100%" } as any}
        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay }}
      />
    </g>
  );
}

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
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 60);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
        gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.2)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 60, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [markers]);

  return <canvas ref={canvasRef} width={1200} height={800} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-70" />;
}

function Minimap({ x, y, scale, markers }: { x: MotionValue<number>, y: MotionValue<number>, scale: MotionValue<number>, markers: StrategicMarker[] }) {
  const viewfinderX = useTransform([x, scale], ([latestX, latestScale]: any) => 80 - (latestX / 5) - (80 / latestScale));
  const viewfinderY = useTransform([y, scale], ([latestY, latestScale]: any) => 60 - (latestY / 5) - (60 / latestScale));
  const viewfinderW = useTransform(scale, (s: number) => 160 / s);
  const viewfinderH = useTransform(scale, (s: number) => 120 / s);

  return (
    <div className="absolute bottom-4 left-4 z-50 w-40 h-32 bg-slate-900/90 border-2 border-white/20 rounded-lg overflow-hidden shadow-2xl backdrop-blur-md pointer-events-none">
      <img src="https://diariocarioca.com/wp-content/uploads/2025/05/174440622467f986d0729ee_1744406224_3x2_lg.webp" className="w-full h-full object-cover opacity-30 grayscale" alt="Mini Map" />
      {markers.map((m) => (
        <div key={`radar-${m.id}`} className={cn("absolute w-1 h-1 rounded-full", m.type === 'treva' ? "bg-red-500 animate-pulse" : "bg-primary")} style={{ top: m.top, left: m.left }} />
      ))}
      <motion.div style={{ x: viewfinderX, y: viewfinderY, width: viewfinderW, height: viewfinderH }} className="absolute border border-primary bg-primary/10" />
    </div>
  );
}

function AnimatedConnection({ x1, y1, x2, y2, delay = 0 }: { x1: string | number, y1: number, x2: string | number, y2: number, delay?: number }) {
  const path = `M ${x1} ${y1} L ${x2} ${y2}`;
  
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#328CC1" strokeWidth="1" strokeDasharray="4,4" className="opacity-20" />
      <motion.circle
        r="3"
        fill="#22D3EE"
        style={{ 
          offsetPath: `path('${path}')`,
          offsetDistance: "var(--motion-offset)",
          WebkitOffsetDistance: "var(--motion-offset)"
        } as any}
        initial={{ "--motion-offset": "0%" } as any}
        animate={{ "--motion-offset": "100%" } as any}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: delay }}
      />
    </g>
  );
}

export function IntelligenceMap({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const { 
    selectedOrg, selectedNode, setSelectedNode, activeTab, 
    setActiveTab, activeModal, closeModal, setActiveModal,
    showFinancialFlow, setShowFinancialFlow
  } = useIntelligence();
  
  const [visibleLayers] = useState<string[]>(['treva', 'port', 'muralha', 'border']);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapX = useMotionValue(0);
  const mapY = useMotionValue(0);
  const mapScale = useMotionValue(1);

  const isOpen = (activeModal === 'MAP');

  const level1 = useMemo(() => selectedOrg?.hierarchy?.filter(h => h.level === 1) || [], [selectedOrg]);
  const level2 = useMemo(() => selectedOrg?.hierarchy?.filter(h => h.level === 2) || [], [selectedOrg]);

  const filteredMarkers = useMemo(() => strategicMarkers.filter(m => visibleLayers.includes(m.type)), [visibleLayers]);

  const MapContent = (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col md:flex-row overflow-hidden relative">
      {!isEmbedded && (
        <div className="hidden md:flex w-80 border-r border-white/10 bg-slate-900/30 p-5 flex-col space-y-6 overflow-y-auto">
          <div className="space-y-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Camadas</span>
            <TabsList className="flex flex-col h-auto bg-transparent gap-2 w-full">
              <TabsTrigger value="hierarchy" className="w-full justify-start gap-3 h-11 px-4 rounded-xl border border-white/5 data-[state=active]:bg-primary">
                <UserCircle className="h-4 w-4" /> Hierarquia
              </TabsTrigger>
              <TabsTrigger value="territory" className="w-full justify-start gap-3 h-11 px-4 rounded-xl border border-white/5 data-[state=active]:bg-primary">
                <MapPin className="h-4 w-4" /> Território
              </TabsTrigger>
            </TabsList>
          </div>
          {selectedNode && (
            <div className="pt-6 border-t border-white/10 space-y-4">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Alvo Selecionado</span>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{selectedNode.role}</p>
                  <p className="text-xs text-white font-bold">{selectedNode.name}</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" className="w-full h-9 text-[9px] font-bold uppercase" onClick={() => setActiveModal('ONU')}>ONU Blacklist</Button>
                  <Button variant="outline" className="w-full h-9 text-[9px] font-bold uppercase" onClick={() => setActiveModal('BRASIL')}>Brasil Blacklist</Button>
                  <Button variant="outline" className="w-full h-9 text-[9px] font-bold uppercase" onClick={() => setActiveModal('DOSSIER')}>Dossiê IABS</Button>
                  <Button variant="outline" className="w-full h-9 text-[9px] font-bold uppercase" onClick={() => setActiveModal('PATRIMONIAL')}>SISBAJUD</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 relative bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #328CC1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <TabsContent value="hierarchy" className="h-full m-0 p-0 overflow-auto">
          <div className="min-h-full p-10 flex flex-col items-center gap-16 relative">
             <div className="flex flex-col items-center relative z-10">
                {level1.map(node => (
                  <HierarchyNode key={node.id} node={node} isSelected={selectedNode?.id === node.id} onClick={() => setSelectedNode(node)} color={node.status === 'Preso' ? 'text-green-500' : 'text-red-500'} />
                ))}
             </div>
             <div className="flex flex-wrap justify-center gap-12 relative z-10 w-full">
                {level2.map(node => (
                  <HierarchyNode key={node.id} node={node} isSelected={selectedNode?.id === node.id} onClick={() => setSelectedNode(node)} color={node.status === 'Preso' ? 'text-green-500' : 'text-red-500'} isSmall />
                ))}
             </div>
             <svg className="absolute inset-0 pointer-events-none w-full h-full">
                {level1.length > 0 && level2.map((l2, i) => (
                  <AnimatedConnection key={`data-${i}`} x1="50%" y1={120} x2={`${(i + 1) * (100 / (level2.length + 1))}%`} y2={280} delay={i * 0.4} />
                ))}
                {showFinancialFlow && level1.length > 0 && level2.map((l2, i) => (
                  <FinancialFlowLine key={`money-${i}`} x1="50%" y1={120} x2={`${(i + 1) * (100 / (level2.length + 1))}%`} y2={280} delay={i * 0.6} />
                ))}
             </svg>
          </div>
        </TabsContent>

        <TabsContent value="territory" className="h-full m-0 p-0 relative overflow-hidden" ref={mapContainerRef}>
           <Minimap x={mapX} y={mapY} scale={mapScale} markers={filteredMarkers} />
           <motion.div drag dragConstraints={mapContainerRef} style={{ x: mapX, y: mapY, scale: mapScale }} className="absolute inset-0 cursor-grab active:cursor-grabbing flex items-center justify-center origin-center">
            <div className="relative w-[120%] h-[120%] border border-white/10 rounded-2xl overflow-hidden bg-slate-900/40 backdrop-blur-sm">
              <img src="https://diariocarioca.com/wp-content/uploads/2025/05/174440622467f986d0729ee_1744406224_3x2_lg.webp" className="w-full h-full object-cover opacity-40 grayscale mix-blend-lighten pointer-events-none" alt="Tactical Map" />
              {showHeatmap && <HeatmapLayer markers={filteredMarkers} />}
              {filteredMarkers.map((marker) => (
                <div key={marker.id} className="absolute group" style={{ top: marker.top, left: marker.left }}>
                  <motion.div className={cn(
                    "h-10 w-10 rounded-full border-2 border-white/40 flex items-center justify-center shadow-2xl transition-all hover:scale-125 cursor-help z-10", 
                    marker.type === 'treva' ? 'bg-red-700 shadow-red-500/50 animate-pulse' : 'bg-primary shadow-primary/50'
                  )}>
                    {marker.type === 'port' ? <Waves className="h-4 w-4 text-white" /> : marker.type === 'treva' ? <ShieldAlert className="h-4 w-4 text-white" /> : marker.type === 'muralha' ? <Scan className="h-4 w-4 text-white" /> : <Fence className="h-4 w-4 text-white" />}
                  </motion.div>
                </div>
              ))}
            </div>
           </motion.div>
        </TabsContent>
      </div>
    </Tabs>
  );

  if (isEmbedded) {
    return <div className="h-full">{MapContent}</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-950 border-white/10 shadow-2xl">
        <WatermarkOverlay />
        <div className="p-5 border-b border-white/10 bg-slate-900/50 relative z-10">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={closeModal}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-left">
                <DialogTitle className="text-xl font-bold text-white uppercase tracking-tighter">Mapa de Inteligência</DialogTitle>
                <DialogDescription className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Monitoramento Geoespacial</DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={showFinancialFlow ? "default" : "outline"} 
                size="sm" 
                className={cn("h-8 text-[9px] font-black uppercase", showFinancialFlow ? "bg-yellow-600 border-yellow-600" : "border-white/10")}
                onClick={() => setShowFinancialFlow(!showFinancialFlow)}
              >
                <DollarSign className="h-3 w-3 mr-2" /> Fluxo de Capital
              </Button>
              <Button 
                variant={showHeatmap ? "default" : "outline"} 
                size="sm" 
                className={cn("h-8 text-[9px] font-black uppercase", showHeatmap ? "bg-red-600 border-red-600" : "border-white/10")}
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                <Flame className="h-3 w-3 mr-2" /> Heatmap Asfixia
              </Button>
            </div>
          </DialogHeader>
        </div>
        {MapContent}
      </DialogContent>
    </Dialog>
  );
}
