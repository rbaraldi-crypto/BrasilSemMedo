import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight, Zap, Target, Landmark } from 'lucide-react';

const steps = [
  {
    title: "Briefing Inicial",
    desc: "Bem-vindo ao IABS-SIP. Este terminal operacionaliza os 12 pontos do programa Brasil Sem Medo.",
    icon: ShieldCheck
  },
  {
    title: "Comando Rápido",
    desc: "Use CTRL+K para abrir a Paleta de Comandos ou F1-F4 para navegação tática instantânea.",
    icon: Zap
  },
  {
    title: "Muralha Brasileira",
    desc: "O Ponto 9 integra 1 milhão de câmeras com reconhecimento facial para match biométrico em tempo real.",
    icon: Target
  },
  {
    title: "Asfixia Financeira",
    desc: "O Ponto 1 utiliza o SISBAJUD para bloquear ativos de facções narcoterroristas automaticamente.",
    icon: Landmark
  }
];

export function TacticalTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('iabs_sip_tour_v1');
    if (!hasSeenTour) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
      localStorage.setItem('iabs_sip_tour_v1', 'true');
    }
  };

  if (!isVisible) return null;

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="max-w-md w-full"
        >
          <Card className="bg-slate-900 border-primary shadow-[0_0_50px_rgba(50,140,193,0.3)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse" />
            <CardHeader className="pb-2">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 border border-primary/30">
                <StepIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold text-white uppercase tracking-tighter">
                {steps[currentStep].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-400 text-sm leading-relaxed">
                {steps[currentStep].desc}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-1">
                  {steps.map((_, i) => (
                    <div key={i} className={cn("h-1 w-4 rounded-full transition-all", i === currentStep ? "bg-primary w-8" : "bg-slate-800")} />
                  ))}
                </div>
                <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest gap-2">
                  {currentStep === steps.length - 1 ? "Iniciar Missão" : "Próximo"}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
