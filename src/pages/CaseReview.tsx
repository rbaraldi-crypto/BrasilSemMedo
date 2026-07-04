import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockMyCases, SimilarCase, CaseDocument } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Scale, FileText, AlertCircle, CheckCircle2, Gavel, ArrowUpRight, Lock, ExternalLink, Paperclip, Eye, Edit2, RefreshCw, Loader2, ShieldAlert, PieChart } from 'lucide-react';

// Interface para a resposta da API
interface Classificacao {
  tipo: string;
  materia: string;
}

export function CaseReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSimilarCase, setSelectedSimilarCase] = useState<SimilarCase | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<CaseDocument | null>(null);
  
  // State for Classification Data (Fetched from API)
  const [classificacoes, setClassificacoes] = useState<Classificacao[]>([]);
  const [isLoadingClassifications, setIsLoadingClassifications] = useState(false);

  // State for Classification Editing
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [tempClassification, setTempClassification] = useState({ tipo: "", materia: "" });
  const [currentClassification, setCurrentClassification] = useState({ tipo: "Execucao Penal", materia: "" });
  
  // State for Similarity Refresh
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [displayedSimilarCases, setDisplayedSimilarCases] = useState<SimilarCase[]>([]);

  // Auth & Error State
  const [authError, setAuthError] = useState<string | null>(null);
  // Mock Identity for demonstration - Defaulting to JUIZ to trigger the requested logic
  const [mockUserRole, setMockUserRole] = useState<"JUIZ" | "ANALISTA">("JUIZ");

  const caseData = mockMyCases.find(c => c.id === id);

  // Initialize state with case data
  useEffect(() => {
    if (caseData) {
      setCurrentClassification({
        tipo: "Execucao Penal", // Default assumption as mock data doesn't have 'tipo' field
        materia: caseData.type
      });
      setDisplayedSimilarCases(caseData.similarCases);
    }
  }, [caseData]);

  // Fetch Classifications (GET /sip/classificacoes)
  useEffect(() => {
    const fetchClassificacoes = async () => {
      setIsLoadingClassifications(true);
      try {
        // SIMULAÇÃO: Chamada ao endpoint GET /sip/classificacoes
        console.log("Fetching GET /sip/classificacoes ...");
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockData: Classificacao[] = [
          { tipo: "Execucao Penal", materia: "Progressao" },
          { tipo: "Execucao Penal", materia: "Livramento Condicional" },
          { tipo: "Execucao Penal", materia: "Comutacao" },
          { tipo: "Execucao Penal", materia: "Indulto" },
          { tipo: "Execucao Penal", materia: "Unificacao de Penas" },
          { tipo: "Execucao Penal", materia: "Remissao" },
          { tipo: "Medida de Seguranca", materia: "Cessacao" },
          { tipo: "Medida de Seguranca", materia: "Internacao" },
          { tipo: "Execucao Penal", materia: "Regressao" }
        ];
        
        setClassificacoes(mockData);
      } catch (error) {
        console.error("Erro ao buscar classificações:", error);
      } finally {
        setIsLoadingClassifications(false);
      }
    };

    fetchClassificacoes();
  }, []);

  const handleOpenEdit = () => {
    setTempClassification(currentClassification);
    setIsEditClassOpen(true);
    setAuthError(null);
  };

  const handleSaveClassification = async () => {
    setAuthError(null);

    // --- IDENTITY EXTRACTION & VALIDATION ---
    console.log(`[Security] Validating identity for classification update... Role: ${mockUserRole}`);
    
    // Logic: role == "JUIZ" OR groups contains JUIZ
    const isJuiz = mockUserRole === "JUIZ";

    if (isJuiz) {
      // Show 403 Error
      setAuthError("Erro 403: Função não permitida para Juízes.");
      
      // "Por erro exibir a mensagem mas permita continuar"
      // We show the error but do NOT return/stop execution immediately.
      // We'll add a small delay to let the user see the error before the modal closes/updates.
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // --- API INTEGRATION POINT ---
    // PATCH /hitl/tasks/{taskId}/classificacao
    try {
      console.log(`[API] PATCH /hitl/tasks/${id}/classificacao`, {
        tipo: tempClassification.tipo,
        materia: tempClassification.materia
      });

      // Simulate API latency
      setIsRecalculating(true);
      setIsEditClassOpen(false); // Close modal

      setTimeout(() => {
        setCurrentClassification(tempClassification);
        
        // Simulate AI reprocessing based on new classification
        const newCases = displayedSimilarCases.map(c => ({
          ...c,
          similarity: Math.floor(Math.random() * (99 - 75) + 75),
          decision: Math.random() > 0.3 ? "Concedido" : "Negado (Falta Grave)" 
        })).sort((a, b) => b.similarity - a.similarity);

        setDisplayedSimilarCases(newCases);
        setIsRecalculating(false);
        setAuthError(null); // Clear error after "success"
      }, 1500);

    } catch (error) {
      console.error("API Error:", error);
      setIsRecalculating(false);
    }
  };

  const handleNavigateToDecision = () => {
    // Passa o role atual via state para manter o contexto da simulação
    navigate(`/acao-humana/${id}`, { state: { role: mockUserRole } });
  };

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-2xl font-bold">Caso não encontrado</h2>
        <Button onClick={() => navigate('/meus-casos')}>Voltar para Meus Casos</Button>
      </div>
    );
  }

  const uniqueTypes = Array.from(new Set(classificacoes.map(c => c.tipo)));
  
  const availableMaterias = classificacoes
    .filter(c => c.tipo === tempClassification.tipo)
    .map(c => c.materia);

  return (
    <div className="space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/meus-casos')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-primary">Revisão do Processo</h2>
            <Badge variant="outline" className="font-mono">{caseData.caseNumber}</Badge>
          </div>
          <p className="text-muted-foreground">
            Apenado: <span className="font-medium text-foreground">{caseData.inmateName}</span>
          </p>
        </div>
        
        {/* Debug Role Switcher */}
        <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted/30 p-2 rounded border border-dashed border-muted-foreground/30">
                <span className="text-xs font-mono text-muted-foreground">Simular Role:</span>
                <select 
                    className="text-xs bg-transparent border-none font-bold text-primary focus:ring-0 cursor-pointer"
                    value={mockUserRole}
                    onChange={(e) => setMockUserRole(e.target.value as any)}
                >
                    <option value="JUIZ">JUIZ (Restrito)</option>
                    <option value="ANALISTA">ANALISTA (Permitido)</option>
                </select>
            </div>

            <Button className="gap-2 shadow-md hover:shadow-lg transition-all hover:scale-105" onClick={handleNavigateToDecision}>
                <Gavel className="h-4 w-4" />
                Decidir Agora
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Case Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Resumo do Pedido
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 gap-2 text-primary" onClick={handleOpenEdit}>
                <Edit2 className="h-3 w-3" />
                Classificar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border text-sm leading-relaxed relative">
                <div className="flex flex-col gap-1 mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Classificação Atual</span>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm font-semibold px-3 py-1">
                            {currentClassification.tipo}
                        </Badge>
                        <span className="text-muted-foreground">/</span>
                        <Badge variant="default" className="text-sm font-semibold px-3 py-1">
                            {currentClassification.materia}
                        </Badge>
                    </div>
                </div>
                <Separator className="my-3" />
                <p>
                  O apenado solicita o benefício acima com base no cumprimento de 1/6 da pena e bom comportamento carcerário atestado.
                  A defesa alega preenchimento de todos os requisitos objetivos e subjetivos.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Data de Entrada</span>
                  <p className="font-medium">{caseData.entryDate}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Status Atual</span>
                  <Badge variant="secondary">{caseData.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Section */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <Paperclip className="h-5 w-5" />
                    Peças Processuais
                </CardTitle>
                <CardDescription>Documentos digitalizados vinculados a este pedido.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {caseData.documents && caseData.documents.length > 0 ? (
                        caseData.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="h-10 w-10 bg-red-100 text-red-600 rounded flex items-center justify-center shrink-0">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate" title={doc.title}>{doc.title}</p>
                                        <p className="text-xs text-muted-foreground">{doc.date} • {doc.pages} págs</p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" onClick={() => setSelectedDocument(doc)}>
                                    <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-4 text-muted-foreground text-sm">
                            Nenhum documento anexado.
                        </div>
                    )}
                </div>
            </CardContent>
          </Card>

          {/* Similar Cases Section */}
          <Card className="border-primary/20 shadow-md relative overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Scale className="h-5 w-5" />
                    Análise de Similaridade (IA)
                  </CardTitle>
                  <CardDescription>
                    Casos precedentes com alta correlação identificados pelo motor de inferência.
                  </CardDescription>
                </div>
                <Badge variant="default" className="bg-primary text-primary-foreground">
                    {displayedSimilarCases.length} Casos Encontrados
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6 min-h-[200px]">
              {isRecalculating ? (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <div className="text-center">
                        <p className="font-semibold text-primary">Recalculando Similaridade...</p>
                        <p className="text-sm text-muted-foreground">Analisando jurisprudência para "{currentClassification.materia}"</p>
                    </div>
                </div>
              ) : null}

              {displayedSimilarCases.length > 0 ? (
                displayedSimilarCases.map((simCase) => (
                  <div key={simCase.id} className="group relative">
                    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                      {/* Similarity Score Circle */}
                      <div className="shrink-0 flex flex-col items-center gap-1">
                        <div className={`
                          flex items-center justify-center w-14 h-14 rounded-full border-4 text-sm font-bold transition-all duration-500
                          ${simCase.similarity >= 90 ? 'border-primary text-primary' : 'border-muted-foreground/30 text-muted-foreground'}
                        `}>
                          {simCase.similarity}%
                        </div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Similaridade</span>
                      </div>

                      {/* Case Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            {/* Case Number as a Link/Button */}
                            <button 
                              onClick={() => setSelectedSimilarCase(simCase)}
                              className="font-mono text-sm font-semibold text-primary hover:underline hover:text-primary/80 flex items-center gap-1 transition-colors text-left"
                            >
                              {simCase.caseNumber}
                              <ExternalLink className="h-3 w-3 opacity-50" />
                            </button>
                            <p className="text-xs text-muted-foreground">{simCase.crime}</p>
                          </div>
                          <Badge variant={simCase.decision.includes('Negado') ? 'destructive' : 'default'} 
                            className={simCase.decision.includes('Negado') ? '' : 'bg-success hover:bg-success/90'}>
                            {simCase.decision}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                          <div className="bg-muted/30 p-2 rounded">
                            <span className="text-xs text-muted-foreground block">Pena</span>
                            <span className="font-medium">{simCase.penalty}</span>
                          </div>
                          <div className="bg-muted/30 p-2 rounded">
                            <span className="text-xs text-muted-foreground block">Resultado</span>
                            <span className="font-medium">{simCase.decision}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action */}
                      <div className="self-center pl-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Ver detalhes do precedente"
                          onClick={() => setSelectedSimilarCase(simCase)}
                        >
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>Nenhum caso similar com alta relevância encontrado para este processo.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Sugestão do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20 flex flex-col items-center text-center gap-2">
                        <CheckCircle2 className="h-8 w-8 text-success" />
                        <span className="font-bold text-success text-lg">Deferimento</span>
                        <p className="text-xs text-muted-foreground">
                            Baseado em 92% de casos similares deferidos com este perfil.
                        </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Fatores de Peso</h4>
                        <ul className="text-sm space-y-2">
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                Requisito Temporal (100%)
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                Bom Comportamento
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                Exame Criminológico Favorável
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Dialog for Classification Edit */}
      <Dialog open={isEditClassOpen} onOpenChange={setIsEditClassOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Classificação do Processo</DialogTitle>
            <DialogDescription>
              Ajuste a tipificação para refinar a busca de precedentes e análise de IA.
            </DialogDescription>
          </DialogHeader>
          
          {authError && (
            <Alert variant="destructive" className="mb-2">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Acesso Negado</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          {isLoadingClassifications ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Carregando classificações...</p>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo do Processo</Label>
                <Select 
                  value={tempClassification.tipo} 
                  onValueChange={(val) => setTempClassification(prev => ({ ...prev, tipo: val, materia: "" }))}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTypes.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="materia">Matéria / Pedido</Label>
                <Select 
                  value={tempClassification.materia} 
                  onValueChange={(val) => setTempClassification(prev => ({ ...prev, materia: val }))}
                  disabled={!tempClassification.tipo}
                >
                  <SelectTrigger id="materia">
                    <SelectValue placeholder="Selecione a matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMaterias.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditClassOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveClassification} disabled={!tempClassification.materia || isLoadingClassifications}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Salvar e Recalcular
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Document Viewer */}
      <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {selectedDocument?.title}
                </DialogTitle>
                <DialogDescription>
                    Visualização do documento digitalizado.
                </DialogDescription>
            </DialogHeader>
            <div className="flex-1 bg-muted/20 rounded-lg border flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <div className="h-24 w-20 bg-white shadow-lg mx-auto border flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">PDF Preview</span>
                    </div>
                    <div>
                        <p className="font-medium">Simulação de Visualização de Arquivo</p>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                            Em um ambiente real, o PDF seria renderizado aqui.
                            <br/>
                            <strong>Assinado por:</strong> {selectedDocument?.signedBy}
                        </p>
                    </div>
                </div>
            </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Similar Case Details */}
      <Dialog open={!!selectedSimilarCase} onOpenChange={(open) => !open && setSelectedSimilarCase(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="gap-1 bg-muted/50">
                    <Lock className="h-3 w-3" /> Read Only
                </Badge>
                <span className="text-xs text-muted-foreground">Visualização de Precedente</span>
            </div>
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Processo {selectedSimilarCase?.caseNumber}
            </DialogTitle>
            <DialogDescription>
              Detalhes do caso correlato para fins de comparação jurisprudencial.
            </DialogDescription>
          </DialogHeader>

          {selectedSimilarCase && (
            <div className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/20 border">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Crime Principal</span>
                        <p className="font-medium mt-1">{selectedSimilarCase.crime}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/20 border">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Pena Fixada</span>
                        <p className="font-medium mt-1">{selectedSimilarCase.penalty}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/20 border">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Decisão Final</span>
                        <p className={`font-medium mt-1 ${selectedSimilarCase.decision.includes("Negado") ? "text-destructive" : "text-success"}`}>
                            {selectedSimilarCase.decision}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        Fatores de Similaridade (Pesos)
                    </h4>
                    <div className="p-4 border rounded-lg bg-card space-y-4">
                        {selectedSimilarCase.factors && selectedSimilarCase.factors.length > 0 ? (
                            selectedSimilarCase.factors.map((factor, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-medium text-foreground/80">{factor.name}</span>
                                        <span className="font-bold text-primary">{factor.weight}%</span>
                                    </div>
                                    <Progress value={factor.weight} className="h-2" />
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">Mesma Tipificação Penal</Badge>
                                <Badge variant="secondary">Reincidência Específica</Badge>
                                <Badge variant="secondary">Tempo de Pena Similar (+/- 10%)</Badge>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-primary">Ementa da Decisão</h4>
                    <div className="p-4 bg-muted/10 border rounded-md text-sm leading-relaxed text-justify">
                        <p>
                            PENAL. PROCESSO PENAL. EXECUÇÃO. PROGRESSÃO DE REGIME. REQUISITO OBJETIVO PREENCHIDO. 
                            BOM COMPORTAMENTO CARCERÁRIO ATESTADO. AUSÊNCIA DE FALTA GRAVE NOS ÚLTIMOS 12 MESES. 
                            SÚMULA 491 DO STJ. DECISÃO MANTIDA.
                        </p>
                        <p className="mt-2 text-muted-foreground">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => setSelectedSimilarCase(null)}>
                        Fechar e Retornar
                    </Button>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
