import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Gavel, Clock, AlertTriangle, CheckCircle2, XCircle, FileText, Shield } from 'lucide-react';
import { fdeMockData } from '@/data/fdeData';
import { cn } from '@/lib/utils';

export function FDEHitl() {
  const [queue, setQueue] = useState(fdeMockData.hitlQueue);

  const approve = (id: string) => setQueue(prev => prev.map(h => h.id === id ? { ...h, status: 'APROVADO' } : h));
  const reject = (id: string) => setQueue(prev => prev.map(h => h.id === id ? { ...h, status: 'REJEITADO' } : h));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Decisão Humana</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">HITL Queue · Decision Workspace</p>
        </div>
        <Badge className="bg-warning text-black font-black text-xs px-4 py-2 border-none">
          {queue.filter(h => h.status === 'PENDENTE').length} Pendentes
        </Badge>
      </div>

      <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
        <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-black text-primary uppercase">Protocolo de Supervisão Humana</p>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">Nenhuma ação crítica (bloqueio de ativos, escalonamento, compartilhamento de inteligência) pode ser executada automaticamente. Toda ação requer aprovação explícita do operador humano responsável.</p>
        </div>
      </div>

      <Tabs defaultValue="queue">
        <TabsList className="bg-slate-900 border border-white/10">
          <TabsTrigger value="queue" className="font-black uppercase text-[10px] data-[state=active]:bg-primary">HITL Queue</TabsTrigger>
          <TabsTrigger value="workspace" className="font-black uppercase text-[10px] data-[state=active]:bg-primary">Decision Workspace</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-3 mt-4">
          {queue.map(h => (
            <Card key={h.id} className={cn("bg-slate-900 border", h.status === 'PENDENTE' ? 'border-warning/30' : h.status === 'APROVADO' ? 'border-success/30' : 'border-red-500/30')}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn("p-2 rounded-lg shrink-0", h.priority === 'URGENTE' ? 'bg-red-600/20' : h.priority === 'ALTA' ? 'bg-orange-500/20' : 'bg-primary/20')}>
                      <UserCheck className={cn("h-4 w-4", h.priority === 'URGENTE' ? 'text-red-400' : h.priority === 'ALTA' ? 'text-orange-400' : 'text-primary')} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={cn("text-[9px] font-black border-none", h.priority === 'URGENTE' ? 'bg-red-600' : h.priority === 'ALTA' ? 'bg-orange-500' : 'bg-primary')}>{h.priority}</Badge>
                        <span className="text-xs font-black text-white">{h.type}</span>
                        <span className="text-[10px] font-mono text-slate-500">{h.caseId}</span>
                      </div>
                      <p className="text-xs text-slate-300 mb-2">{h.description}</p>
                      <div className="flex items-center gap-4 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Prazo: {h.deadline}</span>
                        <span>Analista: {h.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {h.status === 'PENDENTE' ? (
                      <>
                        <Button size="sm" variant="outline" className="h-8 text-[10px] font-black uppercase border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1" onClick={() => reject(h.id)}>
                          <XCircle className="h-3 w-3" /> Rejeitar
                        </Button>
                        <Button size="sm" className="h-8 text-[10px] font-black uppercase bg-success hover:bg-success/90 text-white gap-1" onClick={() => approve(h.id)}>
                          <CheckCircle2 className="h-3 w-3" /> Aprovar
                        </Button>
                      </>
                    ) : (
                      <Badge variant="outline" className={cn("text-[9px] font-black", h.status === 'APROVADO' ? 'border-success/30 text-success' : 'border-red-500/30 text-red-400')}>{h.status}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="workspace" className="mt-4">
          <Card className="bg-slate-900 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm font-black text-white uppercase flex items-center gap-2">
                <Gavel className="h-4 w-4 text-primary" /> Área de Decisão — Solicitação de Medida Cautelar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                <p className="text-xs text-warning font-bold">A solicitação de bloqueio de ativos deve ser encaminhada à autoridade judicial competente (Ministério Público / Juízo). Este sistema prepara a documentação técnica para suporte à decisão.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3">
                  <p className="text-xs font-black text-slate-400 uppercase">Ações Disponíveis</p>
                  {[
                    { label: 'Preparar Solicitação de Bloqueio (Autoridade Competente)', icon: FileText, color: 'text-primary border-primary/30 hover:bg-primary/10' },
                    { label: 'Escalar para Ministério Público Federal', icon: Shield, color: 'text-warning border-warning/30 hover:bg-warning/10' },
                    { label: 'Gerar Dossiê Técnico para Juízo', icon: Gavel, color: 'text-success border-success/30 hover:bg-success/10' },
                  ].map((a, i) => (
                    <Button key={i} variant="outline" className={cn("w-full justify-start text-[10px] font-black uppercase h-9 gap-2", a.color)}>
                      <a.icon className="h-3.5 w-3.5" /> {a.label}
                    </Button>
                  ))}
                </div>
                <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3">
                  <p className="text-xs font-black text-slate-400 uppercase">Histórico de Decisões</p>
                  {fdeMockData.hitlQueue.filter(h => h.status !== 'PENDENTE').map(h => (
                    <div key={h.id} className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">{h.type.slice(0, 25)}</span>
                      <Badge variant="outline" className={cn("text-[9px]", h.status === 'APROVADO' ? 'border-success/30 text-success' : 'border-red-500/30 text-red-400')}>{h.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
