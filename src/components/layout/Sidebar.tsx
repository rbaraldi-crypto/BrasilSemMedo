import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Scale, FileText, Gavel,
  ShieldAlert, Globe, Briefcase, ShieldCheck,
  Menu, Eye, Lock, ShieldX, Scan, Zap,
  Anchor, Plane, Package, MapPin, AlertTriangle,
  Activity, Users, Camera, Link2, Heart,
  ChevronRight, Waves, Building2, Radio,
  Home, Shield, Server, DollarSign, TrendingUp,
  BarChart3, PieChart, Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUI } from '@/contexts/UIContext';

// ─── P7 tree ──────────────────────────────────────────────────────────────────
interface P7Node {
  id: string; label: string; icon: React.ReactNode;
  badge?: string; badgeClass?: string; children?: P7Node[];
}

const p7Tree: P7Node[] = [
  { id: 'NACIONAL', label: 'Visão Nacional', icon: <Home className="h-3.5 w-3.5" /> },
  { id: 'PORTOS', label: 'Portos', icon: <Anchor className="h-3.5 w-3.5" />, children: [
    { id: 'PORTOS__Santos',    label: 'Santos',    icon: <Waves className="h-3 w-3" /> },
    { id: 'PORTOS__Paranaguá', label: 'Paranaguá', icon: <Waves className="h-3 w-3" /> },
    { id: 'PORTOS__Itajaí',    label: 'Itajaí',    icon: <Waves className="h-3 w-3" /> },
    { id: 'PORTOS__Rio Grande',label: 'Rio Grande', icon: <Waves className="h-3 w-3" /> },
    { id: 'PORTOS__Suape',     label: 'Suape',     icon: <Waves className="h-3 w-3" /> },
  ]},
  { id: 'AEROPORTOS', label: 'Aeroportos', icon: <Plane className="h-3.5 w-3.5" />, children: [
    { id: 'AEROPORTOS__GRU', label: 'Guarulhos (GRU)', icon: <Building2 className="h-3 w-3" /> },
    { id: 'AEROPORTOS__VCP', label: 'Viracopos (VCP)', icon: <Building2 className="h-3 w-3" /> },
    { id: 'AEROPORTOS__GIG', label: 'Galeão (GIG)',    icon: <Building2 className="h-3 w-3" /> },
    { id: 'AEROPORTOS__BSB', label: 'Brasília (BSB)',  icon: <Building2 className="h-3 w-3" /> },
    { id: 'AEROPORTOS__CNF', label: 'Confins (CNF)',   icon: <Building2 className="h-3 w-3" /> },
  ]},
  { id: 'CARGAS', label: 'Cargas', icon: <Package className="h-3.5 w-3.5" />, badge: '2.4K', badgeClass: 'bg-primary/20 text-primary' },
  { id: 'VIAGENS', label: 'Viagens', icon: <MapPin className="h-3.5 w-3.5" /> },
  { id: 'INSPECOES', label: 'Inspeções', icon: <Eye className="h-3.5 w-3.5" />, badge: '847', badgeClass: 'bg-warning/20 text-warning' },
  { id: 'INCONSISTENCIAS', label: 'Inconsistências', icon: <AlertTriangle className="h-3.5 w-3.5" />, badge: '23', badgeClass: 'bg-red-600/20 text-red-400' },
  { id: 'ALERTAS', label: 'Alertas', icon: <Radio className="h-3.5 w-3.5" />, badge: '5', badgeClass: 'bg-red-600 text-white' },
  { id: 'HITL', label: 'HITL', icon: <Users className="h-3.5 w-3.5" /> },
  { id: 'CASOS', label: 'Casos', icon: <FileText className="h-3.5 w-3.5" /> },
  { id: 'EVIDENCIAS', label: 'Evidências', icon: <Camera className="h-3.5 w-3.5" /> },
  { id: 'INTEGRACOES', label: 'Integrações', icon: <Link2 className="h-3.5 w-3.5" /> },
  { id: 'SAUDE', label: 'Saúde 24x7', icon: <Heart className="h-3.5 w-3.5" /> },
];

