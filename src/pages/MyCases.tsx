import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockMyCases, mockSubordinates, MyCase, SubordinateUser } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Briefcase, Search, Filter, UserPlus, CalendarClock, AlertCircle, Loader2, ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export function MyCases() {
  const [filterText, setFilterText] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Local state to manage cases to simulate updates without backend
  const [cases, setCases] = useState<MyCase[]>(mockMyCases);

  // Delegation Modal State
  const [isDelegating, setIsDelegating] = useState(false);
  const [selectedCaseForDelegation, setSelectedCaseForDelegation] = useState<MyCase | null>(null);
  const [delegationStep, setDelegationStep] = useState<'loading' | 'select' | 'confirm'>('loading');
  const [selectedSubordinate, setSelectedSubordinate] = useState<SubordinateUser | null>(null);

  // Priority Change Modal State
  const [priorityDialog, setPriorityDialog] = useState<{ isOpen: boolean; case: MyCase | null }>({
    isOpen: false,
    case: null
  });

  const filteredCases = cases.filter(item => {
    const matchesText = item.inmateName.toLowerCase().includes(filterText.toLowerCase()) || 
                        item.caseNumber.includes(filterText);
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    return matchesText && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20';
      case 'Média': return 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20';
      case 'Baixa': return 'bg-success/10 text-success border-success/20 hover:bg-success/20';
      case 'Delegado': return 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  // --- Delegation Handlers ---

  const handleOpenDelegation = (caseItem: MyCase) => {
    setSelectedCaseForDelegation(caseItem);
    setIsDelegating(true);
    setDelegationStep('loading');
    setSelectedSubordinate(null);

    // Simulate API Call failure then fallback to list
    setTimeout(() => {
      setDelegationStep('select');
    }, 1500);
  };

  const handleConfirmDelegation = () => {
    if (!selectedCaseForDelegation || !selectedSubordinate) return;

    const now = new Date();
    const estimated = new Date();
    estimated.setDate(now.getDate() + 2); // +2 days

    const updatedCases = cases.map(c => {
      if (c.id === selectedCaseForDelegation.id) {
        return {
          ...c,
          priority: 'Delegado' as const,
          delegatedTo: selectedSubordinate,
          delegatedAt: now.toLocaleString('pt-BR'),
          estimatedCompletion: estimated.toLocaleDateString('pt-BR'),
          status: `Atribuído a ${selectedSubordinate.name}`
        };
      }
      return c;
    });

    setCases(updatedCases);
    setIsDelegating(false);
    setSelectedCaseForDelegation(null);
  };

  // --- Priority Change Handlers ---

  const handlePriorityClick = (caseItem: MyCase) => {
    if (caseItem.priority === 'Delegado') return; // Cannot change priority of delegated tasks
    setPriorityDialog({ isOpen: true, case: caseItem });
  };

  const handleChangePriority = async (newPriority: 'Alta' | 'Média' | 'Baixa') => {
    if (!priorityDialog.case) return;

    // --- API INTEGRATION POINT ---
    // PATCH /hitl/tasks/{taskId}/prioridade
    try {
        const taskId = priorityDialog.case.id;
        
        // Cálculo simples de prazo baseado na prioridade para o payload
        const prazoMap = {
            'Alta': new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +24h
            'Média': new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // +72h
            'Baixa': new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // +5 dias
        };

        console.log(`[API] PATCH /hitl/tasks/${taskId}/prioridade`);
        console.log("Payload:", {
            prioridade: newPriority,
            prazo_limite: prazoMap[newPriority],
            motivo: "Alteração manual pelo usuário via interface MyCases"
        });

        // await fetch(`/hitl/tasks/${taskId}/prioridade`, { ... })

    } catch (error) {
        console.error("Erro ao atualizar prioridade:", error);
    }

    const updatedCases = cases.map(c => 
      c.id === priorityDialog.case!.id ? { ...c, priority: newPriority } : c
    );

    setCases(updatedCases);
    setPriorityDialog({ isOpen: false, case: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-primary">Meus Casos</h2>
          <p className="text-muted-foreground">Gerencie sua fila de trabalho e prioridades.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Fila de Processos</CardTitle>
              <CardDescription>Lista de casos aguardando análise judicial.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou processo..." 
                  className="pl-8"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Delegado">Delegado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Prioridade</TableHead>
                <TableHead>Processo</TableHead>
                <TableHead>Apenado</TableHead>
                <TableHead>Tipo de Ação</TableHead>
                <TableHead>Entrada / Delegação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length > 0 ? (
                filteredCases.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell>
                      <div className="flex items-center">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${getPriorityColor(item.priority)} 
                            ${item.priority !== 'Delegado' ? 'cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-primary/20 transition-all select-none' : 'opacity-80 cursor-not-allowed'}
                          `}
                          onClick={() => handlePriorityClick(item)}
                          title={item.priority !== 'Delegado' ? "Clique para alterar a prioridade" : "Prioridade fixa"}
                        >
                          {item.priority}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={`/meus-casos/${item.id}`}
                        className="font-mono text-xs font-medium text-primary hover:underline hover:text-primary/80 flex items-center gap-1"
                      >
                        {item.caseNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{item.inmateName}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                        {item.priority === 'Delegado' ? (
                            <div className="flex flex-col">
                                <span className="font-medium text-purple-700">{item.delegatedAt?.split(' ')[0]}</span>
                                <span className="text-[10px]">Prev: {item.estimatedCompletion}</span>
                            </div>
                        ) : (
                            item.entryDate
                        )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${item.priority === 'Delegado' ? 'bg-purple-500' : 'bg-primary/40'}`}></span>
                        <span className="text-sm truncate max-w-[150px]" title={item.status}>{item.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.priority !== 'Delegado' ? (
                        <Button 
                            size="sm" 
                            variant="outline"
                            className="gap-2 shadow-sm transition-all hover:bg-primary hover:text-white"
                            onClick={() => handleOpenDelegation(item)}
                        >
                            <UserPlus className="h-3 w-3" />
                            Delegar
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled className="opacity-50">
                            Delegado
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum caso encontrado com os filtros atuais.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delegation Modal */}
      <Dialog open={isDelegating} onOpenChange={setIsDelegating}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delegar Tarefa</DialogTitle>
            <DialogDescription>
              Atribuir o processo {selectedCaseForDelegation?.caseNumber} a um subordinado.
            </DialogDescription>
          </DialogHeader>

          {delegationStep === 'loading' && (
            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Tentando atribuição automática (PATCH /hitl/tasks)...</p>
            </div>
          )}

          {delegationStep === 'select' && (
            <div className="space-y-4 py-4">
                <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-3 border border-destructive/20">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <span className="font-bold text-destructive">Falha na atribuição automática.</span>
                        <p className="text-destructive/80 mt-1">
                            O sistema não pôde alocar automaticamente. Selecione um usuário disponível manualmente abaixo.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <span className="text-sm font-medium">Subordinados Disponíveis:</span>
                    <div className="grid gap-2">
                        {mockSubordinates.map(user => (
                            <div 
                                key={user.id}
                                className={`
                                    flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                                    ${selectedSubordinate?.id === user.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted'}
                                `}
                                onClick={() => setSelectedSubordinate(user)}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary/20 text-primary text-xs">{user.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.role}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-muted-foreground block mb-1">Carga</span>
                                    <Progress value={user.workload} className="w-16 h-1.5" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {delegationStep === 'confirm' && selectedSubordinate && (
             <div className="py-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <CalendarClock className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h4 className="text-lg font-semibold">Confirmar Delegação?</h4>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                        O caso será adjudicado para <strong>{selectedSubordinate.name}</strong>.
                    </p>
                    <div className="mt-4 bg-muted/50 p-3 rounded text-sm inline-block text-left">
                        <p><strong>Previsão:</strong> {new Date(Date.now() + 172800000).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Status:</strong> Delegado</p>
                    </div>
                </div>
             </div>
          )}

          <DialogFooter>
            {delegationStep === 'select' && (
                <Button 
                    onClick={() => setDelegationStep('confirm')} 
                    disabled={!selectedSubordinate}
                    className="w-full sm:w-auto"
                >
                    Continuar
                </Button>
            )}
            {delegationStep === 'confirm' && (
                <>
                    <Button variant="outline" onClick={() => setDelegationStep('select')}>Voltar</Button>
                    <Button onClick={handleConfirmDelegation}>Confirmar Delegação</Button>
                </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Priority Change Modal */}
      <Dialog open={priorityDialog.isOpen} onOpenChange={(open) => !open && setPriorityDialog(prev => ({ ...prev, isOpen: false }))}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <ArrowUpDown className="h-5 w-5 text-primary" />
                    Alterar Prioridade
                </DialogTitle>
                <DialogDescription>
                    Ajuste a prioridade deste caso na fila de trabalho.
                </DialogDescription>
            </DialogHeader>

            <div className="py-4">
                {priorityDialog.case?.priority === 'Alta' && (
                    <div className="space-y-4">
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive-foreground">
                            A prioridade atual é <strong>Alta</strong>. Deseja rebaixá-la para liberar recursos?
                        </div>
                        <Button 
                            variant="outline" 
                            className="w-full justify-between group hover:border-warning hover:text-warning"
                            onClick={() => handleChangePriority('Média')}
                        >
                            <span>Baixar para Média</span>
                            <ArrowDown className="h-4 w-4 text-muted-foreground group-hover:text-warning" />
                        </Button>
                    </div>
                )}

                {priorityDialog.case?.priority === 'Baixa' && (
                    <div className="space-y-4">
                         <div className="p-3 bg-success/10 border border-success/20 rounded-md text-sm text-success-foreground">
                            A prioridade atual é <strong>Baixa</strong>. Deseja elevá-la para agilizar o atendimento?
                        </div>
                        <Button 
                            variant="outline" 
                            className="w-full justify-between group hover:border-warning hover:text-warning"
                            onClick={() => handleChangePriority('Média')}
                        >
                            <span>Aumentar para Média</span>
                            <ArrowUp className="h-4 w-4 text-muted-foreground group-hover:text-warning" />
                        </Button>
                    </div>
                )}

                {priorityDialog.case?.priority === 'Média' && (
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground mb-2">Selecione o novo nível de prioridade:</p>
                        <Button 
                            variant="outline" 
                            className="w-full justify-between hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
                            onClick={() => handleChangePriority('Alta')}
                        >
                            <span>Aumentar para Alta</span>
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full justify-between hover:bg-success/5 hover:text-success hover:border-success/30"
                            onClick={() => handleChangePriority('Baixa')}
                        >
                            <span>Baixar para Baixa</span>
                            <ArrowDown className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            <DialogFooter>
                <Button variant="ghost" onClick={() => setPriorityDialog(prev => ({ ...prev, isOpen: false }))}>
                    Cancelar
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
