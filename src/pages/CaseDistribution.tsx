import { useState, useMemo } from 'react';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users, Search, BarChart3, CheckCircle2,
  AlertTriangle, Clock, Zap, TrendingUp, Shield, ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

faker.seed(42);

interface Analyst {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  casesCount: number;
  maxCases: number;
  status: 'DISPONÍVEL' | 'OCUPADO' | 'INDISPONÍVEL';
  resolvedCount: number;
  avgDays: number;
}

interface DistCase {
  id: string;
  inmateName: string;
  cpf: string;
  processNumber: string;
  eventType: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  isPoint11: boolean;
  timeInQueue: string;
  analystId: string | null;
  region: string;
}

const generateAnalysts = (): Analyst[] =>
  Array.from({ length: 8 }, (_, i) => {
    const casesCount = faker.number.int({ min: 2, max: 18 });
    return {
      id: `analyst-${i + 1}`,
      name: faker.person.fullName(),
      avatar: faker.person.firstName().substring(0, 2).toUpperCase(),
      specialization: faker.helpers.arrayElement(['Crimes Hediondos', 'Execução Penal', 'Progressão de Regime', 'HITL Avançado']),
      casesCount,
      maxCases: 20,
      status: casesCount >= 18 ? 'OCUPADO' : 'DISPONÍVEL',
      resolvedCount: faker.number.int({ min: 10, max: 80 }),
      avgDays: faker.number.int({ min: 2, max: 14 }),
    };
  });

const generateCases = (): DistCase[] =>
  Array.from({ length: 12 }, (_, i) => ({
    id: `DIST-${String(i + 1).padStart(5, '0')}`,
    inmateName: faker.person.fullName(),
    cpf: faker.string.numeric(3) + '.' + faker.string.numeric(3) + '.' + faker.string.numeric(3) + '-' + faker.string.numeric(2),
    processNumber: faker.string.numeric(7) + '-' + faker.string.numeric(2) + '.' + faker.string.numeric(4) + '.8.26.' + faker.string.numeric(4),
    eventType: faker.helpers.arrayElement(['Progressão de Regime', 'Livramento Condicional', 'Saída Temporária', 'Recurso', 'Monitoramento']),
    priority: faker.helpers.arrayElement(['Alta', 'Média', 'Baixa'] as const),
    isPoint11: i < 3,
    timeInQueue: faker.helpers.arrayElement(['15m', '1h 30m', '3h', '6h', '1d 2h']),
    analystId: i < 8 ? `analyst-${(i % 8) + 1}` : null,
    region: faker.helpers.arrayElement(['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Paraná']),
  }));

const statusColors: Record<string, string> = {
  DISPONÍVEL: 'border-success/30 text-success bg-success/10',
  OCUPADO: 'border-warning/30 text-warning bg-warning/10',
  INDISPONÍVEL: 'border-red-500/30 text-red-400 bg-red-500/10',
};

const priorityColors: Record<string, string> = {
  Alta: 'border-red-500/30 text-red-400',
  Média: 'border-warning/30 text-warning',
  Baixa: 'border-success/30 text-success',
};

