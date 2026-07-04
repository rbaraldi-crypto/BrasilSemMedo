import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, DollarSign, ArrowRight, Users, ShieldCheck, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

/**
 * Medida 10: Módulo de Apoio às Vítimas
 * Rastreia o redirecionamento de recursos de detentos para famílias de vítimas.
 */
export function VictimSupportModule({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const [records] = useState([
    { id: 'VS-001', inmate: 'Carlos Eduardo', victim: 'Família Souza', amount: 1250.00, progress: 85, status: 'ACTIVE' },
    { id: 'VS-002', inmate: 'Marcos Paulo', victim: 'Família Oliveira', amount: 890.00, progress: 40, status: 'PENDING' },
    { id: 'VS-003', inmate: 'Ricardo Silva', victim: 'Família Santos', amount: 2100.00, progress: 100, status: 'ACTIVE' },
  ]);

  const Content = (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl">
          <p className="text-[8px] font-black text-slate-500 uppercase">Total Redirecionado</p>
          <p className="text-lg font-black text-white">R$ 442.800</p>
        </div>
        <div className="bg-success/10 border border-success/20 p-3 rounded-xl">
          <p className="text-[8px] font-black text-slate-500 uppercase">Famílias Atendidas</p>
          <p className="text-lg font-black text-white">1.240</p>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fluxos de Reparação Ativos</span>
        {records.map((record) => (
          <motion.div 
            key={record.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 border border-white/5 p-3 rounded-xl hover:border-primary/30 transition-colors group"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[10px] font-bold text-white uppercase">{record.victim}</p>
                <p className="text-[8px] text-slate-500">Origem: {record.inmate}</p>
              </div>
              <Badge variant="outline" className={cn("text-[7px] font-black", record.status === 'ACTIVE' ? "border-success text-success" : "border-warning text-warning")}>
                {record.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={record.progress} className="h-1.5 flex-1" />
              <span className="text-[9px] font-mono text-primary">R$ {record.amount.toFixed(2)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <Button className="w-full bg-primary hover:bg-primary/90 text-[9px] font-black uppercase tracking-widest h-9">
        <HeartHandshake className="h-3.5 w-3.5 mr-2" /> Novo Termo de Reparação
      </Button>
    </div>
  );

  if (isEmbedded) return <div className="h-full overflow-auto custom-scrollbar bg-slate-950">{Content}</div>;

  return (
    <Card className="bg-slate-900 border-white/10 shadow-2xl overflow-hidden">
      <CardHeader className="bg-white/5 border-b border-white/5">
        <CardTitle className="text-sm font-black text-white uppercase flex items-center gap-2">
          <HeartHandshake className="h-4 w-4 text-primary" /> Apoio às Vítimas (Ponto 10)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {Content}
      </CardContent>
    </Card>
  );
}