// ─── P8 sub-items ─────────────────────────────────────────────────────────────
const p8Items = [
  { label: 'Overview',       path: '/p8-budget-control', icon: <Home className="h-3 w-3" /> },
  { label: 'Budget Alloc.',  path: '/p8-budget-control', icon: <PieChart className="h-3 w-3" /> },
  { label: 'ROI by Axis',    path: '/p8-budget-control', icon: <TrendingUp className="h-3 w-3" /> },
  { label: 'Congressional',  path: '/p8-budget-control', icon: <Gavel className="h-3 w-3" />, badge: '3', badgeClass: 'bg-warning/20 text-warning' },
  { label: 'Execution',      path: '/p8-budget-control', icon: <BarChart3 className="h-3 w-3" /> },
  { label: 'Program Health', path: '/p8-budget-control', icon: <Activity className="h-3 w-3" /> },
];

// ─── P9 sub-items ─────────────────────────────────────────────────────────────
const p9Items = [
  { label: 'Dashboard',  view: 'DASHBOARD',              icon: <Home className="h-3 w-3" /> },
  { label: 'Câmeras',    view: 'CAMERAS',                icon: <Camera className="h-3 w-3" />, badge: '1M+', badgeClass: 'bg-cyan-500/20 text-cyan-400' },
  { label: 'Matches',    view: 'MATCHES',                icon: <Fingerprint className="h-3 w-3" />, badge: '47', badgeClass: 'bg-red-600/20 text-red-400' },
  { label: 'HITL',       view: 'HITL__REVISOES',         icon: <Users className="h-3 w-3" />, badge: '12', badgeClass: 'bg-warning/20 text-warning' },
  { label: 'Alertas',    view: 'ALERTAS',                icon: <AlertTriangle className="h-3 w-3" />, badge: '5', badgeClass: 'bg-red-600 text-white' },
  { label: 'Supervisão', view: 'SUPERVISAO__INDICADORES',icon: <Activity className="h-3 w-3" /> },
  { label: 'Admin',      view: 'ADMIN__POLITICAS',       icon: <Shield className="h-3 w-3" /> },
];

