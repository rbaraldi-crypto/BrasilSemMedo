import { LucideIcon } from 'lucide-react';

export type ThreatLevel = 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
export type OrganizationType = 'Facção' | 'Milícia' | 'Gangue';
export type ClassificationType = 'Comum' | 'Narcoterrorista';
export type NodeStatus = 'Ativo' | 'Preso' | 'Foragido';
export type SectorType = 'Liderança' | 'Operacional' | 'Financeiro' | 'Logística';

export type LinkType = 'FIBER' | 'SATELLITE';

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
  threatScore: number; 
  asphyxiaLevel: number; 
  activeMembers: number;
  territory: string;
  financialPower: 'Baixo' | 'Médio' | 'Alto';
  hierarchy?: HierarchyNode[];
}

export interface IntelligenceLogEntry {
  id?: string;
  timestamp: string;
  type: 'DOSSIER' | 'MURALHA' | 'SISBAJUD' | 'ONU' | 'BRASIL' | 'DISPATCH' | 'LEGAL' | 'RADIO' | 'VICTIM_SUPPORT' | 'NARCO_ALERT' | 'TRANSITION' | 'LOGISTICS';
  targetName: string;
  details: string;
  operator_id?: string;
  audit_hash?: string;
  previous_hash?: string;
  block_index?: number;
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

export interface TrevaWing {
  id: string;
  name: string;
  occupancy: number;
  capacity: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface TrevaFloor {
  id: number;
  label: string;
  wings: TrevaWing[];
}

export interface TacticalRoute {
  id: string;
  origin: string;
  destination: string;
  riskScore: number;
  estimatedTime: string;
  checkpoints: string[];
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
  floors?: TrevaFloor[];
}

export type PanelID = 'MURALHA' | 'MAP' | 'DOSSIER' | 'SISBAJUD' | 'ROADMAP' | 'AUDIT_TIMELINE' | 'VICTIM_SUPPORT' | 'NARCO_INDEX' | 'LOGISTICS_PLANNER';

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

export interface BehaviorMetric {
  name: string;
  juvenile: number;
  adult: number;
  fullMark: number;
}

export interface PatrimonialStep {
  id: number;
  text: string;
  icon: LucideIcon;
}

export interface ProgramGuideline {
  id: string;
  title: string;
  desc: string;
  status: string;
  icon: LucideIcon;
}
