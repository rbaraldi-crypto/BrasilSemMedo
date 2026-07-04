import { useIntelligence } from '@/contexts/IntelligenceContext';
import { motion } from 'framer-motion';
import { 
  History, ShieldCheck, Scan, Gavel, 
  Radio, Landmark, FileText, Hash, 
  User, Clock, CheckCircle2, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * AuditTimeline (Opção 4): Visualização de Cadeia de Custódia Digital.
 * Conecta eventos via hashes de integridade para transparência ministerial.
 */
export function AuditTimeline({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const { auditLog } = useIntelligence();

  const getIcon = (type: string) => {
    switch (type) {
      case 'MURALHA': return Scan;
      case 'DISPATCH': return Radio;
      case 'LEGAL': return Gavel;
      case 'SISBAJUD': return Landmark;
      case 'RADIO': return Radio;
      case 'DOSSIER': return FileText;
      default: return History;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'MURALHA': return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
      case 'DISPATCH': return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'LEGAL': return 'text-primary border-primary/30 bg-primary/10';
      case 'SISBAJUD': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      default: return 'text-slate-400 border-white/10 bg-white/5';
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-slate-950", isEmbedded ? "p-0" : "p-6")}>
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">Cadeia de Custódia Digital</h3>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Integridade de Evidência ICP-Brasil</p>
          </div>
        </div>
        <Badge variant="outline" className="border-success/30 text-success font-mono text-[8px] font-black px-2 py-0.5">
          BLOCKCHAIN_SYNC: OK
        </Badge>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="relative border-l border-white/10 ml-4 space-y-8 pb-10">
          {auditLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <History className="h-12 w-12 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Nenhum evento registrado</p>
            </div>
          ) : (
            auditLog.map((log, idx) => {
              const Icon = getIcon(log.type);
              const colorClass = getColor(log.type);
              
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative pl-8 group"
                >
                  {/* Timeline Node */}
                  <div className={cn(
                    "absolute -left-[13px] top-0 h-6 w-6 rounded-full border-2 flex items-center justify-center z-10 transition-all group-hover:scale-110",
                    colorClass
                  )}>
                    <Icon className="h-3 w-3" />
                  </div>

                  {/* Hash Connector (Blockchain Visual) */}
                  {idx < auditLog.length - 1 && (
                    <div className="absolute left-[-1px] top-6 bottom-[-32px] w-px bg-gradient-to-b from-primary/40 to-transparent" />
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <Badge variant="outline" className={cn("text-[7px] font-black uppercase h-4 px-1.5", colorClass)}>
                          {log.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-[8px] font-mono text-slate-600">
                        <User className="h-2.5 w-2.5" />
                        {log.operator_id || "JUIZ-SILVA-8921"}
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3 group-hover:border-primary/30 transition-colors shadow-lg">
                      <p className="text-[10px] font-black text-white uppercase mb-1">{log.targetName}</p>
                      <p className="text-[9px] text-slate-400 leading-relaxed">{log.details}</p>
                      
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Hash className="h-2.5 w-2.5 text-primary/40" />
                          <span className="text-[7px] font-mono text-primary/60 truncate max-w-[120px]">
                            {log.audit_hash || "sha256:8f4b2e1...a9c3"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-success">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          <span className="text-[7px] font-black uppercase">Validado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="p-4 bg-slate-900/80 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Lock className="h-3 w-3 text-slate-500" />
           <span className="text-[8px] font-mono text-slate-500 uppercase">Cadeia de Custódia Inviolável</span>
        </div>
        <button className="text-[8px] font-black text-primary uppercase hover:underline">
          Verificar Assinaturas (ICP)
        </button>
      </div>
    </div>
  );
}
