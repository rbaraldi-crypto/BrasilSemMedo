import { Organization, ProgramGuideline, StrategicMarker, DossierNode, FieldUnit, TrevaFloor } from '@/types/intelligence';
import { 
  Skull, Siren, Scan, Microscope, HeartHandshake, ShieldAlert, Smartphone, 
  Gavel, Scale, Clock, ShieldX, Lock, Database, Briefcase, ShieldCheck, Network, DollarSign, Link as LinkIcon, MapPin, History, Shield, Users, CalendarClock, FileText
} from 'lucide-react';

export const mockTrevaFloors: TrevaFloor[] = [
  {
    id: 4,
    label: "NÍVEL 04 - ISOLAMENTO P1",
    wings: [
      { id: 'w4-a', name: 'ALA ALFA', occupancy: 42, capacity: 50, riskLevel: 'CRITICAL' },
      { id: 'w4-b', name: 'ALA BRAVO', occupancy: 12, capacity: 50, riskLevel: 'HIGH' },
    ]
  },
  {
    id: 3,
    label: "NÍVEL 03 - CUSTÓDIA MÁXIMA",
    wings: [
      { id: 'w3-a', name: 'ALA CHARLIE', occupancy: 120, capacity: 150, riskLevel: 'HIGH' },
      { id: 'w3-b', name: 'ALA DELTA', occupancy: 145, capacity: 150, riskLevel: 'MEDIUM' },
    ]
  },
  {
    id: 2,
    label: "NÍVEL 02 - TRIAGEM",
    wings: [
      { id: 'w2-a', name: 'ALA ECHO', occupancy: 80, capacity: 200, riskLevel: 'LOW' },
    ]
  }
];

export const strategicMarkers: StrategicMarker[] = [
  { id: 'port-santos', type: 'port', name: 'Porto de Santos', top: '65%', left: '45%', status: 'Vigilância Permanente (Marinha)' },
  { id: 'port-paranagua', type: 'port', name: 'Porto de Paranaguá', top: '75%', left: '38%', status: 'Monitoramento Ativo (Marinha)' },
  { id: 'border-1', type: 'border', name: 'Sistema Nacional de Fronteira', top: '15%', left: '25%', status: 'Tropas de Elite Ativas' },
  { 
    id: 'prison-treva-1', 
    type: 'treva', 
    name: 'Presídio Federal TREVA-01', 
    top: '40%', 
    left: '50%', 
    status: 'Isolamento Total',
    occupancy: 420,
    capacity: 500,
    floors: mockTrevaFloors
  },
  { 
    id: 'prison-treva-2', 
    type: 'treva', 
    name: 'Presídio Federal TREVA-02', 
    top: '30%', 
    left: '60%', 
    status: 'Segurança Máxima',
    occupancy: 150,
    capacity: 500,
    floors: mockTrevaFloors
  },
  { id: 'muralha-1', type: 'muralha', name: 'Nó Muralha Brasileira - SP', top: '55%', left: '48%', status: 'Reconhecimento Facial Ativo' },
];

export const mockOrganizations: Organization[] = [
  {
    id: 'org-001',
    name: 'Primeiro Comando da Capital',
    acronym: 'PCC',
    type: 'Facção',
    classification: 'Narcoterrorista',
    threatLevel: 'Crítico',
    threatScore: 98,
    asphyxiaLevel: 65,
    activeMembers: 35000,
    territory: 'Nacional/Internacional',
    financialPower: 'Alto',
    hierarchy: [
      { id: 'h-1', name: 'Marcola (Simulado)', role: 'Líder Supremo', status: 'Preso', type: 'Liderança', location: 'P1 - Presidente Venceslau', level: 1, org_id: 'org-001' },
      { id: 'h-2', name: 'Sintonia Geral', role: 'Coord. Operacional', status: 'Foragido', type: 'Operacional', location: 'Paraguai', level: 2, parentId: 'h-1', org_id: 'org-001' },
      { id: 'h-3', name: 'Sintonia Financeira', role: 'Gestor de Ativos', status: 'Ativo', type: 'Financeiro', location: 'São Paulo', level: 2, parentId: 'h-1', org_id: 'org-001' },
      { id: 'h-4', name: 'Sintonia Logística', role: 'Rotas de Tráfico', status: 'Ativo', type: 'Logística', location: 'Fronteira', level: 2, parentId: 'h-1', org_id: 'org-001' },
      { id: 'h-5', name: 'Agente Operacional A', role: 'Execução Tática', status: 'Preso', type: 'Operacional', location: 'Bangu', level: 3, parentId: 'h-2', org_id: 'org-001' },
    ]
  },
  {
    id: 'org-002',
    name: 'Comando Vermelho',
    acronym: 'CV',
    type: 'Facção',
    classification: 'Narcoterrorista',
    threatLevel: 'Crítico',
    threatScore: 94,
    asphyxiaLevel: 42,
    activeMembers: 20000,
    territory: 'RJ/Norte/Nordeste',
    financialPower: 'Alto',
    hierarchy: [
      { id: 'cv-1', name: 'Conselho Superior', role: 'Liderança RJ', status: 'Preso', type: 'Liderança', location: 'Bangu 1', level: 1, org_id: 'org-002' },
      { id: 'cv-2', name: 'Frente Norte', role: 'Comando Regional', status: 'Ativo', type: 'Operacional', location: 'Amazonas', level: 2, parentId: 'cv-1', org_id: 'org-002' },
    ]
  }
];

