import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCircle, ShieldCheck, Activity, ArrowLeft } from 'lucide-react';
import { useTactical } from '@/contexts/TacticalContext';
import { useUI } from '@/contexts/UIContext';
import { DossierNode } from '@/types/intelligence';
import { cn } from '@/lib/utils';

interface DossierTreeProps {
  data: DossierNode;
}

export function DossierTree({ data }: DossierTreeProps) {
  const { selectedNode } = useTactical();
  const { activeModal, setActiveModal } = useUI();

  const isOpen = activeModal === 'DOSSIER';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setActiveModal('MAP')}>
      <DialogContent className="max-w-4xl h-[100vh] md:h-[85vh] bg-slate-900 border-white/10 p-0 overflow-hidden shadow-2xl flex flex-col">
        <DialogHeader className="p-4 md:p-6 border-b border-white/10 bg-white/5 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3 md:gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-8 w-8" onClick={() => setActiveModal('MAP')}>
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <div className="text-left">
              <DialogTitle className="text-sm md:text-xl font-bold text-white uppercase tracking-tight">Dossiê Estratégico</DialogTitle>
              <DialogDescription className="sr-only">Visualização estruturada de dados processuais.</DialogDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[8px] md:text-[10px] font-bold">INTEL-GRAPH V2.4</Badge>
        </DialogHeader>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
           <div className="flex flex-col items-center gap-8 md:gap-12">
              {/* Target Identity Card */}
              <div className="p-4 md:p-5 bg-slate-800 border-2 border-primary/30 rounded-2xl flex flex-col sm:flex-row items-center gap-4 md:gap-5 w-full sm:w-fit shadow-xl relative overflow-hidden">
                 <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-inner">
                    <UserCircle className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                 </div>
                 <div className="text-center sm:text-left">
                    <h4 className="text-sm md:text-lg font-bold text-white uppercase tracking-tighter">{selectedNode?.name || data.label}</h4>
                    <p className="text-[10px] md:text-xs text-primary font-mono font-bold">{selectedNode?.id || data.value}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                       <Badge className="bg-red-600 text-[7px] md:text-[8px] h-4 px-1.5 font-black">ALVO PRIORITÁRIO</Badge>
                    </div>
                 </div>
              </div>

              {/* Responsive Grid / Stacked Branches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
                 {data.children?.map((branch, idx) => (
                    <div key={idx} className="space-y-3 md:space-y-4 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 100}ms` }}>
                       <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 shadow-sm">
                          <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-slate-900 flex items-center justify-center border border-white/5">
                             {branch.icon && <branch.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />}
                          </div>
                          <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-wider">{branch.label}</span>
                       </div>
                       <div className="space-y-2 md:space-y-2.5">
                          {branch.children?.map((leaf, lIdx) => {
                             // Detect Point 11 restriction for flashing red text
                             const isPoint11 = leaf.value.includes("Ponto 11");
                             
                             return (
                               <div key={lIdx} className={cn(
                                 "p-2.5 md:p-3 bg-white/5 rounded-xl border transition-all group/leaf",
                                 isPoint11 ? "border-red-500/50 bg-red-500/5" : "border-white/5 hover:border-primary/30 hover:bg-white/10"
                               )}>
                                  <div className="flex items-center gap-2 mb-1">
                                     {leaf.icon && (
                                       <leaf.icon className={cn(
                                         "h-3 w-3 transition-colors",
                                         isPoint11 ? "text-red-500 animate-pulse" : "text-slate-500 group-hover/leaf:text-primary"
                                       )} />
                                     )}
                                     <p className={cn(
                                       "text-[8px] md:text-[9px] font-black uppercase tracking-tighter",
                                       isPoint11 ? "text-red-400" : "text-slate-500 group-hover/leaf:text-slate-300"
                                     )}>{leaf.label}</p>
                                  </div>
                                  <p className={cn(
                                    "text-[9px] md:text-[10px] font-bold leading-tight",
                                    isPoint11 ? "animate-blink-red" : "text-white"
                                  )}>
                                    {leaf.value}
                                  </p>
                               </div>
                             );
                          })}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* HUD Footer (Desktop Only) */}
        <div className="hidden md:flex p-6 bg-slate-950/80 border-t border-white/10 justify-between items-center">
           <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-success" /> DADOS CRIPTOGRAFADOS</span>
              <span className="flex items-center gap-1.5"><Activity className="h-3 w-3 text-primary" /> SINCRONIZAÇÃO: BNMP/SISBAJUD</span>
           </div>
           <Button variant="outline" className="border-white/10 text-white font-bold px-8 hover:bg-white/5" onClick={() => setActiveModal('MAP')}>
              Fechar Dossiê
           </Button>
        </div>

        {/* Mobile Close Button */}
        <div className="md:hidden p-4 bg-slate-900 border-t border-white/10">
          <Button className="w-full bg-primary text-white font-bold" onClick={() => setActiveModal('MAP')}>
            Retornar ao Mapa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
