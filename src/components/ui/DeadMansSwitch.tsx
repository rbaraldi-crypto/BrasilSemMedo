import { motion, AnimatePresence } from 'framer-motion';
import { ShieldX } from 'lucide-react';
import { useUI } from '@/contexts/UIContext';
import { BiometricScanner } from '@/components/intelligence/BiometricScanner';
import { tacticalAudio } from '@/lib/audioUtils';

/**
 * DeadMansSwitch (S4): Interface de Bloqueio de Terminal.
 * 
 * ATUALIZAÇÃO: O bloqueio automático por inatividade foi removido conforme ordem superior.
 * O sistema agora responde apenas ao bloqueio manual (Sidebar/Voz).
 */
export function DeadMansSwitch() {
  const { isLocked, setLocked } = useUI();

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div 
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
          exit={{ opacity: 0, scale: 1.05, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[300] bg-slate-950/40 flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center border border-destructive/20"
              >
                <ShieldX className="h-10 w-10 text-destructive animate-pulse" />
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Terminal Bloqueado</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Protocolo S4: Aguardando Re-autenticação</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
              <BiometricScanner 
                operatorName="Juiz Dr. Silva"
                onVerified={() => {
                  setLocked(false);
                  tacticalAudio.playSuccess();
                }}
              />
              <p className="mt-6 text-[9px] text-slate-500 font-mono uppercase">
                Acesso restrito. O bloqueio automático por inatividade foi desativado neste terminal.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