// ─── P7 tree item ─────────────────────────────────────────────────────────────
function P7TreeItem({ node, depth, activeId, expandedIds, onToggle, onSelect }: {
  node: P7Node; depth: number; activeId: string;
  expandedIds: Set<string>; onToggle: (id: string) => void; onSelect: (id: string) => void;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isActive = activeId === node.id;
  const indentPx = depth === 0 ? 'pl-3' : depth === 1 ? 'pl-6' : 'pl-9';

  return (
    <div>
      <button
        onClick={() => { if (hasChildren) onToggle(node.id); else onSelect(node.id); }}
        className={cn('w-full flex items-center justify-between py-1.5 pr-3 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all group', indentPx,
          isActive ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:bg-white/5 hover:text-white')}>
        <span className="flex items-center gap-2 min-w-0">
          <span className={cn('shrink-0', isActive ? 'text-amber-400' : 'text-slate-600 group-hover:text-white')}>{node.icon}</span>
          <span className="truncate">{node.label}</span>
        </span>
        <span className="flex items-center gap-1 shrink-0 ml-1">
          {node.badge && <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-black leading-none', node.badgeClass)}>{node.badge}</span>}
          {hasChildren && <ChevronRight className={cn('h-3 w-3 transition-transform text-slate-600', isExpanded && 'rotate-90')} />}
        </span>
      </button>
      {hasChildren && isExpanded && (
        <div className="border-l border-white/5 ml-5 my-0.5">
          {node.children!.map(child => (
            <P7TreeItem key={child.id} node={child} depth={depth + 1} activeId={activeId}
              expandedIds={expandedIds} onToggle={onToggle} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main sidebar ─────────────────────────────────────────────────────────────
export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { isNightVision, setNightVision, isLocked, setLocked, setActiveModal, requestMuralhaScan } = useUI();
  const [isOpen, setIsOpen] = useState(false);

  const isP7Route = location.pathname.startsWith('/p7-command-center');
  const isP8Route = location.pathname.startsWith('/p8-budget-control');
  const isP9Route = location.pathname.startsWith('/p9-muralha');
  const searchParams = new URLSearchParams(isP7Route ? location.search : '');
  const activeP7Id = searchParams.get('view') ?? '';

  const deriveExpanded = (): Set<string> => {
    const set = new Set<string>();
    if (!isP7Route) return set;
    set.add('__p7root__');
    for (const node of p7Tree) {
      if (node.children) {
        for (const child of node.children) {
          if (child.id === activeP7Id) set.add(node.id);
        }
      }
    }
    return set;
  };

  const [expandedIds, setExpandedIds] = useState<Set<string>>(deriveExpanded);
  const [p8Expanded, setP8Expanded] = useState(isP8Route);
  const [p9Expanded, setP9Expanded] = useState(isP9Route);

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleP7Select = (nodeId: string) => {
    navigate(`/p7-command-center?view=${encodeURIComponent(nodeId)}`);
    setIsOpen(false);
  };

  const handleMuralhaTest = () => {
    navigate('/brasil-sem-medo');
    setActiveModal('MURALHA');
    requestMuralhaScan();
    setIsOpen(false);
  };

  const navItems = [
    { label: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('nav.mycases'), path: '/meus-casos', icon: Briefcase },
    { label: 'Brasil Sem Medo', path: '/brasil-sem-medo', icon: ShieldCheck },
    { label: 'Muralha Paulista', path: '#muralha', icon: Scan, onClick: handleMuralhaTest, isAction: true },
    { label: t('nav.profile'), path: '/perfil/SIP-2024-8921', icon: User },
    { label: t('nav.compliance'), path: '/compliance', icon: ShieldAlert },
    { label: t('nav.precedents'), path: '/precedentes', icon: Scale },
    { label: t('nav.hitl'), path: '/acao-humana', icon: Gavel },
    { label: 'Backend Proposal', path: '/muralha-backend', icon: Server, isDevTool: true },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900/95 backdrop-blur-xl text-white border-r border-white/10 shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
          <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <FileText className="h-5 w-5 text-white" />
          </div>
          IABS-SIP
        </h1>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-2">Sistema Integrado Penal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = !item.isAction && !(item as any).isDevTool && location.pathname.startsWith(item.path);
          if (item.isAction) {
            return (
              <button key={item.label} onClick={item.onClick}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-black uppercase tracking-tighter transition-all duration-200 group text-cyan-400 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20">
                <item.icon className="h-4 w-4 animate-pulse" />
                {item.label}
                <Zap className="h-3 w-3 ml-auto opacity-50" />
              </button>
            );
          }
          if ((item as any).isDevTool) {
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}
                className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group border',
                  location.pathname === item.path ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'text-slate-600 hover:bg-white/5 hover:text-slate-400 border-dashed border-white/5')}>
                <item.icon className="h-4 w-4" />
                {item.label}
                <span className="ml-auto text-[9px] font-black uppercase bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">DEV</span>
              </Link>
            );
          }
          return (
            <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white')}>
              <item.icon className={cn('h-4 w-4 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-slate-500 group-hover:text-white')} />
              {item.label}
            </Link>
          );
        })}

        {/* ── P7 ──────────────────────────────────────────────────────── */}
        <div className="pt-1">
          <button onClick={() => toggleExpanded('__p7root__')}
            className={cn('w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-black uppercase tracking-tighter transition-all duration-200 group border',
              isP7Route ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'text-amber-400/80 hover:bg-amber-400/10 border-transparent hover:border-amber-400/20')}>
            <span className="flex items-center gap-3"><Shield className="h-4 w-4" /> P7 Command Center</span>
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-amber-600 text-[9px] font-black text-white">P7</span>
              <ChevronRight className={cn('h-3.5 w-3.5 transition-transform text-amber-500', expandedIds.has('__p7root__') && 'rotate-90')} />
            </span>
          </button>
          {expandedIds.has('__p7root__') && (
            <div className="mt-1 ml-2 border-l border-amber-500/20 pl-1 space-y-0.5">
              {p7Tree.map(node => (
                <P7TreeItem key={node.id} node={node} depth={0} activeId={activeP7Id}
                  expandedIds={expandedIds} onToggle={toggleExpanded} onSelect={handleP7Select} />
              ))}
            </div>
          )}
        </div>

        {/* ── P8 ──────────────────────────────────────────────────────── */}
        <div className="pt-1">
          <button onClick={() => setP8Expanded(p => !p)}
            className={cn('w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-black uppercase tracking-tighter transition-all duration-200 group border',
              isP8Route ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'text-emerald-400/80 hover:bg-emerald-400/10 border-transparent hover:border-emerald-400/20')}>
            <span className="flex items-center gap-3"><DollarSign className="h-4 w-4" /> P8 Budget Control</span>
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-[9px] font-black text-white">P8</span>
              <ChevronRight className={cn('h-3.5 w-3.5 transition-transform text-emerald-500', p8Expanded && 'rotate-90')} />
            </span>
          </button>
          {p8Expanded && (
            <div className="mt-1 ml-2 border-l border-emerald-500/20 pl-1 space-y-0.5">
              {p8Items.map((item, idx) => (
                <Link key={idx} to={item.path} onClick={() => setIsOpen(false)}
                  className={cn('w-full flex items-center justify-between py-1.5 pl-3 pr-3 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all group',
                    isP8Route ? 'text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-500 hover:bg-white/5 hover:text-white')}>
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 text-slate-600 group-hover:text-emerald-400 transition-colors">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge && <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-black leading-none shrink-0', item.badgeClass)}>{item.badge}</span>}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── P9 ──────────────────────────────────────────────────────── */}
        <div className="pt-1">
          <button onClick={() => setP9Expanded(p => !p)}
            className={cn('w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-black uppercase tracking-tighter transition-all duration-200 group border',
              isP9Route ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' : 'text-cyan-400/80 hover:bg-cyan-400/10 border-transparent hover:border-cyan-400/20')}>
            <span className="flex items-center gap-3"><Scan className="h-4 w-4" /> P9 Muralha</span>
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-cyan-600 text-[9px] font-black text-white">P9</span>
              <ChevronRight className={cn('h-3.5 w-3.5 transition-transform text-cyan-500', p9Expanded && 'rotate-90')} />
            </span>
          </button>
          {p9Expanded && (
            <div className="mt-1 ml-2 border-l border-cyan-500/20 pl-1 space-y-0.5">
              {p9Items.map((item, idx) => (
                <button key={idx} onClick={() => { navigate(`/p9-muralha?view=${item.view}`); setIsOpen(false); }}
                  className={cn('w-full flex items-center justify-between py-1.5 pl-3 pr-3 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all group',
                    isP9Route ? 'text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/10' : 'text-slate-500 hover:bg-white/5 hover:text-white')}>
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 text-slate-600 group-hover:text-cyan-400 transition-colors">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge && <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-black leading-none shrink-0', item.badgeClass)}>{item.badge}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider">
            <Globe className="h-3 w-3" /> Idioma
          </div>
          <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
            <SelectTrigger className="h-8 bg-slate-800 border-white/10 text-white text-xs rounded-lg">
              <SelectValue placeholder="Idioma" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10 text-white">
              <SelectItem value="pt" className="text-xs">Português (BR)</SelectItem>
              <SelectItem value="en" className="text-xs">English (US)</SelectItem>
              <SelectItem value="es" className="text-xs">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5">
            <div className="flex items-center gap-2">
              <Eye className={cn('h-3.5 w-3.5', isNightVision ? 'text-success' : 'text-slate-500')} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">Operação táctica</span>
            </div>
            <Switch checked={isNightVision} onCheckedChange={setNightVision} className="data-[state=checked]:bg-success" />
          </div>
          <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5">
            <div className="flex items-center gap-2">
              <ShieldX className={cn('h-3.5 w-3.5', isLocked ? 'text-destructive' : 'text-slate-500')} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">Bloqueio</span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] font-black uppercase bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/30" onClick={() => setLocked(true)}>
              Simular
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">JD</div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">Juiz Dr. Silva</span>
            <span className="text-xs text-slate-500 font-medium">Vara de Execuções</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex w-64 h-screen fixed left-0 top-0 z-50">
        <SidebarContent />
      </div>
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-md border-b border-white/10 z-[60] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">IABS-SIP</span>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white"><Menu className="h-6 w-6" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-white/10">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
