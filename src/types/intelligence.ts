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
  threatScore: number; // 0-100
  asphyxiaLevel: number; // 0-100 (Percentual de capital bloqueado)
  activeMembers: number;
  territory: string;
  financialPower: 'Baixo' | 'Médio' | 'Alto';
  hierarchy?: HierarchyNode[];
}

export interface IntelligenceLogEntry {
  id?: string;
  timestamp: string;
  type: 'DOSSIER' | 'MURALHA' | 'SISBAJUD' | 'ONU' | 'BRASIL' | 'DISPATCH' | 'LEGAL' | 'RADIO' | 'VICTIM_SUPPORT' | 'NARCO_ALERT' | 'TRANSITION';
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

export interface BehaviorMetric {
  name: string;
  juvenile: number;
  adult: number;
  fullMark: number;
}

export interface PenalCase {
  id: string;
  case_number: string;
  inmate_id: string;
  inmate_name: string;
  crime_type: string;
  is_point_11: boolean;
  is_hardened_mode?: boolean;
  is_mobile_theft?: boolean;
  age: number;
  status: string;
  last_decision?: string;
  transitionDate?: string;
  behaviorMetrics?: BehaviorMetric[];
}

export interface VictimSupportRecord {
  id: string;
  inmateId: string;
  victimFamilyId: string;
  amountRedirected: number;
  status: 'ACTIVE' | 'PENDING';
  lastPayment: string;
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
  isMassive?: boolean;
}

export type PanelID = 'MURALHA' | 'MAP' | 'DOSSIER' | 'SISBAJUD' | 'ROADMAP' | 'AUDIT_TIMELINE' | 'VICTIM_SUPPORT' | 'NARCO_INDEX';

export interface WorkspaceSettings {
  openPanels: PanelID[];
  layoutMode: 'FULL' | 'SPLIT' | 'QUAD';
  lastUpdated: string;
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