export function CaseDistribution() {
  const [analysts] = useState<Analyst[]>(generateAnalysts);
  const [cases, setCases] = useState<DistCase[]>(generateCases);
  const [search, setSearch] = useState('');
  const [isAutoDistributing, setIsAutoDistributing] = useState(false);

  const unassigned = cases.filter(c => !c.analystId);
  const point11Cases = cases.filter(c => c.isPoint11);

  const filteredAnalysts = useMemo(() =>
    analysts.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.specialization.toLowerCase().includes(search.toLowerCase())
    ), [analysts, search]);

  const handleAutoDistribute = async () => {
    setIsAutoDistributing(true);
    await new Promise(r => setTimeout(r, 1500));
    setCases(prev => prev.map(c => {
      if (!c.analystId) {
        const available = analysts
          .filter(a => a.casesCount < a.maxCases && a.status === 'DISPONÍVEL')
          .sort((a, b) => a.casesCount - b.casesCount);
        return { ...c, analystId: available[0]?.id || null };
      }
      return c;
    }));
    setIsAutoDistributing(false);
  };

  const handleAssign = (caseId: string, analystId: string) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, analystId } : c));
  };

  const avgWorkload = Math.round(analysts.reduce((s, a) => s + a.casesCount, 0) / analysts.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">Distribuição de Casos</h2>
          <p className="text-muted-foreground text-sm mt-1">Gestão de fila e atribuição de casos aos analistas.</p>
        </div>
        <Button
          className="gap-2 bg-primary hover:bg-primary/90 font-black uppercase text-xs"
          onClick={handleAutoDistribute}
          disabled={isAutoDistributing || unassigned.length === 0}
        >
          <Zap className="h-4 w-4" />
          {isAutoDistributing ? 'Distribuindo...' : `Distribuição Automática (${unassigned.length})`}
        </Button>
      </div>

      {point11Cases.length > 0 && (
        <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-xl flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-sm font-black text-red-400 uppercase">Atenção: {point11Cases.length} Casos Ponto 11</p>
            <p className="text-xs text-slate-400 mt-0.5">Casos de crimes hediondos/narcoterrorismo requerem analista especializado. Progressão bloqueada pelo Modo Endurecido.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Analistas', value: analysts.length, icon: Users, color: 'text-primary' },
          { label: 'Disponíveis', value: analysts.filter(a => a.status === 'DISPONÍVEL').length, icon: CheckCircle2, color: 'text-success' },
          { label: 'Carga Média', value: `${avgWorkload} casos`, icon: TrendingUp, color: 'text-primary' },
          { label: 'Não Atribuídos', value: unassigned.length, icon: Clock, color: 'text-warning' },
        ].map((kpi, i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase">{kpi.label}</span>
                <kpi.icon className={cn("h-4 w-4", kpi.color)} />
              </div>
              <p className={cn("text-2xl font-bold", kpi.color)}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="queue">
        <TabsList className="bg-muted">
          <TabsTrigger value="queue" className="font-bold uppercase text-xs">Fila de Entrada</TabsTrigger>
          <TabsTrigger value="team" className="font-bold uppercase text-xs">Visão da Equipe</TabsTrigger>
          <TabsTrigger value="metrics" className="font-bold uppercase text-xs">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-3 mt-4">
          {cases.map(c => (
            <Card key={c.id} className={cn("border-border hover:border-primary/30 transition-all", c.isPoint11 && "border-red-500/30 bg-red-500/5")}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {c.isPoint11 && <ShieldAlert className="h-4 w-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-foreground">{c.inmateName}</p>
                        <Badge variant="outline" className={cn("text-[10px] font-bold", priorityColors[c.priority])}>{c.priority}</Badge>
                        {c.isPoint11 && <Badge className="text-[9px] bg-red-600 border-none font-black">PONTO 11</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{c.processNumber}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.eventType} · Na fila há {c.timeInQueue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {c.analystId ? (
                      <Badge variant="outline" className="text-[10px] border-success/30 text-success font-bold">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {analysts.find(a => a.id === c.analystId)?.name.split(' ')[0]}
                      </Badge>
                    ) : (
                      analysts.filter(a => a.status === 'DISPONÍVEL').slice(0, 3).map(a => (
                        <Button
                          key={a.id}
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] font-bold uppercase border-primary/30 text-primary hover:bg-primary/10"
                          onClick={() => handleAssign(c.id, a.id)}
                        >
                          {a.name.split(' ')[0]}
                        </Button>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar analista..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAnalysts.map(analyst => (
              <Card key={analyst.id} className="border-border hover:border-primary/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">{analyst.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-foreground truncate">{analyst.name}</p>
                        <Badge variant="outline" className={cn("text-[9px] font-bold shrink-0 ml-2", statusColors[analyst.status])}>{analyst.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{analyst.specialization}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Carga</span>
                      <span className="font-bold">{analyst.casesCount}/{analyst.maxCases}</span>
                    </div>
                    <Progress value={(analyst.casesCount / analyst.maxCases) * 100} className="h-1.5" indicatorClassName={analyst.casesCount >= 16 ? 'bg-warning' : 'bg-primary'} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-muted-foreground">
                    <span>{analyst.resolvedCount} resolvidos</span>
                    <span>~{analyst.avgDays}d médio</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Total de Casos', value: cases.length, icon: BarChart3 },
              { label: 'Atribuídos', value: cases.filter(c => c.analystId).length, icon: CheckCircle2 },
              { label: 'Taxa de Alocação', value: `${Math.round((cases.filter(c => c.analystId).length / cases.length) * 100)}%`, icon: Shield },
            ].map((s, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-6 text-center">
                  <s.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-black text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-bold uppercase mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
