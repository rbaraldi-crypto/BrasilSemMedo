import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, BarChart3, Scale,
  ChevronRight, Home, PieChart, Activity,
  FileText, ShieldCheck, AlertTriangle, Clock,
  CheckCircle2, XCircle, Gavel, Landmark,
  Building2, Scan, Users, Smartphone, Heart,
  Shield, Cpu, Info
} from 'lucide-react';
import {
  PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ─── Types ────────────────────────────────────────────────────────────────────
type P8View = 'OVERVIEW' | 'BUDGET' | 'ROI' | 'CONGRESSIONAL' | 'EXECUTION' | 'HEALTH';

interface MenuItem {
  id: P8View;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeClass?: string;
}

// ─── Menu ─────────────────────────────────────────────────────────────────────
const menuItems: MenuItem[] = [
  { id: 'OVERVIEW',     label: 'Executive Overview',      icon: <Home className="h-4 w-4" /> },
  { id: 'BUDGET',       label: 'Budget Allocation',       icon: <PieChart className="h-4 w-4" />, badge: 'R$12.4Bi', badgeClass: 'bg-emerald-500/20 text-emerald-400' },
  { id: 'ROI',          label: 'ROI by Axis',             icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'CONGRESSIONAL',label: 'Congressional Tracker',   icon: <Gavel className="h-4 w-4" />, badge: '3 Active', badgeClass: 'bg-warning/20 text-warning' },
  { id: 'EXECUTION',    label: 'Budget Execution',        icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'HEALTH',       label: 'Program Health 24×7',     icon: <Activity className="h-4 w-4" /> },
];

// ─── Static datasets ──────────────────────────────────────────────────────────
const budgetAllocData = [
  { name: 'Security Forces (P3/P9)', value: 3800, pct: 30.6, color: '#0ea5e9' },
  { name: 'TREVA Infrastructure (P4)', value: 2900, pct: 23.4, color: '#ef4444' },
  { name: 'Muralha Technology (P9)', value: 2100, pct: 16.9, color: '#22D3EE' },
  { name: 'Border Control (P3)', value: 1600, pct: 12.9, color: '#f59e0b' },
  { name: 'Victim Support (P10)', value: 800, pct: 6.5, color: '#22c55e' },
  { name: 'Digital Intelligence (P1)', value: 700, pct: 5.6, color: '#a855f7' },
  { name: 'Legal & Compliance (P11)', value: 300, pct: 2.4, color: '#64748b' },
  { name: 'Other Programs', value: 200, pct: 1.7, color: '#334155' },
];

const roiData = [
  { axis: 'P1 – Narco', roi: 18.2, investment: 700,  status: 'OPERATIONAL', color: '#a855f7' },
  { axis: 'P2 – Age',   roi: 0,    investment: 50,   status: 'LEGISLATIVE', color: '#64748b' },
  { axis: 'P3 – Border',roi: 8.4,  investment: 1600, status: 'OPERATIONAL', color: '#f59e0b' },
  { axis: 'P4 – TREVA', roi: 12.1, investment: 2900, status: 'OPERATIONAL', color: '#ef4444' },
  { axis: 'P5 – Chem',  roi: 0,    investment: 40,   status: 'LEGAL_REVIEW',color: '#64748b' },
  { axis: 'P6 – Fem.',  roi: 7.3,  investment: 180,  status: 'OPERATIONAL', color: '#ec4899' },
  { axis: 'P7 – Ports', roi: 15.8, investment: 420,  status: 'OPERATIONAL', color: '#f59e0b' },
  { axis: 'P8 – Budget',roi: 11.5, investment: 12400,status: 'MASTER',      color: '#22c55e' },
  { axis: 'P9 – Wall',  roi: 22.4, investment: 2100, status: 'OPERATIONAL', color: '#22D3EE' },
  { axis: 'P10 – Vict.',roi: 6.2,  investment: 800,  status: 'OPERATIONAL', color: '#22c55e' },
  { axis: 'P11 – Prog.',roi: 9.8,  investment: 300,  status: 'ACTIVE',      color: '#ef4444' },
  { axis: 'P12 – Phone',roi: 14.3, investment: 210,  status: 'OPERATIONAL', color: '#0ea5e9' },
];

const radarData = [
  { subject: 'P1', value: 18.2, fullMark: 25 },
  { subject: 'P3', value: 8.4,  fullMark: 25 },
  { subject: 'P4', value: 12.1, fullMark: 25 },
  { subject: 'P7', value: 15.8, fullMark: 25 },
  { subject: 'P9', value: 22.4, fullMark: 25 },
  { subject: 'P10',value: 6.2,  fullMark: 25 },
  { subject: 'P11',value: 9.8,  fullMark: 25 },
  { subject: 'P12',value: 14.3, fullMark: 25 },
];

const congressionalBills = [
  { id: 'PL 1234/2024', title: 'Criminal Organizations as Narcoterrorists', pillar: 'P1', status: 'APPROVED',   chamber: 'Senate', votes: '72–8',  date: '15/01/2024' },
  { id: 'PL 2891/2024', title: 'Criminal Majority Age Reduction to 16',     pillar: 'P2', status: 'IN_VOTE',   chamber: 'House',  votes: '–',     date: '22/03/2024' },
  { id: 'PL 3456/2024', title: 'TREVA Maximum Security Prisons Auth.',      pillar: 'P4', status: 'APPROVED',  chamber: 'Senate', votes: '68–10', date: '28/02/2024' },
  { id: 'PL 4520/2024', title: 'Muralha Nacional Budget Authorization',     pillar: 'P9', status: 'APPROVED',  chamber: 'House',  votes: '80–5',  date: '10/03/2024' },
  { id: 'PL 5123/2024', title: 'Chemical Castration for Sexual Crimes',     pillar: 'P5', status: 'COMMITTEE', chamber: 'Senate', votes: '–',     date: '–' },
  { id: 'PL 6789/2024', title: 'Feminicide Zero — Enhanced Penalties',      pillar: 'P6', status: 'APPROVED',  chamber: 'House',  votes: '89–3',  date: '05/04/2024' },
  { id: 'PL 7890/2024', title: 'Mobile Device Theft — 4× Multiplier',      pillar: 'P12',status: 'APPROVED',  chamber: 'Senate', votes: '65–12', date: '18/04/2024' },
  { id: 'PL 8901/2024', title: 'Victim Compensation Fund Establishment',    pillar: 'P10',status: 'PENDING',   chamber: 'House',  votes: '–',     date: '–' },
  { id: 'PL 9012/2024', title: 'P8 Federal Security Budget 12.4 Bi',       pillar: 'P8', status: 'APPROVED',  chamber: 'Both',   votes: '75–11', date: '20/02/2024' },
];

const executionData = [
  { month: 'Jan', planned: 820,  executed: 740  },
  { month: 'Feb', planned: 1040, executed: 1010 },
  { month: 'Mar', planned: 1380, executed: 1290 },
  { month: 'Apr', planned: 1620, executed: 1580 },
  { month: 'May', planned: 1980, executed: 1940 },
  { month: 'Jun', planned: 2410, executed: 2200 },
];

const healthMetrics = [
  { name: 'P1 – Narcoterrorism',     score: 96, trend: '+2', icon: <Shield className="h-3.5 w-3.5" />,     color: 'text-purple-400' },
  { name: 'P3 – Border / Troops',    score: 88, trend: '+1', icon: <ShieldCheck className="h-3.5 w-3.5" />,color: 'text-warning' },
  { name: 'P4 – TREVA Prisons',      score: 91, trend: '0',  icon: <Building2 className="h-3.5 w-3.5" />,  color: 'text-red-400' },
  { name: 'P6 – Feminicide Zero',    score: 84, trend: '+3', icon: <Heart className="h-3.5 w-3.5" />,      color: 'text-pink-400' },
  { name: 'P7 – Port / Airport',     score: 93, trend: '+1', icon: <Landmark className="h-3.5 w-3.5" />,   color: 'text-warning' },
  { name: 'P9 – Muralha Brasileira', score: 98, trend: '+5', icon: <Scan className="h-3.5 w-3.5" />,       color: 'text-cyan-400' },
  { name: 'P10 – Victim Support',    score: 79, trend: '-1', icon: <Users className="h-3.5 w-3.5" />,      color: 'text-emerald-400' },
  { name: 'P11 – Prog. Block',       score: 99, trend: '0',  icon: <Scale className="h-3.5 w-3.5" />,      color: 'text-red-400' },
  { name: 'P12 – Mobile Theft',      score: 87, trend: '+2', icon: <Smartphone className="h-3.5 w-3.5" />, color: 'text-primary' },
];

// ─── Shared tooltip style ─────────────────────────────────────────────────────
const TOOLTIP_STYLE = {
  backgroundColor: '#0f172a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '11px',
  fontWeight: 'bold',
};

// ─── Status badge helper ──────────────────────────────────────────────────────
function BillStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    APPROVED:   { label: 'Approved',    cls: 'bg-success/20 text-success border-success/30',    icon: <CheckCircle2 className="h-3 w-3" /> },
    IN_VOTE:    { label: 'In Vote',     cls: 'bg-warning/20 text-warning border-warning/30 animate-pulse',     icon: <Clock className="h-3 w-3" /> },
    COMMITTEE:  { label: 'Committee',  cls: 'bg-primary/20 text-primary border-primary/30',    icon: <FileText className="h-3 w-3" /> },
    PENDING:    { label: 'Pending',    cls: 'bg-slate-700/40 text-slate-400 border-white/10',  icon: <AlertTriangle className="h-3 w-3" /> },
    REJECTED:   { label: 'Rejected',   cls: 'bg-red-600/20 text-red-400 border-red-600/30',    icon: <XCircle className="h-3 w-3" /> },
  };
  const cfg = map[status] ?? map.PENDING;
  return (
    <Badge variant="outline" className={cn('text-[10px] font-black flex items-center gap-1 w-fit', cfg.cls)}>
      {cfg.icon} {cfg.label}
    </Badge>
  );
}

