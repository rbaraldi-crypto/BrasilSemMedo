import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Layers, Users, ShieldAlert, 
  ArrowLeft, Zap, Info, Lock, 
  Activity, Box, Eye, Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { TrevaFloor } from '@/types/intelligence';

interface TrevaDigitalTwinProps {
  unitName: string;
  floors: TrevaFloor[];
  onClose: () => void;
}

/**
 * Medida 4: 3D Architectural Overlays (Digital Twin)
 * Visualização Isométrica de pavimentos e alas das megaprisões TREVA.
 */
export function TrevaDigitalTwin({ unitName, floors, onClose }: TrevaDigitalTwinProps) {
  const [selectedFloor, setSelectedFloor] = useState<number>(floors[0]?.id || 0);
  const [viewMode, setViewMode] = useState<'ISOMETRIC' | 'FLAT'>('ISOMETRIC');

  const currentFloor = floors.find(f => f.id === selectedFloor);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-slate-950/98 backdrop-blur-2xl flex flex-col overflow-hidden"
    >
      {/* Header Tático */}
      <div className="p-6 border-b border-white/10 bg-slate-900/80 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Gêmeo Digital: {unitName}</h3>
              <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[10px] animate-pulse">BIM_V4_SYNC</Badge>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Monitoramento Estrutural de Megaprisão (Ponto 4)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
            <Button 
              variant={viewMode === 'ISOMETRIC' ? 'default' : 'ghost'} 
              size="sm" 
              className="h-7 text-[10px] font-black uppercase"
              onClick={() => setViewMode('ISOMETRIC')}
            >
              <Box className="h-3 w-3 mr-1" /> 3D Isométrico
            </Button>
            <Button 
              variant={viewMode === 'FLAT' ? 'default' : 'ghost'} 
              size="sm" 
              className="h-7 text-[10px] font-black uppercase"
              onClick={() => setViewMode('FLAT')}
            >
              <Layers className="h-3 w-3 mr-1" /> Planta Baixa
            </Button>
          </div>
          <Badge className="bg-red-600 font-black text-xs px-3 py-1">TREVA MASSIVE</Badge>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Seletor de Pavimentos (3D Stack Preview) */}
        <div className="w-72 border-r border-white/5 p-6 flex flex-col gap-4 bg-black/20 relative z-40">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Database className="h-3 w-3" /> Hierarquia Estrutural
          </span>
          
          <div className="flex flex-col-reverse gap-4 perspective-1000">
            {floors.map((floor, idx) => (
              <motion.button
                key={floor.id}
                whileHover={{ x: 10, scale: 1.02 }}
                onClick={() => setSelectedFloor(floor.id)}
                className={cn(
                  "p-4 rounded-xl border transition-all text-left relative overflow-hidden group",
                  selectedFloor === floor.id 
                    ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(14,165,233,0.2)]" 
                    : "bg-slate-900 border-white/5 hover:border-white/20"
                )}
                style={{
                  transform: viewMode === 'ISOMETRIC' ? `rotateX(30deg) rotateZ(-10deg) translateY(${idx * -5}px)` : 'none',
                  zIndex: selectedFloor === floor.id ? 50 : 10
                }}
              >
                <div className="relative z-10">
                  <p className={cn(
                    "text-xs font-black uppercase tracking-tighter",
                    selectedFloor === floor.id ? "text-primary" : "text-slate-400"
                  )}>
                    {floor.label}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-2.5 w-2.5 text-slate-500" />
                      <span className="text-[10px] font-mono text-slate-300">
                        {floor.wings.reduce((acc, w) => acc + w.occupancy, 0)} P1
                      </span>
                    </div>
                    {selectedFloor === floor.id && <Zap className="h-3 w-3 text-primary animate-pulse" />}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-auto space-y-4">
            <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Sensores de Perímetro</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-mono text-success">1.420 ATIVOS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visualização Principal (Digital Twin View) */}
        <div className="flex-1 p-8 relative overflow-hidden flex flex-col gap-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
          {/* Grid de Fundo */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
            backgroundImage: 'linear-gradient(#FFF 1px, transparent 1px), linear-gradient(90deg, #FFF 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Detalhamento de Alas: {currentFloor?.label}</h4>
                <p className="text-[10px] text-slate-500 font-bold">VISUALIZAÇÃO DE ALTO RISCO (P1)</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase">Ocupação Total</p>
                <p className="text-lg font-black text-white">92%</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase">Bloqueio RF</p>
                <p className="text-lg font-black text-success">100%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <AnimatePresence mode="wait">
              {currentFloor?.wings.map((wing) => (
                <motion.div
                  key={wing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "p-6 rounded-3xl border-2 bg-slate-900/40 backdrop-blur-md relative overflow-hidden group transition-all duration-500",
                    wing.riskLevel === 'CRITICAL' 
                      ? "border-red-600/30 shadow-[0_0_40px_rgba(220,38,38,0.1)]" 
                      : "border-white/5 hover:border-primary/30"
                  )}
                >
                  <div className="relative z-10 space-y-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xl font-black text-white uppercase tracking-tighter italic">{wing.name}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase">Módulo TREVA-X</p>
                      </div>
                      <Badge className={cn(
                        "font-black text-[10px] px-3 py-1",
                        wing.riskLevel === 'CRITICAL' ? "bg-red-600 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "bg-primary"
                      )}>
                        {wing.riskLevel}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className="text-slate-400">Capacidade Operacional</span>
                        <span className="text-white">{Math.round((wing.occupancy / wing.capacity) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(wing.occupancy / wing.capacity) * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            wing.riskLevel === 'CRITICAL' ? "bg-red-600" : "bg-primary"
                          )}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-500">
                        <span>LIMITE: {wing.capacity}</span>
                        <span>ATUAL: {wing.occupancy}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3 bg-black/60 rounded-2xl border border-white/5 group-hover:border-red-600/20 transition-colors">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Lideranças P1</p>
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                          <span className="text-lg font-black text-white">08</span>
                        </div>
                      </div>
                      <div className="p-3 bg-black/60 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-colors">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Sinal Jammer</p>
                        <div className="flex items-center gap-2">
                          <Activity className="h-3.5 w-3.5 text-success" />
                          <span className="text-lg font-black text-white">MAX</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Efeito de Scanline Interno */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* HUD de Telemetria Inferior */}
          <div className="mt-auto p-5 bg-slate-900/80 border-2 border-primary/20 rounded-3xl flex items-center justify-between shadow-2xl relative z-40">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase">Protocolo de Isolamento</p>
                  <p className="text-xs font-bold text-success uppercase">ATIVO (Nível 5)</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-red-600/10 flex items-center justify-center">
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase">Sensores Biométricos</p>
                  <p className="text-xs font-bold text-white uppercase">100% COBERTURA</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 font-black uppercase text-[10px] h-10 px-6">
                Relatório de Integridade
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] h-10 px-6 shadow-lg shadow-primary/20">
                <Zap className="h-3.5 w-3.5 mr-2" /> Forçar Varredura BIM
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
