import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard, Briefcase, DollarSign, GitBranch, Brain, Scale,
  Users, FileText, Shield, ArrowLeft, ChevronDown, ChevronRight,
  Activity, AlertTriangle, BookOpen, UserCheck, Globe, BarChart3,
  BookMarked, ClipboardList, Settings, Zap, Network, Building2,
  Wallet, TrendingUp, FileSearch, Gavel, MessagesSquare, Package,
  CheckSquare, PieChart, History, ShieldCheck, X, Menu
} from 'lucide-react';
import { fdeMockData } from '@/data/fdeData';

interface NavSection {
  id: string;
  label: string;
  icon: React.ElementType;
  items: { label: string; path: string; icon: React.ElementType; badge?: number }[];
}

const navSections: NavSection[] = [
  {
    id: '01', label: 'VISÃO GERAL', icon: LayoutDashboard,
    items: [
      { label: 'Dashboard Executivo', path: '/fde/dashboard/executivo', icon: PieChart },
      { label: 'Dashboard Operacional', path: '/fde/dashboard/operacional', icon: Activity },
    ]
  },
  {
    id: '02', label: 'INVESTIGAÇÕES', icon: Briefcase,
    items: [
      { label: 'Casos', path: '/fde/cases', icon: Briefcase },
      { label: 'Case 360', path: '/fde/case360', icon: FileSearch },
      { label: 'Timeline', path: '/fde/timeline', icon: History },
      { label: 'Evidências', path: '/fde/evidencias', icon: BookMarked },
    ]
  },
  {
    id: '03', label: 'INTEL. FINANCEIRA', icon: DollarSign,
    items: [
      { label: 'Transações', path: '/fde/transacoes', icon: DollarSign },
      { label: 'Fluxo Financeiro', path: '/fde/fluxo', icon: TrendingUp },
      { label: 'Entidades', path: '/fde/entidades', icon: Users },
      { label: 'Organizações', path: '/fde/organizacoes', icon: Building2 },
      { label: 'Ativos', path: '/fde/ativos', icon: Wallet },
      { label: 'Grafo', path: '/fde/grafo', icon: Network },
    ]
  },
  {
    id: '04', label: 'ANÁLISE', icon: Brain,
    items: [
      { label: 'Análise Neuro-Simbólica', path: '/fde/analise', icon: Brain },
      { label: 'Scores', path: '/fde/scores', icon: BarChart3 },
      { label: 'Alertas', path: '/fde/alertas', icon: AlertTriangle, badge: fdeMockData.kpis.alertsOpen },
      { label: 'Explicabilidade', path: '/fde/explicabilidade', icon: BookOpen },
    ]
  },
  {
    id: '05', label: 'JURÍDICO & REGRAS', icon: Scale,
    items: [
      { label: 'Legal Temporal Framework', path: '/fde/legal', icon: Scale },
      { label: 'Rule Manager', path: '/fde/rules', icon: ClipboardList },
      { label: 'Rule Comparison', path: '/fde/rule-comparison', icon: GitBranch },
      { label: 'Rule Sandbox', path: '/fde/rule-sandbox', icon: Settings },
    ]
  },
  {
    id: '06', label: 'DECISÃO HUMANA', icon: UserCheck,
    items: [
      { label: 'HITL Queue', path: '/fde/hitl', icon: UserCheck, badge: fdeMockData.kpis.hitlPending },
      { label: 'Decision Workspace', path: '/fde/decision', icon: Gavel },
    ]
  },
  {
    id: '07', label: 'COOPERAÇÃO', icon: Globe,
    items: [
      { label: 'InterAgency Cases', path: '/fde/interagency', icon: MessagesSquare },
      { label: 'Intelligence Packages', path: '/fde/intel-packages', icon: Package },
      { label: 'Sharing Approval', path: '/fde/sharing', icon: CheckSquare },
    ]
  },
  {
    id: '08', label: 'RESULTADOS', icon: FileText,
    items: [
      { label: 'Dossiê Financeiro', path: '/fde/dossie', icon: FileText },
      { label: 'Relatórios', path: '/fde/relatorios', icon: BarChart3 },
      { label: 'Auditoria', path: '/fde/auditoria', icon: ShieldCheck },
      { label: 'Administração', path: '/fde/admin', icon: Settings },
    ]
  },
];

export function FDELayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSection = (id: string) => {
    setCollapsed(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900/95 border-r border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/30">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-black text-white uppercase tracking-tight">IABS-FDE</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Financial Disruption Engine</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-7 text-[10px] font-bold uppercase text-slate-400 hover:text-white border border-white/10 hover:bg-white/5"
          onClick={() => navigate('/brasil-sem-medo')}
        >
          <ArrowLeft className="h-3 w-3 mr-2" /> Brasil Sem Medo
        </Button>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {navSections.map((section) => {
            const isCollapsed = collapsed.includes(section.id);
            const Icon = section.icon;
            return (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-600 font-mono w-4">{section.id}</span>
                    <Icon className="h-3 w-3 text-slate-500 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{section.label}</span>
                  </div>
                  {isCollapsed ? <ChevronRight className="h-3 w-3 text-slate-600" /> : <ChevronDown className="h-3 w-3 text-slate-600" />}
                </button>
                {!isCollapsed && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/5 pl-3">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={({ isActive }) => cn(
                            "flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] font-medium transition-all group",
                            isActive ? "bg-primary/20 text-primary border border-primary/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <ItemIcon className="h-3 w-3 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && item.badge > 0 && (
                            <Badge className="h-4 px-1 text-[9px] bg-red-600 border-none font-black">{item.badge}</Badge>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-success/10 rounded-lg border border-success/20">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[9px] font-black text-success uppercase tracking-widest">FDE Engine: Online</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-56 shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 shrink-0">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-gradient-to-br from-red-600 to-orange-500 rounded flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-black text-white">IABS-FDE</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
