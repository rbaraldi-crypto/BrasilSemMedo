/**
 * Preload Strategy para Modais Críticos
 * Carrega componentes pesados em background após o carregamento inicial
 */

// Importações dinâmicas para preload
const preloadMuralhaModal = () => import('@/components/intelligence/MuralhaModal');
const preloadDispatchModal = () => import('@/components/intelligence/DispatchModal');
const preloadIntelligenceMap = () => import('@/components/intelligence/IntelligenceMap');
const preloadDossierTree = () => import('@/components/intelligence/DossierTree');
const preloadPatrimonialModal = () => import('@/components/intelligence/PatrimonialModal');
const preloadTrevaDigitalTwin = () => import('@/components/intelligence/TrevaDigitalTwin');
const preloadVictimSupportModule = () => import('@/components/intelligence/VictimSupportModule');

/**
 * Estratégia de Preload Inteligente:
 * 1. Imediato: Componentes críticos do dashboard
 * 2. Após 2s: Modais frequentes (Muralha, Mapa)
 * 3. Após 5s: Componentes secundários
 */
export const initializePreloadStrategy = () => {
  // Fase 1: Preload imediato de componentes críticos
  const criticalComponents = [
    preloadMuralhaModal,
    preloadIntelligenceMap,
  ];

  // Fase 2: Preload após 2 segundos (modais frequentes)
  const frequentModals = [
    preloadDispatchModal,
    preloadDossierTree,
  ];

  // Fase 3: Preload após 5 segundos (componentes secundários)
  const secondaryComponents = [
    preloadPatrimonialModal,
    preloadTrevaDigitalTwin,
    preloadVictimSupportModule,
  ];

  // Executa preload crítico imediatamente
  criticalComponents.forEach(preload => {
    preload().catch(() => {
      // Silencia erros de preload
    });
  });

  // Agenda preload de modais frequentes
  setTimeout(() => {
    frequentModals.forEach(preload => {
      preload().catch(() => {});
    });
  }, 2000);

  // Agenda preload de componentes secundários
  setTimeout(() => {
    secondaryComponents.forEach(preload => {
      preload().catch(() => {});
    });
  }, 5000);
};

/**
 * Preload on Hover - Para links e botões
 * Carrega o componente quando o usuário passa o mouse sobre o elemento
 */
export const createHoverPreload = (importFn: () => Promise<any>) => {
  let loaded = false;
  
  return () => {
    if (!loaded) {
      loaded = true;
      importFn().catch(() => {
        loaded = false;
      });
    }
  };
};

// Exporta funções de preload para uso em componentes
export const preloaders = {
  muralha: preloadMuralhaModal,
  dispatch: preloadDispatchModal,
  map: preloadIntelligenceMap,
  dossier: preloadDossierTree,
  patrimonial: preloadPatrimonialModal,
  treva: preloadTrevaDigitalTwin,
  victim: preloadVictimSupportModule,
};
