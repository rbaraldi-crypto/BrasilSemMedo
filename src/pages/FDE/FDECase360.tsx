import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity, Users, DollarSign, Building2, Network, Wallet,
  AlertTriangle, BookOpen, Scale, BookMarked, UserCheck,
  Globe, FileText, History, ShieldCheck, TrendingUp, Brain,
  FileSearch, Info, ArrowRight, CheckCircle2, Clock
} from 'lucide-react';
import { fdeMockData } from '@/data/fdeData';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'entities', label: 'Entities', icon: Users },
  { id: 'transactions', label: 'Transactions', icon: DollarSign },
  { id: 'organizations', label: 'Organizations', icon: Building2 },
  { id: 'graph', label: 'Graph', icon: Network },
  { id: 'assets', label: 'Assets', icon: Wallet },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'rules', label: 'Rules', icon: BookOpen },
  { id: 'legal', label: 'Legal', icon: Scale },
  { id: 'evidence', label: 'Evidence', icon: BookMarked },
  { id: 'hitl', label: 'HITL', icon: UserCheck },
  { id: 'interagency', label: 'InterAgency', icon: Globe },
  { id: 'intelligence', label: 'Intelligence', icon: Brain },
  { id: 'report', label: 'Report', icon: FileText },
  { id: 'timeline', label: 'Timeline', icon: History },
  { id: 'audit', label: 'Audit', icon: ShieldCheck },
];

