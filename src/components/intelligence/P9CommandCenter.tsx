import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan, Camera, Eye, Fingerprint, AlertTriangle,
  MapPin, FileText, Briefcase, ChevronRight,
  Home, Users, Activity, Shield, ShieldCheck,
  ShieldAlert, Settings, Building2, Scale,
  Clock, CheckCircle2, XCircle, AlertCircle,
  BarChart3, TrendingUp, PieChart, Hash,
  Radio, Lock, Key, UserCheck, MessageSquare,
  Flag, Layers, Search, Gavel, ListChecks,
  UserCog, BookOpen, Tag, ArrowUpRight,
  Zap, Database, Network, GitBranch,
  RefreshCw, History, Filter
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip as RechartsTip, PieChart as RechartsPie, Pie, Cell,
  LineChart, Line, Area, AreaChart, RadarChart, Radar,
  PolarGrid, PolarAngleAxis
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion as m } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────
type P9View =
  | 'DASHBOARD'
  | 'CAMERAS'
  | 'OBSERVACOES'
  | 'MATCHES'
  | 'HITL'
  | 'HITL__REVISOES'
  | 'HITL__MINHAS_TAREFAS'
  | 'HITL__REVISAO_BIOMETRICA'
  | 'HITL__COMPARAR_CANDIDATOS'
  | 'HITL__SEGUNDA_REVISAO'
  | 'HITL__SUPERVISAO'
  | 'HITL__PENDENCIAS_JURIDICAS'
  | 'HITL__RESOLUCAO_TERRITORIAL'
  | 'HITL__AUTORIZACAO_OPERACIONAL'
  | 'HITL__ALERTAS_BLOQUEADOS'
  | 'HITL__DESPACHOS_ATIVOS'
  | 'HITL__FEEDBACK'
  | 'HITL__EVIDENCIAS'
  | 'HITL__TIMELINE'
  | 'ALERTAS'
  | 'TERRITORIO'
  | 'EVIDENCIAS'
  | 'CASOS'
  | 'SUPERVISAO__SLA'
  | 'SUPERVISAO__FILAS'
  | 'SUPERVISAO__ESCALACOES'
  | 'SUPERVISAO__DIVERGENCIAS'
  | 'SUPERVISAO__INDICADORES'
  | 'ADMIN__POLITICAS'
  | 'ADMIN__PERFIS'
  | 'ADMIN__INSTITUICOES'
  | 'ADMIN__REASON_CODES'
  | 'ADMIN__ESCALONAMENTOS';

interface SubItem { id: P9View; label: string; icon: React.ReactNode; badge?: string; badgeClass?: string; }
interface MenuItem {
  id: P9View;
  label: string;
  icon: React.ReactNode;
  children?: SubItem[];
  badge?: string;
  badgeClass?: string;
  section?: string;
}

