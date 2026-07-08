import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IntelligenceLogEntry, LinkType } from '@/types/intelligence';
import { intelligenceService } from '@/services/intelligenceService';
import { syncService } from '@/services/syncService';
import { useConnectivity } from '@/hooks/useConnectivity';

interface SystemContextType {
  isOnline: boolean;
  pendingSyncCount: number;
  linkType: LinkType;
  setLinkType: (type: LinkType) => void;
  simulatedLatency: number;
  withNetworkDelay: <T>(fn: () => Promise<T>) => Promise<T>;
  auditLog: IntelligenceLogEntry[];
  addLogEntry: (type: IntelligenceLogEntry['type'], targetName: string, details: string) => void;
  refreshData: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const isOnline = useConnectivity();
  const [pendingSyncCount, setPendingSyncCount] = useState(syncService.getQueue().length);
  const [linkType, setLinkType] = useState<LinkType>('FIBER');

  const simulatedLatency = useMemo(() => {
    return linkType === 'FIBER' 
      ? Math.floor(15 + Math.random() * 20) 
      : Math.floor(650 + Math.random() * 400);
  }, [linkType]);

  const withNetworkDelay = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    await new Promise(resolve => setTimeout(resolve, simulatedLatency));
    return fn();
  }, [simulatedLatency]);

  const { data: auditLog = [] } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => withNetworkDelay(() => intelligenceService.getAuditLogs(20)),
  });

  const addLogEntry = useCallback((type: IntelligenceLogEntry['type'], targetName: string, details: string) => {
    const lastEntry = auditLog[0];
    const entry: IntelligenceLogEntry = {
      timestamp: new Date().toISOString(),
      type,
      targetName,
      details,
      block_index: (lastEntry?.block_index || 0) + 1,
      previous_hash: lastEntry?.audit_hash || "0000000000000000",
      audit_hash: Math.random().toString(36).substring(2, 18).toUpperCase()
    };

    if (isOnline) {
      intelligenceService.saveAuditLog(entry).then(() => {
        queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      });
    } else {
      syncService.queueAction('LOG', entry);
      setPendingSyncCount(syncService.getQueue().length);
    }
  }, [auditLog, isOnline, queryClient]);

  return (
    <SystemContext.Provider value={{
      isOnline, pendingSyncCount, linkType, setLinkType,
      simulatedLatency, withNetworkDelay, auditLog, addLogEntry,
      refreshData: () => queryClient.invalidateQueries()
    }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within SystemProvider');
  return context;
}
