import { useEffect, useState, Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { CommandPalette } from '../intelligence/CommandPalette';
import { 
  ShieldCheck, Activity, Landmark, Bell, BellOff, 
  Wifi, WifiOff, CloudSync, Mic, MicOff, Lock,
  Globe, Satellite, Zap
} from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { IntelligenceProvider, useIntelligence } from '@/contexts/IntelligenceContext';
import { cn } from '@/lib/utils';
import { DeadMansSwitch } from '../ui/DeadMansSwitch';
import { iabsTreeData } from '@/data/mockData';
import { GlobalIntelligenceTicker } from '../intelligence/GlobalIntelligenceTicker';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Modais de Inteligência Globalizados
const MuralhaModal = lazy(() => import('@/components/intelligence/MuralhaModal').then(m => ({ default: m.MuralhaModal })));
const DispatchModal = lazy(() => import('@/components/intelligence/DispatchModal').then(m => ({ default: m.DispatchModal })));
const IntelligenceMap = lazy(() => import('@/components/intelligence/IntelligenceMap').then(m => ({ default: m.IntelligenceMap })));
const DossierTree = lazy(() => import('@/components/intelligence/DossierTree').then(m => ({ default: m.DossierTree })));
const PatrimonialModal = lazy(() => import('@/components/intelligence/PatrimonialModal').then(m => ({ default: m.PatrimonialModal })));

function TacticalHUD() {
  const { 
    isOnline, pendingSyncCount, isNightVision, 
    isVoiceActive, setVoiceActive, setLocked,
    linkType, setLinkType, simulatedLatency 
  } = useIntelligence();

  const handleLinkChange = (type: 'FIBER' | 'SATELLITE') => {
    setLinkType(type);
    toast.info(`LINK ALTERADO: ${type}`, {
      description: type === 'SATELLITE' 
        ? "Modo de Contingência: Latência elevada detectada." 
        : "Modo Padrão: Conexão de alta velocidade restabelecida.",
      icon: type === 'SATELLITE' ? <Satellite className="h-4 w-4" /> : <Globe className="h-4 w-4" />
    });
  };

  return (
    <div className="md:pl-64 fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="container mx-auto px-4 md:px-10 max-w-7xl">
        <div className="flex justify-end pt-4 gap-4">
           <div className={cn(
             "bg-slate-900/80 backdrop-blur-md border rounded-full px-4 py-1.5 flex items-center gap-3 shadow-2xl pointer-events-auto transition-all duration-500",
             isNightVision ? "border-success/50 shadow-success/10" : "border-white/10 shadow-black",
             linkType === 'SATELLITE' && "border-warning/50 shadow-warning/5"
           )}>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-6 w-6 p-0 rounded-full transition-all",
                  isVoiceActive ? "bg-primary/20 text-primary animate-pulse" : "text-slate-500 hover:bg-white/10"
                )}
                onClick={() => setVoiceActive(!isVoiceActive)}
                title={isVoiceActive ? "Voz Ativa: Diga comandos" : "Ativar Comandos de Voz"}
              >
                {isVoiceActive ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 p-0 text-slate-500 hover:bg-destructive/20 hover:text-destructive rounded-full"
                onClick={() => setLocked(true)}
                title="Bloquear Terminal Agora"
              >
                <Lock className="h-3 w-3" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 border-r border-white/10 pr-3 cursor-pointer group">
                    {isOnline ? (
                      linkType === 'FIBER' ? <Globe className="h-3 w-3 text-success" /> : <Satellite className="h-3 w-3 text-warning animate-pulse" />
                    ) : (
                      <WifiOff className="h-3 w-3 text-destructive animate-pulse" />
                    )}
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest transition-colors",
                      isOnline ? (linkType === 'FIBER' ? "text-success" : "text-warning") : "text-destructive"
                    )}>
                      {isOnline ? `Link: ${linkType}` : "Offline"}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border-white/10 text-white">
                  <DropdownMenuItem onClick={() => handleLinkChange('FIBER')} className="text-[10px] font-bold uppercase gap-2">
                    <Globe className="h-3 w-3 text-success" /> Fibra Óptica (Low Latency)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLinkChange('SATELLITE')} className="text-[10px] font-bold uppercase gap-2">
                    <Satellite className="h-3 w-3 text-warning" /> Satélite (Field Training)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {pendingSyncCount > 0 && (
                <div className="flex items-center gap-2 border-r border-white/10 pr-3 animate-pulse">
                   <CloudSync className="h-3 w-3 text-primary" />
                   <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                     Sync: {pendingSyncCount}
                   </span>
                </div>
              )}

              <div className="flex items-center gap-2 border-r border-white/10 pr-3">
                 <ShieldCheck className="h-3 w-3 text-success" />
                 <span className={cn("text-[9px] font-black uppercase tracking-widest", isNightVision ? "text-success/80" : "text-slate-400")}>Ponto 11: ATIVO</span>
              </div>
              
              <div className="flex items-center gap-2">
                 <Activity className={cn("h-3 w-3 animate-pulse", simulatedLatency > 500 ? "text-warning" : "text-success")} />
                 <span className={cn(
                   "text-[9px] font-black uppercase tracking-widest font-mono",
                   simulatedLatency > 500 ? "text-warning" : "text-success"
                 )}>
                   {simulatedLatency}ms
                 </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function MainLayoutContent() {
  const { isNightVision } = useIntelligence();

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-700 pb-8", 
      isNightVision ? "night-vision bg-black" : "bg-slate-950"
    )}>
      <Sidebar />
      <CommandPalette />
      <TacticalHUD />
      <DeadMansSwitch />

      <main className="md:pl-64 min-h-screen relative transition-all duration-300">
        <div className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-700",
          isNightVision ? "opacity-[0.08]" : "opacity-[0.03]"
        )} style={{ 
          backgroundImage: isNightVision 
            ? 'linear-gradient(rgba(18, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 255, 65, 0.1) 1px, transparent 1px)' 
            : 'radial-gradient(circle, #FFF 1px, transparent 1px)', 
          backgroundSize: isNightVision ? '20px 20px' : '30px 30px' 
        }} />
        
        {isNightVision && (
          <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,255,65,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        )}

        <div className="container mx-auto p-4 md:p-10 max-w-7xl relative z-10 pt-16 md:pt-20">
          <Outlet />
        </div>
      </main>

      <GlobalIntelligenceTicker />

      <Suspense fallback={null}>
        <MuralhaModal />
        <DispatchModal />
        <IntelligenceMap />
        <DossierTree data={iabsTreeData} />
        <PatrimonialModal workflow={[]} />
      </Suspense>
    </div>
  );
}

export function MainLayout() {
  return (
    <IntelligenceProvider>
      <MainLayoutContent />
    </IntelligenceProvider>
  );
}