// ─── Menu ─────────────────────────────────────────────────────────────────────
const menuSections = [
  {
    label: 'OPERAÇÕES',
    items: [
      { id: 'DASHBOARD' as P9View,   label: 'Dashboard',     icon: <Home className="h-3.5 w-3.5" /> },
      { id: 'CAMERAS' as P9View,     label: 'Câmeras',       icon: <Camera className="h-3.5 w-3.5" />, badge: '1M+', badgeClass: 'bg-cyan-500/20 text-cyan-400' },
      { id: 'OBSERVACOES' as P9View, label: 'Observações',   icon: <Eye className="h-3.5 w-3.5" /> },
      { id: 'MATCHES' as P9View,     label: 'Matches',       icon: <Fingerprint className="h-3.5 w-3.5" />, badge: '47', badgeClass: 'bg-red-600/20 text-red-400' },
    ],
  },
  {
    label: 'HITL',
    items: [
      {
        id: 'HITL' as P9View, label: 'HITL', icon: <Users className="h-3.5 w-3.5" />,
        badge: '12', badgeClass: 'bg-warning/20 text-warning',
        children: [
          { id: 'HITL__REVISOES' as P9View,              label: 'Painel de Revisões',       icon: <ListChecks className="h-3 w-3" />,   badge: '12', badgeClass: 'bg-warning/20 text-warning' },
          { id: 'HITL__MINHAS_TAREFAS' as P9View,        label: 'Minhas Tarefas',            icon: <Briefcase className="h-3 w-3" /> },
          { id: 'HITL__REVISAO_BIOMETRICA' as P9View,    label: 'Revisão Biométrica',        icon: <Fingerprint className="h-3 w-3" /> },
          { id: 'HITL__COMPARAR_CANDIDATOS' as P9View,   label: 'Comparar Candidatos',       icon: <Search className="h-3 w-3" /> },
          { id: 'HITL__SEGUNDA_REVISAO' as P9View,       label: 'Segunda Revisão',           icon: <RefreshCw className="h-3 w-3" /> },
          { id: 'HITL__SUPERVISAO' as P9View,            label: 'Supervisão',                icon: <ShieldCheck className="h-3 w-3" /> },
          { id: 'HITL__PENDENCIAS_JURIDICAS' as P9View,  label: 'Pendências Jurídicas',      icon: <Gavel className="h-3 w-3" /> },
          { id: 'HITL__RESOLUCAO_TERRITORIAL' as P9View, label: 'Resolução Territorial',     icon: <MapPin className="h-3 w-3" /> },
          { id: 'HITL__AUTORIZACAO_OPERACIONAL' as P9View,label:'Autorização Operacional',   icon: <Key className="h-3 w-3" /> },
          { id: 'HITL__ALERTAS_BLOQUEADOS' as P9View,    label: 'Alertas Bloqueados',        icon: <Lock className="h-3 w-3" />, badge: '3', badgeClass: 'bg-red-600/20 text-red-400' },
          { id: 'HITL__DESPACHOS_ATIVOS' as P9View,      label: 'Despachos Ativos',          icon: <Radio className="h-3 w-3" /> },
          { id: 'HITL__FEEDBACK' as P9View,              label: 'Feedback / Falso Positivo', icon: <Flag className="h-3 w-3" /> },
          { id: 'HITL__EVIDENCIAS' as P9View,            label: 'Evidências',                icon: <Camera className="h-3 w-3" /> },
          { id: 'HITL__TIMELINE' as P9View,              label: 'Timeline',                  icon: <History className="h-3 w-3" /> },
        ],
      },
    ],
  },
  {
    label: 'INTEL',
    items: [
      { id: 'ALERTAS' as P9View,   label: 'Alertas',    icon: <AlertTriangle className="h-3.5 w-3.5" />, badge: '5', badgeClass: 'bg-red-600 text-white' },
      { id: 'TERRITORIO' as P9View,label: 'Território',  icon: <MapPin className="h-3.5 w-3.5" /> },
      { id: 'EVIDENCIAS' as P9View,label: 'Evidências',  icon: <FileText className="h-3.5 w-3.5" /> },
      { id: 'CASOS' as P9View,     label: 'Casos',      icon: <Briefcase className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'SUPERVISÃO OPERACIONAL',
    items: [
      { id: 'SUPERVISAO__SLA' as P9View,         label: 'SLA HITL',    icon: <Clock className="h-3.5 w-3.5" /> },
      { id: 'SUPERVISAO__FILAS' as P9View,       label: 'Filas',       icon: <Layers className="h-3.5 w-3.5" /> },
      { id: 'SUPERVISAO__ESCALACOES' as P9View,  label: 'Escalações',  icon: <ArrowUpRight className="h-3.5 w-3.5" />, badge: '2', badgeClass: 'bg-warning/20 text-warning' },
      { id: 'SUPERVISAO__DIVERGENCIAS' as P9View,label: 'Divergências', icon: <GitBranch className="h-3.5 w-3.5" /> },
      { id: 'SUPERVISAO__INDICADORES' as P9View, label: 'Indicadores', icon: <BarChart3 className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'ADMINISTRAÇÃO',
    items: [
      { id: 'ADMIN__POLITICAS' as P9View,      label: 'Políticas HITL',     icon: <BookOpen className="h-3.5 w-3.5" /> },
      { id: 'ADMIN__PERFIS' as P9View,         label: 'Perfis e Roles',     icon: <UserCog className="h-3.5 w-3.5" /> },
      { id: 'ADMIN__INSTITUICOES' as P9View,   label: 'Instituições',       icon: <Building2 className="h-3.5 w-3.5" /> },
      { id: 'ADMIN__REASON_CODES' as P9View,   label: 'Motivos / Reason Codes', icon: <Tag className="h-3.5 w-3.5" /> },
      { id: 'ADMIN__ESCALONAMENTOS' as P9View, label: 'Escalonamentos',     icon: <Network className="h-3.5 w-3.5" /> },
    ],
  },
];

// ─── Tooltip style ────────────────────────────────────────────────────────────
const TOOLTIP = {
  backgroundColor: '#0f172a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '11px',
  fontWeight: 'bold',
};

// ─── Mock datasets ────────────────────────────────────────────────────────────
const matchTrendData = [
  { time: '00h', matches: 3,  fp: 0 },
  { time: '03h', matches: 1,  fp: 0 },
  { time: '06h', matches: 5,  fp: 1 },
  { time: '09h', matches: 12, fp: 2 },
  { time: '12h', matches: 18, fp: 3 },
  { time: '15h', matches: 22, fp: 4 },
  { time: '18h', matches: 29, fp: 5 },
  { time: '21h', matches: 15, fp: 2 },
];

const cameraStatusData = [
  { name: 'Online',    value: 924500, color: '#22c55e' },
  { name: 'Offline',   value: 52000,  color: '#ef4444' },
  { name: 'Manutenção',value: 23500,  color: '#f59e0b' },
];

const hitlQueueData = [
  { type: 'Biométrico', pending: 12, sla: 92, color: '#22D3EE' },
  { type: 'Territorial', pending: 4, sla: 97, color: '#f59e0b' },
  { type: 'Jurídico',    pending: 3, sla: 85, color: '#a855f7' },
  { type: 'P12/IMEI',    pending: 6, sla: 88, color: '#ef4444' },
];

const slaData = [
  { day: 'Seg', target: 30, actual: 28 },
  { day: 'Ter', target: 30, actual: 32 },
  { day: 'Qua', target: 30, actual: 25 },
  { day: 'Qui', target: 30, actual: 27 },
  { day: 'Sex', target: 30, actual: 35 },
  { day: 'Sáb', target: 30, actual: 22 },
  { day: 'Dom', target: 30, actual: 18 },
];

const fpRadarData = [
  { subject: 'Ângulo', value: 38, fullMark: 100 },
  { subject: 'Iluminação', value: 52, fullMark: 100 },
  { subject: 'Oclusão', value: 24, fullMark: 100 },
  { subject: 'Resolução', value: 18, fullMark: 100 },
  { subject: 'Gêmeos', value: 8, fullMark: 100 },
  { subject: 'Outros', value: 14, fullMark: 100 },
];

const mockMatches = [
  { id: 'M-8821', name: 'Carlos Eduardo da Silva', confidence: 99.8, sector: 'GRU-T3', status: 'PENDING_REVIEW', time: '2m', threat: 'P1' },
  { id: 'M-8820', name: 'Marcos Paulo Rocha',      confidence: 92.4, sector: 'Santos-B2', status: 'IN_REVIEW',   time: '14m', threat: 'P2' },
  { id: 'M-8819', name: 'Fernanda Lima (WATCH)',   confidence: 87.1, sector: 'BSB-D1',  status: 'APPROVED',    time: '32m', threat: 'P3' },
  { id: 'M-8818', name: 'Unknown Suspect',          confidence: 78.3, sector: 'VCP-A4', status: 'REJECTED',    time: '1h',  threat: 'N/A' },
  { id: 'M-8817', name: 'João Roberto Matos',       confidence: 95.6, sector: 'GIG-T2', status: 'PENDING_REVIEW',time:'5m', threat: 'P2' },
];

const mockCameras = Array.from({ length: 12 }, (_, i) => ({
  id: `CAM-${(9800 + i).toString()}`,
  sector: ['GRU-T1','GRU-T2','GRU-T3','Santos-P1','Santos-P2','BSB-A','BSB-B','VCP-C','GIG-T1','GIG-T2','CNF-A','PNZ-P1'][i],
  status: i < 9 ? 'ONLINE' : i === 9 ? 'OFFLINE' : 'MAINTENANCE',
  fps: 30 - (i * 2 % 10),
  resolution: i % 2 === 0 ? '4K' : '1080p',
  lastMatch: i < 5 ? `${i * 3 + 2}m atrás` : '—',
  coverage: ['Porta de Embarque','Corredor Principal','Área de Check-in','Zona Alfandegária','Esteira de Bagagens','Acesso Restrito','Saída de Emergência','Área de Espera','Duty Free','Estacionamento','Acesso Controle','Portaria'][i],
}));

const mockCases = [
  { id: 'CASO-001', target: 'Carlos Eduardo da Silva', type: 'Narcoterrorista P1', status: 'ACTIVE',   opened: '15/05/2024', matches: 3, priority: 'CRÍTICO' },
  { id: 'CASO-002', target: 'Marcos Paulo Rocha',      type: 'Tráfico Internacional', status: 'REVIEW', opened: '10/05/2024', matches: 1, priority: 'ALTO' },
  { id: 'CASO-003', target: 'Rede de Receptação SP',   type: 'P12 – Dispositivos',   status: 'CLOSED',  opened: '01/05/2024', matches: 7, priority: 'MÉDIO' },
];

const rolesList = [
  { role: 'Operador Muralha', perms: ['Visualizar matches','Iniciar varredura','Abrir HITL'], users: 24 },
  { role: 'Revisor HITL',     perms: ['Confirmar/rejeitar match','Ver evidências','Feedback'],  users: 18 },
  { role: 'Supervisor',       perms: ['Override SLA','Ver filas','Escalar casos','Relatórios'], users: 6 },
  { role: 'Magistrado',       perms: ['Autorização operacional','Despacho','Assinatura ICP'],   users: 4 },
  { role: 'Administrador',    perms: ['Gestão de políticas','Configurar reason codes','RBAC'],  users: 2 },
];

const reasonCodes = [
  { code: 'ANGLE_OBSTRUCTION', desc: 'Câmera em ângulo desfavorável — oclusão parcial do rosto', count: 38 },
  { code: 'LOW_LIGHTING',       desc: 'Iluminação insuficiente — score abaixo de threshold',       count: 52 },
  { code: 'PARTIAL_OCCLUSION',  desc: 'Uso de máscara, óculos ou chapéu obstruindo biometria',     count: 24 },
  { code: 'TWIN_SIMILARITY',    desc: 'Alta similaridade com irmão/gêmeo — requer íris',            count: 8 },
  { code: 'WRONG_SECTOR',       desc: 'Alvo fora do setor monitorado — atualizar geofence',         count: 14 },
  { code: 'MODEL_ARTIFACT',     desc: 'Artefato do modelo Rekognition — enviar para retreino',      count: 6 },
  { code: 'DATABASE_STALE',     desc: 'Foto cadastral desatualizada — solicitar nova captura',      count: 19 },
];

// ─── Status badge helper ──────────────────────────────────────────────────────
function MatchStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    PENDING_REVIEW: { label: 'Aguardando',   cls: 'bg-warning/20 text-warning border-warning/30 animate-pulse' },
    IN_REVIEW:      { label: 'Em Revisão',   cls: 'bg-primary/20 text-primary border-primary/30' },
    APPROVED:       { label: 'Confirmado',   cls: 'bg-success/20 text-success border-success/30' },
    REJECTED:       { label: 'Rejeitado',    cls: 'bg-slate-700/40 text-slate-400 border-white/10' },
    BLOCKED:        { label: 'Bloqueado',    cls: 'bg-red-600/20 text-red-400 border-red-600/30' },
  };
  const c = cfg[status] ?? cfg.PENDING_REVIEW;
  return <Badge variant="outline" className={cn('text-[9px] font-black', c.cls)}>{c.label}</Badge>;
}

// ─── Dashboard View ───────────────────────────────────────────────────────────
function DashboardView({ setView }: { setView: (v: P9View) => void }) {
  const kpis = [
    { label: 'Câmeras Ativas',          value: '924.5K',  sub: '92.4% uptime',          icon: <Camera className="h-5 w-5 text-cyan-400" />,       cls: 'border-l-cyan-500',  onClick: () => setView('CAMERAS') },
    { label: 'Matches Hoje',            value: '47',      sub: '+12 vs ontem',           icon: <Fingerprint className="h-5 w-5 text-red-400" />,    cls: 'border-l-red-500',   onClick: () => setView('MATCHES') },
    { label: 'Aguardando HITL',         value: '12',      sub: 'SLA: 28 min avg',        icon: <Users className="h-5 w-5 text-warning" />,          cls: 'border-l-warning',   onClick: () => setView('HITL__REVISOES') },
    { label: 'Alertas Críticos',        value: '5',       sub: '2 P1 lideranças',        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,  cls: 'border-l-red-600',   onClick: () => setView('ALERTAS') },
    { label: 'Precisão Biométrica',     value: '97.3%',   sub: 'Falso positivo: 2.7%',  icon: <ShieldCheck className="h-5 w-5 text-success" />,    cls: 'border-l-success',   onClick: () => setView('SUPERVISAO__INDICADORES') },
    { label: 'Despachos Ativos',        value: '3',       sub: 'Interceptação em curso', icon: <Radio className="h-5 w-5 text-primary" />,          cls: 'border-l-primary',   onClick: () => setView('HITL__DESPACHOS_ATIVOS') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Dashboard P9</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Muralha Brasileira — Biometric Surveillance Operations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <Card key={i} onClick={k.onClick}
            className={cn('bg-slate-900 border-white/10 border-l-4 cursor-pointer hover:border-cyan-500/40 transition-all hover:shadow-2xl group', k.cls)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-cyan-400 transition-colors">{k.label}</span>
                <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">{k.icon}</div>
              </div>
              <p className="text-2xl font-black text-white tracking-tight">{k.value}</p>
              <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                <Activity className="h-3 w-3 text-cyan-400" /> {k.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-cyan-400 uppercase flex items-center gap-2">
              <Activity className="h-4 w-4" /> Matches por Hora (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={matchTrendData}>
                  <defs>
                    <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                  <YAxis stroke="#475569" fontSize={10} />
                  <RechartsTip contentStyle={TOOLTIP} />
                  <Area type="monotone" dataKey="matches" stroke="#22D3EE" fill="url(#matchGrad)" strokeWidth={2} name="Matches" />
                  <Area type="monotone" dataKey="fp" stroke="#ef4444" fill="url(#fpGrad)" strokeWidth={2} name="Falso Positivo" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-cyan-400 uppercase flex items-center gap-2">
              <Camera className="h-4 w-4" /> Status da Rede de Câmeras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52 flex items-center gap-6">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={180}>
                  <RechartsPie>
                    <Pie data={cameraStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {cameraStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <RechartsTip contentStyle={TOOLTIP} formatter={(v: any) => [v.toLocaleString(), '']} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 shrink-0">
                {cameraStatusData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <div>
                      <p className="text-[10px] font-black text-white">{(d.value / 1000).toFixed(0)}K</p>
                      <p className="text-[9px] text-slate-500 uppercase">{d.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent matches */}
      <Card className="bg-slate-900 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-black text-red-400 uppercase flex items-center gap-2">
            <Fingerprint className="h-4 w-4" /> Matches Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {mockMatches.slice(0, 4).map((m, i) => (
              <div key={i} className="px-5 py-3 flex flex-wrap items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Fingerprint className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{m.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{m.id} · {m.sector} · {m.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black text-cyan-400">{m.confidence}%</span>
                  <Badge className={cn('text-[9px] font-black', m.threat === 'P1' ? 'bg-red-600 text-white' : 'bg-slate-700/60 text-slate-300')}>
                    {m.threat}
                  </Badge>
                  <MatchStatusBadge status={m.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Câmeras View ─────────────────────────────────────────────────────────────
function CamerasView() {
  const [filter, setFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'>('ALL');
  const filtered = filter === 'ALL' ? mockCameras : mockCameras.filter(c => c.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Câmeras</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
            Rede Nacional de Vigilância — 1.000.000+ nós
          </p>
        </div>
        <Badge className="bg-success/20 text-success border border-success/30 animate-pulse">
          <Activity className="h-3 w-3 mr-1" /> 924.5K Online
        </Badge>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['ALL','ONLINE','OFFLINE','MAINTENANCE'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all',
              filter === f ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10')}>
            {f === 'ALL' ? `Todas (${mockCameras.length})` : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((cam, i) => (
          <motion.div key={cam.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
            <Card className={cn('bg-slate-900 border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group',
              cam.status === 'OFFLINE' && 'border-red-600/20',
              cam.status === 'MAINTENANCE' && 'border-warning/20')}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                      cam.status === 'ONLINE' ? 'bg-cyan-500/10 border border-cyan-500/20' :
                      cam.status === 'OFFLINE' ? 'bg-red-600/10 border border-red-600/20' : 'bg-warning/10 border border-warning/20')}>
                      <Camera className={cn('h-4 w-4', cam.status === 'ONLINE' ? 'text-cyan-400' : cam.status === 'OFFLINE' ? 'text-red-400' : 'text-warning')} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">{cam.id}</p>
                      <p className="text-[10px] text-slate-500">{cam.sector}</p>
                    </div>
                  </div>
                  <div className={cn('h-2 w-2 rounded-full shrink-0 mt-1',
                    cam.status === 'ONLINE' ? 'bg-success animate-pulse' :
                    cam.status === 'OFFLINE' ? 'bg-red-600 animate-ping' : 'bg-warning')} />
                </div>
                <p className="text-[10px] text-slate-400 mb-3">{cam.coverage}</p>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="bg-black/30 rounded p-1.5 text-center">
                    <p className="text-slate-500 uppercase">FPS</p>
                    <p className="text-white font-black">{cam.fps}</p>
                  </div>
                  <div className="bg-black/30 rounded p-1.5 text-center">
                    <p className="text-slate-500 uppercase">Res</p>
                    <p className="text-white font-black">{cam.resolution}</p>
                  </div>
                  <div className="bg-black/30 rounded p-1.5 text-center">
                    <p className="text-slate-500 uppercase">Match</p>
                    <p className={cn('font-black', cam.lastMatch !== '—' ? 'text-cyan-400' : 'text-slate-600')}>{cam.lastMatch}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Matches View ─────────────────────────────────────────────────────────────
function MatchesView() {
  const [selected, setSelected] = useState<typeof mockMatches[0] | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Matches Biométricos</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Hits de reconhecimento multimodal — Face + Marcha + Íris
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Hoje', value: '47', color: 'text-white' },
          { label: 'Confirmados', value: '31', color: 'text-success' },
          { label: 'Aguardando', value: '12', color: 'text-warning' },
          { label: 'Falso Positivo', value: '4', color: 'text-red-400' },
        ].map((k, i) => (
          <Card key={i} className="bg-slate-900 border-white/10">
            <CardContent className="p-4">
              <p className="text-[10px] font-black text-slate-500 uppercase">{k.label}</p>
              <p className={cn('text-3xl font-black mt-1', k.color)}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-2">
          {mockMatches.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
              <Card onClick={() => setSelected(m === selected ? null : m)}
                className={cn('bg-slate-900 border-white/10 cursor-pointer hover:border-cyan-500/30 transition-all',
                  selected?.id === m.id && 'border-cyan-500 ring-1 ring-cyan-500')}>
                <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center border shrink-0',
                      m.threat === 'P1' ? 'bg-red-600/20 border-red-600/30' : 'bg-cyan-500/10 border-cyan-500/20')}>
                      <Fingerprint className={cn('h-5 w-5', m.threat === 'P1' ? 'text-red-400' : 'text-cyan-400')} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-white">{m.name}</p>
                        {m.threat === 'P1' && <Badge className="bg-red-600 text-[9px] font-black text-white animate-pulse">ALVO P1</Badge>}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">{m.id} · {m.sector} · {m.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-black uppercase">Confiança</p>
                      <p className="text-lg font-black text-cyan-400">{m.confidence}%</p>
                    </div>
                    <MatchStatusBadge status={m.status} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Card className="bg-slate-900 border-cyan-500/30 sticky top-0">
                <CardHeader className="pb-3 bg-cyan-500/5 border-b border-cyan-500/20">
                  <CardTitle className="text-xs font-black text-cyan-400 uppercase flex items-center gap-2">
                    <Fingerprint className="h-4 w-4" /> Detalhes do Match
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase">Target</p>
                    <p className="text-base font-black text-white mt-0.5">{selected.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Match ID', value: selected.id },
                      { label: 'Setor', value: selected.sector },
                      { label: 'Threat', value: selected.threat },
                      { label: 'Registrado', value: selected.time },
                    ].map((f, i) => (
                      <div key={i} className="bg-black/30 rounded-lg p-2.5">
                        <p className="text-[9px] text-slate-500 uppercase font-black">{f.label}</p>
                        <p className="text-xs font-bold text-white mt-0.5">{f.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-500 font-black uppercase">Scores Multimodais</p>
                    {[
                      { label: 'Face', value: selected.confidence },
                      { label: 'Gait', value: Math.round(selected.confidence * 0.96) },
                      { label: 'Íris', value: Math.round(selected.confidence * 0.99) },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 w-10 font-bold">{s.label}</span>
                        <Progress value={s.value} className="flex-1 h-1.5 bg-slate-800" indicatorClassName="bg-cyan-500" />
                        <span className="text-[10px] font-mono text-cyan-400 w-10 text-right">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                  <MatchStatusBadge status={selected.status} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── HITL Panel de Revisões ───────────────────────────────────────────────────
function HitlRevisoesView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Painel de Revisões HITL</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Fila centralizada de matches aguardando revisão humana
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {hitlQueueData.map((q, i) => (
          <Card key={i} className="bg-slate-900 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-black text-slate-500 uppercase">{q.type}</p>
                <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: q.color }} />
              </div>
              <p className="text-3xl font-black text-white">{q.pending}</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-500">SLA</span>
                  <span style={{ color: q.sla > 90 ? '#22c55e' : '#f59e0b' }}>{q.sla}%</span>
                </div>
                <Progress value={q.sla} className="h-1 bg-slate-800" indicatorClassName="transition-all" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-slate-900 border-white/10">
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {mockMatches.filter(m => m.status === 'PENDING_REVIEW' || m.status === 'IN_REVIEW').map((m, i) => (
              <div key={i} className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{m.name}</p>
                    <p className="text-[10px] text-slate-500">{m.id} · {m.sector} · {m.confidence}% confiança</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MatchStatusBadge status={m.status} />
                  <button className="px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 text-[10px] font-black text-success uppercase hover:bg-success/20 transition-colors">
                    Revisar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── HITL Revisão Biométrica ──────────────────────────────────────────────────
function HitlRevisaoBiometricaView() {
  const [decision, setDecision] = useState<'CONFIRM' | 'REJECT' | null>(null);
  const match = mockMatches[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Revisão Biométrica</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Confirmação / rejeição de match com scores multimodais
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-black text-cyan-400 uppercase flex items-center gap-2">
              <Camera className="h-4 w-4" /> Frame Capturado (Câmera {match.sector})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-slate-950 rounded-xl border border-white/10 overflow-hidden relative">
              <img src="https://i.pravatar.cc/800?u=target-sip-882" alt="target" className="w-full h-full object-cover opacity-40 grayscale" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-cyan-400 w-24 h-28 rounded relative">
                  <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-cyan-400/30">
                <p className="text-[10px] font-mono text-cyan-400">CONF: {match.confidence}% · {match.time}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
              <Database className="h-4 w-4" /> Foto Cadastral (ABIS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-slate-950 rounded-xl border border-white/10 overflow-hidden relative">
              <img src="https://i.pravatar.cc/800?u=sip-db-882" alt="db" className="w-full h-full object-cover opacity-50 grayscale" />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
                <p className="text-[10px] font-mono text-slate-400">DB_REF: SIP-8821 · 2023-04-12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-slate-900 border-white/10">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            {[
              { label: 'Reconhecimento Facial', value: match.confidence, color: '#22D3EE' },
              { label: 'Análise de Marcha (Gait)', value: 94.2, color: '#a855f7' },
              { label: 'Íris Biométrica', value: 99.1, color: '#22c55e' },
              { label: 'Score Composto ABIS', value: 97.7, color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 w-44 font-bold shrink-0">{s.label}</span>
                <Progress value={s.value} className="flex-1 h-2 bg-slate-800" />
                <span className="text-sm font-black w-14 text-right" style={{ color: s.color }}>{s.value}%</span>
              </div>
            ))}
          </div>
          {!decision ? (
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDecision('CONFIRM')}
                className="flex-1 py-3 rounded-xl bg-success/20 border border-success/30 text-success font-black uppercase text-xs tracking-widest hover:bg-success/30 transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Confirmar Match
              </button>
              <button onClick={() => setDecision('REJECT')}
                className="flex-1 py-3 rounded-xl bg-red-600/10 border border-red-600/20 text-red-400 font-black uppercase text-xs tracking-widest hover:bg-red-600/20 transition-colors flex items-center justify-center gap-2">
                <XCircle className="h-4 w-4" /> Rejeitar (Falso Positivo)
              </button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className={cn('p-4 rounded-xl border flex items-center gap-3',
                decision === 'CONFIRM' ? 'bg-success/10 border-success/30' : 'bg-red-600/10 border-red-600/20')}>
              {decision === 'CONFIRM'
                ? <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                : <XCircle className="h-5 w-5 text-red-400 shrink-0" />}
              <div>
                <p className={cn('text-xs font-black uppercase', decision === 'CONFIRM' ? 'text-success' : 'text-red-400')}>
                  {decision === 'CONFIRM' ? 'Match Confirmado — Acionar Despacho?' : 'Rejeitado — Registrar Reason Code'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Decisão registrada · Assinatura ICP-Brasil pendente</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── HITL Comparar Candidatos ─────────────────────────────────────────────────
function HitlCompararCandidatosView() {
  const candidates = [
    { rank: 1, name: 'Carlos Eduardo da Silva', score: 99.8, id: 'SIP-8821', photo: 'https://i.pravatar.cc/200?u=c1' },
    { rank: 2, name: 'Carlos Eduardo Santos',   score: 87.4, id: 'SIP-4412', photo: 'https://i.pravatar.cc/200?u=c2' },
    { rank: 3, name: 'Carlos E. da Silva Jr.',  score: 82.1, id: 'SIP-7723', photo: 'https://i.pravatar.cc/200?u=c3' },
    { rank: 4, name: 'C. Eduardo Mendes',       score: 71.3, id: 'SIP-2290', photo: 'https://i.pravatar.cc/200?u=c4' },
  ];
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Comparar Candidatos</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Candidatos rankeados pelo GSI — selecione o correto para confirmar
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {candidates.map((c, i) => (
          <Card key={i} onClick={() => setSelected(i === selected ? null : i)}
            className={cn('bg-slate-900 border-white/10 cursor-pointer hover:border-cyan-500/30 transition-all',
              selected === i && 'border-cyan-500 ring-1 ring-cyan-500',
              c.rank === 1 && 'border-warning/30')}>
            <CardContent className="p-4 text-center space-y-3">
              <div className="relative mx-auto w-16 h-16">
                <img src={c.photo} alt={c.name} className="w-full h-full rounded-full object-cover border-2 border-white/10" />
                <div className={cn('absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black',
                  c.rank === 1 ? 'bg-warning text-black' : 'bg-slate-700 text-white')}>
                  #{c.rank}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{c.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">{c.id}</p>
              </div>
              <div className={cn('text-lg font-black', c.score > 95 ? 'text-cyan-400' : c.score > 80 ? 'text-warning' : 'text-slate-400')}>
                {c.score}%
              </div>
              <Progress value={c.score} className="h-1.5 bg-slate-800" indicatorClassName={c.score > 95 ? 'bg-cyan-500' : 'bg-warning'} />
            </CardContent>
          </Card>
        ))}
      </div>
      {selected !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-slate-900 border-success/30">
            <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                <div>
                  <p className="text-sm font-black text-white">{candidates[selected].name} selecionado como alvo correto</p>
                  <p className="text-[10px] text-slate-500">Confirme para prosseguir com autorização operacional</p>
                </div>
              </div>
              <button className="px-6 py-2.5 rounded-xl bg-success/20 border border-success/30 text-success font-black uppercase text-xs tracking-widest hover:bg-success/30 transition-colors">
                Confirmar Seleção
              </button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ─── Supervisão SLA View ──────────────────────────────────────────────────────
function SupervisaoSLAView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">SLA HITL</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Tempo médio de revisão · Meta: 30 min
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Avg Revisão', value: '28 min', color: 'text-success', sub: 'Dentro do SLA' },
          { label: 'Pior Caso',   value: '52 min', color: 'text-warning', sub: 'Acima do SLA' },
          { label: 'SLA 90%ile', value: '41 min', color: 'text-white',   sub: 'Percentil 90' },
          { label: 'Compliance', value: '84%',    color: 'text-primary',  sub: 'Meta: 90%' },
        ].map((k, i) => (
          <Card key={i} className="bg-slate-900 border-white/10">
            <CardContent className="p-4">
              <p className="text-[10px] font-black text-slate-500 uppercase">{k.label}</p>
              <p className={cn('text-2xl font-black mt-1', k.color)}>{k.value}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-slate-900 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-black text-primary uppercase flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Tempo de Revisão por Dia (min) — Meta: 30 min
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={10} />
                <RechartsTip contentStyle={TOOLTIP} formatter={(v: any) => [`${v} min`]} />
                <Bar dataKey="target" name="Meta" fill="#1e293b" radius={[4,4,0,0]} barSize={16} />
                <Bar dataKey="actual" name="Real" radius={[4,4,0,0]} barSize={16}>
                  {slaData.map((e, i) => <Cell key={i} fill={e.actual <= 30 ? '#22c55e' : '#f59e0b'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Supervisão Filas ─────────────────────────────────────────────────────────
function SupervisaoFilasView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Filas HITL</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Profundidade de fila por tipo de alerta · previsão de backlog
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hitlQueueData.map((q, i) => (
          <Card key={i} className="bg-slate-900 border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-black text-white uppercase">{q.type}</p>
                  <p className="text-3xl font-black mt-1" style={{ color: q.color }}>{q.pending}</p>
                  <p className="text-[10px] text-slate-500">Aguardando revisão</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase">SLA</p>
                  <p className="text-xl font-black" style={{ color: q.sla > 90 ? '#22c55e' : '#f59e0b' }}>{q.sla}%</p>
                </div>
              </div>
              <Progress value={q.pending * 8} className="h-2 bg-slate-800" />
              <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase">
                <span>0</span>
                <span>Previsão: {Math.round(q.pending * 28)} min p/ limpar</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Supervisão Indicadores ───────────────────────────────────────────────────
function SupervisaoIndicadoresView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Indicadores Operacionais</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          KPIs do sistema Muralha Brasileira
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-cyan-400 uppercase flex items-center gap-2">
              <Activity className="h-4 w-4" /> Falso Positivo — Causas Raiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={fpRadarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <Radar name="FP %" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} />
                  <RechartsTip contentStyle={TOOLTIP} formatter={(v: any) => [`${v}%`]} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> KPIs Resumidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Taxa de Confirmação',       value: '91.5%', color: 'text-success' },
              { label: 'Taxa de Falso Positivo',    value: '2.7%',  color: 'text-warning' },
              { label: 'Tempo Médio de Despacho',   value: '4.2 min',color: 'text-primary' },
              { label: 'Precisão Multimodal',       value: '97.3%', color: 'text-cyan-400' },
              { label: 'Despachos Bem-Sucedidos',   value: '89.2%', color: 'text-success' },
              { label: 'Interceptações Confirmadas',value: '34',    color: 'text-red-400' },
            ].map((k, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <p className="text-[10px] font-black text-slate-400 uppercase">{k.label}</p>
                <span className={cn('text-sm font-black font-mono', k.color)}>{k.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Administração — Políticas HITL ──────────────────────────────────────────
function AdminPoliticasView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Políticas HITL</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Regras de threshold de confiança e roteamento de revisão
        </p>
      </div>
      {[
        { title: 'Threshold Auto-Dispatch', value: '99.0%', desc: 'Matches acima deste score são despachados automaticamente sem revisão HITL', status: 'ATIVO', icon: <Zap className="h-4 w-4 text-warning" /> },
        { title: 'Threshold Revisão Obrigatória', value: '80%–99%', desc: 'Matches neste intervalo entram na fila HITL para revisão humana antes de despacho', status: 'ATIVO', icon: <Users className="h-4 w-4 text-primary" /> },
        { title: 'Threshold Descarte Automático', value: '< 70%', desc: 'Matches abaixo do mínimo são descartados e registrados como não-identificado', status: 'ATIVO', icon: <XCircle className="h-4 w-4 text-slate-500" /> },
        { title: 'Segunda Revisão Obrigatória', value: 'Score 80%–90%', desc: 'Exige segundo revisor independente antes de autorização operacional', status: 'ATIVO', icon: <RefreshCw className="h-4 w-4 text-cyan-400" /> },
        { title: 'Auto-Escalação por SLA', value: '> 45 min', desc: 'Tarefa HITL sem revisão após 45 min é automaticamente escalada para supervisor', status: 'ATIVO', icon: <Clock className="h-4 w-4 text-red-400" /> },
      ].map((p, i) => (
        <Card key={i} className="bg-slate-900 border-white/10 hover:border-cyan-500/20 transition-colors">
          <CardContent className="p-5 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">{p.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-black text-white">{p.title}</p>
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black font-mono border border-primary/20">{p.value}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-lg">{p.desc}</p>
              </div>
            </div>
            <Badge className="bg-success/20 text-success border border-success/30 text-[10px] font-black">{p.status}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Administração — Perfis e Roles ──────────────────────────────────────────
function AdminPerfisView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Perfis e Roles</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          RBAC — Controle de acesso baseado em papel no fluxo Muralha
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rolesList.map((r, i) => (
          <Card key={i} className="bg-slate-900 border-white/10 hover:border-cyan-500/20 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <UserCog className="h-4 w-4 text-cyan-400" />
                  </div>
                  <p className="text-sm font-black text-white">{r.role}</p>
                </div>
                <Badge className="bg-slate-700/40 text-slate-300 text-[10px] font-black">{r.users} usuários</Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {r.perms.map((p, j) => (
                  <span key={j} className="text-[9px] font-bold bg-white/5 border border-white/10 px-2 py-1 rounded-full text-slate-300">
                    {p}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Administração — Reason Codes ────────────────────────────────────────────
function AdminReasonCodesView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Motivos / Reason Codes</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Códigos padronizados de rejeição para retroalimentação do modelo ML
        </p>
      </div>
      <Card className="bg-slate-900 border-white/10">
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {reasonCodes.map((r, i) => (
              <div key={i} className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                    <Tag className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-cyan-400 font-mono">{r.code}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{r.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-black">Usos</p>
                  <p className="text-lg font-black text-white">{r.count}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Casos View ───────────────────────────────────────────────────────────────
function CasosView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Casos Muralha</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Casos gerados por matches biométricos confirmados
        </p>
      </div>
      <div className="space-y-3">
        {mockCases.map((c, i) => (
          <Card key={i} className={cn('bg-slate-900 border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer',
            c.status === 'ACTIVE' && 'border-l-4 border-l-red-500')}>
            <CardContent className="p-5 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0">
                  <Briefcase className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-black text-white">{c.id}</p>
                    <Badge className={cn('text-[9px] font-black',
                      c.priority === 'CRÍTICO' ? 'bg-red-600 text-white' :
                      c.priority === 'ALTO' ? 'bg-warning/20 text-warning border border-warning/30' :
                      'bg-slate-700/40 text-slate-300')}>
                      {c.priority}
                    </Badge>
                  </div>
                  <p className="text-xs font-bold text-white">{c.target}</p>
                  <p className="text-[10px] text-slate-500">{c.type} · Aberto: {c.opened} · {c.matches} match(es)</p>
                </div>
              </div>
              <Badge variant="outline" className={cn('text-[10px] font-black',
                c.status === 'ACTIVE' ? 'bg-success/10 border-success/20 text-success' :
                c.status === 'REVIEW' ? 'bg-primary/10 border-primary/20 text-primary' :
                'bg-slate-700/40 border-white/10 text-slate-400')}>
                {c.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Generic placeholder ──────────────────────────────────────────────────────
function GenericView({ title, icon, desc }: { title: string; icon: React.ReactNode; desc?: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          {desc ?? 'Módulo P9 — Muralha Brasileira'}
        </p>
      </div>
      <Card className="bg-slate-900 border-white/10">
        <CardContent className="p-20 text-center">
          <div className="opacity-20 mx-auto mb-4 w-fit">{icon}</div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{title}</p>
          <p className="text-slate-700 text-[10px] mt-2 font-mono uppercase">P9_{title.replace(/[\s/]/g, '_').toUpperCase()}_MODULE_PENDING_SUPABASE</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Content router ───────────────────────────────────────────────────────────
function P9ContentView({ view, setView }: { view: P9View; setView: (v: P9View) => void }) {
  switch (view) {
    case 'DASHBOARD':                   return <DashboardView setView={setView} />;
    case 'CAMERAS':                     return <CamerasView />;
    case 'OBSERVACOES':                 return <GenericView title="Observações" icon={<Eye className="h-16 w-16" />} desc="Registros de observação manual de operadores de câmera" />;
    case 'MATCHES':                     return <MatchesView />;
    case 'HITL':
    case 'HITL__REVISOES':              return <HitlRevisoesView />;
    case 'HITL__MINHAS_TAREFAS':        return <GenericView title="Minhas Tarefas" icon={<Briefcase className="h-16 w-16" />} desc="Fila individual do operador — Tarefas atribuídas" />;
    case 'HITL__REVISAO_BIOMETRICA':    return <HitlRevisaoBiometricaView />;
    case 'HITL__COMPARAR_CANDIDATOS':   return <HitlCompararCandidatosView />;
    case 'HITL__SEGUNDA_REVISAO':       return <GenericView title="Segunda Revisão" icon={<RefreshCw className="h-16 w-16" />} desc="Workflow de escalação — segundo revisor independente" />;
    case 'HITL__SUPERVISAO':            return <GenericView title="Supervisão" icon={<ShieldCheck className="h-16 w-16" />} desc="Visão do supervisor — override e SLA da equipe" />;
    case 'HITL__PENDENCIAS_JURIDICAS':  return <GenericView title="Pendências Jurídicas" icon={<Gavel className="h-16 w-16" />} desc="Matches confirmados aguardando autorização judicial" />;
    case 'HITL__RESOLUCAO_TERRITORIAL': return <GenericView title="Resolução Territorial" icon={<MapPin className="h-16 w-16" />} desc="Casos com conflito de jurisdição entre unidades" />;
    case 'HITL__AUTORIZACAO_OPERACIONAL':return <GenericView title="Autorização Operacional" icon={<Key className="h-16 w-16" />} desc="Multi-assinatura Dual-Key para despacho de interceptação" />;
    case 'HITL__ALERTAS_BLOQUEADOS':    return <GenericView title="Alertas Bloqueados" icon={<Lock className="h-16 w-16" />} desc="Matches bloqueados por regra jurídica ou territorial" />;
    case 'HITL__DESPACHOS_ATIVOS':      return <GenericView title="Despachos Ativos" icon={<Radio className="h-16 w-16" />} desc="Ordens de despacho em curso — rastreamento de campo" />;
    case 'HITL__FEEDBACK':              return <GenericView title="Feedback / Falso Positivo" icon={<Flag className="h-16 w-16" />} desc="Registro estruturado para retreino do modelo Rekognition" />;
    case 'HITL__EVIDENCIAS':            return <GenericView title="Evidências" icon={<Camera className="h-16 w-16" />} desc="Galeria de frames, áudios e documentos vinculados ao caso" />;
    case 'HITL__TIMELINE':              return <GenericView title="Timeline" icon={<History className="h-16 w-16" />} desc="Cadeia cronológica: detecção → HITL → autorização → custódia" />;
    case 'ALERTAS':                     return <GenericView title="Alertas" icon={<AlertTriangle className="h-16 w-16 text-red-400" />} desc="Alertas P1 e P2 gerados pela Muralha" />;
    case 'TERRITORIO':                  return <GenericView title="Território" icon={<MapPin className="h-16 w-16" />} desc="Mapa de cobertura e geofences da Muralha" />;
    case 'EVIDENCIAS':                  return <GenericView title="Evidências" icon={<FileText className="h-16 w-16" />} desc="Repositório centralizado de evidências de casos Muralha" />;
    case 'CASOS':                       return <CasosView />;
    case 'SUPERVISAO__SLA':             return <SupervisaoSLAView />;
    case 'SUPERVISAO__FILAS':           return <SupervisaoFilasView />;
    case 'SUPERVISAO__ESCALACOES':      return <GenericView title="Escalações" icon={<ArrowUpRight className="h-16 w-16" />} desc="Casos que ultrapassaram SLA e foram escalados automaticamente" />;
    case 'SUPERVISAO__DIVERGENCIAS':    return <GenericView title="Divergências" icon={<GitBranch className="h-16 w-16" />} desc="Casos onde dois revisores divergiram — terceira instância" />;
    case 'SUPERVISAO__INDICADORES':     return <SupervisaoIndicadoresView />;
    case 'ADMIN__POLITICAS':            return <AdminPoliticasView />;
    case 'ADMIN__PERFIS':               return <AdminPerfisView />;
    case 'ADMIN__INSTITUICOES':         return <GenericView title="Instituições" icon={<Building2 className="h-16 w-16" />} desc="Órgãos autorizados a receber alertas: PF, PM, GCM, PRF" />;
    case 'ADMIN__REASON_CODES':         return <AdminReasonCodesView />;
    case 'ADMIN__ESCALONAMENTOS':       return <GenericView title="Escalonamentos" icon={<Network className="h-16 w-16" />} desc="Regras de escalação automática por inatividade ou SLA" />;
    default:                            return <DashboardView setView={setView} />;
  }
}

// ─── Root component ───────────────────────────────────────────────────────────
interface P9CommandCenterProps {
  initialView?: string;
}

export function P9CommandCenter({ initialView }: P9CommandCenterProps) {
  const [activeView, setActiveView] = useState<P9View>('DASHBOARD');
  const [expandedHitl, setExpandedHitl] = useState(true);

  useEffect(() => {
    if (initialView) setActiveView(initialView as P9View);
  }, [initialView]);

  const isActive = (id: P9View) => activeView === id || activeView.startsWith(id + '__');

  return (
    <div className="h-full flex bg-slate-950 rounded-xl overflow-hidden border border-white/10">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <div className="w-56 border-r border-white/10 flex flex-col bg-slate-900/60 shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 shrink-0">
              <Scan className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-black text-white uppercase tracking-tighter leading-tight truncate">P9 Muralha</h3>
              <p className="text-[10px] text-cyan-400/70 font-bold uppercase tracking-widest truncate">Biometric Control</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-2 px-1.5">
          {menuSections.map((section) => (
            <div key={section.label} className="mb-3">
              <p className="px-2 mb-1 text-[9px] font-black text-slate-600 uppercase tracking-widest">{section.label}</p>
              <nav className="space-y-0.5">
                {section.items.map((item: any) => {
                  const active = isActive(item.id);
                  const hasChildren = !!item.children;
                  const isHitlExpanded = item.id === 'HITL' && expandedHitl;

                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => {
                          if (hasChildren) { setExpandedHitl(p => !p); }
                          else { setActiveView(item.id); }
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all group border',
                          active && !hasChildren ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                          active && hasChildren  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                          'text-slate-400 hover:bg-white/5 hover:text-white border-transparent',
                        )}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className={cn('shrink-0', active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white')}>{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </span>
                        <span className="flex items-center gap-1 shrink-0 ml-1">
                          {item.badge && (
                            <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-black leading-none', item.badgeClass)}>{item.badge}</span>
                          )}
                          {hasChildren && (
                            <ChevronRight className={cn('h-3 w-3 transition-transform text-slate-600', isHitlExpanded && 'rotate-90')} />
                          )}
                        </span>
                      </button>
                      {/* Children */}
                      <AnimatePresence>
                        {hasChildren && isHitlExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 my-0.5 border-l border-white/5 pl-2 space-y-0.5">
                              {item.children.map((child: any) => (
                                <button key={child.id} onClick={() => setActiveView(child.id)}
                                  className={cn(
                                    'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all',
                                    activeView === child.id ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:bg-white/5 hover:text-white',
                                  )}>
                                  <span className="flex items-center gap-2 min-w-0">
                                    {child.icon}
                                    <span className="truncate">{child.label}</span>
                                  </span>
                                  {child.badge && (
                                    <span className={cn('px-1 py-0.5 rounded text-[9px] font-black leading-none shrink-0', child.badgeClass)}>{child.badge}</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </div>
          ))}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse shrink-0" />
            <span className="uppercase tracking-widest truncate">924.5K Câmeras Online</span>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
            className="h-full overflow-y-auto custom-scrollbar p-6"
          >
            <P9ContentView view={activeView} setView={setActiveView} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
