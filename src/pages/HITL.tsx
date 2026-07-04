import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Gavel, Loader2, CheckCircle, ShieldAlert, FileInput, ArrowRight, ArrowLeft, Search, BookOpen, AlertCircle, ShieldCheck, Fingerprint, FileText, User, Briefcase, ShieldX, Activity, BrainCircuit } from "lucide-react";
import { mockMyCases } from "@/data/mockData";
import { BiometricScanner } from "@/components/intelligence/BiometricScanner";
import { ComplianceSandbox } from "@/components/intelligence/ComplianceSandbox";
import { RecidivismRiskAnalysis } from "@/components/intelligence/RecidivismRiskAnalysis";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  actionType: z.string({ required_error: "Selecione um tipo de ação." }),
  dispatchText: z.string().min(10, "O texto deve ter no mínimo 10 caracteres."),
  legalObservation: z.string().optional(),
  humanCheck: z.boolean().refine(val => val === true, {
    message: "Você deve confirmar a responsabilidade pela ação.",
  }),
});

export function HITL() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Sandbox State (P3)
  const [isSandboxValidated, setIsSandboxValidated] = useState(false);
  const [complianceScore, setComplianceScore] = useState<number | null>(null);

  // Law Verification State
  const [isVerifyingLaw, setIsVerifyingLaw] = useState(false);
  const [lawSummary, setLawSummary] = useState<{title: string, content: string} | null>(null);
  const [lawNotFound, setLawNotFound] = useState(false);

  // Mock Identity Context
  const [mockUserRole, setMockUserRole] = useState<"JUIZ" | "ANALISTA">("ANALISTA");

  const currentCase = mockMyCases.find(c => c.id === taskId);
  const isPoint11Active = currentCase?.isPoint11;

  useEffect(() => {
    if (location.state?.role) {
      setMockUserRole(location.state.role);
    }
  }, [location.state]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dispatchText: "",
      legalObservation: "",
      humanCheck: false,
    },
  });

  const isHumanChecked = form.watch("humanCheck");
  const selectedAction = form.watch("actionType");

  // Re-validar sandbox se a ação mudar
  useEffect(() => {
    setIsSandboxValidated(false);
    setComplianceScore(null);
  }, [selectedAction]);

  const handleVerifyLaw = async () => {
    const term = form.getValues("legalObservation");
    if (!term || term.length < 3) return;
    setIsVerifyingLaw(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerifyingLaw(false);
    setLawSummary({
      title: "Lei de Execução Penal - Art. 112",
      content: "A pena privativa de liberdade será executada em forma progressiva..."
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage(mockUserRole === "JUIZ" ? "Decisão assinada via ICP-Brasil." : "Status atualizado.");
      setIsSuccess(true);
    } catch (error) {
      setAuthError("Erro ao processar.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="h-20 w-20 bg-success/10 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-primary">{mockUserRole === "JUIZ" ? "Decisão Registrada" : "Tramitação Realizada"}</h2>
            <p className="text-muted-foreground max-w-md mx-auto">{successMessage}</p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline">Voltar</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-6 w-6" /></Button>
            <div>
                <h2 className="text-3xl font-bold text-primary">{mockUserRole === 'JUIZ' ? "Decisão Judicial (HITL)" : "Tramitação Processual"}</h2>
                <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">Terminal de Supervisão Humana</p>
            </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-white/10">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Simular Role:</span>
            <select 
                className="text-[10px] bg-transparent border-none font-black text-primary focus:ring-0 cursor-pointer uppercase"
                value={mockUserRole}
                onChange={(e) => setMockUserRole(e.target.value as any)}
            >
                <option value="JUIZ">JUIZ (MAGISTRADO)</option>
                <option value="ANALISTA">ANALISTA (TÉCNICO)</option>
            </select>
        </div>
      </div>

      <div className="bg-slate-900 border border-primary/20 rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-4 items-center shadow-xl">
          <div className="flex-1">
              <div className="flex items-center gap-2 text-primary mb-1">
                  <FileText className="h-5 w-5" />
                  <span className="font-mono font-black text-xl tracking-tighter">{currentCase?.caseNumber}</span>
                  {isPoint11Active && (
                    <Badge variant="destructive" className="ml-2 bg-red-600 font-black animate-pulse h-5 text-[8px]">PONTO 11 ATIVO</Badge>
                  )}
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <User className="h-3 w-3" /> {currentCase?.inmateName}
                  <span className="opacity-30">|</span>
                  <Activity className="h-3 w-3" /> {currentCase?.type}
              </div>
          </div>
          <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Status Atual</span>
                <Badge variant="secondary" className="font-black text-[10px] h-6">{currentCase?.status}</Badge>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-slate-900 border-white/10 overflow-hidden">
            <div className={cn("h-1 w-full", mockUserRole === 'JUIZ' ? "bg-primary" : "bg-secondary")} />
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white uppercase tracking-tight">
                {mockUserRole === 'JUIZ' ? "Registro de Sentença" : "Parecer Técnico"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="actionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase text-slate-500">Tipo de Movimentação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-white/10 h-11">
                              <SelectValue placeholder="Selecione a ação estratégica..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-white/10 text-white">
                            {mockUserRole === 'JUIZ' ? (
                                <>
                                    <SelectItem value="concessao" className="font-bold">Concessão de Benefício</SelectItem>
                                    <SelectItem value="negacao" className="font-bold">Negação de Pedido</SelectItem>
                                    <SelectItem value="arquivamento" className="font-bold">Arquivamento</SelectItem>
                                </>
                            ) : (
                                <>
                                    <SelectItem value="parecer_favoravel">Parecer Favorável</SelectItem>
                                    <SelectItem value="parecer_desfavoravel">Parecer Desfavorável</SelectItem>
                                    <SelectItem value="concluso">Remeter para Conclusão</SelectItem>
                                </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dispatchText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase text-slate-500">Corpo do Texto</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Insira a fundamentação jurídica..."
                            className="min-h-[180px] bg-black/20 border-white/10 font-medium text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4 gap-3">
                    <Button type="button" variant="ghost" className="text-slate-500 hover:text-white" onClick={() => navigate(-1)}>Cancelar</Button>
                    <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isLoading || !isHumanChecked || (mockUserRole === 'JUIZ' && !isSandboxValidated)} 
                        className={cn(
                          "w-full md:w-auto gap-2 font-black uppercase text-[10px] tracking-widest h-12 px-8 transition-all duration-300",
                          isHumanChecked ? "shadow-[0_0_20px_rgba(11,60,93,0.4)] scale-105" : "opacity-50 grayscale",
                          mockUserRole === 'ANALISTA' ? 'bg-secondary hover:bg-secondary/90' : 'bg-primary hover:bg-primary/90'
                        )}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (mockUserRole === 'JUIZ' ? <><Gavel className="h-4 w-4" /> Assinar e Decidir</> : <><ArrowRight className="h-4 w-4" /> Atualizar Status</>)}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Score de Reincidência (Opção 1) - Visível apenas para o Juiz */}
          {mockUserRole === 'JUIZ' && (
            <RecidivismRiskAnalysis inmateId={currentCase?.inmate_id || "001"} />
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          {/* Sandbox de Impacto (P3) - Visível apenas para Juiz ou se ação for selecionada */}
          {selectedAction && (
            <ComplianceSandbox 
              caseType={currentCase?.type || ""}
              actionType={selectedAction}
              isPoint11={!!isPoint11Active}
              onValidated={(score) => {
                setIsSandboxValidated(true);
                setComplianceScore(score);
              }}
            />
          )}

          {/* Componente de Assinatura Biométrica (P2) */}
          <div className={cn(
            "sticky top-24 transition-all duration-500",
            (mockUserRole === 'JUIZ' && !isSandboxValidated) ? "opacity-30 pointer-events-none scale-95" : "opacity-100"
          )}>
            {mockUserRole === 'JUIZ' ? (
              <BiometricScanner 
                operatorName="Juiz Dr. Silva"
                onVerified={() => form.setValue("humanCheck", true)}
              />
            ) : (
              <Card className="bg-slate-900 border-white/10 shadow-xl">
                <CardHeader className="pb-3 bg-white/5 border-b border-white/5">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Confirmação de Analista</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="humanCheck"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-white/10 p-5 bg-black/20">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-xs font-bold text-white">Declaração de Veracidade</FormLabel>
                          <FormDescription className="text-[9px] text-slate-500 font-medium leading-relaxed">
                            Confirmo que as informações prestadas foram revisadas tecnicamente e estão em conformidade com o regimento interno.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
            
            {mockUserRole === 'JUIZ' && !isSandboxValidated && selectedAction && (
              <p className="text-[9px] font-black text-destructive uppercase text-center mt-4 animate-pulse">
                Aguardando Validação do Sandbox de Impacto
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
