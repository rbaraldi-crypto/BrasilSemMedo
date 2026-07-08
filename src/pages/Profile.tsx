import { useState } from "react";
import { mockInmate, mockTimeline } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Fingerprint, FileText, Calendar, Hash, AlertTriangle } from "lucide-react";

export function Profile() {
  const [selectedEvent, setSelectedEvent] = useState<typeof mockTimeline[0] | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">{mockInmate.name}</h2>
          <p className="text-muted-foreground font-mono mt-1">ID Penal: {mockInmate.id}</p>
        </div>
        <Badge variant="outline" className="w-fit text-sm py-1 px-3 border-primary text-primary">
          Regime Semiaberto
        </Badge>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Identity & Bio */}
        <div className="col-span-12 md:col-span-4 space-y-6">
          <Card className="overflow-hidden border-t-4 border-t-primary">
            <CardHeader className="bg-muted/30 pb-8">
              <div className="flex justify-center">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={mockInmate.photoUrl} />
                  <AvatarFallback>CE</AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent className="pt-0 -mt-4 text-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full text-sm font-semibold cursor-help border border-success/20">
                      <Fingerprint className="h-4 w-4" />
                      Identidade Confirmada
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Identidade confirmada via ABIS externo. O IABS não armazena biometria bruta.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="mt-6 space-y-3 text-left">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">CPF</span>
                  <span className="text-sm font-medium font-mono">{mockInmate.cpf}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Nascimento</span>
                  <span className="text-sm font-medium">{mockInmate.dateOfBirth}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Mãe</span>
                  <span className="text-sm font-medium">{mockInmate.motherName}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Component */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Linha do Tempo Penal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4">
                  {mockTimeline.map((event) => (
                    <div 
                      key={event.id} 
                      className="relative pl-8 cursor-pointer group"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-background border-2 border-primary group-hover:bg-primary transition-colors" />
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-primary/80">{event.date}</span>
                        <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{event.type}</h4>
                        <p className="text-xs text-muted-foreground">{event.origin}</p>
                        <div className="flex items-center gap-1 mt-1 bg-muted/50 w-fit px-2 py-0.5 rounded text-xs font-mono text-muted-foreground">
                          <Hash className="h-3 w-3" />
                          {event.hashICP}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details & Accordions */}
        <div className="col-span-12 md:col-span-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Dossiê Jurídico</CardTitle>
              <CardDescription>Informações consolidadas do processo de execução.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full" defaultValue="situacao">
                <AccordionItem value="situacao">
                  <AccordionTrigger className="text-lg font-semibold text-primary">Situação da Pena</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/20 rounded-lg border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Pena Total</span>
                        <p className="text-xl font-bold mt-1">5 anos e 4 meses</p>
                      </div>
                      <div className="p-4 bg-muted/20 rounded-lg border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Pena Cumprida</span>
                        <p className="text-xl font-bold mt-1 text-success">1 ano e 2 meses</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      O apenado encontra-se atualmente em regime semiaberto, com bom comportamento carcerário atestado. 
                      Próxima previsão de progressão: 15/08/2024.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="direitos">
                  <AccordionTrigger className="text-lg font-semibold text-primary">Direitos & Benefícios</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Direito a visita periódica (Concedido)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Remição por trabalho (32 dias remidos)</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="compliance">
                  <AccordionTrigger className="text-lg font-semibold text-primary">Compliance</AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20">
                      <h4 className="font-semibold text-destructive mb-1 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Alerta de Benefício Vencido
                      </h4>
                      <p className="text-sm text-destructive/80">
                        Detectado possível atraso na concessão de saída temporária. Verifique a aba de Compliance para mais detalhes.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="similares">
                  <AccordionTrigger className="text-lg font-semibold text-primary">Casos Similares</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      O sistema identificou 3 casos com alta similaridade (crime, pena e perfil).
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded border text-sm">
                        <span>Caso #0001234-56...</span>
                        <Badge variant="secondary">92% Similaridade</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded border text-sm">
                        <span>Caso #0005678-12...</span>
                        <Badge variant="secondary">85% Similaridade</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <FileText className="h-5 w-5" />
              Evento Penal – Prova Digital
            </DialogTitle>
            <DialogDescription>
              Detalhes técnicos e jurídicos do evento selecionado.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Tipo</span>
                  <p className="text-sm font-medium">{selectedEvent.type}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Data</span>
                  <p className="text-sm font-medium">{selectedEvent.date}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Origem</span>
                  <p className="text-sm font-medium">{selectedEvent.origin}</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Hash ICP-Brasil
                </span>
                <code className="text-xs font-mono break-all bg-background p-2 rounded border block">
                  {selectedEvent.hashICP}
                </code>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Descrição</span>
                <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded border">
                  {selectedEvent.details}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
