import { useState, useRef, Suspense, lazy } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ShieldAlert, ShieldCheck, DollarSign, 
  Lock, ArrowRight, Scan, Skull, Network,
  History, UserCircle, Loader2, BarChart3, LayoutGrid,
  Shield
} from 'lucide-react';
import { useIntelligence } from '@/contexts/IntelligenceContext';
import { MetricCard } from '@/components/intelligence/MetricCard';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TacticalWorkspace } from '@/components/intelligence/TacticalWorkspace';

export default function StrategicIntelligence() {
  const { 
    setSelectedOrg, 
    auditLog, 
    organizations,
    togglePanel,
    openPanels,
    requestMuralhaScan
  } = useIntelligence();

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: auditLog.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  const handleOpenMap = (org?: any) => {
    const targetOrg = org || organizations[0];
    if (!targetOrg) return;
    setSelectedOrg(targetOrg);
    togglePanel('MAP');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-xl border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="h-14 w-14 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <ShieldAlert className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Brasil Sem Medo</h2>
            <p className="text-slate-400 text-[10px] md:text-xs font-medium uppercase tracking-wider">Terminal de Inteligência Multitarefa</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 relative z-10">
          <PanelToggleButton id="ROADMAP" label="Roadmap" active={openPanels.includes('ROADMAP')} onClick={() => togglePanel('ROADMAP')} icon={<LayoutGrid className="h-3 w-3" />} />
          <PanelToggleButton id="MAP" label="Mapa" active={openPanels.includes('MAP')} onClick={() => handleOpenMap()} icon={<Network className="h-3 w-3" />} />
          <PanelToggleButton id="AUDIT_TIMELINE" label="Custódia" active={openPanels.includes('AUDIT_TIMELINE')} onClick={() => togglePanel('AUDIT_TIMELINE')} icon={<Shield className="h-3 w-3" />} />
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Investimento Federal" value="R$ 12.4 Bi" icon={<DollarSign className="h-5 w-5 text-primary" />} trend="+100% vs 2024" />
        <MetricCard 
          title="Nós da Muralha" 
          value="1.0M+" 
          icon={<Scan className="h-5 w-5 text-primary" />} 
          trend="Câmeras Ativas" 
          className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
          onClick={requestMuralhaScan}
        />
        <MetricCard title="Vagas TREVA" value="5.000" icon={<Lock className="h-5 w-5 text-primary" />} trend="Segurança Máxima" />
        <MetricCard title="Lideranças" value="48" icon={<Skull className="h-5 w-5 text-primary" />} trend="Isolamento Total" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <TacticalWorkspace />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-slate-900 border-white/10 overflow-hidden">
            <CardHeader className="pb-3 bg-white/5 border-b border-white/5">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="h-3 w-3 text-primary" /> Organizações
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {organizations.map((org) => (
                    <TableRow key={org.id} className="border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => handleOpenMap(org)}>
                      <TableCell className="pl-4 font-bold text-white text-[10px]">{org.acronym}</TableCell>
                      <TableCell className="text-right pr-4">
                        <Badge variant="outline" className="text-[7px] border-red-500/30 text-red-500 uppercase">Crítico</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <History className="h-3 w-3 text-primary" /> Log de Auditoria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={parentRef} className="h-[400px] overflow-auto custom-scrollbar">
                <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const log = auditLog[virtualRow.index];
                    return (
                      <div 
                        key={virtualRow.index} 
                        className="absolute top-0 left-0 w-full border-b border-white/5 hover:bg-white/5 p-3"
                        style={{ height: `${virtualRow.size}px`, transform: `translateY(${virtualRow.start}px)` }}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[7px] font-black text-primary uppercase">{log.type}</span>
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
