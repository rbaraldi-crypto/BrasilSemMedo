import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Loader2 } from 'lucide-react';
import { useIntelligence } from '@/contexts/IntelligenceContext';

interface ONUModalProps {
  isLoading: boolean;
  result: any;
}

export function ONUModal({ isLoading, result }: ONUModalProps) {
  const { selectedNode, activeModal, setActiveModal } = useIntelligence();

  const isOpen = activeModal === 'ONU';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setActiveModal('MAP')}>
      <DialogContent className="max-w-2xl bg-slate-900 border-white/10 p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 font-semibold">
            <Globe className="h-5 w-5 text-primary" />
            ONU Intelligence Network
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">Consulta de sanções e resoluções internacionais</DialogDescription>
        </DialogHeader>
        <div className="py-6 min-h-[300px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Acessando Banco de Dados ONU...</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Alvo Identificado</span>
                  <h4 className="text-lg font-bold text-white">{selectedNode?.name || result.targetName}</h4>
                </div>
                <Badge variant="destructive" className="font-bold">RISCO {result.riskLevel}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Designação</span>
                  <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                    <p className="text-xs font-bold text-white">{result.designation}</p>
                    <p className="text-[10px] text-primary mt-1 font-mono">{result.resolution}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Sanções</span>
                  <div className="flex flex-wrap gap-2">
                    {result.sanctions.map((s: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-[9px] border-white/10 font-medium">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button variant="outline" className="border-white/10 text-white" onClick={() => setActiveModal('MAP')}>Fechar Consulta</Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
