import { Outlet } from 'react-router-dom';
import { SystemProvider } from '@/contexts/SystemContext';
import { TacticalProvider } from '@/contexts/TacticalContext';
import { UIProvider } from '@/contexts/UIContext';

/**
 * StandaloneLayout: Wrapper de providers para rotas que não usam o MainLayout
 * (ex: StatsDashboard, CaseDistribution) mas precisam de acesso aos contextos.
 * 
 * Fix do Problema #1: StatsDashboard estava fora dos providers.
 */
export function StandaloneLayout() {
  return (
    <SystemProvider>
      <TacticalProvider>
        <UIProvider>
          <Outlet />
        </UIProvider>
      </TacticalProvider>
    </SystemProvider>
  );
}
