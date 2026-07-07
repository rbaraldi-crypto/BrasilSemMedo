import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartHandshake, DollarSign, ArrowRight, Users, 
  ShieldCheck, History, LayoutGrid, Eye, 
  ArrowLeft, Landmark, Activity, Lock,
  ShieldAlert, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { DirectFinancialLink } from './DirectFinancialLink';
import { VictimTransparencyPortal } from './VictimTransparencyPortal';
import { tacticalAudio } from '@/lib/audioUtils';

/**
 * Medida 10: Módulo de Apoio às Vítimas (Ponto 10)
 * Gerencia o redirecionamento de ativos de detentos para famílias de vítimas.
 */
export function VictimSupportModule({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const [view, setView] = useState<'LIST' | 'FLOW' | 'PORTAL'>('LIST');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [records] = useState([
    { id: 'VS-001', inmate: 'Carlos Eduardo', victim: 'Família Souza', amount: 45200.00, monthly: 1250.00, progress: 27, status: 'ACTIVE', protocol: 'SIS-882144' },
    { id: 'VS-002', inmate: 'Marcos Paulo', victim: 'Família Oliveira', amount: 32400.00, monthly: 890.00, progress: 15, status: 'PENDING', protocol: 'SIS-109233' },
    { id: 'VS-003', inmate: 'Ricardo Silva', victim: 'Família Santos', amount: 12000.00, monthly: 2100.00, progress: 100, status: 'COMPLETED', protocol: 'SIS-991200' },
  ]);

  const handleOpenFlow = (record: any) => {
    tacticalAudio.playScan();
    setSelectedRecord(record);
    setView('FLOW');
  };

  const handleOpenPortal = () => {
    tacticalAudio.playSuccess();
    setView('PORTAL');
  };

  const Header = (
    <div className="p-5 bg-slate-900 border-b border-white/10 flex items-center justify-between shrink-0 relative z-50">
      <div className="flex items-center gap-4">
        {view !== 'LIST' && (
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-white/5" onClick={() => setView('LIST')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="h-10 w-10 bg-success/20 rounded-2xl flex items-center justify-center border border-success/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          <HeartHandshake className="h-6 w-6 text-success" />
        </div>
        <div className="text-left">
          <h4 className="text-base font-black text-white uppercase tracking-tighter italic">Apoio às Vítimas (P10)</h4>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Redirecionamento de Ativos SISBAJUD</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant={view === 'PORTAL' ? 'default' : 'outline'} 
          size="sm" 
          className={cn(
            "h-10 px-5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl",
            view === 'PORTAL' 
              ? "bg-success text-white shadow-[0_0_25px_rgba(34,197,94,0.4)]" 
              : "border-success/50 text-success hover:bg-success/10 animate-pulse"
          )}
          onClick={handleOpenPortal}
        >
          <Lock className="h-4 w-4 mr-2" /> Portal Família
        </Button>
      </div>
    </div>
  );

  const Content = (
    <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-950">
      <AnimatePresence mode="wait">
        {view === 'LIST' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 space-y-6 overflow-y-auto custom-scrollbar"
          >
            {/* Call to Action para o Portal da Vítima */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="p-6 bg-gradient-to-br from-success/20 to-primary/10 border-2 border-success/30 rounded-[2rem] relative overflow-hidden group cursor-pointer shadow-xl" 
              onClick={handleOpenPortal}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success animate-ping" />
                    <h5 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-success" /> Área do Familiar
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium max-w-[280px] leading-relaxed">
                    Acesso restrito para famílias acompanharem o fluxo de reparações em tempo real via Token Ministerial.
                  </p>
                </div>
                <Button size="sm" className="bg-success hover:bg-success/90 text-[10px] font-black uppercase h-10 px-6 rounded-xl shadow-lg">
                  Acessar Portal <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-[0.08] group-hover:scale-110 transition-transform duration-700">
                <Lock className="h-32 w-32 text-white" />
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl shadow-inner group hover:border-success/20 transition-colors">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Total Redirecionado</p>
                <p className="text-2xl font-black text-white tracking-tighter">R$ 442.800,00</p>
                <div className="mt-2 flex items-center gap-1 text-[8px] text-success font-bold">
                  <Activity className="h-3 w-3" /> ROI SOCIAL: +14.2%
                </div>
              </div>
              <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl shadow-inner group hover:border-primary/20 transition-colors">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Famílias Atendidas</p>
                <p className="text-2xl font-black text-white tracking-tighter">1.240</p>
                <div className="mt-2 flex items-center gap-1 text-[8px] text-primary font-bold">
                  <Users className="h-3 w-3" /> PROTOCOLO P10 ATIVO
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="h-4 w-4 text-success" /> Monitoramento de Repasses
                </span>
                <Badge variant="outline" className="text-[8px] border-white/10 text-slate-500">ORDEM: RECENTES</Badge>
              </div>
              
              <div className="grid gap-3">
                {records.map((record) => (
                  <motion.div 
                    key={record.id}
                    whileHover={{ x: 5 }}
                    className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl hover:border-success/30 transition-all group cursor-pointer"
                    onClick={() => handleOpenFlow(record)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-success/10 group-hover:border-success/20 transition-colors">
                          <Users className="h-5 w-5 text-slate-400 group-hover:text-success" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-tight">{record.victim}</p>
                          <p className="text-[9px] text-slate-500 font-medium">Origem: {record.inmate}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[8px] font-black px-2 py-0.5", 
                        record.status === 'ACTIVE' ? "border-success text-success bg-success/5" : 
                        record.status === 'COMPLETED' ? "border-primary text-primary bg-primary/5" :
                        "border-warning text-warning bg-warning/5"
                      )}>
                        {record.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-slate-500 uppercase">Progresso da Reparação</span>
                        <span className="text-success font-bold">{record.progress}%</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress value={record.progress} className="h-1.5 flex-1 bg-slate-800" indicatorClassName="bg-success" />
                        <span className="text-[11px] font-black text-white font-mono">R$ {record.amount.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'FLOW' && selectedRecord && (
          <motion.div 
            key="flow"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 h-full flex flex-col"
          >
            <DirectFinancialLink 
              inmateName={selectedRecord.inmate}
              victimFamily={selectedRecord.victim}
              amount={selectedRecord.monthly}
              protocolId={selectedRecord.protocol}
            />
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="p-6 bg-slate-900 border border-white/5 rounded-[2rem] space-y-5">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" /> Telemetria de Repasse
                </span>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-mono border-b border-white/5 pb-2">
                    <span className="text-slate-500 uppercase">BLOQUEIO_JUDICIAL:</span>
                    <span className="text-success font-bold">CONFIRMADO</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono border-b border-white/5 pb-2">
                    <span className="text-slate-500 uppercase">REPASSE_MINISTERIAL:</span>
                    <span className="text-primary font-bold">AGENDADO (T+1)</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono border-b border-white/5 pb-2">
                    <span className="text-slate-500 uppercase">IDENTIDADE_ICP:</span>
                    <span className="text-success font-bold">VALIDADA</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-slate-600">HASH: SHA256:8F4B...A9C3</span>
                    <Badge variant="outline" className="text-[8px] border-primary/30 text-primary">SECURE_LINK</Badge>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900 border border-white/5 rounded-[2rem] flex flex-col justify-center items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Info className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h6 className="text-sm font-black text-white uppercase">Ação do Operador</h6>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[200px]">
                    O repasse mensal é processado automaticamente pelo motor de regras SISBAJUD.
                  </p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-[10px] font-black uppercase h-11 rounded-xl">
                  Forçar Reiteração de Bloqueio
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'PORTAL' && (
          <motion.div 
            key="portal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="p-6 h-full"
          >
            <VictimTransparencyPortal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isEmbedded) return (
    <div className="h-full w-full overflow-hidden bg-slate-950 flex flex-col">
      {Header}
      {Content}
    </div>
  );

  return (
    <Card className="bg-slate-900 border-white/10 shadow-2xl overflow-hidden h-full flex flex-col">
      {Header}
      <CardContent className="p-0 flex-1 overflow-hidden">
        {Content}
      </CardContent>
    </Card>
  );
}
