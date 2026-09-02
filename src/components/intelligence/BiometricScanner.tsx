import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tacticalAudio } from '@/lib/audioUtils';
import { logger } from '@/lib/logger';

interface BiometricScannerProps {
  onVerified: () => void;
  operatorName: string;
  className?: string;
}

export function BiometricScanner({ onVerified, operatorName, className }: BiometricScannerProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const HOLD_DURATION = 2500;

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
  }, []);

  const completeVerification = useCallback(() => {
    setIsVerified(true);
    setIsPressing(false);
    clearAllTimers();
    tacticalAudio.playMatch();
    logger.info('BiometricScanner', `Autenticação confirmada para: ${operatorName}`);
    onVerified();
  }, [clearAllTimers, operatorName, onVerified]);

  const startScanning = useCallback(() => {
    if (isVerified) return;
    setIsPressing(true);
    tacticalAudio.playScan();

    audioIntervalRef.current = setInterval(() => {
      tacticalAudio.playScan();
    }, 600);

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setProgress(newProgress);
      if (newProgress >= 100) {
        completeVerification();
      }
    }, 50);
  }, [isVerified, completeVerification]);

  const stopScanning = useCallback(() => {
    if (isVerified) return;
    setIsPressing(false);
    setProgress(0);
    clearAllTimers();
  }, [isVerified, clearAllTimers]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return (
    <div className={cn("relative p-6 bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden", className)}>
      <div className="flex flex-col items-center gap-6">
        <div className="text-center space-y-1">
          <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Autenticação Biométrica</h4>
          <p className="text-xs text-slate-400 font-medium">Mantenha pressionado para assinar via ICP-Brasil</p>
        </div>

        <div
          className="relative h-32 w-32 flex items-center justify-center cursor-pointer select-none touch-none"
          onMouseDown={startScanning}
          onMouseUp={stopScanning}
          onMouseLeave={stopScanning}
          onTouchStart={startScanning}
          onTouchEnd={stopScanning}
          role="button"
          aria-label="Área de autenticação biométrica - Mantenha pressionado"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              startScanning();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              stopScanning();
            }
          }}
        >
          <div className={cn(
            "absolute inset-0 rounded-full border-2 transition-all duration-300",
            isVerified ? "border-success bg-success/10 shadow-[0_0_20px_rgba(34,197,94,0.3)]" :
            isPressing ? "border-primary bg-primary/5 scale-110" : "border-white/10 bg-black/20"
          )} />

          <svg className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <circle
              cx="64" cy="64" r="60"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className={cn("transition-all duration-100", isVerified ? "text-success" : "text-primary")}
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * progress) / 100}
            />
          </svg>

          <AnimatePresence mode="wait">
            {isVerified ? (
              <motion.div key="verified" initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10">
                <ShieldCheck className="h-12 w-12 text-success" />
              </motion.div>
            ) : (
              <motion.div
                key="scanning"
                className="relative z-10"
                animate={isPressing ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Fingerprint className={cn("h-12 w-12 transition-colors", isPressing ? "text-primary" : "text-slate-600")} />
              </motion.div>
            )}
          </AnimatePresence>

          {isPressing && (
            <motion.div
              className="absolute left-4 right-4 h-0.5 bg-primary/50 shadow-[0_0_10px_#0B3C5D] z-20"
              initial={{ top: "20%" }}
              animate={{ top: "80%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              aria-hidden="true"
            />
          )}
        </div>

        <div className="w-full space-y-3">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-slate-500 uppercase">Operador:</span>
            <span className="text-white font-bold">{operatorName}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-slate-500 uppercase">Status:</span>
            <span className={cn("font-bold", isVerified ? "text-success" : isPressing ? "text-primary animate-pulse" : "text-slate-500")}>
              {isVerified ? "IDENTIDADE VINCULADA" : isPressing ? "LENDO DIGITAL..." : "AGUARDANDO SENSOR"}
            </span>
          </div>
        </div>

        {isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded text-[10px] font-black text-success uppercase tracking-widest"
          >
            <ShieldCheck className="h-3 w-3" />
            Certificado ICP-Brasil: VALIDADO
          </motion.div>
        )}
      </div>
    </div>
  );
}
