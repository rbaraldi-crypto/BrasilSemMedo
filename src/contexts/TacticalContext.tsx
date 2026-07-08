import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Organization, HierarchyNode, FieldUnit } from '@/types/intelligence';
import { intelligenceService } from '@/services/intelligenceService';
import { useSystem } from './SystemContext';

interface TacticalContextType {
  organizations: Organization[];
  isLoading: boolean;
  selectedOrg: Organization | null;
  setSelectedOrg: (org: Organization | null) => void;
  selectedNode: HierarchyNode | null;
  setSelectedNode: (node: HierarchyNode | null) => void;
  fieldUnits: FieldUnit[];
  targetTrajectory: any[] | null;
  setTargetTrajectory: (trajectory: any[]) => void;
}

const TacticalContext = createContext<TacticalContextType | undefined>(undefined);

export function TacticalProvider({ children }: { children: ReactNode }) {
  const { isOnline, withNetworkDelay } = useSystem();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedNode, setSelectedNode] = useState<HierarchyNode | null>(null);
  const [fieldUnits, setFieldUnits] = useState<FieldUnit[]>([]);
  const [targetTrajectory, setTargetTrajectory] = useState<any[] | null>(null);

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => withNetworkDelay(() => intelligenceService.getOrganizations()),
  });

  useEffect(() => {
    if (organizations.length > 0 && !selectedOrg) {
      setSelectedOrg(organizations[0]);
    }
  }, [organizations, selectedOrg]);

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

  return (
    <TacticalContext.Provider value={{
      organizations, isLoading, selectedOrg, setSelectedOrg,
      selectedNode, setSelectedNode, fieldUnits,
      targetTrajectory, setTargetTrajectory
    }}>
      {children}
    </TacticalContext.Provider>
  );
}

export function useTactical() {
  const context = useContext(TacticalContext);
  if (!context) throw new Error('useTactical must be used within TacticalProvider');
  return context;
}
