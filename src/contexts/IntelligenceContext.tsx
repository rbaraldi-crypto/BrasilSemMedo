import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Organization, HierarchyNode, IntelligenceLogEntry, PanelID, WorkspaceSettings, FieldUnit } from '@/types/intelligence';
import { intelligenceService } from '@/services/intelligenceService';
import { syncService } from '@/services/syncService';
import { useConnectivity } from '@/hooks/useConnectivity';
import { toast } from 'sonner';
import { tacticalAudio } from '@/lib/audioUtils';
import { voiceService, TacticalCommand } from '@/services/voiceService';

interface IntelligenceContextType {
  selectedOrg: Organization | null;
  setSelectedOrg: (org: Organization | null) => void;
  selectedNode: HierarchyNode | null;
  setSelectedNode: (node: HierarchyNode | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeModal: any; 
  setActiveModal: (modal: any) => void;
  closeModal: () => void;
  auditLog: IntelligenceLogEntry[];
  addLogEntry: (type: IntelligenceLogEntry['type'], targetName: string, details: string) => void;
  isLoading: boolean;
  organizations: Organization[];
  fieldUnits: FieldUnit[];
  refreshData: () => void;
  isOnline: boolean;
  pendingSyncCount: number;
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
  targetTrajectory: any[] | null;
  setTargetTrajectory: (trajectory: any[]) => void;
}

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

export function IntelligenceProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const isOnline = useConnectivity();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedNode, setSelectedNode] = useState<HierarchyNode | null>(null);
  const [activeTab, setActiveTab] = useState('hierarchy');
  const [activeModal, setActiveModal] = useState<string>('NONE');
  const [pendingSyncCount, setPendingSyncCount] = useState(syncService.getQueue().length);
  const [isNightVision, setIsNightVision] = useState(false);
  
  const [fieldUnits, setFieldUnits] = useState<FieldUnit[]>([]);
  const [openPanels, setOpenPanels] = useState<PanelID[]>(['ROADMAP']);
  const [layoutMode, setLayoutMode] = useState<'FULL' | 'SPLIT' | 'QUAD'>('FULL');

  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showFinancialFlow, setShowFinancialFlow] = useState(false);
  const [isLocked, setLocked] = useState(false);
  const [muralhaScanTrigger, setMuralhaScanTrigger] = useState(0);
  const [targetTrajectory, setTargetTrajectory] = useState<any[] | null>(null);

  const { data: organizations = [], isLoading: isLoadingOrgs } = useQuery({
    queryKey: ['organizations'],
    queryFn: intelligenceService.getOrganizations,
  });

  const { data: auditLog = [] } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => intelligenceService.getAuditLogs(20),
  });

  useEffect(() => {
    if (organizations.length > 0 && !selectedOrg) {
      setSelectedOrg(organizations[0]);
    }
  }, [organizations, selectedOrg]);

  const requestMuralhaScan = useCallback(() => {
    setOpenPanels(prev => prev.includes('MURALHA') ? prev : [...prev, 'MURALHA'].slice(-4));
    setMuralhaScanTrigger(prev => prev + 1);
    tacticalAudio.playScan();
  }, []);

  const handleVoiceCommand = useCallback((cmd: TacticalCommand) => {
    tacticalAudio.playSuccess();
    toast.info(`COMANDO DE VOZ: ${cmd.replace('_', ' ')}`, { icon: '🎙️' });

    switch (cmd) {
      case 'ABRIR_MURALHA': requestMuralhaScan(); break;
      case 'ABRIR_MAPA': setActiveModal('MAP'); break;
      case 'BLOQUEAR_SISTEMA': setLocked(true); break;
      case 'MODO_TACTICO': setNightVision(!isNightVision); break;
      case 'FECHAR_MODAIS': setActiveModal('NONE'); break;
    }
  }, [requestMuralhaScan, isNightVision]);

  useEffect(() => {
    if (isVoiceActive) {
      voiceService.start(handleVoiceCommand);
    } else {
      voiceService.stop();
    }
  }, [isVoiceActive, handleVoiceCommand]);

  useEffect(() => {
    if (!isOnline) return;
    const subscription = intelligenceService.subscribeToUnits((updatedUnit) => {
      setFieldUnits(prev => {
        const exists = prev.find(u => u.id === updatedUnit.id);
        if (exists) {
          return prev.map(u => u.id === updatedUnit.id ? updatedUnit : u);
        }
        return [...prev, updatedUnit];
      });
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [isOnline]);

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

  const addLogEntry = (type: IntelligenceLogEntry['type'], targetName: string, details: string) => {
    const entry: IntelligenceLogEntry = {
      timestamp: new Date().toISOString(),
      type,
      targetName,
      details
    };

    if (isOnline) {
      intelligenceService.saveAuditLog(entry).then(() => {
        queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      });
    } else {
      syncService.queueAction('LOG', entry);
      setPendingSyncCount(syncService.getQueue().length);
    }
  };

  const togglePanel = (panelId: PanelID) => {
    if (panelId === 'MURALHA' && !openPanels.includes('MURALHA')) {
      requestMuralhaScan();
      return;
    }
    setOpenPanels(prev => 
      prev.includes(panelId) 
        ? prev.filter(id => id !== panelId) 
        : [...prev, panelId].slice(-4)
    );
    tacticalAudio.playScan();
  };

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
    <IntelligenceContext.Provider 
      value={{ 
        selectedOrg, setSelectedOrg, 
        selectedNode, setSelectedNode, 
        activeTab, setActiveTab,
        activeModal, setActiveModal,
        closeModal, auditLog, addLogEntry,
        isLoading: isLoadingOrgs,
        organizations, fieldUnits, isOnline, pendingSyncCount,
        openPanels, togglePanel, layoutMode, setLayoutMode,
        isNightVision, setNightVision,
        isVoiceActive, setVoiceActive: setIsVoiceActive,
        showFinancialFlow, setShowFinancialFlow,
        isLocked, setLocked,
        muralhaScanTrigger, requestMuralhaScan,
        targetTrajectory, setTargetTrajectory,
        refreshData: () => queryClient.invalidateQueries()
      }}
    >
      {children}
    </IntelligenceContext.Provider>
  );
}

export function useIntelligence() {
  const context = useContext(IntelligenceContext);
  if (!context) throw new Error('useIntelligence must be used within IntelligenceProvider');
  return context;
}
