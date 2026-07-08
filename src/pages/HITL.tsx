import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Gavel, Loader2, CheckCircle, Smartphone, 
  ArrowLeft, Calculator, ShieldAlert, Lock,
  ShieldCheck, BrainCircuit, Key, FileText
} from "lucide-react";
import { mockMyCases } from "@/data/mockData";
import { BiometricScanner } from "@/components/intelligence/BiometricScanner";
import { ComplianceSandbox } from "@/components/intelligence/ComplianceSandbox";
import { HardenedModeToggle } from "@/components/intelligence/HardenedModeToggle";
import { LegalJustificationAssistant } from "@/components/intelligence/LegalJustificationAssistant";
import { MultiSignatureAuth } from "@/components/intelligence/MultiSignatureAuth";
import { tacticalAudio } from "@/lib/audioUtils";

const formSchema = z.object({
  actionType: z.string({ required_error: "Selecione um tipo de ação." }),
  dispatchText: z.string().min(10, "O texto deve ter no mínimo 10 caracteres."),
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
  const [isSandboxValidated, setIsSandboxValidated] = useState(false);
  
  // Medida 6 & 11: Modo Endurecido State
  const [isHardenedMode, setIsHardenedMode] = useState(true);
  const [isMultiSigOpen, setIsMultiSigOpen] = useState(false);
  
  const [mockUserRole, setMockUserRole] = useState<"JUIZ" | "ANALISTA">("ANALISTA");

  const currentCase = mockMyCases.find(c => c.id === taskId);
  const isMobileTheft = currentCase?.type.toLowerCase().includes('celular') || currentCase?.type.toLowerCase().includes('mobile');

  useEffect(() => {
    if (location.state?.role) setMockUserRole(location.state.role);
  }, [location.state]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { dispatchText: "", humanCheck: false },
  });

  const selectedAction = form.watch("actionType");

  const handleToggleHardenedMode = (val: boolean) => {
    if (!val && isHardenedMode) {
      // Tentativa de desativar: Exige Multi-Assinatura
      setIsMultiSigOpen(true);
    } else {
      setIsHardenedMode(val);
      tacticalAudio.playScan();
    }
  };

  const handleJustificationSelect = (text: string) => {
    form.setValue("dispatchText", text);
    tacticalAudio.playSuccess();
  };

  // Medida 12: Multiplicador 4x para Celulares
  const calculatePenalty = () => {
    const basePenalty = 5; // anos base
    if (isMobileTheft) return { base: basePenalty, multiplier: 4, total: basePenalty * 4 };
    return { base: basePenalty, multiplier: 1, total: basePenalty };
  };

  const penaltyInfo = calculatePenalty();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isHardenedMode && values.actionType === 'concessao') {
      alert("BLOQUEIO ESTRATÉGICO: Progressão proibida em Modo Endurecido (Ponto 11).");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSuccess(true);
    setIsLoading(false);
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="h-20 w-20 bg-success/10 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-primary">Decisão Registrada via ICP-Brasil</h2>
        <Button onClick={() => navigate(-1)} variant="outline">Voltar</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <MultiSignatureAuth 
        isOpen={isMultiSigOpen}
        onClose={() => setIsMultiSigOpen(false)}
        onAuthorized={() => {
          setIsHardenedMode(false);
          tacticalAudio.playSuccess();
        }}
        actionName="Desativação do Modo Endurecido (Ponto 11)"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-6 w-6" /></Button>
            <div>
                <h2 className="text-3xl font-bold text-primary">Terminal de Supervisão Humana</h2>
                <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">Brasil Sem Medo: Operational C2</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <HardenedModeToggle 
            checked={isHardenedMode} 
            onCheckedChange={handleToggleHardenedMode}
            disabled={mockUserRole !== 'JUIZ'}
          />

          {isMobileTheft && (
            <Card className="bg-red-950/20 border-red-600/50 overflow-hidden">
              <div className="bg-red-600 px-4 py-1.5 flex items-center gap-2">
                <Calculator className="h-3 w-3 text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Calculadora Penal P12 (Dispositivos Móveis)</span>
              </div>
              <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-red-500 uppercase">Art. 155/157 CP</p>
                    <p className="text-xl font-black text-white">RECEPTAÇÃO / ROUBO</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Base</p>
                    <p className="text-lg font-bold text-white">{penaltyInfo.base}a</p>
                  </div>
                  <div className="text-red-500 font-black">X</div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Multiplicador</p>
                    <p className="text-lg font-bold text-red-500">{penaltyInfo.multiplier}x</p>
                  </div>
                  <div className="text-white font-black">=</div>
                  <div className="text-center px-4 py-1 bg-red-600 rounded-lg">
                    <p className="text-[10px] font-black text-white/70 uppercase">Total</p>
                    <p className="text-xl font-black text-white">{penaltyInfo.total} ANOS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-900 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-white uppercase">Sentença Estratégica</CardTitle>
              <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[10px]">
                <Lock className="h-2.5 w-2.5 mr-1" /> SECURE_DRAFT
              </Badge>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="actionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="bg-black/20 border-white/10 h-11">
                              <SelectValue placeholder="Selecione a ação..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                              <SelectItem value="concessao" disabled={isHardenedMode} className="font-bold">
                                Concessão (BLOQUEADO EM MODO ENDURECIDO)
                              </SelectItem>
                              <SelectItem value="negacao" className="font-bold">Negação de Pedido</SelectItem>
                              <SelectItem value="arquivamento" className="font-bold">Arquivamento</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dispatchText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase text-slate-500 flex items-center gap-2">
                          <FileText className="h-3 w-3" /> Fundamentação Jurídica
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            className="min-h-[200px] bg-black/20 border-white/10 font-mono text-xs leading-relaxed" 
                            placeholder="Insira a fundamentação ou utilize o assistente IA ao lado..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isLoading || (mockUserRole === 'JUIZ' && !isSandboxValidated)} 
                    className="w-full h-12 bg-primary hover:bg-primary/90 font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                    Assinar via ICP-Brasil
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {/* Medida 6 & 11: Assistente IA Integrado */}
          <LegalJustificationAssistant 
            crimeType={currentCase?.type || "Crime Comum"}
            onSelect={handleJustificationSelect}
          />

          {selectedAction && (
            <ComplianceSandbox 
              caseType={currentCase?.type || ""}
              actionType={selectedAction}
              isPoint11={isHardenedMode}
              onValidated={() => setIsSandboxValidated(true)}
            />
          )}

          {mockUserRole === 'JUIZ' && (
            <BiometricScanner 
              operatorName="Juiz Dr. Silva"
              onVerified={() => form.setValue("humanCheck", true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