function OverviewTab({ c }: { c: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Score de Risco', value: `${c.score}%`, color: c.score >= 80 ? 'text-red-400' : 'text-warning' },
          { label: 'Valor Total', value: `R$ ${(c.amount / 1e6).toFixed(2)}M`, color: 'text-red-400' },
          { label: 'Entidades', value: c.entities, color: 'text-cyan-400' },
          { label: 'Transações', value: c.transactions, color: 'text-primary' },
        ].map((s, i) => (
          <div key={i} className="p-3 bg-slate-900 rounded-xl border border-white/5">
            <p className="text-[9px] font-black text-slate-500 uppercase">{s.label}</p>
            <p className={cn("text-lg font-black mt-1", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-900 rounded-xl border border-white/5 space-y-3">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Resumo do Caso</p>
          <p className="text-xs text-slate-300 leading-relaxed">Investigação de movimentação financeira suspeita associada à organização <strong className="text-white">{c.org}</strong>. Análise de {c.transactions} transações revelou padrões de estruturação e layering com alto risco de lavagem de capitais.</p>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
              <span>Progresso da Investigação</span>
              <span className="text-primary">68%</span>
            </div>
            <Progress value={68} className="h-1.5" indicatorClassName="bg-primary" />
          </div>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-white/5 space-y-2">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Detalhes</p>
          {[
            { label: 'Status', value: c.status },
            { label: 'Prioridade', value: c.priority },
            { label: 'Fase', value: c.phase },
            { label: 'Analista', value: c.analyst },
            { label: 'Criado em', value: c.createdAt },
          ].map((d, i) => (
            <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-1">
              <span className="text-slate-500 font-bold uppercase">{d.label}</span>
              <span className="text-white font-bold">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EntitiesTab() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/5 hover:bg-transparent">
          {['ID', 'Nome', 'Tipo', 'CPF/CNPJ', 'Score', 'Papel', 'Status'].map(h => (
            <TableHead key={h} className="text-[9px] font-black text-slate-500 uppercase">{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {fdeMockData.entities.slice(0, 8).map(e => (
          <TableRow key={e.id} className="border-white/5 hover:bg-white/5">
            <TableCell className="font-mono text-[10px] text-primary">{e.id}</TableCell>
            <TableCell className="text-xs font-bold text-white">{e.name}</TableCell>
            <TableCell><Badge variant="outline" className="text-[9px] border-white/10 text-slate-400">{e.type}</Badge></TableCell>
            <TableCell className="font-mono text-[10px] text-slate-400">{e.cpfCnpj}</TableCell>
            <TableCell><span className={cn("text-xs font-black", e.riskScore >= 70 ? 'text-red-400' : 'text-warning')}>{e.riskScore}%</span></TableCell>
            <TableCell className="text-[10px] text-slate-300">{e.role}</TableCell>
            <TableCell><Badge variant="outline" className={cn("text-[9px] font-black", e.status === 'BLOQUEADO_JUDICIAL' ? 'border-red-500/30 text-red-400' : e.status === 'MONITORADO' ? 'border-warning/30 text-warning' : 'border-success/30 text-success')}>{e.status}</Badge></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TransactionsTab() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/5 hover:bg-transparent">
          {['ID', 'De', 'Para', 'Valor', 'Data', 'Tipo', 'Risco', 'Flags'].map(h => (
            <TableHead key={h} className="text-[9px] font-black text-slate-500 uppercase">{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {fdeMockData.transactions.slice(0, 8).map(t => (
          <TableRow key={t.id} className="border-white/5 hover:bg-white/5">
            <TableCell className="font-mono text-[10px] text-primary">{t.id}</TableCell>
            <TableCell>
              <div><p className="text-[10px] font-bold text-white">{t.fromName.slice(0, 20)}</p><p className="text-[9px] font-mono text-slate-500">{t.from}</p></div>
            </TableCell>
            <TableCell>
              <div><p className="text-[10px] font-bold text-white">{t.toName.slice(0, 20)}</p><p className="text-[9px] font-mono text-slate-500">{t.to}</p></div>
            </TableCell>
            <TableCell className="text-xs font-black text-red-400">R$ {t.amount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</TableCell>
            <TableCell className="text-[10px] text-slate-400">{t.date}</TableCell>
            <TableCell><Badge variant="outline" className="text-[9px] border-white/10 text-slate-400">{t.type}</Badge></TableCell>
            <TableCell><span className={cn("text-[10px] font-black", t.risk === 'ALTO' ? 'text-red-400' : t.risk === 'MÉDIO' ? 'text-warning' : 'text-success')}>{t.risk}</span></TableCell>
            <TableCell>
              <div className="flex gap-1 flex-wrap">
                {t.flags.map((f, i) => <Badge key={i} className="text-[8px] h-3.5 px-1 bg-red-600/20 text-red-400 border-none">{f}</Badge>)}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AssetsTab() {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-warning/10 border border-warning/20 rounded-xl flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
        <p className="text-xs text-warning font-bold">Nota Jurídica: Não é possível solicitar bloqueio direto. Use "Preparar Solicitação para Autoridade Competente" após análise completa.</p>
      </div>
      {fdeMockData.assets.map(a => (
        <div key={a.id} className="p-4 bg-slate-900 rounded-xl border border-white/5 flex items-center justify-between hover:border-primary/20 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{a.description}</p>
              <p className="text-[10px] text-slate-500 font-mono">{a.id} · {a.type} · {a.registry}</p>
              <p className="text-[10px] text-slate-400">Titular: {a.owner}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-white">R$ {a.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
              <Badge variant="outline" className={cn("text-[9px] font-black mt-1", a.status === 'BLOQUEADO_JUDICIAL' ? 'border-red-500/30 text-red-400' : a.status === 'BLOQUEIO_SOLICITADO' ? 'border-warning/30 text-warning' : 'border-white/10 text-slate-400')}>{a.status}</Badge>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase border-primary/30 text-primary hover:bg-primary/10">
              <FileText className="h-3 w-3 mr-1" /> Preparar Solicitação
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AlertsTab() {
  return (
    <div className="space-y-3">
      {fdeMockData.alerts.map(a => (
        <div key={a.id} className={cn("p-4 rounded-xl border flex items-start justify-between gap-4",
          a.severity === 'CRÍTICO' ? 'bg-red-600/5 border-red-600/20' : a.severity === 'ALTO' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-warning/5 border-warning/20'
        )}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={cn("h-4 w-4 mt-0.5 shrink-0", a.severity === 'CRÍTICO' ? 'text-red-500' : a.severity === 'ALTO' ? 'text-orange-400' : 'text-warning')} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className={cn("text-[9px] font-black border-none", a.severity === 'CRÍTICO' ? 'bg-red-600' : a.severity === 'ALTO' ? 'bg-orange-500' : 'bg-warning')}>{a.severity}</Badge>
                <span className="text-[10px] font-black text-white uppercase">{a.type}</span>
              </div>
              <p className="text-xs text-slate-300">{a.entity}</p>
              <p className="text-[10px] text-slate-500 font-mono">Regra: {a.ruleId} · {a.timestamp}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-black text-red-400">R$ {a.amount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
            {a.acknowledged ? <Badge className="text-[9px] bg-success/20 text-success border-none mt-1">Reconhecido</Badge> : <Button size="sm" variant="outline" className="h-6 text-[9px] font-black uppercase border-white/10 mt-1">Reconhecer</Button>}
          </div>
        </div>
      ))}
    </div>
  );
}

function HITLTab() {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
        <UserCheck className="h-4 w-4 text-primary shrink-0" />
        <p className="text-xs text-primary font-bold">Decisões de alto impacto requerem validação humana antes de prosseguir. Nenhuma ação pode ser executada automaticamente sem aprovação.</p>
      </div>
      {fdeMockData.hitlQueue.slice(0, 4).map(h => (
        <div key={h.id} className="p-4 bg-slate-900 rounded-xl border border-white/5 hover:border-primary/20 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge className={cn("text-[9px] font-black border-none", h.priority === 'URGENTE' ? 'bg-red-600' : h.priority === 'ALTA' ? 'bg-orange-500' : 'bg-primary')}>{h.priority}</Badge>
              <span className="text-xs font-black text-white">{h.type}</span>
            </div>
            <Badge variant="outline" className={cn("text-[9px] font-black", h.status === 'PENDENTE' ? 'border-warning/30 text-warning' : h.status === 'APROVADO' ? 'border-success/30 text-success' : 'border-white/10 text-slate-400')}>{h.status}</Badge>
          </div>
          <p className="text-[10px] text-slate-400 mb-3">{h.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {h.deadline}</span>
              <span>{h.assignedTo}</span>
            </div>
            {h.status === 'PENDENTE' && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-[10px] font-black uppercase border-red-500/30 text-red-400 hover:bg-red-500/10">Rejeitar</Button>
                <Button size="sm" className="h-7 text-[10px] font-black uppercase bg-success hover:bg-success/90 text-white">Aprovar</Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function LegalTab() {
  const frameworks = [
    { law: 'Lei 9.613/1998', desc: 'Lei de Lavagem de Dinheiro — tipificação e penalidades.', art: 'Art. 1º, §1º, II', status: 'APLICÁVEL' },
    { law: 'Lei 12.683/2012', desc: 'Alteração da Lei de Lavagem — ampliação de crimes antecedentes.', art: 'Art. 1º, caput', status: 'APLICÁVEL' },
    { law: 'Res. CMN 4.557/2017', desc: 'Gestão de riscos — PLD/CFT em instituições financeiras.', art: 'Seção IV', status: 'MONITORADO' },
    { law: 'Lei 13.260/2016', desc: 'Lei Antiterrorismo — lavagem ligada a terrorismo.', art: 'Art. 5º', status: 'VERIFICAR' },
    { law: 'Lei 13.964/2019', desc: 'Pacote Anticrime — fortalecimento do combate ao crime organizado.', art: 'Art. 91-A', status: 'APLICÁVEL' },
  ];
  return (
    <div className="space-y-3">
      {frameworks.map((f, i) => (
        <div key={i} className="p-4 bg-slate-900 rounded-xl border border-white/5 flex items-center justify-between hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 shrink-0">
              <Scale className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-black text-white">{f.law}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{f.desc}</p>
              <p className="text-[10px] font-mono text-primary mt-1">{f.art}</p>
            </div>
          </div>
          <Badge variant="outline" className={cn("text-[9px] font-black shrink-0", f.status === 'APLICÁVEL' ? 'border-success/30 text-success' : f.status === 'VERIFICAR' ? 'border-warning/30 text-warning' : 'border-white/10 text-slate-400')}>{f.status}</Badge>
        </div>
      ))}
    </div>
  );
}

function ReportTab({ c }: { c: any }) {
  return (
    <div className="space-y-4">
      <div className="p-5 bg-slate-900 rounded-xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div>
            <p className="text-xs font-black text-white uppercase">Dossiê Financeiro — {c.id}</p>
            <p className="text-[10px] text-slate-500">Gerado automaticamente pelo FDE Engine</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 font-black uppercase text-[10px] h-8 gap-2">
            <FileText className="h-3.5 w-3.5" /> Exportar PDF
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Score Final', value: `${c.score}%` },
            { label: 'Transações Suspeitas', value: Math.floor(c.transactions * 0.3) },
            { label: 'Entidades Envolvidas', value: c.entities },
            { label: 'Valor Total', value: `R$ ${(c.amount / 1e6).toFixed(2)}M` },
          ].map((s, i) => (
            <div key={i} className="p-3 bg-black/30 rounded-lg border border-white/5">
              <p className="text-[9px] font-black text-slate-500 uppercase">{s.label}</p>
              <p className="text-sm font-black text-primary mt-1">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase">Conclusão Analítica</p>
          <p className="text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
            A análise financeira do caso <strong className="text-white">{c.id}</strong> indica movimentações atípicas consistentes com esquemas de lavagem de dinheiro associados à organização <strong className="text-white">{c.org}</strong>. Recomenda-se o escalonamento para o Ministério Público Federal com solicitação de medidas cautelares de bloqueio de ativos via SISBAJUD, conforme Art. 4º da Lei 9.613/1998.
          </p>
        </div>
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
          <p className="text-[10px] text-warning font-bold">A ação de bloqueio de ativos deve ser solicitada à autoridade judicial competente. Este sistema não executa bloqueios diretamente.</p>
        </div>
        <Button className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 font-black uppercase text-xs h-10 shadow-lg" onClick={() => {}}>
          <FileText className="h-4 w-4 mr-2" /> Preparar Solicitação para Autoridade Competente
        </Button>
      </div>
    </div>
  );
}

export function FDECase360() {
  const location = useLocation();
  const [tab, setTab] = useState('overview');
  const caseId = location.state?.caseId || fdeMockData.cases[0].id;
  const c = fdeMockData.cases.find(x => x.id === caseId) || fdeMockData.cases[0];

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-primary font-black">{c.id}</span>
            <Badge className={cn("text-[9px] font-black border-none", c.priority === 'CRÍTICA' ? 'bg-red-600' : c.priority === 'ALTA' ? 'bg-orange-500' : 'bg-primary')}>{c.priority}</Badge>
            <Badge variant="outline" className="text-[9px] border-white/10 text-slate-400 font-black">{c.status}</Badge>
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">{c.title}</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">Case 360 · {c.org} · Score: <span className={c.score >= 80 ? 'text-red-400' : 'text-warning'}>{c.score}%</span></p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <ScrollArea className="w-full" type="scroll">
          <TabsList className="bg-slate-900 border border-white/10 h-9 p-1 flex w-max gap-0.5">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <TabsTrigger key={t.id} value={t.id} className="h-7 px-3 text-[10px] font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap gap-1.5">
                  <Icon className="h-2.5 w-2.5" />{t.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </ScrollArea>

        <div className="mt-4 bg-slate-950 rounded-xl border border-white/5 p-4">
          <TabsContent value="overview"><OverviewTab c={c} /></TabsContent>
          <TabsContent value="entities"><EntitiesTab /></TabsContent>
          <TabsContent value="transactions"><TransactionsTab /></TabsContent>
          <TabsContent value="assets"><AssetsTab /></TabsContent>
          <TabsContent value="alerts"><AlertsTab /></TabsContent>
          <TabsContent value="hitl"><HITLTab /></TabsContent>
          <TabsContent value="legal"><LegalTab /></TabsContent>
          <TabsContent value="report"><ReportTab c={c} /></TabsContent>
          <TabsContent value="organizations">
            <div className="space-y-3">
              {['PCC', 'CV', 'Intermediário Financeiro'].map((org, i) => (
                <div key={i} className="p-4 bg-slate-900 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600/10 rounded-lg"><Building2 className="h-4 w-4 text-red-500" /></div>
                    <div>
                      <p className="text-xs font-black text-white">{org}</p>
                      <p className="text-[10px] text-slate-500">Organização {i === 2 ? 'Parceira' : 'Narcoterrorista'}</p>
                    </div>
                  </div>
                  <Badge className="bg-red-600/20 text-red-400 text-[9px] font-black border-none">INVESTIGADO</Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="graph">
            <div className="h-64 flex items-center justify-center bg-slate-900 rounded-xl border border-white/5">
              <div className="text-center space-y-2">
                <Network className="h-12 w-12 text-slate-700 mx-auto" />
                <p className="text-xs text-slate-500 font-bold uppercase">Grafo Investigativo</p>
                <p className="text-[10px] text-slate-600">Visualização disponível no módulo Graph</p>
              </div>
            </div>
          </TabsContent>
          {['rules', 'evidence', 'interagency', 'intelligence', 'timeline', 'audit'].map(id => (
            <TabsContent key={id} value={id}>
              <div className="h-48 flex items-center justify-center bg-slate-900 rounded-xl border border-white/5">
                <p className="text-xs text-slate-500 font-bold uppercase">{TABS.find(t => t.id === id)?.label} — Em carregamento</p>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
