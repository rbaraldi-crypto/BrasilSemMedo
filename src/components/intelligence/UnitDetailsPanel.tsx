import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Siren, Navigation, FileDown, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { FieldChat } from './FieldChat';
import { reportService } from '@/services/reportService';
import { FieldMessage } from '@/types/intelligence';

interface UnitDetailsPanelProps {
  selectedUnit: any;
  isSent: boolean;
  isSending: boolean;
  targetData: any;
  fieldMessages: FieldMessage[];
  targetTrajectory: any[] | null;
  onDispatch: () => void;
}

export function UnitDetailsPanel({
  selectedUnit,
  isSent,
  isSending,
  targetData,
  fieldMessages,
  targetTrajectory,
  onDispatch
}: UnitDetailsPanelProps) {
  return (
    <div className="w-full md:w-80 bg-slate-900/80 backdrop-blur-xl p-6 flex flex-col gap-6">
      <div className="flex-1 overflow-hidden flex flex-col gap-4">
        <span className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
          <Navigation className="h-3 w-3" /> Unidade Selecionada
        </span>
        
        {selectedUnit ? (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-primary/30 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Siren className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-tighter">{selectedUnit.callsign || 'N/A'}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">{selectedUnit.type || 'Viatura'}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-black">Coordenadas Atuais</p>
                  <p className="text-xs font-mono text-white">
                    {selectedUnit.lat?.toFixed(6) || '0.000000'}, {selectedUnit.lng?.toFixed(6) || '0.000000'}
                  </p>
                </div>
                {!isSent && (
                  <Button 
                    className="w-full font-black uppercase text-xs tracking-widest h-12 bg-red-600 hover:bg-red-700" 
                    disabled={isSending} 
                    onClick={onDispatch}
                  >
                    {isSending ? 'TRANSMITINDO...' : 'DESPACHAR AGORA'}
                  </Button>
                )}
            </div>

            {/* Terminal de Rádio Digital (I3) */}
            <AnimatePresence>
              {isSent && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-[300px]"
                >
                  <FieldChat messages={fieldMessages} unitCallsign={selectedUnit.callsign} />
                </motion.div>
              )}
            </AnimatePresence>

            {isSent && (
                <Button 
                  variant="outline" 
                  className="w-full border-primary/30 text-primary hover:bg-primary/10 font-bold uppercase text-[10px] h-10" 
                  onClick={() => reportService.generateCaptureDossier(targetData, selectedUnit)}
                >
                  <FileDown className="h-3 w-3 mr-2" /> Dossiê ICP-Brasil
                </Button>
            )}
          </div>
        ) : (
          <div className="h-48 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-6 bg-black/20">
              <p className="text-xs text-slate-500 font-bold uppercase">Selecione uma unidade no mapa para ver a posição real.</p>
          </div>
        )}
      </div>

      {/* HISTÓRICO DE AVISTAMENTO (Oculto se chat estiver ativo para economizar espaço) */}
      {!isSent && (
        <div className="space-y-3">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <History className="h-3 w-3" /> Trajetória do Alvo
          </span>
          <div className="space-y-2">
              {targetTrajectory?.map((loc, i) => (
                <div key={loc.id} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                      <div className={cn("h-2 w-2 rounded-full", i === targetTrajectory.length - 1 ? "bg-red-500 animate-pulse" : "bg-primary/40")} />
                      {i < targetTrajectory.length - 1 && <div className="h-4 w-px bg-white/10" />}
                  </div>
                  <div className="flex-1">
                      <p className="text-[10px] font-bold text-white uppercase">{loc.name}</p>
                      <p className="text-[10px] text-slate-500">{loc.time}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase">Ativos Monitorados</span>
            <span className="text-[10px] font-mono text-primary">150+</span>
        </div>
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase">Sincronização AVL</span>
            <span className="text-[10px] font-mono text-success">REAL-TIME</span>
        </div>
      </div>
    </div>
  );
}
