import { Organization, FieldUnit, IntelligenceLogEntry, WorkspaceSettings, GlobalSearchItem } from '@/types/intelligence';
import { mockOrganizations, mockFieldUnits, mockMyCases } from '@/data/mockData';
import { logger } from '@/lib/logger';

/**
 * Intelligence Service: Interface de Persistência Final IABS-SIP
 * Mapeado para operações AWS DynamoDB (Simuladas via High-Fidelity Mocks).
 * Fix: Substituído console.log por logger condicional.
 */
export const intelligenceService = {
  async getOrganizations(): Promise<Organization[]> {
    logger.log('IntelligenceService', 'Scanning table: sip_organizations...');
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockOrganizations;
  },

  async searchMuralha(filters: { clothing: string, accessory: string }, isManualOverride = false) {
    const queryType = isManualOverride ? "PRIORITY_TARGET_SCAN" : "GSI_ATTRIBUTE_SEARCH";
    logger.log('IntelligenceService', `Executando ${queryType} em GSI_MURALHA_V2...`, filters);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      match: isManualOverride ? "99.9%" : "99.8%",
      location: "Aeroporto de Guarulhos - Terminal 3",
      timestamp: new Date().toLocaleString(),
      status: "ALVO IDENTIFICADO",
      id: "SIP-TARGET-882",
      name: "CARLOS EDUARDO DA SILVA",
      threatLevel: "CRÍTICO",
      classification: "NARCOTERRORISTA (P1)",
      lastSeen: "GRU - Portão 302",
      origin: "AWS_DYNAMODB_GSI_SEARCH",
      aws_metadata: {
        region: "us-east-1",
        table: "muralha_targets_live",
        read_capacity: 5
      },
      multimodal: {
        face: 98.2,
        gait: 94.5,
        iris: 99.1
      },
      deviceAlert: {
        detected: true,
        imei: "358294/10/284756/0",
        status: "ROUBADO",
        model: "iPhone 15 Pro Max",
        last_owner: "Maria Oliveira",
        theft_date: "12/05/2024"
      },
      trajectory: [
        { id: 'loc-1', name: 'Portão 204', time: '22m atrás', lat: -23.4350, lng: -46.4820 },
        { id: 'loc-2', name: 'Duty Free T3', time: '12m atrás', lat: -23.4325, lng: -46.4780 },
        { id: 'loc-3', name: 'Terminal 3 - Check-in', time: 'Agora', lat: -23.4306, lng: -46.4730 }
      ],
      attributes: {
        clothing: filters.clothing === 'Qualquer' ? "Jaqueta Preta" : filters.clothing,
        accessory: filters.accessory === 'Nenhum' ? "Mochila Tática" : filters.accessory,
        gender: "Masculino"
      }
    };
  },

  subscribeToUnits(onUpdate: (unit: FieldUnit) => void) {
    logger.log('IntelligenceService', 'Subscribed to field_units_stream');
    const interval = setInterval(() => {
      const randomUnit = mockFieldUnits[Math.floor(Math.random() * mockFieldUnits.length)];
      onUpdate({
        ...randomUnit,
        lat: randomUnit.lat + (Math.random() - 0.5) * 0.001,
        lng: randomUnit.lng + (Math.random() - 0.5) * 0.001,
      });
    }, 5000);

    return {
      unsubscribe: () => clearInterval(interval)
    };
  },

  async saveWorkspaceSettings(settings: WorkspaceSettings): Promise<void> {
    logger.debug('IntelligenceService', 'PutItem: sip_user_settings', settings);
    localStorage.setItem('iabs_workspace_aws_cache', JSON.stringify(settings));
  },

  async getWorkspaceSettings(): Promise<WorkspaceSettings | null> {
    const cached = localStorage.getItem('iabs_workspace_aws_cache');
    return cached ? JSON.parse(cached) : null;
  },

  async globalSearch(query: string): Promise<GlobalSearchItem[]> {
    const q = query.toLowerCase();
    logger.log('IntelligenceService', `Querying GSI_GLOBAL_SEARCH for: ${q}`);
    
    const orgResults: GlobalSearchItem[] = mockOrganizations
      .filter(o => o.name.toLowerCase().includes(q) || o.acronym.toLowerCase().includes(q))
      .map(o => ({ id: o.id, type: 'ORGANIZATION', title: o.name, subtitle: `Facção: ${o.acronym}`, data: o }));

    const caseResults: GlobalSearchItem[] = mockMyCases
      .filter(c => c.inmateName.toLowerCase().includes(q) || c.caseNumber.includes(q))
      .map(c => ({ id: c.id, type: 'CASE', title: c.inmateName, subtitle: `Processo: ${c.caseNumber}`, data: c }));

    return [...orgResults, ...caseResults].slice(0, 8);
  },

  async saveAuditLog(entry: IntelligenceLogEntry): Promise<void> {
    logger.debug('IntelligenceService', 'PutItem: sip_audit_logs', entry);
  },

  async getAuditLogs(limit = 20): Promise<IntelligenceLogEntry[]> {
    return []; 
  }
};
