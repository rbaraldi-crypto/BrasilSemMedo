import { useState, useMemo } from 'react';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users, BarChart3, TrendingUp, Clock, CheckCircle2,
  AlertCircle, RefreshCw, UserCheck, Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

faker.seed(99);

interface Coordinator {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  workload: number;
  maxCases: number;
  casesCount: number;
  status: string;
  avgDecisionTime: string;
  approvalRate: number;
  phone: string;
}

const generatePhone = (): string => {
  const ddd = String(faker.number.int({ min: 11, max: 99 })).padStart(2, '0');
  const part1 = String(faker.number.int({ min: 1000, max: 9999 })).padStart(4, '0');
  const part2 = String(faker.number.int({ min: 1000, max: 9999 })).padStart(4, '0');
  return `(${ddd}) 9${part1}-${part2}`;
};

const generateCoordinators = (): Coordinator[] =>
  Array.from({ length: 8 }, (_, i) => ({
    id: `coord-${i + 1}`,
    name: faker.person.fullName(),
    avatar: faker.person.firstName().substring(0, 2).toUpperCase(),
    specialty: faker.helpers.arrayElement(['Execução Penal', 'Crimes Hediondos', 'Juvenil', 'Financeiro', 'Geral']),
    workload: faker.number.int({ min: 20, max: 95 }),
    maxCases: 20,
    casesCount: faker.number.int({ min: 2, max: 18 }),
    status: faker.helpers.arrayElement(['Disponível', 'Ocupado', 'Férias']),
    avgDecisionTime: `${faker.number.int({ min: 1, max: 10 })}d ${faker.number.int({ min: 1, max: 23 })}h`,
    approvalRate: faker.number.int({ min: 60, max: 98 }),
    phone: generatePhone(),
  }));

const statusColors: Record<string, string> = {
  'Disponível': 'border-success/30 text-success bg-success/10',
  'Ocupado': 'border-warning/30 text-warning bg-warning/10',
  'Férias': 'border-slate-500/30 text-slate-400 bg-slate-500/10',
};

export function CoordinatorDistribution() {
  const coordinators = useMemo(() => generateCoordinators(), []);
  const [selected, setSelected] = useState<Coordinator | null>(null);

  const available = coordinators.filter(c => c.status === 'Disponível');
  const avgWorkload = Math.round(coordinators.reduce((acc, c) => acc + c.workload, 0) / coordinators.length);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Distribuição de Coordenadores</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
            Gestão de Carga de Trabalho da Equipe
          </p>
        </div>
        <Button variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 gap-2 font-black uppercase text-xs">
          <RefreshCw className="h-3.5 w-3.5" /> Atualizar
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Coordenadores', value: coordinators.length, icon: Users, color: 'text-primary' },
          { label: 'Disponíveis Agora', value: available.length, icon: UserCheck, color: 'text-success' },
          { label: 'Carga Média', value: `${avgWorkload}%`, icon: BarChart3, color: 'text-warning' },
          { label: 'Taxa Aprovação Média', value: `${Math.round(coordinators.reduce((acc, c) => acc + c.approvalRate, 0) / coordinators.length)}%`, icon: CheckCircle2, color: 'text-cyan-400' },
        ].map((kpi, i) => (
          <Card key={i} className="bg-slate-900 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{kpi.label}</span>
                <kpi.icon className={cn("h-4 w-4", kpi.color)} />
              </div>
              <p className={cn("text-2xl font-black tracking-tighter", kpi.color)}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="team">
        <TabsList className="bg-slate-900 border border-white/10">
          <TabsTrigger value="team" className="font-black uppercase text-[10px] data-[state=active]:bg-primary">Equipe</TabsTrigger>
          <TabsTrigger value="metrics" className="font-black uppercase text-[10px] data-[state=active]:bg-primary">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coordinators.map((coord) => (
              <Card
                key={coord.id}
                className={cn(
                  "bg-slate-900 border cursor-pointer transition-all hover:shadow-lg",
                  selected?.id === coord.id ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-white/20"
                )}
                onClick={() => setSelected(selected?.id === coord.id ? null : coord)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Avatar className="h-10 w-10 border-2 border-white/10">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-black">{coord.avatar}</AvatarFallback>
                    </Avatar>
                    <Badge variant="outline" className={cn("text-[9px] font-black", statusColors[coord.status])}>{coord.status}</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">{coord.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{coord.specialty}</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span className="text-slate-500">Carga</span>
                      <span className={cn(coord.workload > 80 ? 'text-red-400' : coord.workload > 60 ? 'text-warning' : 'text-success')}>
                        {coord.workload}%
                      </span>
                    </div>
                    <Progress
                      value={coord.workload}
                      className="h-1.5"
                      indicatorClassName={coord.workload > 80 ? 'bg-red-500' : coord.workload > 60 ? 'bg-warning' : 'bg-success'}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="p-1.5 bg-black/30 rounded border border-white/5 text-center">
                      <p className="text-[8px] font-black text-slate-500 uppercase">Casos</p>
                      <p className="text-xs font-black text-white">{coord.casesCount}/{coord.maxCases}</p>
                    </div>
                    <div className="p-1.5 bg-black/30 rounded border border-white/5 text-center">
                      <p className="text-[8px] font-black text-slate-500 uppercase">Aprovação</p>
                      <p className="text-xs font-black text-success">{coord.approvalRate}%</p>
                    </div>
                  </div>
                  {selected?.id === coord.id && (
                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <div className="flex justify-between text-[9px]">
                        <span className="text-slate-500 font-bold uppercase">Tempo Médio</span>
                        <span className="text-white font-mono">{coord.avgDecisionTime}</span>
                      </div>
                      <div className="flex justify-between text-[9px]">
                        <span className="text-slate-500 font-bold uppercase">Contato</span>
                        <span className="text-primary font-mono">{coord.phone}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <Card className="bg-slate-900 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Performance da Equipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coordinators.sort((a, b) => b.approvalRate - a.approvalRate).map((coord) => (
                  <div key={coord.id} className="flex items-center gap-4 p-3 bg-black/20 rounded-lg border border-white/5">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-black">{coord.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{coord.name}</p>
                      <p className="text-[9px] text-slate-500 uppercase">{coord.specialty}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className="text-[8px] font-black text-slate-500 uppercase">Aprovação</p>
                        <p className={cn("text-xs font-black", coord.approvalRate >= 85 ? 'text-success' : 'text-warning')}>{coord.approvalRate}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-slate-500 uppercase">ETA</p>
                        <p className="text-xs font-mono text-white">{coord.avgDecisionTime}</p>
                      </div>
                      <div className="w-20">
                        <Progress
                          value={coord.approvalRate}
                          className="h-1"
                          indicatorClassName={coord.approvalRate >= 85 ? 'bg-success' : 'bg-warning'}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
