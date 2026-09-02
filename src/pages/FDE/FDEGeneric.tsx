import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign, TrendingUp, Users, Building2, Wallet, Network,
  Brain, BarChart3, AlertTriangle, BookOpen, Scale, ClipboardList,
  GitBranch, Settings, Globe, MessagesSquare, Package, CheckSquare,
  FileText, ShieldCheck, BookMarked, History
} from 'lucide-react';
import { fdeMockData } from '@/data/fdeData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface PageConfig {
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const pageMap: Record<string, PageConfig> = {
  '/fde/transacoes': { title: 'Transações', subtitle: 'Monitoramento de movimentações financeiras suspeitas', icon: DollarSign },
  '/fde/fluxo': { title: 'Fluxo Financeiro', subtitle: 'Visualização de caminhos de dinheiro', icon: TrendingUp },
  '/fde/entidades': { title: 'Entidades', subtitle: 'Pessoas físicas, jurídicas e contas monitoradas', icon: Users },
  '/fde/organizacoes': { title: 'Organizações', subtitle: 'Facções e organizações criminosas rastreadas', icon: Building2 },
  '/fde/ativos': { title: 'Ativos', subtitle: 'Patrimônio identificado e em processo de bloqueio judicial', icon: Wallet },
  '/fde/grafo': { title: 'Grafo Investigativo', subtitle: 'Visualização de conexões entre entidades e transações', icon: Network },
  '/fde/analise': { title: 'Análise Neuro-Simbólica', subtitle: 'Modelos de IA aplicados à detecção de padrões', icon: Brain },
  '/fde/scores': { title: 'Scores de Risco', subtitle: 'Índices de periculosidade financeira por entidade', icon: BarChart3 },
  '/fde/alertas': { title: 'Alertas', subtitle: 'Notificações automáticas do motor de regras', icon: AlertTriangle },
  '/fde/explicabilidade': { title: 'Explicabilidade', subtitle: 'Transparência nas decisões da IA — SHAP/LIME', icon: BookOpen },
  '/fde/legal': { title: 'Legal Temporal Framework', subtitle: 'Marco jurídico-temporal das investigações', icon: Scale },
  '/fde/rules': { title: 'Rule Manager', subtitle: 'Gestão de regras de detecção de lavagem', icon: ClipboardList },
  '/fde/rule-comparison': { title: 'Rule Comparison', subtitle: 'Comparação entre versões de regras', icon: GitBranch },
  '/fde/rule-sandbox': { title: 'Rule Sandbox', subtitle: 'Teste seguro de novas regras em ambiente isolado', icon: Settings },
  '/fde/interagency': { title: 'InterAgency Cases', subtitle: 'Casos em colaboração com outras agências', icon: MessagesSquare },
  '/fde/intel-packages': { title: 'Intelligence Packages', subtitle: 'Pacotes de inteligência para compartilhamento', icon: Package },
  '/fde/sharing': { title: 'Sharing Approval', subtitle: 'Aprovação de compartilhamento de dados', icon: CheckSquare },
  '/fde/dossie': { title: 'Dossiê Financeiro', subtitle: 'Documentação consolidada para autoridades', icon: FileText },
  '/fde/relatorios': { title: 'Relatórios', subtitle: 'Relatórios periódicos e customizados', icon: BarChart3 },
  '/fde/auditoria': { title: 'Auditoria', subtitle: 'Rastreabilidade completa de todas as ações', icon: ShieldCheck },
  '/fde/admin': { title: 'Administração', subtitle: 'Configurações do sistema FDE', icon: Settings },
  '/fde/evidencias': { title: 'Evidências', subtitle: 'Gestão de evidências digitais e documentais', icon: BookMarked },
  '/fde/timeline': { title: 'Timeline', subtitle: 'Histórico completo de eventos do caso', icon: History },
  '/fde/cooperation': { title: 'Cooperação Internacional', subtitle: 'Colaboração entre agências internacionais', icon: Globe },
};

