import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ComposedChart, Area
} from 'recharts';
import { 
  ArrowLeft, AlertTriangle, CheckCircle2, 
  Clock, Users, BrainCircuit, FileDown, Loader2,
  LayoutDashboard, CalendarRange, TrendingUp, Search, ArrowRight,
  DollarSign, Landmark, ShieldAlert, Zap, Skull, BarChart3, 
  Target, ShieldCheck, Activity, TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { tacticalAudio } from '@/lib/audioUtils';
import { reportService } from '@/services/reportService';
import { toast } from 'sonner';

// --- Constantes de Estilo IABS-SIP ---
const COLORS = {
  primary: '#0B3C5D',
  secondary: '#1F7A8C',
  accent: '#328CC1',
  success: '#22c55e',
  warning: '#ED6C02',
  danger: '#ef4444',
  muted: '#94a3b8',
  slate: '#0f172a'
};

// --- Mock Data Financeira (Ponto 8 vs Ponto 1) ---
const financialImpactData = [
  { month: 'Jan', bloqueios: 12.5, investimento: 1.2, roi: 10.4 },
  { month: 'Fev', bloqueios: 18.2, investimento: 1.2, roi: 15.1 },
  { month: 'Mar', bloqueios: 15.8, investimento: 2.5, roi: 6.3 },
  { month: 'Abr', bloqueios: 28.4, investimento: 2.5, roi: 11.3 },
  { month: 'Mai', bloqueios: 32.1, investimento: 4.8, roi: 6.6 },
  { month: 'Jun', bloqueios: 45.8, investimento: 6.2, roi: 7.3 },
];

const orgFinancialData = [
  { name: 'PCC', value: 68.4, color: COLORS.primary, status: 'Crítico' },
  { name: 'CV', value: 42.1, color: COLORS.danger, status: 'Crítico' },
  { name: 'Milícias', value: 22.3, color: COLORS.success, status: 'Monitorado' },
  { name: 'Outros', value: 10.0, color: COLORS.muted, status: 'Estável' },
];

const sisbajudEvents = [
  { id: 1, org: 'PCC', amount: 'R$ 450.000', type: 'Conta Corrente', time: '2m atrás' },
  { id: 2, org: 'CV', amount: 'R$ 1.200.000', type: 'Ativos Digitais', time: '15m atrás' },
  { id: 3, org: 'Milícia', amount: 'R$ 89.000', type: 'Imóvel Rural', time: '1h atrás' },
];

export function StatsDashboard() {
  const navigate = useNavigate();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activeTab, setActiveTab] = useState('financeiro');
  const statsRef = useRef<HTMLDivElement>(null);

  const handleExportDossier = async () => {
    if (!statsRef.current) return;
    
    setIsGeneratingPdf(true);
    tacticalAudio.playScan();
    toast.loading("Compilando dados ministeriais...", { id: "pdf-gen" });
    
    try {
      // Dados consolidados para o sumário do PDF
      const summaryData = {
        totalBlocked: "R$ 142.822.450,00",
        totalInvestment: "R$ 12.4 Bilhões",
        roi: "11.5%",
        protocols: "1.248"
      };

      await reportService.generateFinancialDossier(statsRef.current, summaryData);
      
      tacticalAudio.playSuccess();
      toast.success("Dossiê Financeiro exportado com sucesso.", { id: "pdf-gen" });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Falha ao exportar dossiê estratégico.", { id: "pdf-gen" });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      
      {/* Header Tático */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md px-8 py-4 flex items-center justify-between shadow-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
              <BarChart3 className="h-6 w-6 text-primary" />
              Estatísticas Avançadas IABS-SIP
            </h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
              Monitoramento Estratégico Brasil Sem Medo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            className="gap-2 border-white/10 text-slate-300 hover:bg-white/5"
            onClick={handleExportDossier}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            Exportar Dossiê
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold">
            <BrainCircuit className="h-4 w-4" />
            Atualizar IA
          </Button>
        </div>
      </header>

      <main className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar" ref={statsRef}>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-slate-900 border border-white/10 p-1 h-12">
              <TabsTrigger value="processual" className="px-8 font-bold text-[10px] uppercase data-[state=active]:bg-primary">
                <LayoutDashboard className="h-4 w-4 mr-2" /> Fluxo Processual
              </TabsTrigger>
              <TabsTrigger value="financeiro" className="px-8 font-bold text-[10px] uppercase data-[state=active]:bg-primary">
                <Landmark className="h-4 w-4 mr-2" /> Asfixia Financeira
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-lg border border-white/10 shadow-inner">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sincronização SISBAJUD: ONLINE</span>
            </div>
          </div>

          <TabsContent value="financeiro" className="space-y-8 animate-in fade-in duration-500">
            {/* Cards de Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <SummaryCard 
                title="Investimento Federal (Ponto 8)" 
                value="R$ 12.4 Bi" 
                icon={<Landmark className="h-5 w-5 text-primary" />}
                trend="+100% vs 2024"
                className="border-l-4 border-l-primary"
              />
              <SummaryCard 
                title="Ativos Bloqueados (Ponto 1)" 
                value="R$ 142.8 M" 
                icon={<ShieldAlert className="h-5 w-5 text-danger" />}
                trend="Asfixia em curso"
                className="border-l-4 border-l-danger"
                valueClassName="text-danger"
              />
              <SummaryCard 
                title="ROI de Segurança" 
                value="11.5%" 
                icon={<TrendingUp className="h-5 w-5 text-success" />}
                trend="Recuperação de Ativos"
                className="border-l-4 border-l-success"
                valueClassName="text-success"
              />
              <SummaryCard 
                title="Protocolos SISBAJUD" 
                value="1.248" 
                icon={<Zap className="h-5 w-5 text-warning" />}
                trend="Automação Ativa"
                className="border-l-4 border-l-warning"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Gráfico de Correlação */}
              <div className="lg:col-span-8">
                <Card className="bg-slate-900 border-white/10 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Correlação: Investimento vs. Asfixia Financeira
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      Impacto do Ponto 8 na eficácia do Ponto 1 (SISBAJUD)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={financialImpactData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontWeight="bold" />
                          <YAxis yAxisId="left" stroke="#64748b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                          <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                          />
                          <Area yAxisId="right" type="monotone" dataKey="investimento" fill={COLORS.primary} stroke={COLORS.primary} fillOpacity={0.1} strokeWidth={2} name="Investimento (Bi)" />
                          <Bar yAxisId="left" dataKey="bloqueios" barSize={20} fill={COLORS.danger} radius={[4, 4, 0, 0]} name="Bloqueios (M)" />
                          <Line yAxisId="left" type="monotone" dataKey="bloqueios" stroke={COLORS.danger} strokeWidth={3} dot={{ r: 4, fill: COLORS.danger }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feed Real-time SISBAJUD */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="bg-slate-900 border-white/10 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                      <Skull className="h-5 w-5 text-danger" />
                      Bloqueios por Organização
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={orgFinancialData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" stroke="#fff" fontSize={10} fontWeight="bold" width={60} />
                          <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={25}>
                            {orgFinancialData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-white/10 shadow-2xl overflow-hidden">
                  <CardHeader className="bg-white/5 border-b border-white/5">
                    <CardTitle className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <Activity className="h-3 w-3" /> Feed Recente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                      {sisbajudEvents.map((event) => (
                        <div key={event.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-danger/10 flex items-center justify-center border border-danger/20">
                              <DollarSign className="h-4 w-4 text-danger" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-white uppercase">{event.org}</p>
                              <p className="text-[9px] text-slate-500 font-bold">{event.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-danger">{event.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="processual" className="space-y-8 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <SummaryCard 
                title="Casos em Execução" 
                value="1.847" 
                icon={<Users className="h-5 w-5 text-primary" />}
                trend="+2.5% este mês"
              />
              <SummaryCard 
                title="Taxa de Conclusão" 
                value="92%" 
                icon={<CheckCircle2 className="h-5 w-5 text-success" />}
                trend="+1.2% vs média"
              />
              <SummaryCard 
                title="Atrasos Críticos" 
                value="47" 
                icon={<AlertTriangle className="h-5 w-5 text-danger" />}
                className="border-l-4 border-l-danger bg-danger/5"
                valueClassName="text-danger"
              />
              <SummaryCard 
                title="Média de Decisão" 
                value="14 dias" 
                icon={<Clock className="h-5 w-5 text-warning" />}
                trend="-2 dias vs 2024"
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer HUD */}
      <footer className="bg-slate-900 border-t border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-success" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Criptografia AES-256 Ativa</span>
          </div>
        </div>
        <div className="text-[9px] font-mono text-slate-600">
          IABS-SIP v2.5.0-ALPHA // TERMINAL-01 // {new Date().toLocaleDateString()}
        </div>
      </footer>
    </div>
  );
}

function SummaryCard({ title, value, icon, trend, className, valueClassName, onClick }: any) {
  return (
    <Card className={cn("bg-slate-900 border-white/10 transition-all hover:shadow-2xl hover:border-primary/30 group", className)} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary transition-colors">
            {title}
          </span>
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all">
            {icon}
          </div>
        </div>
        <div className={cn("text-3xl font-black tracking-tighter text-white", valueClassName)}>
          {value}
        </div>
        {trend && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" /> {trend}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