export const programGuidelines: ProgramGuideline[] = [
  { id: 'g1', title: 'Narcoterrorismo', desc: 'Classificação de Facções como Narcoterroristas (PCC/CV).', status: 'Implementado', icon: Skull },
  { id: 'g2', title: 'Redução Maioridade', desc: 'Tratamento penal para 16 anos em crimes graves.', status: 'Em Votação', icon: Siren },
  { id: 'g3', title: 'Muralha Brasileira', desc: 'Reconhecimento facial integrado a bases criminais.', status: 'Operacional', icon: Scan },
  { id: 'g4', title: 'Castração Química', desc: 'Medida para condenados por crimes sexuais.', status: 'Análise Jurídica', icon: Microscope },
  { id: 'g5', title: 'Apoio às Vítimas', desc: 'Redirecionamento de auxílio para famílias de vítimas.', status: 'Em Trâmite', icon: HeartHandshake },
  { id: 'g6', title: 'Feminicídio Zero', desc: 'Monitoramento eletrônico e endurecimento de penas.', status: 'Operacional', icon: ShieldAlert },
  { id: 'g7', title: 'Roubo de Celulares', desc: 'Asfixia da cadeia de receptação e revenda.', status: 'Operacional', icon: Smartphone },
];

export const iabsTreeData: DossierNode = {
  label: "Pessoa-alvo",
  value: "Carlos Eduardo da Silva | CPF: 123.456.789-00",
  children: [
    { 
      label: "Processo Penal", 
      value: "Execução #0008921-33.2024.8.26.0050", 
      icon: Gavel, 
      children: [
        { label: "Decisões", value: "03 Sentenças Ativas", icon: Scale },
        { label: "Pena", value: "12a 4m - Regime Fechado", icon: Clock },
        { label: "Progressão", value: "Bloqueada (Ponto 11: Crime Hediondo)", icon: ShieldX }
      ] 
    },
    { 
      label: "Perfil Penitenciário", 
      value: "Prontuário SAP: 1.234.567", 
      icon: Database, 
      children: [
        { label: "Unidade", value: "TREVA-01 (Segurança Máxima)", icon: Lock },
        { label: "Localização", value: "Pavilhão 4 - Isolamento", icon: MapPin }
      ] 
    },
    { 
      label: "Documentos", 
      value: "Dossiê Digital #8921-2025", 
      icon: Briefcase, 
      children: [
        { label: "RIF COAF", value: "Relatório #442/2025", icon: ShieldCheck },
        { label: "Autos", value: "Volume IX - Fls. 1450", icon: FileText }
      ] 
    },
    { 
      label: "Rede de Vínculos", 
      value: "Contatos Nível 3", 
      icon: Network, 
      children: [
        { label: "Ativos", value: "R$ 1.2M Bloqueados (SISBAJUD)", icon: DollarSign },
        { label: "Conexões", value: "05 CPFs Relacionados", icon: Users }
      ] 
    }
  ]
};