export function FDEGeneric() {
  const location = useLocation();
  const page = pageMap[location.pathname];
  if (!page) return null;
  const Icon = page.icon;

  const renderContent = () => {
    if (location.pathname === '/fde/transacoes') {
      return (
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              {['ID', 'De', 'Para', 'Valor', 'Data', 'Tipo', 'Risco', 'Status'].map(h => (
                <TableHead key={h} className="text-[9px] font-black text-slate-500 uppercase">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {fdeMockData.transactions.map(t => (
              <TableRow key={t.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="font-mono text-[10px] text-primary">{t.id}</TableCell>
                <TableCell><div><p className="text-[10px] font-bold text-white">{t.fromName.slice(0, 18)}</p><p className="text-[9px] font-mono text-slate-500">{t.from}</p></div></TableCell>
                <TableCell><div><p className="text-[10px] font-bold text-white">{t.toName.slice(0, 18)}</p><p className="text-[9px] font-mono text-slate-500">{t.to}</p></div></TableCell>
                <TableCell className="text-xs font-black text-red-400">R$ {t.amount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</TableCell>
                <TableCell className="text-[10px] text-slate-400">{t.date}</TableCell>
                <TableCell><Badge variant="outline" className="text-[9px] border-white/10 text-slate-400">{t.type}</Badge></TableCell>
                <TableCell><span className={cn("text-[10px] font-black", t.risk === 'ALTO' ? 'text-red-400' : t.risk === 'MÉDIO' ? 'text-warning' : 'text-success')}>{t.risk}</span></TableCell>
                <TableCell><Badge variant="outline" className="text-[9px] border-white/10 text-slate-400">{t.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    if (location.pathname === '/fde/entidades') {
      return (
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              {['ID', 'Nome', 'Tipo', 'Score', 'Papel', 'Org.', 'Status'].map(h => (
                <TableHead key={h} className="text-[9px] font-black text-slate-500 uppercase">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {fdeMockData.entities.map(e => (
              <TableRow key={e.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="font-mono text-[10px] text-primary">{e.id}</TableCell>
                <TableCell className="text-xs font-bold text-white">{e.name}</TableCell>
                <TableCell><Badge variant="outline" className="text-[9px] border-white/10 text-slate-400">{e.type}</Badge></TableCell>
                <TableCell><span className={cn("text-xs font-black", e.riskScore >= 70 ? 'text-red-400' : 'text-warning')}>{e.riskScore}%</span></TableCell>
                <TableCell className="text-[10px] text-slate-300">{e.role}</TableCell>
                <TableCell className="text-[10px] text-slate-400">{e.linkedOrg}</TableCell>
                <TableCell><Badge variant="outline" className={cn("text-[9px] font-black", e.status === 'BLOQUEADO_JUDICIAL' ? 'border-red-500/30 text-red-400' : e.status === 'MONITORADO' ? 'border-warning/30 text-warning' : 'border-success/30 text-success')}>{e.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    if (location.pathname === '/fde/alertas') {
      return (
        <div className="space-y-3 p-4">
          {fdeMockData.alerts.map(a => (
            <div key={a.id} className={cn("p-4 rounded-xl border flex items-start justify-between", a.severity === 'CRÍTICO' ? 'bg-red-600/5 border-red-600/20' : 'bg-warning/5 border-warning/20')}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={cn("h-4 w-4 mt-0.5 shrink-0", a.severity === 'CRÍTICO' ? 'text-red-500' : 'text-warning')} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={cn("text-[9px] font-black border-none", a.severity === 'CRÍTICO' ? 'bg-red-600' : 'bg-warning text-black')}>{a.severity}</Badge>
                    <span className="text-[10px] font-black text-white uppercase">{a.type}</span>
                  </div>
                  <p className="text-xs text-slate-300">{a.entity}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Regra: {a.ruleId} · {a.timestamp}</p>
                </div>
              </div>
              <p className="text-xs font-black text-red-400 shrink-0">R$ {a.amount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Icon className="h-16 w-16 text-slate-800 mb-4" />
        <p className="text-sm font-black text-slate-600 uppercase tracking-widest">{page.title}</p>
        <p className="text-xs text-slate-700 mt-1 max-w-xs">{page.subtitle}</p>
        <Badge variant="outline" className="mt-4 border-primary/20 text-primary font-mono text-[10px]">MÓDULO EM DESENVOLVIMENTO</Badge>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">{page.title}</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{page.subtitle}</p>
          </div>
        </div>
      </div>
      <Card className="bg-slate-900 border-white/10">
        <CardContent className="p-0">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
