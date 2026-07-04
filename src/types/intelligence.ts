import { LucideIcon } from 'lucide-react';

export type ThreatLevel = 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
export type OrganizationType = 'Facção' | 'Milícia' | 'Gangue';
export type ClassificationType = 'Comum' | 'Narcoterrorista';
export type NodeStatus = 'Ativo' | 'Preso' | 'Foragido';
export type SectorType = 'Liderança' | 'Operacional' | 'Financeiro' | 'Logística';

export interface HierarchyNode {
  id: string;
  org_id: string;
  name: string;
  role: string;
  status: NodeStatus;
  type: SectorType;
  location?: string;
  level: 1 | 2 | 3;
  parentId?: string;
}

export interface Organization {
  id: string;
  name: string;
  acronym: string;
  type: OrganizationType;
  classification: ClassificationType;
  threatLevel: ThreatLevel;
  activeMembers: number;
  territory: string;
  financialPower: 'Baixo' | 'Médio' | 'Alto';
  hierarchy?: HierarchyNode[];
}

export interface IntelligenceLogEntry {
  id?: string;
  timestamp: string;
  type: 'DOSSIER' | 'MURALHA' | 'SISBAJUD' | 'ONU' | 'BRASIL' | 'DISPATCH' | 'LEGAL' | 'RADIO';
  targetName: string;
  details: string;
  operator_id?: string;
  audit_hash?: string;
}

export interface FieldUnit {
  id: string;
  callsign: string;
  status: 'patrolling' | 'busy';
  lat: number;
  lng: number;
  type: 'Viatura' | 'Agente' | 'Aeronave';
  last_update?: string;
}

export interface FieldMessage {
  id: string;
  unitId: string;
  callsign: string;
  text: string;
  timestamp: string;
  type: 'INFO' | 'STATUS' | 'ACTION' | 'ALERT';
}

export interface FinancialBlock {
  id: string;
  org_id: string;
  amount: number;
  institution: string;
  target_cpf: string;
  protocol_id: string;
  timestamp: string;
}

export interface PenalCase {
  id: string;
  case_number: string;
  inmate_id: string;
  inmate_name: string;
  crime_type: string;
  is_point_11: boolean;
  status: string;
  last_decision?: string;
}

export interface DispatchOrder {
  id: string;
  unit_id: string;
  target_id: string;
  operator_id: string;
  timestamp: string;
  icp_signature_hash: string;
  status: 'TRANSMITTED' | 'RECEIVED' | 'EXECUTED';
}

export interface DossierNode {
  label: string;
  value: string;
  icon?: LucideIcon;
  children?: DossierNode[];
}

export interface ProgramGuideline {
  id: string;
  title: string;
  desc: string;
  status: 'Implementado' | 'Operacional' | 'Em Votação' | 'Análise Jurídica' | 'Em Trâmite';
  icon: LucideIcon;
}

export interface StrategicMarker {
  id: string;
  type: 'port' | 'treva' | 'muralha' | 'border' | 'airport';
  name: string;
  top: string;
  left: string;
  status: string;
  occupancy?: number;
  capacity?: number;
}

export interface PatrimonialStep {
  id: number;
  text: string;
  icon: LucideIcon;
}

export type PanelID = 'MURALHA' | 'MAP' | 'DOSSIER' | 'SISBAJUD' | 'ROADMAP' | 'AUDIT_TIMELINE';

export interface WorkspaceSettings {
  openPanels: PanelID[];
  layoutMode: 'FULL' | 'SPLIT' | 'QUAD';
  lastUpdated: string;
}

export interface SearchResult {
  id: string;
  type: 'ORGANIZATION' | 'CASE' | 'UNIT' | 'COMMAND';
  title: string;
  subtitle: string;
  action: () => void;
  icon: LucideIcon;
}

export interface RecidivismRisk {
  score: number;
  level: 'BAIXO' | 'MÉDIO' | 'ALTO' | 'CRÍTICO';
  factors: {
    name: string;
    value: number;
    fullMark: number;
  }[];
  redFlags: string[];
}
