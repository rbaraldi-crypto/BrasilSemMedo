import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { PanelID, WorkspaceSettings } from '@/types/intelligence';
import { intelligenceService } from '@/services/intelligenceService';
import { voiceService, TacticalCommand } from '@/services/voiceService';
import { tacticalAudio } from '@/lib/audioUtils';
import { toast } from 'sonner';

interface UIContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeModal: string;
  setActiveModal: (modal: string) => void;
  closeModal: () => void;
  openPanels: PanelID[];
  togglePanel: (panelId: PanelID) => void;
  layoutMode: 'FULL' | 'SPLIT' | 'QUAD';
  setLayoutMode: (mode: 'FULL' | 'SPLIT' | 'QUAD') => void;
  isNightVision: boolean;
  setNightVision: (val: boolean) => void;
  isVoiceActive: boolean;
  setVoiceActive: (val: boolean) => void;
  showFinancialFlow: boolean;
  setShowFinancialFlow: (val: boolean) => void;
  isLocked: boolean;
  setLocked: (val: boolean) => void;
  muralhaScanTrigger: number;
  requestMuralhaScan: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('hierarchy');
  const [activeModal, setActiveModal] = useState<string>('NONE');
  const [openPanels, setOpenPanels] = useState<PanelID[]>(['ROADMAP']);
  const [layoutMode, setLayoutMode] = useState<'FULL' | 'SPLIT' | 'QUAD'>('FULL');
  const [isNightVision, setIsNightVision] = useState(false);
  const [isVoiceActive, setVoiceActive] = useState(false);
  const [showFinancialFlow, setShowFinancialFlow] = useState(false);
  const [isLocked, setLocked] = useState(false);
  const [muralhaScanTrigger, setMuralhaScanTrigger] = useState(0);

  const requestMuralhaScan = useCallback(() => {
    setOpenPanels((prev: PanelID[]): PanelID[] => {
      if (prev.includes('MURALHA')) return prev;
      return ([...prev, 'MURALHA'] as PanelID[]).slice(-4) as PanelID[];
    });
    setMuralhaScanTrigger(prev => prev + 1);
    tacticalAudio.playScan();
  }, []);

  const togglePanel = useCallback((panelId: PanelID) => {
    if (panelId === 'MURALHA' && !openPanels.includes('MURALHA')) {
      requestMuralhaScan();
      return;
    }
    setOpenPanels((prev: PanelID[]): PanelID[] =>
      prev.includes(panelId)
        ? prev.filter((id: PanelID) => id !== panelId)
        : (([...prev, panelId] as PanelID[]).slice(-4) as PanelID[])
    );
    tacticalAudio.playScan();
  }, [openPanels, requestMuralhaScan]);

  const handleVoiceCommand = useCallback((cmd: TacticalCommand) => {
    tacticalAudio.playSuccess();
    toast.info(`COMANDO DE VOZ: ${cmd.replace(/_/g, ' ')}`, { icon: '🎙️' });

    switch (cmd) {
      case 'ABRIR_MURALHA': requestMuralhaScan(); break;
      case 'ABRIR_MAPA': setActiveModal('MAP'); break;
      case 'BLOQUEAR_SISTEMA': setLocked(true); break;
      case 'MODO_TACTICO':
        setIsNightVision(prev => !prev);
        toast.info("MODO OPERAÇÃO TÁCTICA ATIVADO", { icon: '🟢' });
        break;
      case 'FECHAR_MODAIS': setActiveModal('NONE'); break;
      case 'VER_RISCO_CARLOS':
        setActiveModal('DOSSIER');
        toast.success("Dossiê de Carlos Eduardo carregado via voz.");
        break;
      case 'BLOQUEAR_ATIVOS_PCC':
        setActiveModal('PATRIMONIAL');
        toast.error("Protocolo de Asfixia Financeira PCC iniciado via voz.", {
          description: "Aguardando confirmação biométrica para SISBAJUD."
        });
        break;
    }
  }, [requestMuralhaScan]);

  useEffect(() => {
    if (isVoiceActive) {
      voiceService.start(handleVoiceCommand);
    } else {
      voiceService.stop();
    }
  }, [isVoiceActive, handleVoiceCommand]);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await intelligenceService.getWorkspaceSettings();
      if (settings) {
        setOpenPanels(settings.openPanels);
        setLayoutMode(settings.layoutMode);
        if ((settings as any).isNightVision !== undefined) {
          setIsNightVision((settings as any).isNightVision);
        }
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const settings: WorkspaceSettings & { isNightVision: boolean } = {
      openPanels,
      layoutMode,
      isNightVision,
      lastUpdated: new Date().toISOString()
    };
    intelligenceService.saveWorkspaceSettings(settings as any);
  }, [openPanels, layoutMode, isNightVision]);

  const setNightVision = (val: boolean) => {
    setIsNightVision(val);
    tacticalAudio.playScan();
    if (val) {
      toast.info("MODO OPERAÇÃO TÁCTICA ATIVADO", {
        description: "Filtros de visão noturna aplicados ao terminal.",
        icon: '🟢'
      });
    }
  };

  const closeModal = () => setActiveModal('NONE');

  return (
    <UIContext.Provider value={{
      activeTab, setActiveTab, activeModal, setActiveModal, closeModal,
      openPanels, togglePanel, layoutMode, setLayoutMode,
      isNightVision, setNightVision, isVoiceActive, setVoiceActive,
      showFinancialFlow, setShowFinancialFlow, isLocked, setLocked,
      muralhaScanTrigger, requestMuralhaScan
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
}
