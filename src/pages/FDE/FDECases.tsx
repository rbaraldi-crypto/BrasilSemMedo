import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Plus, ExternalLink, TrendingUp, Users, DollarSign } from 'lucide-react';
import { fdeMockData } from '@/data/fdeData';
import { cn } from '@/lib/utils';

const priorityColors: Record<string, string> = {
  CRÍTICA: 'bg-red-600/20 text-red-400 border-red-600/30',
  ALTA: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  MÉDIA: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  BAIXA: 'bg-success/20 text-success border-success/30',
};

const statusColors: Record<string, string> = {
  EM_ANÁLISE: 'border-primary/30 text-primary',
  ESCALADO: 'border-red-500/30 text-red-400',
  FECHADO: 'border-slate-500/30 text-slate-400',
  PENDENTE_HITL: 'border-warning/30 text-warning',
};

export function FDECases() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('all');

  const filtered = fdeMockData.cases.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search) || c.org.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priority === 'all' || c.priority === priority;
    return matchSearch && matchPriority;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Casos de Investigação</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">FDE · {fdeMockData.cases.length} casos ativos</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 font-black uppercase text-xs h-9 gap-2">
          <Plus className="h-4 w-4" /> Novo Caso
        </Button>
      </div>

      <Card className="bg-slate-900 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input placeholder="Buscar por caso, ID ou organização..." className="pl-9 bg-black/20 border-white/10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-40 bg-black/20 border-white/10">
                <Filter className="h-3 w-3 mr-2" />
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="CRÍTICA">Crítica</SelectItem>
                <SelectItem value="ALTA">Alta</SelectItem>
                <SelectItem value="MÉDIA">Média</SelectItem>
                <SelectItem value="BAIXA">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] font-black text-slate-500 uppercase">ID</TableHead>
                <TableHead className="text-[10px] font-black text-slate-500 uppercase">Caso</TableHead>
                <TableHead className="text-[10px] font-black text-slate-500 uppercase">Organização</TableHead>
                <TableHead className="text-[10px] font-black text-slate-500 uppercase">Prioridade</TableHead>
                <TableHead className="text-[10px] font-black text-slate-500 uppercase">Status</TableHead>
                <TableHead className="text-[10px] font-black text-slate-500 uppercase">Score</TableHead>
                <TableHead className="text-[10px] font-black text-slate-500 uppercase">Valor</TableHead>
                <TableHead className="text-[10px] font-black text-slate-500 uppercase">Entidades</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id} className="border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => navigate('/fde/case360', { state: { caseId: c.id } })}>
                  <TableCell className="font-mono text-xs text-primary">{c.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs font-bold text-white">{c.title}</p>
                      <p className="text-[10px] text-slate-500">{c.phase} · {c.createdAt}</p>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-xs font-bold text-slate-300">{c.org}</span></TableCell>
                  <TableCell><Badge variant="outline" className={cn("text-[9px] font-black", priorityColors[c.priority])}>{c.priority}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={cn("text-[9px] font-black", statusColors[c.status])}>{c.status}</Badge></TableCell>
                  <TableCell>
                    <span className={cn("text-xs font-black", c.score >= 80 ? 'text-red-400' : c.score >= 60 ? 'text-warning' : 'text-success')}>
                      {c.score}%
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-red-400">R$ {(c.amount / 1e6).toFixed(2)}M</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-400">{c.entities}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-primary">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
