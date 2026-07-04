import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartHandshake, Lock, Key, ArrowRight, 
  History, Calendar, DollarSign, CheckCircle2,
  ExternalLink, ShieldCheck, Eye, EyeOff,
  AlertCircle, Download, Landmark, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { tacticalAudio } from '@/lib/audioUtils';

/**
 * Medida 10: Portal de Transparência da Vítima
 * Interface de acesso restrito para famílias acompanharem reparações.
 */
export function VictimTransparencyPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (token.length === 6) {
      setIsVerifying(true);
      tacticalAudio.playScan();
      
      // Simulação de verificação de token ministerial
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      tacticalAudio.playSuccess();
      setIsAuthenticated(true);
      setIsVerifying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-950 rounded-2xl border border-white/10 relative overflow-hidden">
        {/* Efeito de Scanline Superior */}
        <div className="absolute top-0 left-0 w-full h-1 bg-success/30 animate-pulse" />
        
        <div className="max-w-sm w-full space-y-8 text-center relative z-10">
          <div className="space-y-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-24 w-24 bg-success/10 rounded-[2rem] flex items-center justify-center mx-auto border border-success/20 shadow-[0_0_40px_rgba(34,197,94,0.1)] relative"
            >
              <Lock className="h-12 w-12 text-success" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-success/20 rounded-[2rem]"
              />
            </motion.div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Portal da Família</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight max-w-[280px] mx-auto">
                Insira o Token Ministerial de 6 dígitos para acessar o extrato de reparação
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="relative group">
              <Input 
                ref={inputRef}
                type={showToken ? "text" : "password"}
                placeholder="· · · · · ·"
                maxLength={6}
                disabled={isVerifying}
                className={cn(
                  "h-16 bg-black/60 border-white/10 text-center font-mono text-3xl tracking-[0.5em] focus:border-success transition-all duration-300 rounded-2xl",
                  token.length === 6 ? "border-success text-success shadow-[0_0_20px_rgba(34,197,94,0.1)]" : ""
                )}
                value={token}
                onKeyDown={handleKeyDown}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
              />
              <button 
                onClick={() => setShowToken(!showToken)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
              >
                {showToken ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-center gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div 
                  key={i} 
                  animate={token.length > i ? { scale: [1, 1.2, 1], backgroundColor: '#22c55e' } : {}}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    token.length > i ? "shadow-[0_0_10px_#22c55e]" : "bg-white/10"
                  )} 
                />
              ))}
            </div>

            <Button 
              className={cn(
                "w-full h-14 font-black uppercase text-xs tracking-widest transition-all duration-500 rounded-2xl",
                token.length === 6 
                  ? "bg-success hover:bg-success/90 text-white shadow-lg shadow-success/20" 
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              )}
              onClick={handleLogin}
              disabled={token.length !== 6 || isVerifying}
            >
              {isVerifying ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <History className="h-5 w-5" />
                </motion.div>
              ) : (
                <>Autenticar Acesso <ArrowRight className="h-4 w-4 ml-2" /></>
              )}
            </Button>
          </div>

          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-start gap-3 text-left">
            <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
              PROTOCOLO DE SEGURANÇA: O token é alterado a cada 30 dias por medida de segurança ministerial. Em caso de perda, procure o Ministério Público.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col bg-slate-950 rounded-2xl border border-success/30 overflow-hidden shadow-2xl"
    >
      {/* Header do Portal */}
      <div className="p-6 bg-success/10 border-b border-success/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-success/20 rounded-2xl flex items-center justify-center border border-success/30">
            <HeartHandshake className="h-6 w-6 text-success" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white uppercase tracking-tight">Família Souza</span>
              <Badge variant="outline" className="text-[8px] border-success/30 text-success font-mono">TOKEN_VERIFIED</Badge>
            </div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Programa Brasil Sem Medo // Reparação de Danos</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 px-4 text-[10px] font-black uppercase text-slate-400 hover:text-white hover:bg-red-600/10 hover:text-red-500 transition-all" 
          onClick={() => {
            tacticalAudio.playScan();
            setIsAuthenticated(false);
            setToken('');
          }}
        >
          Encerrar Sessão
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {/* Cards de Métricas Financeiras */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 shadow-inner group hover:border-primary/30 transition-colors">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-3 flex items-center gap-2">
              <Landmark className="h-3 w-3" /> Total da Reparação
            </p>
            <p className="text-3xl font-black text-white tracking-tighter">R$ 45.200,00</p>
            <p className="text-[8px] text-slate-600 mt-2 font-mono italic">Sentença: Proc. 0008921-33</p>
          </div>
          <div className="p-6 bg-success/5 rounded-3xl border border-success/20 shadow-inner group hover:border-success/40 transition-colors">
            <p className="text-[10px] font-black text-success uppercase mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" /> Pago até agora
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-success tracking-tighter">R$ 12.500,00</p>
              <span className="text-xs text-success/60 font-black">(27%)</span>
            </div>
            <div className="mt-3 h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '27%' }} className="h-full bg-success" />
            </div>
          </div>
          <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20 shadow-inner group hover:border-primary/40 transition-colors">
            <p className="text-[10px] font-black text-primary uppercase mb-3 flex items-center gap-2">
              <Calendar className="h-3 w-3" /> Próximo Repasse
            </p>
            <p className="text-3xl font-black text-primary tracking-tighter">12/06/2024</p>
            <p className="text-[8px] text-primary/60 mt-2 font-bold uppercase">Agendamento Automático SISBAJUD</p>
          </div>
        </div>

        {/* Histórico de Pagamentos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <History className="h-4 w-4" /> Histórico de Repasses Mensais
            </span>
            <Button variant="outline" size="sm" className="h-7 text-[8px] font-black uppercase border-white/10">
              <Download className="h-3 w-3 mr-1" /> Exportar Extrato
            </Button>
          </div>
          
          <div className="grid gap-3">
            {[
              { date: '12/05/2024', amount: '1.250,00', status: 'EFETIVADO', ref: 'REF-8821-A', bank: 'CAIXA' },
              { date: '12/04/2024', amount: '1.250,00', status: 'EFETIVADO', ref: 'REF-7710-B', bank: 'CAIXA' },
              { date: '12/03/2024', amount: '1.250,00', status: 'EFETIVADO', ref: 'REF-6604-C', bank: 'CAIXA' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-success/20 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center border border-success/20 group-hover:scale-110 transition-transform">
                    <DollarSign className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white tracking-tight">Repasse Mensal - {item.bank}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{item.date} // {item.ref}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-mono font-black text-white">R$ {item.amount}</p>
                  <div className="flex items-center justify-end gap-1.5 text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{item.status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status Jurídico e Decisão */}
        <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-5 relative overflow-hidden">
          <div className="flex items-center gap-3 text-primary relative z-10">
            <ShieldCheck className="h-6 w-6" />
            <span className="text-xs font-black uppercase tracking-widest">Status Jurídico da Reparação</span>
          </div>
          <p className="text-sm text-slate-300 font-medium leading-relaxed relative z-10 max-w-2xl">
            A reiteração do bloqueio via SISBAJUD foi confirmada pelo magistrado da Vara de Execuções Penais. 
            O redirecionamento dos ativos do detento <span className="text-white font-bold">Carlos Eduardo da Silva</span> está garantido conforme a Lei do Programa Brasil Sem Medo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 relative z-10 pt-2">
            <Button variant="outline" className="h-11 border-primary/30 text-primary text-[10px] font-black uppercase hover:bg-primary/10 flex-1">
              <FileText className="h-4 w-4 mr-2" /> Visualizar Decisão Judicial
            </Button>
            <Button variant="outline" className="h-11 border-primary/30 text-primary text-[10px] font-black uppercase hover:bg-primary/10 flex-1">
              <ExternalLink className="h-4 w-4 mr-2" /> Portal do TJSP (Processo)
            </Button>
          </div>
          {/* Marca d'água de fundo */}
          <ShieldCheck className="absolute -right-6 -bottom-6 h-32 w-32 text-primary/5 rotate-12" />
        </div>
      </div>
    </motion.div>
  );
}
