import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, MapPin, Anchor, Plane, Package,
  AlertTriangle, Activity, Users, FileText,
  Link2, Heart, Eye, ChevronRight, Home,
  Building2, Waves, Camera, Radio,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// ─── Types ────────────────────────────────────────────────────────────────────
type P7View =
  | 'HOME'
  | 'NACIONAL'
  | 'PORTOS'
  | 'AEROPORTOS'
  | 'CARGAS'
  | 'VIAGENS'
  | 'INSPECOES'
  | 'INCONSISTENCIAS'
  | 'ALERTAS'
  | 'HITL'
  | 'CASOS'
  | 'EVIDENCIAS'
  | 'INTEGRACOES'
  | 'SAUDE';

interface SubItem {
  label: string;
  icon: React.ReactNode;
}

interface MenuItem {
  id: P7View;
  label: string;
  icon: React.ReactNode;
  children?: SubItem[];
  badge?: string;
  badgeColor?: string;
}

// ─── Menu structure ───────────────────────────────────────────────────────────
const menuStructure: MenuItem[] = [
  { id: 'NACIONAL', label: 'Visão Nacional', icon: <Home className="h-4 w-4" /> },
  {
    id: 'PORTOS',
    label: 'Portos',
    icon: <Anchor className="h-4 w-4" />,
    children: [
      { label: 'Santos',     icon: <Waves className="h-3 w-3" /> },
      { label: 'Paranaguá',  icon: <Waves className="h-3 w-3" /> },
      { label: 'Itajaí',     icon: <Waves className="h-3 w-3" /> },
      { label: 'Rio Grande', icon: <Waves className="h-3 w-3" /> },
      { label: 'Suape',      icon: <Waves className="h-3 w-3" /> },
    ],
  },
  {
    id: 'AEROPORTOS',
    label: 'Aeroportos',
    icon: <Plane className="h-4 w-4" />,
    children: [
      { label: 'Guarulhos (GRU)', icon: <Building2 className="h-3 w-3" /> },
      { label: 'Viracopos (VCP)', icon: <Building2 className="h-3 w-3" /> },
      { label: 'Galeão (GIG)',    icon: <Building2 className="h-3 w-3" /> },
      { label: 'Brasília (BSB)',  icon: <Building2 className="h-3 w-3" /> },
      { label: 'Confins (CNF)',   icon: <Building2 className="h-3 w-3" /> },
    ],
  },
  { id: 'CARGAS',          label: 'Cargas',          icon: <Package className="h-4 w-4" />,       badge: '2.4K', badgeColor: 'bg-primary/20 text-primary' },
  { id: 'VIAGENS',         label: 'Viagens',         icon: <MapPin className="h-4 w-4" /> },
  { id: 'INSPECOES',       label: 'Inspeções',       icon: <Eye className="h-4 w-4" />,            badge: '847',  badgeColor: 'bg-warning/20 text-warning' },
  { id: 'INCONSISTENCIAS', label: 'Inconsistências', icon: <AlertTriangle className="h-4 w-4" />,  badge: '23',   badgeColor: 'bg-red-600/20 text-red-400' },
  { id: 'ALERTAS',         label: 'Alertas',         icon: <Radio className="h-4 w-4" />,          badge: '5',    badgeColor: 'bg-red-600 text-white' },
  { id: 'HITL',            label: 'HITL',            icon: <Users className="h-4 w-4" /> },
  { id: 'CASOS',           label: 'Casos',           icon: <FileText className="h-4 w-4" /> },
  { id: 'EVIDENCIAS',      label: 'Evidências',      icon: <Camera className="h-4 w-4" /> },
  { id: 'INTEGRACOES',     label: 'Integrações',     icon: <Link2 className="h-4 w-4" /> },
  { id: 'SAUDE',           label: 'Saúde 24x7',      icon: <Heart className="h-4 w-4" /> },
];

