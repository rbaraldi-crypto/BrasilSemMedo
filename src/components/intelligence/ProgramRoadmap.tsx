import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Target, Layout, Zap, FileDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { reportService } from '@/services/reportService';
import { tacticalAudio } from '@/lib/audioUtils';
import { toast } from 'sonner';

const roadmapData = [
  { id: 1, eixo: "Facções como Narcoterroristas", ui: "Monitoramento de Organizações", status: "Implementado", color: "bg-red-500/10 text-red-500" },
  { id: 2, eixo: "Redução da Maioridade", ui: "Diretrizes do Programa", status: "Em Votação", color: "bg-warning/10 text-warning" },
  { id: 3, eixo: "Tropas nas Fronteiras", ui: "Mapa Tático (Markers)", status: "Operacional", color: "bg-success/10 text-success" },
  { id: 4, eixo: "Presídios TREVA", ui: "Mapa Tático (Complexos)", status: "Operacional", color: "bg-success/10 text-success" },
  { id: 5, eixo: "Castração Química", ui: "Diretrizes do Programa", status: "Análise Jurídica", color: "bg-primary/10 text-primary" },
  { id: 6, eixo: "Feminicídio Zero", ui: "Diretrizes do Programa", status: "Operacional", color: "bg-success/10 text-success" },
  { id: 7, eixo: "Controle de Portos", ui: "Mapa Tático (Vigilância)", status: "Operacional", color: "bg-success/10 text-success" },
  { id: 8, eixo: "Aumento de Orçamento", ui: "Dashboard Financeiro", status: "ROI: 11.5%", color: "bg-primary/10 text-primary" },
  { id: 9, eixo: "Muralha Brasileira", ui: "Muralha & Despacho", status: "Operacional", color: "bg-success/10 text-success" },
  { id: 10, eixo: "Apoio às Vítimas", ui: "Diretrizes do Programa", status: "Em Trâmite", color: "bg-warning/10 text-warning" },
  { id: 11, eixo: "Fim da Progressão", ui: "Ação Humana (HITL)", status: "Bloqueio Ativo", color: "bg-red-500/10 text-red-500" },
  { id: 12, eixo: "Roubo de Celulares", ui: "Diretrizes do Programa", status: "Operacional", color: "bg-success/10 text-success" },
];

export function ProgramRoadmap({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportAudit = async () => {
    setIsExporting(true);
    tacticalAudio.playScan();
    toast.loading("Gerando Relatório Ministerial de Auditoria...", { id: "audit-gen" });

    try {
      await reportService.generateMinisterialRoadmapReport(roadmapData);
      tacticalAudio.playSuccess();
      toast.success("Relatório de Auditoria exportado com sucesso.", { id: "audit-gen" });
    } catch (error) {
      console.error(error);
      toast.error("Falha ao gerar relatório de auditoria.", { id: "audit-gen" });
    } finally {
      setIsExporting(false);
    }
  };

  const Content = (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-6">#</TableHead>
            <TableHead className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Eixo do Programa</TableHead>
            <TableHead className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-right pr-6">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roadmapData.map((item) => (
            <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group">
              <TableCell className="pl-6 font-mono text-[10px] text-slate-500">{item.id.toString().padStart(2, '0')}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3 text-primary/40 group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-bold text-slate-200">{item.eixo}</span>
                </div>
              </TableCell>
              <TableCell className="text-right pr-6">
                <Badge className={cn("text-[7px] font-black uppercase border-none h-4", item.color)}>
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (isEmbedded) {
    return <div className="h-full overflow-auto custom-scrollbar">{Content}</div>;
  }

  return (
    <Card className="bg-slate-900 border-white/10 shadow-2xl overflow-hidden h-full">
      <CardHeader className="bg-white/5 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Roadmap Combate a Terrorismo
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Mapeamento de Eixos Estratégicos
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 border-primary/30 text-primary hover:bg-primary/10 font-bold text-[9px] uppercase tracking-widest"
              onClick={handleExportAudit}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <FileDown className="h-3 w-3 mr-2" />}
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {Content}
      </CardContent>
    </Card>
  );
}
