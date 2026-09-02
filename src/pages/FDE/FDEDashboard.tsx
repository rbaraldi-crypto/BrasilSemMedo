import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  DollarSign, AlertTriangle, Users, Activity, TrendingUp, Shield,
  Zap, Brain, FileText, Clock, ArrowUpRight, Target
} from 'lucide-react';
import { fdeMockData } from '@/data/fdeData';
import { cn } from '@/lib/utils';

const blockingTrend = [
  { month: 'Jan', valor: 8.2, casos: 12 },
  { month: 'Fev', valor: 15.4, casos: 18 },
  { month: 'Mar', valor: 12.1, casos: 15 },
  { month: 'Abr', valor: 28.7, casos: 24 },
  { month: 'Mai', valor: 35.2, casos: 31 },
  { month: 'Jun', valor: 42.9, casos: 47 },
];

const riskDist = [
  { name: 'Crítico', value: 8, color: '#ef4444' },
  { name: 'Alto', value: 19, color: '#f97316' },
  { name: 'Médio', value: 32, color: '#eab308' },
  { name: 'Baixo', value: 41, color: '#22c55e' },
];

export function FDEDashboard() {
  const { type } = useParams<{ type: string }>();
  const isExecutivo = type === 'executivo';

  const kpis = [
    { label: 'Total Bloqueado', value: `R$ ${(fdeMockData.kpis.totalBlocked / 1e6).toFixed(1)}M`, icon: DollarSign, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
    { label: 'Investigações Ativas', value: fdeMockData.kpis.activeInvestigations, icon: Activity, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
    { label: 'Entidades Monitoradas', value: fdeMockData.kpis.entitiesMonitored.toLocaleString(), icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
    { label: 'Alertas Abertos', value: fdeMockData.kpis.alertsOpen, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
    { label: 'HITL Pendente', value: fdeMockData.kpis.hitlPending, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    { label: 'Score Médio Risco', value: `${fdeMockData.kpis.avgScore}%`, icon: Brain, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">FDE Live</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Dashboard {isExecutivo ? 'Executivo' : 'Operacional'}
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
            Financial Disruption Engine — Programa Brasil Sem Medo
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-xs px-4 py-2 border-none">
          <Zap className="h-3 w-3 mr-2" /> FDE v2.6 ACTIVE
        </Badge>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={cn("bg-slate-900 border hover:shadow-lg transition-all", kpi.border)}>
              <CardContent className="p-4">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center mb-3", kpi.bg)}>
                  <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                </div>
                <div className={cn("text-xl font-black tracking-tighter", kpi.color)}>{kpi.value}</div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bloqueios por Mês */}
        <div className="lg:col-span-8">
          <Card className="bg-slate-900 border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Evolução de Bloqueios (R$ Milhões)
                </CardTitle>
                <Badge variant="outline" className="text-[9px] border-primary/30 text-primary font-mono">SISBAJUD_STREAM</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={blockingTrend}>
                    <defs>
                      <linearGradient id="gradVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontWeight="bold" />
                    <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="valor" stroke="#0ea5e9" fill="url(#gradVal)" strokeWidth={2} name="R$ Milhões" />
                    <Bar dataKey="casos" fill="#ef4444" name="Casos" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribuição de Risco */}
        <div className="lg:col-span-4">
          <Card className="bg-slate-900 border-white/10 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="h-4 w-4 text-red-400" /> Distribuição de Risco
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                      {riskDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {riskDist.map((r, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-[10px] font-bold text-slate-400">{r.name}: {r.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Cases */}
      <Card className="bg-slate-900 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Casos Recentes
            </CardTitle>
            <Button variant="outline" size="sm" className="h-7 text-[10px] font-black uppercase border-white/10 text-slate-400">
              Ver Todos <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {fdeMockData.cases.slice(0, 5).map((c) => (
              <div key={c.id} className="px-6 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn("h-2 w-2 rounded-full", c.priority === 'CRÍTICA' ? 'bg-red-500 animate-pulse' : c.priority === 'ALTA' ? 'bg-orange-500' : 'bg-primary')}>  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{c.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{c.id} · {c.org}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-red-400">R$ {(c.amount / 1e6).toFixed(2)}M</span>
                  <Badge variant="outline" className={cn("text-[9px] font-black",
                    c.status === 'ESCALADO' ? 'border-red-500/30 text-red-400' :
                    c.status === 'PENDENTE_HITL' ? 'border-warning/30 text-warning' : 'border-white/10 text-slate-400'
                  )}>
                    {c.status}
                  </Badge>
                  <span className={cn("text-[10px] font-black", c.score >= 80 ? 'text-red-400' : c.score >= 60 ? 'text-warning' : 'text-success')}>
                    {c.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
