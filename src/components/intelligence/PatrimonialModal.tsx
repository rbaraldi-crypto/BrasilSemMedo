import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Landmark, Loader2, Zap, CircleCheck, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntelligence } from '@/contexts/IntelligenceContext';
import { PatrimonialStep } from '@/types/intelligence';
import { tacticalAudio } from '@/lib/audioUtils';

interface PatrimonialModalProps {
  workflow: PatrimonialStep[];
}

export function PatrimonialModal({ workflow }: PatrimonialModalProps) {
  const { activeModal, setActiveModal, selectedNode, addLogEntry } = useIntelligence();
  const [isSisbajudLoading, setIsSisbajudLoading] = useState(false);
  const [sisbajudResult, setSisbajudResult] = useState<any>(null);

  const isOpen = activeModal === 'PATRIMONIAL';

  const handleSisbajudProtocol = async () => {
    setIsSisbajudLoading(true);
    setSisbajudResult(null);
    
    // Play subtle scan pulses during loading
    const interval = setInterval(() => tacticalAudio.playScan(), 600);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    clearInterval(interval);
    tacticalAudio.playSuccess(); // Trigger professional success beep
    
    const result = {
      protocolId: `SIS-${Math.floor(Math.random() * 900000 + 100000)}`,
      institution: "Banco do Brasil S.A.",
      amount: "R$ 452.890,22",
      status: "BLOQUEIO EFETUADO",
    };
    setSisbajudResult(result);
    if (selectedNode) {
      addLogEntry('SISBAJUD', selectedNode.name, `Bloqueio Patrimonial: ${result.amount} via ${result.institution}`);
    }
    setIsSisbajudLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setActiveModal('MAP')}>
      <DialogContent className="max-w-2xl bg-slate-900 border-white/10 p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 border-b border-white/10 bg-white/5 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <Landmark className="h-6 w-6 text-primary" />
            <DialogTitle className="text-xl font-bold text-white">Medidas Patrimoniais</DialogTitle>
          </div>
          <DialogDescription className="sr-only">Protocolo de asfixia financeira e integração SISBAJUD.</DialogDescription>
          <Badge className="bg-primary text-white font-bold">SISBAJUD INTEGRATION</Badge>
        </DialogHeader>
        <div className="p-8 h-[60vh] overflow-y-auto custom-scrollbar">
           <div className="space-y-4">
              {workflow.map((step) => (
                 <div key={step.id} className="relative">
                    <div className={cn(
                      "p-4 rounded-lg border transition-all flex items-center gap-4",
                      step.id === 8 ? "bg-primary/10 border-primary shadow-lg" : "bg-white/5 border-white/5"
                    )}>
                       <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-primary">
                          {step.id}
                       </div>
                       <step.icon className="h-5 w-5 text-slate-400" />
                       <span className="text-xs font-medium text-white">{step.text}</span>
                       {step.id === 8 && !sisbajudResult && (
                          <Button size="sm" className="ml-auto bg-primary hover:bg-primary/90 text-[10px] font-bold" onClick={handleSisbajudProtocol} disabled={isSisbajudLoading}>
                             {isSisbajudLoading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Zap className="h-3 w-3 mr-2" />} Executar Protocolo
                          </Button>
                       )}
                    </div>
                    {step.id === 8 && sisbajudResult && (
                       <div className="mt-2 ml-12 p-4 bg-green-600/10 border border-green-600 rounded-lg animate-in zoom-in">
                          <div className="flex items-center gap-2 text-green-500 mb-2">
                             <CircleCheck className="h-4 w-4" />
                             <span className="text-[10px] font-bold uppercase">{sisbajudResult.status}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-[10px]">
                             <div>
                                <p className="text-slate-500 font-bold uppercase">ID Protocolo</p>
                                <p className="text-white font-mono">{sisbajudResult.protocolId}</p>
                             </div>
                             <div>
                                <p className="text-slate-500 font-bold uppercase">Montante</p>
                                <p className="text-white font-bold">{sisbajudResult.amount}</p>
                             </div>
                          </div>
                       </div>
                    )}
                    {step.id < 10 && (
                       <div className="flex justify-center py-1">
                          <ArrowDown className="h-4 w-4 text-slate-700" />
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </div>
        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
           <Button variant="outline" className="border-white/10 text-white font-bold" onClick={() => setActiveModal('MAP')}>Retornar ao Mapa</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