// ─── ROI status badge ─────────────────────────────────────────────────────────
function RoiStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    OPERATIONAL: 'bg-success/20 text-success',
    LEGISLATIVE: 'bg-slate-700/40 text-slate-400',
    LEGAL_REVIEW:'bg-warning/20 text-warning',
    ACTIVE:      'bg-primary/20 text-primary',
    MASTER:      'bg-emerald-500/20 text-emerald-400',
  };
  return (
    <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-black uppercase', map[status] ?? 'bg-slate-700/40 text-slate-400')}>
      {status.replace('_', ' ')}
    </span>
  );
}

// ─── Overview view ────────────────────────────────────────────────────────────
function OverviewView({ setView }: { setView: (v: P8View) => void }) {
  const kpis = [
    { label: 'Federal Investment (P8)', value: 'R$ 12.4 Bi', sub: '+100% vs 2024', icon: <Landmark className="h-5 w-5 text-emerald-400" />, cls: 'border-l-emerald-500', onClick: () => setView('BUDGET') },
    { label: 'Blocked Assets (P1)',     value: 'R$ 142.8 M', sub: 'SISBAJUD Active', icon: <Shield className="h-5 w-5 text-red-400" />,     cls: 'border-l-red-500',     onClick: () => setView('ROI') },
    { label: 'Security ROI',            value: '11.5%',       sub: 'Portfolio Average', icon: <TrendingUp className="h-5 w-5 text-primary" />, cls: 'border-l-primary',     onClick: () => setView('ROI') },
    { label: 'Bills Approved',          value: '7 / 9',       sub: '2 still in progress', icon: <Gavel className="h-5 w-5 text-warning" />,   cls: 'border-l-warning',     onClick: () => setView('CONGRESSIONAL') },
    { label: 'Budget Execution YTD',    value: '91.2%',       sub: 'R$ 11.3 Bi spent', icon: <BarChart3 className="h-5 w-5 text-success" />,  cls: 'border-l-success',     onClick: () => setView('EXECUTION') },
    { label: 'Avg Program Health',      value: '90.6%',       sub: '9 axes monitored', icon: <Activity className="h-5 w-5 text-cyan-400" />,  cls: 'border-l-cyan-500',   onClick: () => setView('HEALTH') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Executive Overview</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Brasil Sem Medo — Pillar 8: Budget &amp; Financial Control
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <Card
            key={i}
            onClick={k.onClick}
            className={cn('bg-slate-900 border-white/10 border-l-4 cursor-pointer hover:border-emerald-500/40 transition-all hover:shadow-2xl group', k.cls)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
                  {k.label}
                </span>
                <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">{k.icon}</div>
              </div>
              <p className="text-2xl font-black text-white tracking-tight">{k.value}</p>
              <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-400" /> {k.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-emerald-400 uppercase flex items-center gap-2">
              <PieChart className="h-4 w-4" /> Budget Allocation Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={budgetAllocData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {budgetAllocData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`R$ ${v}M`, '']} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {budgetAllocData.slice(0, 4).map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-[10px] text-slate-400 truncate">{d.name.split(' ')[0]}: <span className="text-white font-bold">{d.pct}%</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-primary uppercase flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Monthly Execution vs. Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={executionData}>
                  <defs>
                    <linearGradient id="planGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="execGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#475569" fontSize={10} />
                  <YAxis stroke="#475569" fontSize={10} />
                  <RechartsTip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`R$ ${v}M`]} />
                  <Area type="monotone" dataKey="planned" stroke="#0ea5e9" fill="url(#planGrad)" strokeWidth={2} name="Planned" />
                  <Area type="monotone" dataKey="executed" stroke="#22c55e" fill="url(#execGrad)" strokeWidth={2} name="Executed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Budget Allocation View ───────────────────────────────────────────────────
function BudgetAllocationView() {
  const total = budgetAllocData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Budget Allocation</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          R$ 12.4 Billion — Breakdown by Program Axis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Pie */}
        <Card className="bg-slate-900 border-white/10 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-emerald-400 uppercase flex items-center gap-2">
              <PieChart className="h-4 w-4" /> Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={budgetAllocData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ pct }) => `${pct}%`}
                    labelLine={false}
                  >
                    {budgetAllocData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`R$ ${v}M`, '']} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2 border-t border-white/5 pt-3">
              <p className="text-[10px] text-slate-500 uppercase font-black">Total Federal Budget</p>
              <p className="text-2xl font-black text-emerald-400">R$ {(total / 1000).toFixed(1)} Bi</p>
            </div>
          </CardContent>
        </Card>

        {/* Bars */}
        <Card className="bg-slate-900 border-white/10 lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-primary uppercase flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Allocation by Axis (R$ Millions)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetAllocData} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#475569" fontSize={10} />
                  <YAxis type="category" dataKey="name" width={150} stroke="#fff" fontSize={9} tick={{ fill: '#94a3b8' }} />
                  <RechartsTip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`R$ ${v}M`]} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {budgetAllocData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail table */}
      <Card className="bg-slate-900 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
            <FileText className="h-4 w-4" /> Budget Line Items
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/80">
                  {['Program Axis', 'Allocation', 'Share', 'Execution', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {budgetAllocData.map((row, i) => {
                  const execPct = Math.floor(75 + Math.random() * 20);
                  return (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: row.color }} />
                        <span className="text-slate-200 font-bold">{row.name}</span>
                      </td>
                      <td className="px-5 py-3 font-mono font-bold text-white">R$ {(row.value / 1000).toFixed(1)} Bi</td>
                      <td className="px-5 py-3 font-bold text-emerald-400">{row.pct}%</td>
                      <td className="px-5 py-3 w-44">
                        <div className="flex items-center gap-2">
                          <Progress value={execPct} className="h-1.5 flex-1 bg-slate-800" indicatorClassName="bg-emerald-500" />
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">{execPct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge className="bg-success/20 text-success text-[9px] font-black">ON TRACK</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── ROI Analysis View ────────────────────────────────────────────────────────
function ROIAnalysisView() {
  const [selectedAxis, setSelectedAxis] = useState<typeof roiData[0] | null>(null);
  const operational = roiData.filter(d => d.roi > 0);
  const avgRoi = (operational.reduce((s, d) => s + d.roi, 0) / operational.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">ROI Drill-Down by Axis</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Return on Investment per programme pillar · Portfolio Avg: <span className="text-emerald-400">{avgRoi}%</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-emerald-400 uppercase flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> ROI (%) per Pillar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roiData} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="axis" stroke="#475569" fontSize={9} />
                  <YAxis stroke="#475569" fontSize={10} unit="%" />
                  <RechartsTip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${v}%`, 'ROI']} />
                  <Bar dataKey="roi" radius={[4, 4, 0, 0]} onClick={(d) => setSelectedAxis(d)}>
                    {roiData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.color}
                        opacity={selectedAxis && selectedAxis.axis !== entry.axis ? 0.3 : 1}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Radar */}
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-primary uppercase flex items-center gap-2">
              <Activity className="h-4 w-4" /> Multi-Axis ROI Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                  <Radar name="ROI %" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.25} strokeWidth={2} />
                  <RechartsTip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${v}%`, 'ROI']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drill-down detail panel */}
      <AnimatePresence>
        {selectedAxis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="bg-slate-900 border-emerald-500/30 shadow-[0_0_30px_rgba(34,197,94,0.08)]">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center border shrink-0"
                      style={{ background: selectedAxis.color + '20', borderColor: selectedAxis.color + '40' }}>
                      <TrendingUp className="h-7 w-7" style={{ color: selectedAxis.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-black text-white uppercase">{selectedAxis.axis}</h3>
                        <RoiStatusBadge status={selectedAxis.status} />
                      </div>
                      <p className="text-slate-500 text-xs font-bold uppercase">
                        Investment: R$ {(selectedAxis.investment / 1000).toFixed(2)} Bi
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase">ROI</p>
                      <p className="text-3xl font-black" style={{ color: selectedAxis.color }}>
                        {selectedAxis.roi > 0 ? `${selectedAxis.roi}%` : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase">Return</p>
                      <p className="text-3xl font-black text-white">
                        {selectedAxis.roi > 0
                          ? `R$ ${((selectedAxis.investment * selectedAxis.roi) / 100 / 1000).toFixed(2)}Bi`
                          : '—'}
                      </p>
                    </div>
                  </div>
                </div>
                {selectedAxis.roi > 0 && (
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                      <span>ROI Performance vs. Portfolio Avg ({avgRoi}%)</span>
                      <span style={{ color: selectedAxis.color }}>{selectedAxis.roi}%</span>
                    </div>
                    <Progress
                      value={(selectedAxis.roi / 25) * 100}
                      className="h-2 bg-slate-800"
                      indicatorClassName="transition-all"
                      style={{ '--indicator-color': selectedAxis.color } as any}
                    />
                  </div>
                )}
                <button
                  className="mt-3 text-[10px] text-slate-600 hover:text-slate-400 font-bold uppercase"
                  onClick={() => setSelectedAxis(null)}
                >
                  ✕ Clear selection
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full table */}
      <Card className="bg-slate-900 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
            <FileText className="h-4 w-4" /> All Pillars — Investment &amp; ROI
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/80">
                  {['Pillar', 'Status', 'Investment', 'ROI', 'Return Value', 'Performance'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roiData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedAxis(row)}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ background: row.color }} />
                        <span className="text-slate-200 font-bold">{row.axis}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5"><RoiStatusBadge status={row.status} /></td>
                    <td className="px-4 py-2.5 font-mono text-slate-300">R$ {(row.investment / 1000).toFixed(2)} Bi</td>
                    <td className="px-4 py-2.5 font-black" style={{ color: row.roi > 0 ? row.color : '#475569' }}>
                      {row.roi > 0 ? `${row.roi}%` : 'N/A'}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-slate-400">
                      {row.roi > 0 ? `R$ ${((row.investment * row.roi) / 100 / 1000).toFixed(2)}Bi` : '—'}
                    </td>
                    <td className="px-4 py-2.5 w-32">
                      {row.roi > 0 && (
                        <Progress value={(row.roi / 25) * 100} className="h-1.5 bg-slate-800"
                          indicatorClassName="bg-emerald-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Congressional Tracker View ───────────────────────────────────────────────
function CongressionalTrackerView() {
  const approved = congressionalBills.filter(b => b.status === 'APPROVED').length;
  const pending  = congressionalBills.filter(b => b.status !== 'APPROVED').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Congressional Bill Tracker</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Brasil Sem Medo Legislative Pipeline — 2024
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Bills', value: congressionalBills.length, color: 'text-white' },
          { label: 'Approved',    value: approved,  color: 'text-success' },
          { label: 'In Progress', value: pending,   color: 'text-warning' },
          { label: 'Approval Rate', value: `${Math.round((approved / congressionalBills.length) * 100)}%`, color: 'text-emerald-400' },
        ].map((k, i) => (
          <Card key={i} className="bg-slate-900 border-white/10">
            <CardContent className="p-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{k.label}</p>
              <p className={cn('text-3xl font-black mt-1', k.color)}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline */}
      <Card className="bg-slate-900 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-black text-warning uppercase flex items-center gap-2">
            <Gavel className="h-4 w-4" /> Legislative Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {congressionalBills.map((bill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="px-5 py-4 flex flex-wrap items-start justify-between gap-4 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className={cn(
                    'h-9 w-9 rounded-xl flex items-center justify-center border shrink-0 mt-0.5',
                    bill.status === 'APPROVED' ? 'bg-success/10 border-success/20' :
                    bill.status === 'IN_VOTE'  ? 'bg-warning/10 border-warning/20 animate-pulse' :
                    'bg-white/5 border-white/5'
                  )}>
                    {bill.status === 'APPROVED' ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : bill.status === 'IN_VOTE' ? (
                      <Clock className="h-4 w-4 text-warning" />
                    ) : (
                      <FileText className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-white/5">{bill.id}</span>
                      <Badge className="text-[9px] font-black bg-primary/10 text-primary border border-primary/20">{bill.pillar}</Badge>
                    </div>
                    <p className="text-sm font-bold text-white leading-tight">{bill.title}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] text-slate-500 font-bold uppercase">
                      <span>{bill.chamber}</span>
                      {bill.votes !== '–' && <span>Votes: {bill.votes}</span>}
                      {bill.date !== '–' && <span>{bill.date}</span>}
                    </div>
                  </div>
                </div>
                <BillStatusBadge status={bill.status} />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress bar summary */}
      <Card className="bg-slate-900 border-emerald-500/20">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black text-emerald-400 uppercase">Legislative Progress</p>
            <p className="text-xs font-mono text-white">{approved}/{congressionalBills.length} Approved</p>
          </div>
          <Progress value={(approved / congressionalBills.length) * 100} className="h-3 bg-slate-800"
            indicatorClassName="bg-emerald-500" />
          <div className="flex justify-between mt-2 text-[10px] font-black uppercase text-slate-500">
            <span>0%</span>
            <span className="text-emerald-400">{Math.round((approved / congressionalBills.length) * 100)}% Complete</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Budget Execution View ────────────────────────────────────────────────────
function BudgetExecutionView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Budget Execution</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Planned vs. Executed — R$ 12.4 Billion YTD Tracking
        </p>
      </div>

      <Card className="bg-slate-900 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-black text-primary uppercase flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Monthly Execution (R$ Millions)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={executionData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={10} />
                <RechartsTip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`R$ ${v}M`]} />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Bar dataKey="planned" name="Planned" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="executed" name="Executed" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
              <Activity className="h-4 w-4" /> Execution by Program Axis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {budgetAllocData.map((row, i) => {
              const exec = Math.floor(80 + (i * 3 % 20));
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-300 truncate max-w-[180px]">{row.name}</span>
                    <span style={{ color: row.color }}>{exec}%</span>
                  </div>
                  <Progress value={exec} className="h-1.5 bg-slate-800"
                    indicatorClassName="transition-all duration-700"
                    style={{ '--indicator-color': row.color } as any}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-emerald-400 uppercase flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Execution KPIs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Total Budget (P8)',       value: 'R$ 12.40 Bi', sub: 'Federal Appropriation' },
              { label: 'Total Executed YTD',      value: 'R$ 11.31 Bi', sub: '91.2% of total' },
              { label: 'Remaining Balance',        value: 'R$ 1.09 Bi',  sub: 'Q4 Allocation' },
              { label: 'Avg. Monthly Execution',  value: 'R$ 1.88 Bi',  sub: '6-month average' },
              { label: 'Variance (Plan vs Exec)', value: '-8.8%',        sub: 'Below plan (acceptable)' },
              { label: 'Projected Year-End',      value: 'R$ 12.2 Bi',  sub: '98.4% total execution' },
            ].map((k, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase">{k.label}</p>
                  <p className="text-[10px] text-slate-600">{k.sub}</p>
                </div>
                <span className="text-sm font-black text-white font-mono">{k.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Program Health View ──────────────────────────────────────────────────────
function ProgramHealthView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Program Health 24×7</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Real-time Health Score per Programme Axis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Avg Health Score', value: '90.6%', cls: 'text-success', sub: '9 axes monitored' },
          { label: 'Critical Alerts',  value: '0',     cls: 'text-slate-300', sub: 'All systems nominal' },
          { label: 'Last Updated',     value: 'Now',   cls: 'text-primary',  sub: 'Live telemetry' },
        ].map((k, i) => (
          <Card key={i} className="bg-slate-900 border-white/10">
            <CardContent className="p-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{k.label}</p>
              <p className={cn('text-3xl font-black mt-1', k.cls)}>{k.value}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {healthMetrics.map((m, i) => {
          const isCritical = m.score < 75;
          const isWarning  = m.score >= 75 && m.score < 85;
          const scoreColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#22c55e';
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={cn(
                'bg-slate-900 border-white/10 hover:border-emerald-500/30 transition-all',
                isCritical && 'border-red-600/30',
              )}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={m.color}>{m.icon}</span>
                      <span className="text-xs font-black text-white uppercase tracking-tighter">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-[10px] font-black', m.trend.startsWith('+') ? 'text-success' : m.trend === '0' ? 'text-slate-500' : 'text-red-400')}>
                        {m.trend !== '0' ? m.trend + '%' : '→'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-3xl font-black" style={{ color: scoreColor }}>{m.score}</span>
                    <span className="text-[10px] text-slate-500 font-black uppercase mb-1">/ 100</span>
                  </div>
                  <Progress value={m.score} className="h-2 bg-slate-800"
                    indicatorClassName="transition-all duration-700"
                    style={{ '--tw-progress-fill': scoreColor } as any}
                  />
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className={cn('h-1.5 w-1.5 rounded-full', isCritical ? 'bg-red-600 animate-ping' : 'bg-success animate-pulse')} />
                    <span className={cn('text-[10px] font-black uppercase tracking-widest',
                      isCritical ? 'text-red-400' : isWarning ? 'text-warning' : 'text-success')}>
                      {isCritical ? 'ATTENTION' : isWarning ? 'MONITOR' : 'NOMINAL'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-slate-900 border-emerald-500/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Health scores are calculated every 60 seconds using KPIs derived from each pillar's
            operational data: arrest rates (P1), camera uptime (P9), budget execution velocity (P8),
            case processing time (P11/P7), and field unit availability (P3/P4). Scores below 75
            trigger automatic alerts to the coordination team.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
interface P8CommandCenterProps {
  initialView?: P8View;
}

export function P8CommandCenter({ initialView = 'OVERVIEW' }: P8CommandCenterProps) {
  const [activeView, setActiveView] = useState<P8View>(initialView);

  const renderContent = () => {
    switch (activeView) {
      case 'OVERVIEW':     return <OverviewView setView={setActiveView} />;
      case 'BUDGET':       return <BudgetAllocationView />;
      case 'ROI':          return <ROIAnalysisView />;
      case 'CONGRESSIONAL':return <CongressionalTrackerView />;
      case 'EXECUTION':    return <BudgetExecutionView />;
      case 'HEALTH':       return <ProgramHealthView />;
    }
  };

  return (
    <div className="h-full flex bg-slate-950 rounded-xl overflow-hidden border border-white/10">
      {/* ── Internal sidebar ─────────────────────────────────────────────── */}
      <div className="w-56 border-r border-white/10 flex flex-col bg-slate-900/60 shrink-0">
        {/* header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-black text-white uppercase tracking-tighter leading-tight truncate">
                P8 Budget
              </h3>
              <p className="text-[10px] text-emerald-400/70 font-bold uppercase tracking-widest truncate">
                Financial Control
              </p>
            </div>
          </div>
        </div>

        {/* nav */}
        <ScrollArea className="flex-1 py-2 px-1.5">
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all group border',
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white border-transparent',
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className={cn('shrink-0 transition-colors', isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-white')}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-black leading-none shrink-0 ml-1', item.badgeClass)}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* footer */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="uppercase tracking-widest truncate">Budget Live</span>
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="h-full overflow-y-auto custom-scrollbar p-6"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
