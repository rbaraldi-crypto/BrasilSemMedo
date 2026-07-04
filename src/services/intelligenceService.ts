import { Organization, FieldUnit, IntelligenceLogEntry, WorkspaceSettings } from '@/types/intelligence';
import { mockOrganizations, mockFieldUnits, mockMyCases } from '@/data/mockData';

/**
 * Intelligence Service: Interface de Persistência Final IABS-SIP
 * Mapeado para operações AWS DynamoDB (Simuladas via High-Fidelity Mocks).
 * Utiliza padrões de GSI (Global Secondary Index) para buscas na Muralha P9.
 */
export const intelligenceService = {
  // 1. Domínio: Inteligência Estratégica (Facções)
  async getOrganizations(): Promise<Organization[]> {
    // Simulação de Scan em Tabela DynamoDB: 'sip_organizations'
    console.log("[AWS_DYNAMODB] Scanning table: sip_organizations...");
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockOrganizations;
  },

  // 2. Muralha Paulista: Busca via GSI_MURALHA_V2 (P9 + P12)
  async searchMuralha(filters: { clothing: string, accessory: string }, isManualOverride = false) {
    const queryType = isManualOverride ? "PRIORITY_TARGET_SCAN" : "GSI_ATTRIBUTE_SEARCH";
    console.log(`[AWS_DYNAMODB] Executando ${queryType} em GSI_MURALHA_V2...`, filters);
    
    // Latência simulada de processamento em nuvem (AWS Region: us-east-1)
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
        model: "iPhone 15 Pro Max"
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

  // 3. Monitoramento de Viaturas (Simulação de Kinesis Data Streams)
  subscribeToUnits(onUpdate: (unit: FieldUnit) => void) {
    console.log("[AWS_KINESIS] Subscribed to field_units_stream");
    // Mock de stream em tempo real
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

  // 4. Persistência de Workspace (DynamoDB: 'sip_user_settings')
  async saveWorkspaceSettings(settings: WorkspaceSettings): Promise<void> {
    console.log("[AWS_DYNAMODB] PutItem: sip_user_settings", settings);
    localStorage.setItem('iabs_workspace_aws_cache', JSON.stringify(settings));
  },

  async getWorkspaceSettings(): Promise<WorkspaceSettings | null> {
    const cached = localStorage.getItem('iabs_workspace_aws_cache');
    return cached ? JSON.parse(cached) : null;
  },

  // 5. Motor de Busca Global
  async globalSearch(query: string): Promise<any[]> {
    const q = query.toLowerCase();
    console.log(`[AWS_DYNAMODB] Querying GSI_GLOBAL_SEARCH for: ${q}`);
    
    return [
      ...mockOrganizations.filter(o => o.name.toLowerCase().includes(q) || o.acronym.toLowerCase().includes(q))
        .map(o => ({ id: o.id, type: 'ORGANIZATION', title: o.name, subtitle: `Facção: ${o.acronym}`, data: o })),
      ...mockMyCases.filter(c => c.inmateName.toLowerCase().includes(q) || c.caseNumber.includes(q))
        .map(c => ({ id: c.id, type: 'CASE', title: c.inmateName, subtitle: `Processo: ${c.caseNumber}`, data: c }))
    ].slice(0, 8);
  },

  async saveAuditLog(entry: IntelligenceLogEntry): Promise<void> {
    console.log("[AWS_DYNAMODB] PutItem: sip_audit_logs", entry);
  },

  async getAuditLogs(limit = 20): Promise<IntelligenceLogEntry[]> {
    return []; // Mock vazio para o log inicial
  }
};
