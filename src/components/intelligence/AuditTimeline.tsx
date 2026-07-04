import { useIntelligence } from '@/contexts/IntelligenceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, ShieldCheck, Scan, Gavel, 
  Radio, Landmark, FileText, Hash, 
  User, Clock, CheckCircle2, Lock,
  Link as LinkIcon, Database, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * 3. Technical Infrastructure: Blockchain Integrity Proof
 * Visualiza o log de auditoria como blocos encadeados para garantir imutabilidade.
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
      case 'NARCO_ALERT': return Shield;
      default: return History;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'MURALHA': return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
      case 'DISPATCH': return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'LEGAL': return 'text-primary border-primary/30 bg-primary/10';
      case 'SISBAJUD': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'NARCO_ALERT': return 'text-red-600 border-red-600/30 bg-red-600/10';
      default: return 'text-slate-400 border-white/10 bg-white/5';
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-slate-950", isEmbedded ? "p-0" : "p-6")}>
      <div className="flex items-center justify-between mb-6 px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <Database className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">Ledger de Integridade</h3>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Cadeia de Custódia Blockchain</p>
          </div>
        </div>
        <Badge variant="outline" className="border-success/30 text-success font-mono text-[8px] font-black px-2 py-0.5 animate-pulse">
          BLOCK_SYNC: ACTIVE
        </Badge>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 pb-10">
          <AnimatePresence initial={false}>
            {auditLog.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                <History className="h-12 w-12 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Aguardando Genesis Block...</p>
              </div>
            ) : (
              auditLog.map((log, idx) => {
                const Icon = getIcon(log.type);
                const colorClass = getColor(log.type);
                
                return (
                  <motion.div 
                    key={log.audit_hash || idx}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="relative"
                  >
                    {/* Blockchain Link Visual */}
                    {idx < auditLog.length - 1 && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-0">
                        <LinkIcon className="h-4 w-4 text-slate-800" />
                      </div>
                    )}

                    {/* Block Container */}
                    <div className="bg-slate-900/80 border-2 border-white/5 rounded-2xl overflow-hidden shadow-2xl relative z-10 group hover:border-primary/30 transition-all duration-500">
                      {/* Block Header */}
                      <div className="bg-black/40 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono text-primary font-black">BLOCK #{log.block_index || idx}</span>
                          <div className="h-1 w-1 rounded-full bg-slate-700" />
                          <span className="text-[8px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <Badge variant="outline" className={cn("text-[7px] font-black uppercase h-4 px-1.5", colorClass)}>
                          {log.type}
                        </Badge>
                      </div>

                      {/* Block Body */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className={cn("h-10 w-10 rounded-xl border flex items-center justify-center shrink-0", colorClass)}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-white uppercase truncate">{log.targetName}</p>
                            <p className="text-[9px] text-slate-400 leading-relaxed mt-1 line-clamp-2">{log.details}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-[8px] font-mono text-slate-600">
                            <User className="h-2.5 w-2.5" />
                            {log.operator_id || "JUIZ-SILVA-8921"}
                          </div>
                          <div className="flex items-center justify-end gap-1.5 text-success">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            <span className="text-[7px] font-black uppercase">Sealed</span>
                          </div>
                        </div>
                      </div>

                      {/* Block Footer (Hashes) */}
                      <div className="bg-black/20 px-4 py-1.5 border-t border-white/5 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[6px] font-mono text-slate-600 uppercase">Prev_Hash:</span>
                          <span className="text-[6px] font-mono text-slate-500 truncate max-w-[150px]">{log.previous_hash || "0000000000000000"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[6px] font-mono text-primary/60 uppercase">Curr_Hash:</span>
                          <span className="text-[6px] font-mono text-primary truncate max-w-[150px] font-bold">{log.audit_hash || "8F4B2E1...A9C3"}</span>
                        </div>
                      </div>

                      {/* Seal Animation Overlay */}
                      <motion.div 
                        initial={{ opacity: 1, scale: 2 }}
                        animate={{ opacity: 0, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute inset-0 bg-success/10 pointer-events-none flex items-center justify-center"
                      >
                         <ShieldCheck className="h-20 w-20 text-success/20" />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="p-4 bg-slate-900/80 border-t border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
           <Lock className="h-3 w-3 text-slate-500" />
           <span className="text-[8px] font-mono text-slate-500 uppercase">Imutabilidade Garantida</span>
        </div>
        <button className="text-[8px] font-black text-primary uppercase hover:underline flex items-center gap-1">
          <Hash className="h-2.5 w-2.5" /> Validar Cadeia (ICP)
        </button>
      </div>
    </div>
  );
}
