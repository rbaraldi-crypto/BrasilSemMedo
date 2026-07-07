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
import { ArrowLeft, Scale, FileText, AlertCircle, CircleCheck, Gavel, ArrowUpRight, Lock, ExternalLink, Paperclip, Eye, Pencil, RefreshCw, Loader2, ShieldAlert, PieChart, Baby } from 'lucide-react';
import { JuvenileTransitionWorkflow } from '@/components/intelligence/JuvenileTransitionWorkflow';

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
  const [mockUserRole, setMockUserRole] = useState<"JUIZ" | "ANALISTA">("JUIZ");

  const caseData = mockMyCases.find(c => c.id === id);

  // Medida 2: Age Check Logic
  const inmateAge = 17; // Mocked for demonstration
  const showJuvenileWorkflow = inmateAge < 18;

  useEffect(() => {
    if (caseData) {
      setCurrentClassification({
        tipo: "Execucao Penal",
        materia: caseData.type
      });
      setDisplayedSimilarCases(caseData.similarCases);
    }
  }, [caseData]);

  useEffect(() => {
    const fetchClassificacoes = async () => {
      setIsLoadingClassifications(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData: Classificacao[] = [
          { tipo: "Execucao Penal", materia: "Progressao" },
          { tipo: "Execucao Penal", materia: "Livramento Condicional" },
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
    if (mockUserRole === "JUIZ") {
      setAuthError("Erro 403: Função não permitida para Juízes.");
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsRecalculating(true);
    setIsEditClassOpen(false);
    setTimeout(() => {
      setCurrentClassification(tempClassification);
      setIsRecalculating(false);
    }, 1500);
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
  const availableMaterias = classificacoes.filter(c => c.tipo === tempClassification.tipo).map(c => c.materia);

  return (
    <div className="space-y-6">
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
        
        <div className="ml-auto flex items-center gap-4">
            <Button className="gap-2 shadow-md" onClick={() => navigate(`/acao-humana/${id}`, { state: { role: mockUserRole } })}>
                <Gavel className="h-4 w-4" /> Decidir Agora
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Medida 2: Juvenile Transition Workflow Integration */}
          {showJuvenileWorkflow && (
            <JuvenileTransitionWorkflow 
              age={inmateAge} 
              inmateName={caseData.inmateName} 
              onComplete={() => console.log("Transição Efetivada")}
            />
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Resumo do Pedido
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 gap-2 text-primary" onClick={handleOpenEdit}>
                <Pencil className="h-3 w-3" /> Classificar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border text-sm leading-relaxed">
                <div className="flex flex-col gap-1 mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Classificação Atual</span>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">{currentClassification.tipo}</Badge>
                        <span className="text-muted-foreground">/</span>
                        <Badge variant="default">{currentClassification.materia}</Badge>
                    </div>
                </div>
                <Separator className="my-3" />
                <p>O apenado solicita o benefício acima com base no cumprimento de requisitos temporais.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-md relative overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Scale className="h-5 w-5" /> Análise de Similaridade (IA)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6 min-h-[200px]">
              {isRecalculating ? (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="font-semibold text-primary">Recalculando Similaridade...</p>
                </div>
              ) : displayedSimilarCases.map((simCase) => (
                <div key={simCase.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 text-sm font-bold border-primary text-primary">
                      {simCase.similarity}%
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-mono text-sm font-semibold text-primary">{simCase.caseNumber}</p>
                      <Badge variant={simCase.decision.includes('Negado') ? 'destructive' : 'default'}>{simCase.decision}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle className="text-base">Sugestão do Sistema</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20 flex flex-col items-center text-center gap-2">
                        <CircleCheck className="h-8 w-8 text-success" />
                        <span className="font-bold text-success text-lg">Deferimento</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      <Dialog open={isEditClassOpen} onOpenChange={setIsEditClassOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Classificação do Processo</DialogTitle>
          </DialogHeader>
          {authError && <Alert variant="destructive"><ShieldAlert className="h-4 w-4" /><AlertTitle>Acesso Negado</AlertTitle><AlertDescription>{authError}</AlertDescription></Alert>}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo do Processo</Label>
              <Select value={tempClassification.tipo} onValueChange={(val) => setTempClassification(prev => ({ ...prev, tipo: val, materia: "" }))}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>{uniqueTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditClassOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveClassification} disabled={isLoadingClassifications}>Salvar e Recalcular</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