// ─── Resolve view from sidebar ?view= param ───────────────────────────────────
function resolveViewFromNodeId(nodeId: string): { view: P7View; sub: string | null } {
  if (!nodeId) return { view: 'HOME', sub: null };

  const [parent, child] = nodeId.split('__');

  const viewMap: Record<string, P7View> = {
    NACIONAL:        'NACIONAL',
    PORTOS:          'PORTOS',
    AEROPORTOS:      'AEROPORTOS',
    CARGAS:          'CARGAS',
    VIAGENS:         'VIAGENS',
    INSPECOES:       'INSPECOES',
    INCONSISTENCIAS: 'INCONSISTENCIAS',
    ALERTAS:         'ALERTAS',
    HITL:            'HITL',
    CASOS:           'CASOS',
    EVIDENCIAS:      'EVIDENCIAS',
    INTEGRACOES:     'INTEGRACOES',
    SAUDE:           'SAUDE',
  };

  return {
    view: (viewMap[parent] as P7View) ?? 'HOME',
    sub:  child ?? null,
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface P7CommandCenterProps {
  initialView?: string;
}

// ─── Root component ───────────────────────────────────────────────────────────
export function P7CommandCenter({ initialView }: P7CommandCenterProps) {
  const resolved = resolveViewFromNodeId(initialView ?? '');
  const [activeView, setActiveView]         = useState<P7View>(resolved.view);
  const [selectedSub, setSelectedSub]       = useState<string | null>(resolved.sub);
  const [expandedMenu, setExpandedMenu]     = useState<P7View | null>(() =>
    resolved.view === 'PORTOS' || resolved.view === 'AEROPORTOS' ? resolved.view : null
  );

  useEffect(() => {
    const r = resolveViewFromNodeId(initialView ?? '');
    setActiveView(r.view);
    setSelectedSub(r.sub);
    if (r.view === 'PORTOS' || r.view === 'AEROPORTOS') {
      setExpandedMenu(r.view);
    }
  }, [initialView]);

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      setExpandedMenu(prev => (prev === item.id ? null : item.id));
    } else {
      setActiveView(item.id);
      setSelectedSub(null);
    }
  };

  const handleSubClick = (parentId: P7View, childLabel: string) => {
    setActiveView(parentId);
    setSelectedSub(childLabel);
  };

  return (
    <div className="h-full flex bg-slate-950 rounded-xl overflow-hidden border border-white/10">
      {/* ── Internal sidebar ─────────────────────────────────────────────── */}
      <div className="w-56 border-r border-white/10 flex flex-col bg-slate-900/60 shrink-0">
        {/* header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0">
              <Shield className="h-5 w-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-black text-white uppercase tracking-tighter leading-tight truncate">
                P7 Command
              </h3>
              <p className="text-[10px] text-amber-400/70 font-bold uppercase tracking-widest truncate">
                Controle de Portos
              </p>
            </div>
          </div>
        </div>

        {/* nav */}
        <ScrollArea className="flex-1 py-2 px-1.5">
          <nav className="space-y-0.5">
            {menuStructure.map((item) => {
              const isActive = activeView === item.id;
              const isExpanded = expandedMenu === item.id;

              return (
                <div key={item.id + item.label}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all group border',
                      isActive && !item.children
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white border-transparent',
                    )}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={cn('shrink-0 transition-colors', isActive && !item.children ? 'text-amber-400' : 'text-slate-500 group-hover:text-white')}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    <span className="flex items-center gap-1 shrink-0 ml-1">
                      {item.badge && (
                        <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-black leading-none', item.badgeColor)}>
                          {item.badge}
                        </span>
                      )}
                      {item.children && (
                        <ChevronRight className={cn('h-3 w-3 transition-transform text-slate-600', isExpanded && 'rotate-90')} />
                      )}
                    </span>
                  </button>

                  {/* sub-items */}
                  <AnimatePresence>
                    {item.children && isExpanded && (
                      <motion.div
                        key="sub"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 my-0.5 border-l border-white/5 pl-2 space-y-0.5">
                          {item.children.map((child, idx) => {
                            const isSubActive = selectedSub === child.label && activeView === item.id;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleSubClick(item.id, child.label)}
                                className={cn(
                                  'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all',
                                  isSubActive
                                    ? 'bg-amber-500/10 text-amber-400'
                                    : 'text-slate-500 hover:bg-white/5 hover:text-white',
                                )}
                              >
                                {child.icon}
                                <span className="truncate">{child.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        {/* status footer */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse shrink-0" />
            <span className="uppercase tracking-widest truncate">Sistema Operacional</span>
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeView}__${selectedSub ?? ''}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="h-full overflow-y-auto custom-scrollbar p-6"
          >
            <P7ContentView view={activeView} selectedItem={selectedSub} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Content router ───────────────────────────────────────────────────────────
function P7ContentView({ view, selectedItem }: { view: P7View; selectedItem: string | null }) {
  switch (view) {
    case 'HOME':
    case 'NACIONAL':
      return <NationalView />;
    case 'PORTOS':
      return <PortosView selectedPort={selectedItem} />;
    case 'AEROPORTOS':
      return <AeroportosView selectedAirport={selectedItem} />;
    case 'CARGAS':
      return (
        <GenericModuleView
          title="Cargas"
          icon={<Package className="h-6 w-6 text-warning" />}
          badge="2.4K"
          badgeClass="bg-warning/20 text-warning"
        />
      );
    case 'VIAGENS':
      return <GenericModuleView title="Viagens" icon={<MapPin className="h-6 w-6 text-primary" />} />;
    case 'INSPECOES':
      return (
        <GenericModuleView
          title="Inspeções"
          icon={<Eye className="h-6 w-6 text-primary" />}
          badge="847"
          badgeClass="bg-warning/20 text-warning"
        />
      );
    case 'INCONSISTENCIAS':
      return (
        <GenericModuleView
          title="Inconsistências"
          icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
          badge="23"
          badgeClass="bg-red-600/20 text-red-400"
        />
      );
    case 'ALERTAS':
      return (
        <GenericModuleView
          title="Alertas"
          icon={<Radio className="h-6 w-6 text-red-500" />}
          badge="5"
          badgeClass="bg-red-600 text-white"
          pulse
        />
      );
    case 'HITL':
      return <GenericModuleView title="HITL" icon={<Users className="h-6 w-6 text-primary" />} />;
    case 'CASOS':
      return <GenericModuleView title="Casos" icon={<FileText className="h-6 w-6 text-primary" />} />;
    case 'EVIDENCIAS':
      return <GenericModuleView title="Evidências" icon={<Camera className="h-6 w-6 text-primary" />} />;
    case 'INTEGRACOES':
      return <GenericModuleView title="Integrações" icon={<Link2 className="h-6 w-6 text-primary" />} />;
    case 'SAUDE':
      return <GenericModuleView title="Saúde 24x7" icon={<Heart className="h-6 w-6 text-success" />} />;
    default:
      return <NationalView />;
  }
}

// ─── Views ────────────────────────────────────────────────────────────────────
function NationalView() {
  const stats = [
    { label: 'Portos Ativos',    value: '12',    icon: <Anchor className="h-4 w-4" />,       color: 'text-primary' },
    { label: 'Aeroportos',       value: '34',    icon: <Plane className="h-4 w-4" />,         color: 'text-success' },
    { label: 'Cargas Hoje',      value: '2,456', icon: <Package className="h-4 w-4" />,       color: 'text-warning' },
    { label: 'Alertas Críticos', value: '5',     icon: <AlertTriangle className="h-4 w-4" />, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Visão Nacional</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
            Monitoramento em Tempo Real — Pilar 7
          </p>
        </div>
        <Badge className="bg-success/20 text-success border border-success/30 animate-pulse">
          <Activity className="h-3 w-3 mr-1" /> ONLINE
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="bg-slate-900 border-white/10 hover:border-amber-500/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className={cn('p-2 rounded-lg bg-white/5', s.color)}>{s.icon}</span>
                <span className="text-2xl font-black text-white">{s.value}</span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase mt-3">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900 border-white/10">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase text-amber-400 flex items-center gap-2">
            <Shield className="h-4 w-4" /> Mapa Estratégico Nacional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="text-center relative z-10">
              <Shield className="h-14 w-14 text-amber-500/30 mx-auto mb-3" />
              <p className="text-slate-600 text-sm font-bold uppercase tracking-widest">
                Mapa Interativo — Em Integração
              </p>
              <p className="text-slate-700 text-[10px] mt-1 font-mono">
                P7_MAP_MODULE_PENDING_SATELLITE_FEED
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PortosView({ selectedPort }: { selectedPort: string | null }) {
  const portData = [
    { name: 'Santos',     throughput: '124.5M', status: 'OPERACIONAL', alerts: 2 },
    { name: 'Paranaguá',  throughput: '45.2M',  status: 'OPERACIONAL', alerts: 0 },
    { name: 'Itajaí',     throughput: '32.8M',  status: 'ALERTA',      alerts: 3 },
    { name: 'Rio Grande', throughput: '28.1M',  status: 'OPERACIONAL', alerts: 1 },
    { name: 'Suape',      throughput: '22.4M',  status: 'OPERACIONAL', alerts: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
          <Anchor className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white uppercase flex flex-wrap items-center gap-2">
            Portos
            {selectedPort && (
              <span className="text-amber-400">— {selectedPort}</span>
            )}
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Monitoramento Portuário Nacional
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {portData.map((port, i) => (
          <Card
            key={i}
            className={cn(
              'bg-slate-900 border-white/10 transition-all hover:border-primary/30 cursor-pointer',
              selectedPort === port.name && 'border-primary ring-1 ring-primary',
            )}
          >
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Waves className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{port.name}</p>
                  <p className="text-xs text-slate-500">Throughput: {port.throughput} ton/ano</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {port.alerts > 0 && (
                  <Badge className="bg-red-600/20 text-red-500 text-[10px] font-black">
                    {port.alerts} Alertas
                  </Badge>
                )}
                <Badge
                  className={cn(
                    'text-[10px] font-black',
                    port.status === 'OPERACIONAL'
                      ? 'bg-success/20 text-success'
                      : 'bg-warning/20 text-warning',
                  )}
                >
                  {port.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AeroportosView({ selectedAirport }: { selectedAirport: string | null }) {
  const airports = [
    { code: 'GRU', name: 'Guarulhos', city: 'São Paulo',      status: 'OPERACIONAL', flights: 342 },
    { code: 'VCP', name: 'Viracopos', city: 'Campinas',       status: 'OPERACIONAL', flights: 156 },
    { code: 'GIG', name: 'Galeão',    city: 'Rio de Janeiro', status: 'ALERTA',      flights: 234 },
    { code: 'BSB', name: 'Brasília',  city: 'Brasília',       status: 'OPERACIONAL', flights: 189 },
    { code: 'CNF', name: 'Confins',   city: 'Belo Horizonte', status: 'OPERACIONAL', flights: 98  },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center border border-success/30 shrink-0">
          <Plane className="h-6 w-6 text-success" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white uppercase flex flex-wrap items-center gap-2">
            Aeroportos
            {selectedAirport && (
              <span className="text-amber-400">— {selectedAirport}</span>
            )}
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Controle Aeroportuário Nacional
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {airports.map((a, i) => (
          <Card
            key={i}
            className={cn(
              'bg-slate-900 border-white/10 transition-all hover:border-success/30 cursor-pointer',
              selectedAirport?.includes(a.code) && 'border-success ring-1 ring-success',
            )}
          >
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {a.code} — {a.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {a.city} · {a.flights} voos hoje
                  </p>
                </div>
              </div>
              <Badge
                className={cn(
                  'text-[10px] font-black',
                  a.status === 'OPERACIONAL'
                    ? 'bg-success/20 text-success'
                    : 'bg-warning/20 text-warning',
                )}
              >
                {a.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GenericModuleView({
  title,
  icon,
  badge,
  badgeClass,
  pulse = false,
}: {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  badgeClass?: string;
  pulse?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'h-12 w-12 rounded-xl flex items-center justify-center border shrink-0',
            pulse ? 'bg-red-600/20 border-red-600/30' : 'bg-primary/20 border-primary/30',
          )}
        >
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-black text-white uppercase flex flex-wrap items-center gap-3">
            {title}
            {badge && (
              <Badge className={cn('text-[10px] font-black', badgeClass, pulse && 'animate-pulse')}>
                {badge}
              </Badge>
            )}
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Módulo P7 — Pilar 7 Brasil Sem Medo
          </p>
        </div>
      </div>

      <Card className={cn('bg-slate-900', pulse ? 'border-red-600/30' : 'border-white/10')}>
        <CardContent className="p-16 text-center">
          <div className={cn('mx-auto mb-4 opacity-20', pulse && 'animate-pulse')} style={{ width: 'fit-content' }}>
            {icon}
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            Módulo de {title} em Desenvolvimento
          </p>
          <p className="text-slate-700 text-[10px] mt-2 font-mono uppercase">
            P7_{title.replace(/\s/g, '_').toUpperCase()}_MODULE_PENDING
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
