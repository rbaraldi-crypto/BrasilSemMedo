import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, ShieldAlert, 
  ArrowRight, Scale, Gavel, 
  CheckCircle2, BarChart3, 
  Shield, Clock, FileText, AlertCircle,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BehaviorComparativeChart } from './BehaviorComparativeChart';
import { PredictiveTransitionAlert } from './PredictiveTransitionAlert';
import { tacticalAudio } from '@/lib/audioUtils';

interface JuvenileTransitionWorkflowProps {
  age: number;
  inmateName: string;
  onComplete?: () => void;
}

/**
 * Medida 2: Redução da Idade Criminal & Transição Juvenil/Adulto
 * Workflow operacional para gestão de maioridade e crimes hediondos.
 */
export function JuvenileTransitionWorkflow({ age, inmateName, onComplete }: JuvenileTransitionWorkflowProps) {
  const [step, setStep] = useState(1);
  const isReducedAge = age >= 16;

  // Dados comparativos: Comportamento Juvenil vs Requisitos TREVA
  const behaviorData = [
    { name: 'Disciplina', juvenile: 82, adult: 45, fullMark: 100 },
    { name: 'Risco Fuga', juvenile: 15, adult: 92, fullMark: 100 },
    { name: 'Vínculo Facção', juvenile: 25, adult: 98, fullMark: 100 },
    { name: 'Trabalho/Estudo', juvenile: 88, adult: 12, fullMark: 100 },
    { name: 'Agressividade', juvenile: 40, adult: 85, fullMark: 100 },
  ];

  const steps = [
    { id: 1, title: 'Alertas Preditivos', icon: Clock },
    { id: 2, title: 'Análise de Risco', icon: BarChart3 },
    { id: 3, title: 'Reserva TREVA', icon: Shield },
    { id: 4, title: 'Protocolo Final', icon: Gavel },
  ];

  const handleNext = () => {
    tacticalAudio.playScan();
    setStep(prev => prev + 1);
  };

  return (
    <Card className="bg-slate-900 border-primary/30 shadow-2xl overflow-hidden">
      <CardHeader className="bg-primary/10 border-b border-white/5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-black text-white uppercase tracking-tight">Transição Juvenil/Adulto</CardTitle>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocolo Brasil Sem Medo - Ponto 2</p>
            </div>
          </div>
          <Badge className={cn("font-black text-[10px] px-3", isReducedAge ? "bg-red-600" : "bg-success")}>
            IDADE: {age} ANOS
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Stepper Visual Tático */}
        <div className="flex justify-between relative mb-10 px-4">
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div 
                animate={step === s.id ? { scale: [1, 1.1, 1], borderColor: ['#0ea5e9', '#fff', '#0ea5e9'] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                  step >= s.id ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]" : "bg-slate-950 border-white/10 text-slate-600"
                )}
              >
                <s.icon className="h-5 w-5" />
              </motion.div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest absolute -bottom-6 whitespace-nowrap",
                step === s.id ? "text-primary" : "text-slate-600"
              )}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <div className="min-h-[320px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                className="space-y-6"
              >
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs font-black uppercase">Monitoramento de Maioridade</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    O sistema monitora automaticamente a proximidade da maioridade penal (18a) ou do gatilho de crimes hediondos (16a).
                  </p>
                </div>
                <PredictiveTransitionAlert 
                  transitionDate={new Date(Date.now() + 85 * 24 * 60 * 60 * 1000).toISOString()} 
                  thresholdAge={16} 
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-500">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-xs font-black uppercase">Tracking de Incompatibilidade</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-400 font-mono">REINTEGRATION_VS_CUSTODY</Badge>
                </div>
                
                <BehaviorComparativeChart data={behaviorData} />
                
                <div className="p-3 bg-red-600/5 border border-red-600/20 rounded-xl">
                  <p className="text-[10px] text-red-200 leading-relaxed italic font-medium">
                    "A análise de rede detectou vínculos ativos com 'Sintonia Geral', justificando a transição imediata para o sistema TREVA sob a nova diretriz de segurança máxima."
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                className="space-y-6"
              >
                <div className="flex items-center gap-3 text-red-500 mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Alocação Estratégica TREVA</span>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
                        <Building2 className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase">Complexo Destino</p>
                        <p className="text-sm font-bold text-white uppercase">TREVA-01 (Norte)</p>
                      </div>
                    </div>
                    <Badge className="bg-success text-[10px] font-black">VAGA_CONFIRMADA</Badge>
                  </div>

                  <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Logística de Transferência</span>
                      <span className="text-[10px] font-mono text-primary">PRIORIDADE_ALTA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs text-slate-300 font-medium">Escolta tática pré-agendada para T+1 dia.</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.05 }} 
                className="flex flex-col items-center gap-6 text-center py-4"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-success rounded-full blur-2xl"
                  />
                  <div className="h-20 w-20 bg-success/10 rounded-full flex items-center justify-center border-2 border-success/40 relative z-10">
                    <CheckCircle2 className="h-10 w-10 text-success" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter">Protocolo Validado</h3>
                  <p className="text-xs text-slate-400 max-w-[240px] mx-auto font-medium">
                    Dossiê de transição ministerial gerado com base no Art. 155/157. Pronto para assinatura ICP-Brasil.
                  </p>
                </div>

                <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Hash de Integridade</span>
                    <span className="text-[10px] font-mono text-primary uppercase">SHA256:7F8A...C2E1</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Dossie_Transicao_{inmateName.replace(' ', '_')}.pdf</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/5">
          {step > 1 && step < 4 && (
            <Button 
              variant="outline"
              className="border-white/10 text-slate-400 hover:bg-white/5 font-black uppercase text-xs h-12 px-6"
              onClick={() => setStep(step - 1)}
            >
              Voltar
            </Button>
          )}
          
          {step < 4 ? (
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90 font-black uppercase text-xs tracking-widest h-12 shadow-lg shadow-primary/20"
              onClick={handleNext}
            >
              Avançar Protocolo <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              className="flex-1 bg-success hover:bg-success/90 text-white font-black uppercase text-xs tracking-widest h-12 shadow-lg shadow-success/20"
              onClick={() => {
                tacticalAudio.playSuccess();
                onComplete?.();
              }}
            >
              Efetivar Transição via ICP-Brasil
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
