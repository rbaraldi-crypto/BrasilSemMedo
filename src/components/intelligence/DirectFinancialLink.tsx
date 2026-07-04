import { motion } from 'framer-motion';
import { Landmark, ArrowRight, Users, DollarSign, ShieldCheck, CreditCard, Activity, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DirectFinancialLinkProps {
  inmateName: string;
  victimFamily: string;
  amount: number;
  protocolId: string;
}

/**
 * Medida 10: Direct Financial Link
 * Visualização tática do "Caminho do Dinheiro" (Inmate -> Victim).
 * Demonstra o redirecionamento de ativos bloqueados via SISBAJUD.
 */
export function DirectFinancialLink({ inmateName, victimFamily, amount, protocolId }: DirectFinancialLinkProps) {
  return (
    <div className="p-6 bg-slate-950 border border-success/30 rounded-3xl relative overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.1)]">
      {/* Grade de Fundo Tática */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />

      <div className="relative z-10 space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-success">
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Fluxo de Reparação Ativo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase">Protocolo: {protocolId}</span>
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-ping" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
          {/* Origem: SISBAJUD / Inmate */}
          <div className="flex flex-col items-center gap-3 w-40 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="h-20 w-20 rounded-2xl bg-slate-900 border border-red-500/30 flex items-center justify-center shadow-xl relative group"
            >
              <Landmark className="h-10 w-10 text-primary group-hover:text-red-500 transition-colors" />
              <div className="absolute -top-2 -right-2 bg-red-600 text-[7px] font-black px-1.5 py-0.5 rounded border border-white/20">BLOQUEADO</div>
            </motion.div>
            <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-500 uppercase">Origem (Ativos Detento)</p>
              <p className="text-[11px] font-bold text-white truncate w-full">{inmateName}</p>
              <p className="text-[7px] font-mono text-red-400/60">SISBAJUD_REF: 8821-X</p>
            </div>
          </div>

          {/* Caminho Animado (Money Path) */}
          <div className="flex-1 h-24 relative flex items-center justify-center min-w-[200px]">
            <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="moneyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <motion.path
                d="M 10 20 L 190 20"
                stroke="url(#moneyGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="10 15"
                animate={{ strokeDashoffset: [-25, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              {/* Partículas de Dinheiro/Dados */}
              {[0, 1, 2, 3].map((i) => (
                <motion.circle
                  key={i}
                  r="2.5"
                  fill="#22c55e"
                  initial={{ cx: 10 }}
                  animate={{ cx: 190 }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.5, ease: "easeInOut" }}
                />
              ))}
            </svg>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <div className="bg-slate-900 border border-success/50 px-4 py-1.5 rounded-full shadow-2xl backdrop-blur-md">
                <span className="text-xs font-black text-success font-mono">R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center gap-1 text-[7px] font-black text-slate-500 uppercase tracking-tighter">
                <TrendingDown className="h-2 w-2" /> Redirecionamento Direto
              </div>
            </div>
          </div>

          {/* Destino: Família da Vítima */}
          <div className="flex flex-col items-center gap-3 w-40 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="h-20 w-20 rounded-2xl bg-success/10 border border-success/30 flex items-center justify-center shadow-xl group"
            >
              <Users className="h-10 w-10 text-success group-hover:scale-110 transition-transform" />
            </motion.div>
            <div className="space-y-1">
              <p className="text-[8px] font-black text-success uppercase">Destino (Família Vítima)</p>
              <p className="text-[11px] font-bold text-white truncate w-full">{victimFamily}</p>
              <p className="text-[7px] font-mono text-success/60">CONTA_VINCULADA: ****8921</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 group hover:border-primary/30 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[7px] font-black text-slate-500 uppercase">Instituição de Repasse</p>
              <p className="text-[9px] font-bold text-slate-300">CAIXA ECONÔMICA FEDERAL</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-success/5 rounded-2xl border border-success/20 group hover:border-success/40 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-[7px] font-black text-slate-500 uppercase">Validação ICP-Brasil</p>
              <p className="text-[9px] font-bold text-success uppercase">Assinatura Digital OK</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
