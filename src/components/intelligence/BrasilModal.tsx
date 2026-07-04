import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntelligence } from '@/contexts/IntelligenceContext';

interface BrasilModalProps {
  isLoading: boolean;
  result: any;
}

export function BrasilModal({ isLoading, result }: BrasilModalProps) {
  const { selectedNode, activeModal, setActiveModal } = useIntelligence();

  const isOpen = activeModal === 'BRASIL';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setActiveModal('MAP')}>
      <DialogContent className="max-w-2xl bg-slate-900 border-white/10 p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 font-semibold">
            <Shield className="h-5 w-5 text-primary" />
            Inteligência Brasil
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">Sistemas Integrados de Segurança Nacional</DialogDescription>
        </DialogHeader>
        <div className="py-6 min-h-[350px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Consultando Bases Nacionais...</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Alvo em Verificação</span>
                  <h4 className="text-lg font-bold text-white">{selectedNode?.name || result.targetName}</h4>
                </div>
                <Badge className={cn("font-bold", result.riskLevel === 'Monitorado' ? "bg-green-600" : "bg-red-600")}>
                  STATUS: {result.riskLevel}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Mandados</p>
                  <p className="text-xs font-semibold text-red-400 mt-1">{result.warrants}</p>
                </div>
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Investigações</p>
                  <p className="text-xs font-semibold text-white mt-1">{result.investigations}</p>
                </div>
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Condenações</p>
                  <p className="text-xs font-semibold text-white mt-1">{result.convictions}</p>
                </div>
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Cautelares</p>
                  <p className="text-xs font-semibold text-white mt-1">{result.precautionaryMeasures}</p>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button variant="outline" className="border-white/10 text-white" onClick={() => setActiveModal('MAP')}>Retornar ao Mapa</Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
