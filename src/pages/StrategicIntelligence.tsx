import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShieldAlert, ShieldCheck, DollarSign, 
  Lock, Scan, Skull, Network,
  History, LayoutGrid, Shield, Zap, 
  AlertCircle, Target, Truck
} from 'lucide-react';
import { useIntelligence } from '@/contexts/IntelligenceContext';
import { MetricCard } from '@/components/intelligence/MetricCard';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TacticalWorkspace } from '@/components/intelligence/TacticalWorkspace';
import { motion, AnimatePresence } from 'framer-motion';
import { NarcoterroristAlert } from '@/components/intelligence/NarcoterroristAlert';
import { FinancialAsphyxiaFlow } from '@/components/intelligence/FinancialAsphyxiaFlow';

export default function StrategicIntelligence() {
  const { 
    setSelectedOrg, 
    auditLog, 
    organizations,
    togglePanel,
    openPanels,
    requestMuralhaScan,
    addLogEntry
  } = useIntelligence();

  const [narcoterroristAlert, setNarcoterroristAlert] = useState<string | null>(null);
  const [showP1Alert, setShowP1Alert] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: auditLog.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setNarcoterroristAlert("Liderança P1 'Sintonia Geral' detectada no Setor de Cargas - GRU.");
      setShowP1Alert(true);
      addLogEntry('NARCO_ALERT', 'Sintonia Geral', 'Match Biométrico P1 via AWS DynamoDB GSI.');
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AnimatePresence>
        {showP1Alert && narcoterroristAlert && (
          <NarcoterroristAlert 
            message={narcoterroristAlert} 
            onClose={() => setShowP1Alert(false)} 
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-xl border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="h-14 w-14 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <ShieldAlert className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Brasil Sem Medo</h2>
            <p className="text-slate-400 text-[10px] md:text-xs font-medium uppercase tracking-wider">Terminal de Inteligência AWS DynamoDB</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 relative z-10">
          <PanelToggleButton id="ROADMAP" label="Roadmap" active={openPanels.includes('ROADMAP')} onClick={() => togglePanel('ROADMAP')} icon={<LayoutGrid className="h-3 w-3" />} />
          <PanelToggleButton id="MAP" label="Mapa" active={openPanels.includes('MAP')} onClick={() => togglePanel('MAP')} icon={<Network className="h-3 w-3" />} />
          <PanelToggleButton id="LOGISTICS_PLANNER" label="Logística" active={openPanels.includes('LOGISTICS_PLANNER')} onClick={() => togglePanel('LOGISTICS_PLANNER')} icon={<Truck className="h-3 w-3" />} />
          <PanelToggleButton id="VICTIM_SUPPORT" label="Vítimas" active={openPanels.includes('VICTIM_SUPPORT')} onClick={() => togglePanel('VICTIM_SUPPORT')} icon={<ShieldCheck className="h-3 w-3" />} />
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Investimento Federal" value="R$ 12.4 Bi" icon={<DollarSign className="h-5 w-5 text-primary" />} trend="+100% vs 2024" />
        <MetricCard 
          title="Nós da Muralha" 
          value="1.0M+" 
          icon={<Scan className="h-5 w-5 text-primary" />} 
          trend="SCAN MANUAL (P9)" 
          className="cursor-pointer hover:ring-2 hover:ring-red-600/50 transition-all border-red-600/20"
          onClick={requestMuralhaScan}
        />
        <MetricCard title="Vagas TREVA" value="120k+" icon={<Lock className="h-5 w-5 text-primary" />} trend="Massive Scale" />
        <MetricCard title="Lideranças P1" value="48" icon={<Skull className="h-5 w-5 text-red-500" />} trend="Isolamento Total" className="border-red-600/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <TacticalWorkspace />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-slate-900 border-red-600/30 overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.1)]">
            <CardHeader className="pb-3 bg-red-600/10 border-b border-red-600/20">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-red-500">
                <AlertCircle className="h-3 w-3 animate-pulse" /> Índice Narcoterrorista (P1)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              {organizations.map((org) => (
                <div key={org.id} className="space-y-3 pb-4 border-b border-white/5 last:border-0 group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black text-white group-hover:text-red-400 transition-colors">{org.acronym}</p>
                      <p className="text-[8px] text-slate-500 uppercase font-bold">{org.name}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-red-600 text-[7px] font-black h-4 px-1.5 animate-pulse">AMEAÇA: {org.threatScore}</Badge>
                    </div>
                  </div>

                  <FinancialAsphyxiaFlow 
                    asphyxiaLevel={org.asphyxiaLevel} 
                    orgAcronym={org.acronym} 
                  />

                  <div className="flex items-center gap-2 pt-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-[7px] font-black uppercase bg-white/5 hover:bg-red-600 hover:text-white transition-all"
                      onClick={() => setSelectedOrg(org)}
                    >
                      <Target className="h-2.5 w-2.5 mr-1" /> Ver Hierarquia
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-[7px] font-black uppercase bg-white/5 hover:bg-primary hover:text-white transition-all"
                    >
                      <DollarSign className="h-2.5 w-2.5 mr-1" /> Bloquear Ativos
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <History className="h-3 w-3 text-primary" /> Log de Auditoria AWS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={parentRef} className="h-[300px] overflow-auto custom-scrollbar">
                <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const log = auditLog[virtualRow.index];
                    if (!log) return null;
                    return (
                      <div 
                        key={virtualRow.index} 
                        className="absolute top-0 left-0 w-full border-b border-white/5 hover:bg-white/5 p-3"
                        style={{ height: `${virtualRow.size}px`, transform: `translateY(${virtualRow.start}px)` }}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={cn(
                            "text-[7px] font-black uppercase",
                            log.type === 'NARCO_ALERT' ? "text-red-500" : "text-primary"
                          )}>{log.type}</span>
                          <span className="text-[7px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-200 truncate">{log.targetName}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PanelToggleButton({ label, active, onClick, icon }: any) {
  return (
    <Button 
      variant={active ? "default" : "outline"} 
      size="sm" 
      onClick={onClick}
      className={cn(
        "h-8 text-[9px] font-black uppercase tracking-widest gap-2 transition-all",
        active ? "bg-primary shadow-lg shadow-primary/20" : "border-white/10 text-slate-400 hover:bg-white/5"
      )}
    >
      {icon} {label}
    </Button>
  );
}
