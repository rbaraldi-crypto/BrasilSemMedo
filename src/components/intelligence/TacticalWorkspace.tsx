import { PanelID } from '@/types/intelligence';
import { useUI } from '@/contexts/UIContext';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { cn } from '@/lib/utils';
import { X, Maximize2, GripVertical, GripHorizontal, LayoutGrid, Monitor, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { Suspense, lazy } from 'react';
import { TacticalSkeleton } from '@/components/ui/TacticalSkeleton';
import { ProgramRoadmap } from './ProgramRoadmap';
import { TacticalErrorBoundary } from '@/components/ui/TacticalErrorBoundary';
import { AuditTimeline } from './AuditTimeline';
import { VictimSupportModule } from './VictimSupportModule';
import { TacticalRoutePlanner } from './TacticalRoutePlanner';

// Lazy load para os componentes pesados dentro dos painéis
const MuralhaPanel = lazy(() => import('./MuralhaModal').then(m => ({ default: m.MuralhaModal })));
const MapPanel = lazy(() => import('./IntelligenceMap').then(m => ({ default: m.IntelligenceMap })));

interface WorkspacePanelProps {
  id: PanelID;
  title: string;
  children: React.ReactNode;
}

function WorkspacePanelWrapper({ id, title, children }: WorkspacePanelProps) {
  const { togglePanel } = useUI();

  return (
    <div className="h-full flex flex-col bg-slate-950 border border-white/10 rounded-lg overflow-hidden shadow-2xl relative group/panel">
      <div className="h-9 bg-slate-900/80 border-b border-white/10 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/panel:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white" onClick={() => togglePanel(id)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <TacticalErrorBoundary moduleName={title}>
          <Suspense fallback={<div className="p-10"><TacticalSkeleton lines={10} /></div>}>
            {children}
          </Suspense>
        </TacticalErrorBoundary>
      </div>
    </div>
  );
}

export function TacticalWorkspace() {
  const { openPanels, layoutMode, setLayoutMode } = useUI();

  if (openPanels.length === 0) {
    return (
      <div className="h-[70vh] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-center p-10 bg-slate-900/20">
        <Monitor className="h-16 w-16 text-slate-800 mb-4" />
        <h3 className="text-xl font-bold text-slate-600 uppercase tracking-tighter">Workspace Vazio</h3>
        <p className="text-slate-500 text-sm max-w-xs mt-2 font-medium">Selecione um módulo acima para iniciar o monitoramento multitarefa.</p>
      </div>
    );
  }

  const renderPanelContent = (id: PanelID) => {
    switch (id) {
      case 'ROADMAP': return <ProgramRoadmap isEmbedded />;
      case 'MAP': return <MapPanel isEmbedded />;
      case 'MURALHA': return <MuralhaPanel isEmbedded />;
      case 'AUDIT_TIMELINE': return <AuditTimeline isEmbedded />;
      case 'VICTIM_SUPPORT': return <VictimSupportModule isEmbedded />;
      case 'LOGISTICS_PLANNER': return <TacticalRoutePlanner isEmbedded />;
      case 'DOSSIER': return <div className="p-4 text-slate-500 font-mono text-[10px]">MÓDULO DOSSIÊ EM DESENVOLVIMENTO PARA VIEWPORT REDUZIDA</div>;
      default: return null;
    }
  };

  const getPanelTitle = (id: PanelID) => {
    const titles: Record<PanelID, string> = {
      ROADMAP: 'Roadmap Estratégico',
      MAP: 'Mapa de Conexões',
      MURALHA: 'Muralha Paulista',
      SISBAJUD: 'Asfixia Financeira',
      DOSSIER: 'Dossiê de Inteligência',
      AUDIT_TIMELINE: 'Linha do Tempo de Custódia',
      VICTIM_SUPPORT: 'Apoio às Vítimas (P10)',
      LOGISTICS_PLANNER: 'Logística Tática (P4)',
      NARCO_INDEX: 'Índice Narcoterrorista'
    };
    return titles[id];
  };

  return (
    <div className="h-[80vh] flex flex-col gap-4 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between bg-slate-900/40 p-2 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-primary ml-2" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Configuração de Workspace</span>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant={layoutMode === 'FULL' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-8 text-[9px] font-bold uppercase"
            onClick={() => setLayoutMode('FULL')}
          >
            <Monitor className="h-3 w-3 mr-2" /> Foco
          </Button>
          <Button 
            variant={layoutMode === 'SPLIT' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-8 text-[9px] font-bold uppercase"
            onClick={() => setLayoutMode('SPLIT')}
          >
            <Columns className="h-3 w-3 mr-2" /> Split
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <PanelGroup direction={layoutMode === 'SPLIT' ? "horizontal" : "vertical"}>
          {openPanels.map((panelId, index) => (
            <React.Fragment key={panelId}>
              <Panel defaultSize={100 / openPanels.length} minSize={20}>
                <WorkspacePanelWrapper id={panelId} title={getPanelTitle(panelId)}>
                  {renderPanelContent(panelId)}
                </WorkspacePanelWrapper>
              </Panel>
              {index < openPanels.length - 1 && (
                <PanelResizeHandle className={cn(
                  "flex items-center justify-center bg-transparent hover:bg-primary/20 transition-colors",
                  layoutMode === 'SPLIT' ? "w-2 cursor-col-resize" : "h-2 cursor-row-resize"
                )}>
                  {layoutMode === 'SPLIT' ? <GripVertical className="h-4 w-4 text-slate-700" /> : <GripHorizontal className="h-4 w-4 text-slate-700" />}
                </PanelResizeHandle>
              )}
            </React.Fragment>
          ))}
        </PanelGroup>
      </div>
    </div>
  );
}