export const mockFieldUnits: FieldUnit[] = [
  { id: 'unit-1', callsign: 'RP-2204', status: 'patrolling', lat: -23.4320, lng: -46.4750, type: 'Viatura' },
  { id: 'unit-2', callsign: 'RP-1092', status: 'busy', lat: -23.4280, lng: -46.4680, type: 'Viatura' },
  { id: 'unit-3', callsign: 'AG-SILVA', status: 'patrolling', lat: -23.4350, lng: -46.4710, type: 'Agente' },
  { id: 'unit-4', callsign: 'RP-9912', status: 'patrolling', lat: -23.4400, lng: -46.4800, type: 'Viatura' },
  { id: 'unit-5', callsign: 'AG-ROCHA', status: 'busy', lat: -23.4250, lng: -46.4790, type: 'Agente' },
  { id: 'unit-6', callsign: 'HE-ÁGUIA', status: 'patrolling', lat: -23.4150, lng: -46.4730, type: 'Aeronave' },
];

export const mockSubordinates: any[] = [
  { id: "u1", name: "Ana Paula Souza", role: "Analista Judiciário", avatar: "AP", workload: 45 },
  { id: "u2", name: "Bruno Mendes", role: "Assessor", avatar: "BM", workload: 80 },
  { id: "u3", name: "Carla Diaz", role: "Estagiária de Direito", avatar: "CD", workload: 20 },
];

export const mockDocuments: any[] = [
  { id: "doc-01", title: "Petição Inicial de Progressão", type: "Petição", date: "10/05/2024", pages: 5, signedBy: "Dr. Advogado OAB/SP 123456" },
  { id: "doc-02", title: "Boletim Informativo", type: "Certidão", date: "11/05/2024", pages: 2, signedBy: "Diretor da Unidade" },
];

export const mockInmate: any = {
  id: "SIP-2024-8921",
  name: "Carlos Eduardo da Silva",
  photoUrl: "https://i.pravatar.cc/300?u=SIP-2024-8921",
  biometricStatus: "confirmed",
  dateOfBirth: "15/03/1985",
  motherName: "Maria Aparecida da Silva",
  cpf: "123.456.789-00"
};

export const mockMetrics: any[] = [
  { label: "Total de Apenados", value: "12,450", status: "normal", icon: "Users" },
  { label: "Alertas Críticos", value: 23, status: "critical", icon: "AlertTriangle" },
  { label: "Benefícios Vencidos", value: 145, status: "warning", icon: "Clock" },
  { label: "Aguardando HITL", value: 8, status: "normal", icon: "UserCheck" },
];

export const mockTimeline: any[] = [
  { id: "evt-001", date: "10/01/2024", type: "Progressão de Regime", origin: "Vara de Execuções Penais - TJSP", hashICP: "8f4b2e1...a9c3", details: "Concessão de progressão para o regime semiaberto conforme Art. 112 da LEP." }
];

export const mockSimilarCases: any[] = [
  { id: "case-992", caseNumber: "0001234-56.2023.8.26.0050", penalty: "5 anos", crime: "Roubo Majorado", decision: "Concedido", similarity: 92 }
];

export const mockMyCases: any[] = [
  { 
    id: "case-rev-001", 
    inmateName: "Carlos Eduardo da Silva", 
    caseNumber: "0008921-33.2024.8.26.0050", 
    priority: "Alta", 
    type: "Progressão de Regime", 
    status: "Aguardando Análise", 
    entryDate: "10/05/2024", 
    similarCases: mockSimilarCases, 
    documents: mockDocuments,
    isPoint11: true 
  },
  { 
    id: "case-rev-002", 
    inmateName: "Marcos Paulo Rocha", 
    caseNumber: "0004722-12.2024.8.26.0000", 
    priority: "Média", 
    type: "Livramento Condicional", 
    status: "Em Análise", 
    entryDate: "12/05/2024", 
    similarCases: [], 
    documents: mockDocuments,
    isPoint11: false 
  }
];

export const mockDistributionCases: any[] = [
  { id: "dist-001", inmateName: "Marcos Paulo Rocha", inmatePhoto: "https://i.pravatar.cc/150?u=dist-001", cpf: "333.222.111-00", eventType: "Progressão de Regime", priority: "Alta", timeInQueue: "2h 15m" }
];

export const mockDistributionUsers: any[] = [
  { id: "user-002", name: "Ana Clara", role: "Analista Penal", avatar: "https://i.pravatar.cc/150?u=user-002", workload: 40, status: "Disponível", casesCount: 8, maxCases: 20 }
];
