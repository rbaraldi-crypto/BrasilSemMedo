import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { BrainCircuit, Sparkles, Check, RefreshCw, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { tacticalAudio } from '@/lib/audioUtils';

interface LegalJustificationAssistantProps {
  onSelect: (text: string) => void;
  crimeType: string;
}

export function LegalJustificationAssistant({ onSelect, crimeType }: LegalJustificationAssistantProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const { mutate: generateJustification, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      tacticalAudio.playScan();
      await new Promise(resolve => setTimeout(resolve, 2000));

      const justifications = [
        `Considerando a natureza do delito tipificado como crime hediondo e a classificação do apenado como integrante de organização narcoterrorista, nos termos do Art. 112, inciso VI, alínea 'a' da LEP (redação dada pela Lei 13.964/19), indefiro a progressão. A manutenção do regime fechado é imperativa para a garantia da ordem pública e asfixia operacional da facção.`,
        `Fundamentado no Art. 112, § 1º da LEP, verifico que a gravidade concreta do crime e o vínculo ativo com a estrutura financeira da organização impedem a concessão de benefícios. O protocolo Brasil Sem Medo estabelece o isolamento total como medida de segurança nacional, sobrepondo-se ao requisito puramente temporal.`,
        `A análise de inteligência via IABS-SIP confirma o alto risco de reincidência específica. Diante do Modo Endurecido ativo, a fundamentação jurídica baseia-se na ausência de mérito subjetivo e na necessidade de segregação de lideranças P1, conforme diretrizes ministeriais vigentes.`
      ];

      return justifications[Math.floor(Math.random() * justifications.length)];
    },
    onSuccess: (data) => {
      setDraft(data);
      tacticalAudio.playSuccess();
    }
  });

  return (
    <div className="bg-slate-900/50 border border-primary/20 rounded-2xl overflow-hidden">
      <div className="p-4 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-primary" />
          <span className="text-xs font-black text-white uppercase tracking-widest">Assistente IA Jurídica</span>
        </div>
        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">LLM_LEP_V2.6</Badge>
      </div>

      <div className="p-5 space-y-4">
        {!draft && !isGenerating && (
          <div className="flex flex-col items-center py-4 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
              <Sparkles className="h-6 w-6 text-primary/40" />
            </div>
            <p className="text-xs text-slate-500 font-medium max-w-[200px]">
              Gere uma fundamentação técnica baseada no Art. 112 da LEP para este caso.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => generateJustification()}
              className="h-8 text-[10px] font-black uppercase border-primary/30 text-primary hover:bg-primary/10"
            >
              Minutar Justificativa
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="py-8 flex flex-col items-center gap-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full"
            />
            <span className="text-[10px] font-mono text-primary animate-pulse uppercase">Processando Jurisprudência...</span>
          </div>
        )}

        <AnimatePresence>
          {draft && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 bg-black/40 border border-white/5 rounded-xl relative group">
                <p className="text-sm text-slate-300 leading-relaxed italic">&quot;{draft}&quot;</p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Scale className="h-3 w-3 text-primary/40" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-[10px] font-black uppercase h-9"
                  onClick={() => onSelect(draft)}
                >
                  <Check className="h-3.5 w-3.5 mr-2" /> Aplicar ao Despacho
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 border-white/10"
                  onClick={() => generateJustification()}
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
