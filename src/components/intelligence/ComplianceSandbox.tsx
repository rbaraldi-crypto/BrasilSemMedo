import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, 
  Scale, Zap, Info, CheckCircle2, XCircle,
  BarChart3, Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { tacticalAudio } from '@/lib/audioUtils';

interface ComplianceSandboxProps {
  caseType: string;
  actionType: string;
  isPoint11: boolean;
  onValidated: (score: number) => void;
}

export function ComplianceSandbox({ caseType, actionType, isPoint11, onValidated }: ComplianceSandboxProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const runSimulation = async () => {
    setIsSimulating(true);
    setResult(null);
    setAcknowledged(false);
    tacticalAudio.playScan();

    // Simulação de processamento de IA Jurídica
    await new Promise(resolve => setTimeout(resolve, 2000));

    let score = 95; // Score base de conformidade
    const violations = [];

    // Lógica Ponto 11
    if (isPoint11 && actionType === 'concessao') {
      score = 15;
      violations.push({
        id: 'P11',
        title: 'Violação Ponto 11',
        desc: 'Tentativa de progressão em crime hediondo/narcoterrorista.',
        severity: 'CRITICAL'
      });
    } else if (actionType === 'concessao') {
      score = 82; // Risco moderado para concessões comuns
    }

    const simulationResult = {
      score,
      status: score > 70 ? 'CONFORME' : score > 40 ? 'ALERTA' : 'BLOQUEADO',
      violations,
      timestamp: new Date().toISOString()
    };

    setResult(simulationResult);
    setIsSimulating(false);
    tacticalAudio.playSuccess();
  };

  const handleAcknowledge = () => {
    setAcknowledged(true);
    if (result) onValidated(result.score);
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <span className="text-xs font-black text-white uppercase tracking-widest">Sandbox de Conformidade</span>
        </div>
        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">PONTO 11 ENGINE v1.0</Badge>
      </div>

      <div className="p-6 space-y-6">
        {!result && !isSimulating && (
          <div className="text-center space-y-4 py-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Pronto para Simulação</h4>
              <p className="text-xs text-slate-500 mt-1">Analise o impacto jurídico desta decisão antes de assinar.</p>
            </div>
            <Button 
              onClick={runSimulation}
              className="w-full bg-primary hover:bg-primary/90 font-black uppercase text-xs tracking-widest h-11"
            >
              Simular Impacto Jurídico
            </Button>
          </div>
        )}

        {isSimulating && (
          <div className="py-8 space-y-6">
            <div className="flex justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xs font-black text-primary animate-pulse uppercase tracking-[0.2em]">Cruzando Diretrizes Brasil Sem Medo...</p>
              <div className="flex gap-1 justify-center">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                    className="h-1 w-2 bg-primary rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Score de Conformidade</span>
                <div className={cn(
                  "text-3xl font-black tracking-tighter",
                  result.score > 70 ? "text-success" : result.score > 40 ? "text-warning" : "text-destructive"
                )}>
                  {result.score}/100
                </div>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full border font-black text-[10px] uppercase tracking-widest",
                result.score > 70 ? "bg-success/10 border-success/20 text-success" : "bg-destructive/10 border-destructive/20 text-destructive"
              )}>
                {result.status}
              </div>
            </div>

            <Progress 
              value={result.score} 
              className="h-2" 
              indicatorClassName={result.score > 70 ? "bg-success" : result.score > 40 ? "bg-warning" : "bg-destructive"}
            />

            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Análise de Riscos</span>
              {result.violations.length > 0 ? (
                result.violations.map((v: any) => (
                  <div key={v.id} className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
                    <ShieldAlert className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-destructive uppercase">{v.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{v.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-success/10 border border-success/20 rounded-xl flex items-start gap-3">
                  <ShieldCheck className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-success uppercase">Conformidade Plena</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Nenhuma violação aos 12 pontos detectada.</p>
                  </div>
                </div>
              )}
            </div>

            <Button 
              variant={acknowledged ? "outline" : "default"}
              onClick={handleAcknowledge}
              disabled={acknowledged}
              className={cn(
                "w-full font-black uppercase text-xs tracking-widest h-11",
                acknowledged ? "border-success text-success" : ""
              )}
            >
              {acknowledged ? (
                <><CheckCircle2 className="h-4 w-4 mr-2" /> Relatório Validado</>
              ) : (
                "Confirmar Ciência do Risco"
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Badge({ children, variant, className }: any) {
  return (
    <div className={cn(
      "px-2 py-0.5 rounded text-[10px] font-black uppercase border",
      variant === 'outline' ? "border-white/10 text-slate-400" : "bg-primary text-white border-primary",
      className
    )}>
      {children}
    </div>
  );
}
