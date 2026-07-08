import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, ArrowLeft, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VictimTransparencyPortal } from './VictimTransparencyPortal';
import { tacticalAudio } from '@/lib/audioUtils';
import { VictimList } from './VictimList';
import { VictimFlowView } from './VictimFlowView';

export function VictimSupportModule({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const [view, setView] = useState<'LIST' | 'FLOW' | 'PORTAL'>('LIST');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [records] = useState([
    { id: 'VS-001', inmate: 'Carlos Eduardo', victim: 'Família Souza', amount: 45200.00, monthly: 1250.00, progress: 27, status: 'ACTIVE', protocol: 'SIS-882144' },
    { id: 'VS-002', inmate: 'Marcos Paulo', victim: 'Família Oliveira', amount: 32400.00, monthly: 890.00, progress: 15, status: 'PENDING', protocol: 'SIS-109233' },
    { id: 'VS-003', inmate: 'Ricardo Silva', victim: 'Família Santos', amount: 12000.00, monthly: 2100.00, progress: 100, status: 'COMPLETED', protocol: 'SIS-991200' },
  ]);

  const handleOpenFlow = (record: any) => {
    tacticalAudio.playScan();
    setSelectedRecord(record);
    setView('FLOW');
  };

  const handleOpenPortal = () => {
    tacticalAudio.playSuccess();
    setView('PORTAL');
  };

  const Header = (
    <div className="p-5 bg-slate-900 border-b border-white/10 flex items-center justify-between shrink-0 relative z-50">
      <div className="flex items-center gap-4">
        {view !== 'LIST' && (
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-white/5" onClick={() => setView('LIST')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="h-10 w-10 bg-success/20 rounded-2xl flex items-center justify-center border border-success/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          <HeartHandshake className="h-6 w-6 text-success" />
        </div>
        <div className="text-left">
          <h4 className="text-base font-black text-white uppercase tracking-tighter italic">Apoio às Vítimas (P10)</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Redirecionamento de Ativos SISBAJUD</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant={view === 'PORTAL' ? 'default' : 'outline'} 
          size="sm" 
          className={cn(
            "h-10 px-5 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-xl",
            view === 'PORTAL' 
              ? "bg-success text-white shadow-[0_0_25px_rgba(34,197,94,0.4)]" 
              : "border-success/50 text-success hover:bg-success/10 animate-pulse"
          )}
          onClick={handleOpenPortal}
        >
          <Lock className="h-4 w-4 mr-2" /> Portal Família
        </Button>
      </div>
    </div>
  );

  const Content = (
    <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-950">
      <AnimatePresence mode="wait">
        {view === 'LIST' && (
          <VictimList 
            records={records} 
            onOpenFlow={handleOpenFlow} 
            onOpenPortal={handleOpenPortal} 
          />
        )}

        {view === 'FLOW' && selectedRecord && (
          <VictimFlowView selectedRecord={selectedRecord} />
        )}

        {view === 'PORTAL' && (
          <motion.div 
            key="portal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="p-6 h-full"
          >
            <VictimTransparencyPortal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isEmbedded) return (
    <div className="h-full w-full overflow-hidden bg-slate-950 flex flex-col">
      {Header}
      {Content}
    </div>
  );

  return (
    <Card className="bg-slate-900 border-white/10 shadow-2xl overflow-hidden h-full flex flex-col">
      {Header}
      <CardContent className="p-0 flex-1 overflow-hidden">
        {Content}
      </CardContent>
    </Card>
  );
}
