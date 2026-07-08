import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Lock, UserCheck, 
  Key, ShieldAlert, X, Fingerprint,
  CheckCircle2, AlertTriangle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { BiometricScanner } from './BiometricScanner';
import { tacticalAudio } from '@/lib/audioUtils';
import { cn } from '@/lib/utils';

interface MultiSignatureAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorized: () => void;
  actionName: string;
}

/**
 * Medida 6 & 11: Protocolo de Multi-Assinatura (Dual-Key)
 * Exige validação sequencial de Juiz e Coordenador para desativar o Modo Endurecido.
 */
export function MultiSignatureAuth({ isOpen, onClose, onAuthorized, actionName }: MultiSignatureAuthProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [signatures, setSignatures] = useState({ judge: false, coordinator: false });

  const handleVerified = (role: 'judge' | 'coordinator') => {
    setSignatures(prev => ({ ...prev, [role]: true }));
    
    if (role === 'judge') {
      setStep(2);
    } else {
      setTimeout(() => {
        onAuthorized();
        onClose();
        // Reset para próximo uso
        setStep(1);
        setSignatures({ judge: false, coordinator: false });
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-slate-950 border-2 border-red-600/50 p-0 overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.3)]">
        <div className="p-6 bg-red-600/10 border-b border-red-600/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
              <Key className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Protocolo Dual-Key</h3>
              <p className="text-[10px] text-red-400 font-black uppercase tracking-widest animate-pulse">Autorização de Alto Risco</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-start gap-4">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-black text-white uppercase">Ação Solicitada:</p>
              <p className="text-xs text-slate-400 font-medium">{actionName}</p>
            </div>
          </div>

          {/* Stepper Visual */}
          <div className="flex justify-center gap-4">
             <div className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
               signatures.judge ? "bg-success/10 border-success text-success" : step === 1 ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/10 text-slate-600"
             )}>
                {signatures.judge ? <CheckCircle2 className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                <span className="text-[10px] font-black uppercase">Magistrado</span>
             </div>
             <div className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
               signatures.coordinator ? "bg-success/10 border-success text-success" : step === 2 ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/10 text-slate-600"
             )}>
                {signatures.coordinator ? <CheckCircle2 className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                <span className="text-[10px] font-black uppercase">Coordenador</span>
             </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="judge"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <BiometricScanner 
                  operatorName="Juiz Dr. Silva"
                  onVerified={() => handleVerified('judge')}
                  className="border-primary/20 bg-primary/5"
                />
              </motion.div>
            ) : (
              <motion.div 
                key="coordinator"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <BiometricScanner 
                  operatorName="Coord. Operacional"
                  onVerified={() => handleVerified('coordinator')}
                  className="border-red-600/20 bg-red-600/5"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 bg-black/60 border-t border-white/5 text-center">
          <p className="text-[10px] font-mono text-slate-600 uppercase">
            Protocolo S5 // Criptografia Assimétrica RSA-4096 // IABS-SIP SECURE_CORE
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
