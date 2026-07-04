import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Users, BarChart3, Settings, UserCheck, AlertCircle, TrendingUp } from 'lucide-react';
import { mockDistributionUsers } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function CoordinatorDistribution() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/distribuicao')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-primary tracking-tight">Painel do Coordenador</h2>
              <p className="text-muted-foreground">Gestão de equipe e balanceamento de carga.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" /> Regras de Negócio
            </Button>
            <Button className="gap-2">
              <BarChart3 className="h-4 w-4" /> Relatório de Produtividade
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Processos em Fila</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">42</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +12% desde ontem
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Média de Conclusão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">4.2 dias</div>
              <p className="text-xs text-muted-foreground mt-1">Meta: 5.0 dias</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Concluídos (Hoje)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">18</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <UserCheck className="h-3 w-3" /> 85% da meta diária
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestão de Analistas</CardTitle>
            <CardDescription>Monitore a ocupação e o status de cada membro da equipe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Analista</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processos Ativos</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Desempenho</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDistributionUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Disponível' ? 'default' : 'secondary'} className={user.status === 'Disponível' ? 'bg-success hover:bg-success/90' : ''}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold">{user.casesCount}</TableCell>
                    <TableCell className="w-[200px]">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                          <span>Ocupação</span>
                          <span>{Math.round((user.casesCount / user.maxCases) * 100)}%</span>
                        </div>
                        <Progress value={(user.casesCount / user.maxCases) * 100} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-success">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">Alto</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Ajustar Carga</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Alertas Críticos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/10 text-sm">
                <p className="font-bold">Gargalo Detectado</p>
                <p className="text-xs text-muted-foreground">3 analistas estão acima de 90% da capacidade. Recomenda-se redistribuição.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resumo de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Novos Processos</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Distribuídos</span>
                  <span className="font-bold">18</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Pendentes</span>
                  <span className="font-bold text-warning">6</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
