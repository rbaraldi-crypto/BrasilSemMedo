import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FieldMessage } from '@/types/intelligence';

interface FieldChatProps {
  messages: FieldMessage[];
  unitCallsign: string;
}

export function FieldChat({ messages, unitCallsign }: FieldChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-inner">
      <div className="bg-slate-900/80 border-b border-white/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-3 w-3 text-primary animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Link de Campo: {unitCallsign}</span>
        </div>
        <Badge variant="outline" className="text-[10px] border-success/30 text-success uppercase">Criptografado</Badge>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <MessageSquare className="h-8 w-8 mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Aguardando Handshake...</p>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-tighter px-1.5 rounded",
                    msg.type === 'ALERT' ? "bg-red-500/20 text-red-400" : 
                    msg.type === 'ACTION' ? "bg-primary/20 text-primary" : "bg-white/5 text-slate-400"
                  )}>
                    {msg.type}
                  </span>
                </div>
                <div className={cn(
                  "p-2.5 rounded-lg text-xs font-medium leading-relaxed border",
                  msg.type === 'ALERT' ? "bg-red-500/5 border-red-500/20 text-red-200" : 
                  msg.type === 'ACTION' ? "bg-primary/5 border-primary/20 text-primary-foreground" : 
                  "bg-white/5 border-white/5 text-slate-300"
                )}>
                  {msg.text}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="p-2 bg-slate-900/40 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-mono text-slate-500 uppercase">Sinal: -42dBm</span>
        </div>
        <span className="text-[10px] font-mono text-slate-600">AES-256_LINK_V4</span>
      </div>
    </div>
  );
}
