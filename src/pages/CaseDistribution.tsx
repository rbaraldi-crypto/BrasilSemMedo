import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDistributionCases, mockDistributionUsers } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, Search, Filter, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function CaseDistribution() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = mockDistributionCases.filter(c => 
    c.inmateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cpf.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowRight className="h-5 w-5 rotate-180" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-primary tracking-tight">Distribuição de Processos</h2>
              <p className="text-muted-foreground">Fila de entrada e atribuição de analistas.</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => navigate('/coordenador')}>
            <LayoutGrid className="h-4 w-4" />
            Visão do Coordenador
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou CPF..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {filteredCases.map((caseItem) => (
                <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={caseItem.inmatePhoto} />
                        <AvatarFallback>{caseItem.inmateName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-primary">{caseItem.inmateName}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>CPF: {caseItem.cpf}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {caseItem.timeInQueue} em fila
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <Badge variant={caseItem.priority === 'Alta' ? 'destructive' : 'secondary'}>
                          Prioridade {caseItem.priority}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{caseItem.eventType}</p>
                      </div>
                      <Button size="sm" className="gap-2">
                        Distribuir <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analistas Disponíveis</CardTitle>
                <CardDescription>Carga de trabalho em tempo real.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockDistributionUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded-lg border bg-muted/10">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold">{user.casesCount}/{user.maxCases}</span>
                      <div className="w-12 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(user.casesCount / user.maxCases) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <AlertDistribution />
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertDistribution() {
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Auto-Distribuição
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs opacity-90">
          O motor de regras SIP pode distribuir automaticamente processos de baixa complexidade.
        </p>
        <Button variant="secondary" className="w-full text-xs">Ativar Modo Automático</Button>
      </CardContent>
    </Card>
  );
}