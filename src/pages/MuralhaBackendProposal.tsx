import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan, Zap, Database, Shield, Radio, Smartphone,
  Navigation, Camera, Activity, Lock, ArrowRight,
  Code2, ChevronDown, ChevronRight, Server, GitBranch,
  AlertTriangle, CheckCircle2, Clock, Layers,
  Network, Eye, Fingerprint, Crosshair, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LambdaParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface LambdaResponse {
  field: string;
  type: string;
  description: string;
}

interface LambdaDef {
  id: string;
  name: string;
  trigger: string;
  runtime: string;
  memory: string;
  timeout: string;
  guiTrigger: string;
  description: string;
  httpMethod: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'WS';
  endpoint: string;
  params: LambdaParam[];
  response: LambdaResponse[];
  downstreamServices: string[];
  color: string;
  icon: React.ReactNode;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  phase: 'SCAN' | 'MATCH' | 'DISPATCH' | 'PERSIST' | 'STREAM';
}

// ─── Lambda definitions ───────────────────────────────────────────────────────
const lambdas: LambdaDef[] = [
  {
    id: 'L01',
    name: 'muralha-biometric-gsi-search',
    trigger: 'API Gateway (REST)',
    runtime: 'Node.js 22.x',
    memory: '1024 MB',
    timeout: '29s',
    guiTrigger: 'Button "Iniciar Varredura AWS_GSI" in the filter panel (FILTERING phase)',
    description:
      'Receives clothing/accessory filter attributes and performs a DynamoDB GSI query on the `muralha_targets_live` table using the `GSI_CLOTHING_META` index. Returns ranked biometric candidates for the UI radar animation phase.',
    httpMethod: 'POST',
    endpoint: '/muralha/search',
    params: [
      { name: 'clothing', type: 'string', required: false, description: 'Clothing description filter (e.g. "Jaqueta Preta")' },
      { name: 'accessory', type: 'string', required: false, description: 'Accessory filter (e.g. "Mochila Tática")' },
      { name: 'sector', type: 'string', required: false, description: 'Airport / port sector code (e.g. "GRU-T3")' },
      { name: 'operator_id', type: 'string', required: true, description: 'Authenticated operator JWT sub claim' },
    ],
    response: [
      { field: 'match', type: 'string', description: 'Biometric confidence score (e.g. "99.8%")' },
      { field: 'name', type: 'string', description: 'Full name of matched target' },
      { field: 'id', type: 'string', description: 'Internal SIP target ID' },
      { field: 'location', type: 'string', description: 'Last known physical location' },
      { field: 'trajectory', type: 'TrajectoryPoint[]', description: 'Array of geolocation breadcrumbs' },
      { field: 'multimodal', type: 'MultimodalScores', description: 'Face / gait / iris confidence breakdown' },
      { field: 'deviceAlert', type: 'DeviceAlert | null', description: 'IMEI correlation result (P12)' },
      { field: 'aws_metadata', type: 'AwsMeta', description: 'Region, table, index used for audit trail' },
    ],
    downstreamServices: ['DynamoDB GSI_CLOTHING_META', 'Rekognition (face)', 'ABIS Gait Service', 'P12 IMEI Registry'],
    color: 'border-cyan-500/40 bg-cyan-500/5',
    icon: <Scan className="h-5 w-5 text-cyan-400" />,
    priority: 'CRITICAL',
    phase: 'SCAN',
  },
  {
    id: 'L02',
    name: 'muralha-priority-p1-override',
    trigger: 'API Gateway (REST)',
    runtime: 'Node.js 22.x',
    memory: '512 MB',
    timeout: '10s',
    guiTrigger: 'MetricCard "Muralha Paulista" click (requestMuralhaScan) OR sidebar "Muralha Paulista" action button — triggers a P1 priority scan bypassing attribute filters',
    description:
      'Manual override endpoint that forces an immediate P1 leader scan. Skips the GSI clothing filter and directly queries the `p1_targets_priority` DynamoDB table. Returns a hardened result within 2.5 s for the UI shake/alarm sequence.',
    httpMethod: 'POST',
    endpoint: '/muralha/priority-scan',
    params: [
      { name: 'operator_id', type: 'string', required: true, description: 'Authenticated operator ID' },
      { name: 'sector', type: 'string', required: false, description: 'Optional sector scope to narrow the search' },
      { name: 'justification', type: 'string', required: true, description: 'Free-text reason for manual override (ICP-Brasil audit)' },
    ],
    response: [
      { field: 'match', type: 'string', description: 'Confidence score (expected 99.9% for P1)' },
      { field: 'name', type: 'string', description: 'P1 target full name' },
      { field: 'classification', type: 'string', description: '"NARCOTERRORISTA (P1)"' },
      { field: 'trajectory', type: 'TrajectoryPoint[]', description: 'Real-time breadcrumbs' },
      { field: 'audit_token', type: 'string', description: 'ICP-Brasil signed token for this scan event' },
    ],
    downstreamServices: ['DynamoDB p1_targets_priority', 'Rekognition', 'CloudWatch (audit)', 'SNS (P1 alert topic)'],
    color: 'border-red-500/40 bg-red-500/5',
    icon: <Crosshair className="h-5 w-5 text-red-400" />,
    priority: 'CRITICAL',
    phase: 'SCAN',
  },
  {
    id: 'L03',
    name: 'muralha-websocket-stream',
    trigger: 'API Gateway (WebSocket)',
    runtime: 'Node.js 22.x',
    memory: '256 MB',
    timeout: '900s (WS keep-alive)',
    guiTrigger: 'Auto-connect when MuralhaModal opens (RADAR phase — wsStatus badge in the UI)',
    description:
      'Manages the WebSocket connection lifecycle ($connect / $disconnect / $default routes). Pushes real-time biometric hit events from Kinesis Data Streams to the connected frontend session. The UI badge switches from "CONNECTING" to "CONNECTED" on first message.',
    httpMethod: 'WS',
    endpoint: 'wss://api.iabs-sip.gov.br/muralha-stream',
    params: [
      { name: 'connectionId', type: 'string', required: true, description: 'API Gateway managed connection ID' },
      { name: 'operator_id', type: 'string', required: true, description: 'Passed as query string on connect' },
    ],
    response: [
      { field: 'event', type: '"HIT" | "HEARTBEAT" | "DISCONNECT"', description: 'Stream event type' },
      { field: 'payload', type: 'MuralhaHitPayload', description: 'Full match object identical to L01 response on HIT events' },
    ],
    downstreamServices: ['Kinesis Data Streams (muralha_hits_stream)', 'DynamoDB (ws_connections table)', 'API Gateway Management API'],
    color: 'border-primary/40 bg-primary/5',
    icon: <Radio className="h-5 w-5 text-primary" />,
    priority: 'CRITICAL',
    phase: 'STREAM',
  },
  {
    id: 'L04',
    name: 'muralha-imei-p12-correlate',
    trigger: 'API Gateway (REST) — async invoke from L01/L02',
    runtime: 'Python 3.12',
    memory: '512 MB',
    timeout: '15s',
    guiTrigger: 'Automatically called after a biometric match is returned (BiometricMultimodalOverlay renders the IMEI panel)',
    description:
      'Cross-references the identified target\'s face against the P12 stolen-device registry. Queries the `imei_registry` table for devices linked to the matched target\'s CPF or last-known IMEI via camera proximity. Returns device model, IMEI, stolen flag, and original owner info.',
    httpMethod: 'POST',
    endpoint: '/muralha/imei-correlate',
    params: [
      { name: 'target_id', type: 'string', required: true, description: 'SIP target ID from the biometric match' },
      { name: 'camera_sector', type: 'string', required: true, description: 'Camera sector where the hit occurred' },
      { name: 'timestamp', type: 'string (ISO 8601)', required: true, description: 'Time of detection for proximity window' },
    ],
    response: [
      { field: 'detected', type: 'boolean', description: 'Whether a stolen device was correlated' },
      { field: 'imei', type: 'string', description: 'IMEI of the correlated device' },
      { field: 'model', type: 'string', description: 'Device model (e.g. "iPhone 15 Pro Max")' },
      { field: 'status', type: '"STOLEN" | "CLEAN" | "UNKNOWN"', description: 'Device registry status' },
      { field: 'last_owner', type: 'string', description: 'Victim\'s name from the stolen-device report' },
      { field: 'theft_date', type: 'string', description: 'Date of theft registration' },
    ],
    downstreamServices: ['DynamoDB imei_registry (P12)', 'ANATEL IMEI DB (external)', 'BO Cross-reference Service'],
    color: 'border-orange-500/40 bg-orange-500/5',
    icon: <Smartphone className="h-5 w-5 text-orange-400" />,
    priority: 'HIGH',
    phase: 'MATCH',
  },
  {
    id: 'L05',
    name: 'muralha-trajectory-predictor',
    trigger: 'EventBridge (triggered after L01/L02 completes)',
    runtime: 'Python 3.12 (SageMaker endpoint)',
    memory: '1024 MB',
    timeout: '20s',
    guiTrigger: 'Renders the trajectory breadcrumb list in UnitDetailsPanel ("Trajetória do Alvo") and the predictive vector in DispatchMapContainer',
    description:
      'Reads the raw trajectory points returned by L01 and invokes a SageMaker ML endpoint to predict the next likely position of the target (direction vector). Returns extended trajectory array including the predicted next point and the trend direction label used in the map overlay ("Deslocamento Norte-Oeste").',
    httpMethod: 'POST',
    endpoint: '/muralha/predict-trajectory',
    params: [
      { name: 'target_id', type: 'string', required: true, description: 'SIP target ID' },
      { name: 'trajectory', type: 'TrajectoryPoint[]', required: true, description: 'Known breadcrumbs from the match result' },
    ],
    response: [
      { field: 'predicted_point', type: '{ lat: number; lng: number }', description: 'Next predicted location' },
      { field: 'direction_label', type: 'string', description: 'Human-readable trend label (e.g. "Deslocamento Norte-Oeste")' },
      { field: 'confidence', type: 'number', description: 'Model confidence 0–1' },
      { field: 'extended_trajectory', type: 'TrajectoryPoint[]', description: 'Original points + predicted point appended' },
    ],
    downstreamServices: ['SageMaker trajectory-predictor endpoint', 'DynamoDB trajectory_cache', 'ElastiCache (hot path)'],
    color: 'border-purple-500/40 bg-purple-500/5',
    icon: <Navigation className="h-5 w-5 text-purple-400" />,
    priority: 'HIGH',
    phase: 'MATCH',
  },
  {
    id: 'L06',
    name: 'muralha-audit-log-writer',
    trigger: 'Kinesis Data Streams (consumer) — also direct invoke from L01/L02',
    runtime: 'Node.js 22.x',
    memory: '256 MB',
    timeout: '10s',
    guiTrigger: 'Triggered on every addLogEntry() call: NARCO_ALERT, DISPATCH, MURALHA types. Populates the AuditTimeline blockchain ledger in the UI.',
    description:
      'Writes immutable audit log entries to DynamoDB `sip_audit_logs` table. Computes SHA-256 chain hash of previous entry to maintain blockchain integrity. Each entry becomes a "block" rendered in the AuditTimeline component. Also emits to CloudWatch Logs for LGPD compliance retention.',
    httpMethod: 'POST',
    endpoint: '/audit/log (also Kinesis consumer)',
    params: [
      { name: 'type', type: 'IntelligenceLogEntry[\'type\']', required: true, description: 'Log type: MURALHA | NARCO_ALERT | DISPATCH | RADIO' },
      { name: 'targetName', type: 'string', required: true, description: 'Name of the target or subject of the log entry' },
      { name: 'details', type: 'string', required: true, description: 'Free-text description of the event' },
      { name: 'operator_id', type: 'string', required: true, description: 'Operator who triggered the event' },
    ],
    response: [
      { field: 'block_index', type: 'number', description: 'Sequential block number in the audit chain' },
      { field: 'audit_hash', type: 'string', description: 'SHA-256 hash of this block' },
      { field: 'previous_hash', type: 'string', description: 'Hash of the previous block (chain link)' },
      { field: 'timestamp', type: 'string (ISO 8601)', description: 'Server-side timestamp' },
    ],
    downstreamServices: ['DynamoDB sip_audit_logs', 'CloudWatch Logs (LGPD)', 'S3 (cold archive)'],
    color: 'border-success/40 bg-success/5',
    icon: <Lock className="h-5 w-5 text-success" />,
    priority: 'HIGH',
    phase: 'PERSIST',
  },
  {
    id: 'L07',
    name: 'muralha-camera-cluster-resolver',
    trigger: 'API Gateway (REST)',
    runtime: 'Node.js 22.x',
    memory: '512 MB',
    timeout: '15s',
    guiTrigger: '"Mostrar Câmeras" toggle in DispatchModal header — fetches camera locations for the MarkerClusterer overlay',
    description:
      'Returns the geolocation of all active surveillance cameras within a given radius of the target location. Data is used to populate the MarkerClusterer in DispatchMapContainer (150+ cameras). Cached in ElastiCache with 5-minute TTL to reduce DynamoDB reads.',
    httpMethod: 'GET',
    endpoint: '/muralha/cameras?lat={lat}&lng={lng}&radius={km}',
    params: [
      { name: 'lat', type: 'number', required: true, description: 'Center latitude of the search radius' },
      { name: 'lng', type: 'number', required: true, description: 'Center longitude' },
      { name: 'radius', type: 'number', required: false, description: 'Radius in km (default 5)' },
    ],
    response: [
      { field: 'cameras', type: 'CameraPoint[]', description: 'Array of { id, lat, lng, sector, status }' },
      { field: 'total', type: 'number', description: 'Total cameras returned' },
      { field: 'cached', type: 'boolean', description: 'Whether the response was served from cache' },
    ],
    downstreamServices: ['DynamoDB camera_registry', 'ElastiCache Redis (5-min TTL)', 'Google Maps Places API (optional enrichment)'],
    color: 'border-amber-500/40 bg-amber-500/5',
    icon: <Camera className="h-5 w-5 text-amber-400" />,
    priority: 'MEDIUM',
    phase: 'DISPATCH',
  },
  {
    id: 'L08',
    name: 'muralha-dispatch-order-writer',
    trigger: 'API Gateway (REST)',
    runtime: 'Node.js 22.x',
    memory: '256 MB',
    timeout: '10s',
    guiTrigger: '"DESPACHAR AGORA" button in UnitDetailsPanel (handleDispatch in DispatchModal)',
    description:
      'Persists the dispatch order linking a field unit (callsign) to the identified target. Writes to `dispatch_orders` DynamoDB table, publishes to an SNS topic for field unit notification, and enqueues in SQS for the offline-sync fallback (Offline mode in the UI). Returns the protocol ID used in ICP-Brasil dossier generation.',
    httpMethod: 'POST',
    endpoint: '/dispatch/order',
    params: [
      { name: 'unit_id', type: 'string', required: true, description: 'Field unit ID (e.g. "unit-1")' },
      { name: 'unit_callsign', type: 'string', required: true, description: 'Radio callsign for the field unit' },
      { name: 'target_id', type: 'string', required: true, description: 'SIP target ID' },
      { name: 'target_location', type: 'string', required: true, description: 'Last known location string' },
      { name: 'operator_id', type: 'string', required: true, description: 'Issuing operator ID' },
      { name: 'is_offline', type: 'boolean', required: false, description: 'If true, enqueues to SQS for later sync' },
    ],
    response: [
      { field: 'order_id', type: 'string', description: 'Unique dispatch order ID' },
      { field: 'protocol_id', type: 'string', description: 'ICP-Brasil dossier protocol reference' },
      { field: 'status', type: '"TRANSMITTED" | "QUEUED"', description: 'QUEUED when is_offline=true' },
      { field: 'timestamp', type: 'string', description: 'Server-side order timestamp' },
    ],
    downstreamServices: ['DynamoDB dispatch_orders', 'SNS unit_notification_topic', 'SQS dispatch_offline_queue', 'ICP-Brasil signing service'],
    color: 'border-red-500/40 bg-red-500/5',
    icon: <Zap className="h-5 w-5 text-red-400" />,
    priority: 'CRITICAL',
    phase: 'DISPATCH',
  },
  {
    id: 'L09',
    name: 'muralha-field-radio-simulator',
    trigger: 'API Gateway (WebSocket) — separate route from L03',
    runtime: 'Node.js 22.x',
    memory: '256 MB',
    timeout: '900s',
    guiTrigger: 'Auto-fires after handleDispatch resolves (isSent=true) — populates the FieldChat radio terminal in UnitDetailsPanel',
    description:
      'Simulates (and in production: relays) real-time field radio messages from the dispatched unit back to the command terminal. Pushes scripted status updates through the WebSocket connection. In production this would relay actual radio-over-IP messages from the field MDT (Mobile Data Terminal).',
    httpMethod: 'WS',
    endpoint: 'wss://api.iabs-sip.gov.br/field-radio',
    params: [
      { name: 'order_id', type: 'string', required: true, description: 'Active dispatch order ID to subscribe to' },
      { name: 'operator_id', type: 'string', required: true, description: 'Command terminal operator' },
    ],
    response: [
      { field: 'message', type: 'FieldMessage', description: 'Radio message with id, text, type, timestamp, callsign' },
    ],
    downstreamServices: ['DynamoDB dispatch_orders', 'API Gateway Management API (push)', 'SNS (field MDT relay in production)'],
    color: 'border-primary/40 bg-primary/5',
    icon: <Radio className="h-5 w-5 text-primary" />,
    priority: 'HIGH',
    phase: 'DISPATCH',
  },
  {
    id: 'L10',
    name: 'muralha-unit-gps-avl-stream',
    trigger: 'Kinesis Data Streams (AVL/GPRS feed) — also queryable via REST',
    runtime: 'Node.js 22.x',
    memory: '256 MB',
    timeout: '15s',
    guiTrigger: 'TacticalContext.subscribeToUnits() — drives the live unit markers and polyline animations in DispatchMapContainer (every 5 s)',
    description:
      'Consumes GPS telemetry from the fleet AVL/GPRS stream and writes updated unit positions to DynamoDB `field_units_live` table. The REST endpoint returns a snapshot for initial load. WebSocket push delivers delta updates to the frontend subscription.',
    httpMethod: 'GET',
    endpoint: '/units/live?sector={sector}',
    params: [
      { name: 'sector', type: 'string', required: false, description: 'Narrow by sector (e.g. "GRU")' },
    ],
    response: [
      { field: 'units', type: 'FieldUnit[]', description: 'Array of { id, callsign, status, lat, lng, type, last_update }' },
    ],
    downstreamServices: ['Kinesis Data Streams AVL_GPRS_stream', 'DynamoDB field_units_live', 'API Gateway Management API'],
    color: 'border-success/40 bg-success/5',
    icon: <Activity className="h-5 w-5 text-success" />,
    priority: 'HIGH',
    phase: 'STREAM',
  },
];

// ─── Phase colour map ─────────────────────────────────────────────────────────
const phaseConfig: Record<LambdaDef['phase'], { label: string; color: string }> = {
  SCAN:     { label: 'Scan',     color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  MATCH:    { label: 'Match',    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  DISPATCH: { label: 'Dispatch', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  PERSIST:  { label: 'Persist',  color: 'bg-success/20 text-success border-success/30' },
  STREAM:   { label: 'Stream',   color: 'bg-primary/20 text-primary border-primary/30' },
};

const priorityConfig: Record<LambdaDef['priority'], string> = {
  CRITICAL: 'bg-red-600 text-white',
  HIGH:     'bg-warning/30 text-warning border-warning/30',
  MEDIUM:   'bg-slate-700 text-slate-300',
};

// ─── Lambda card ──────────────────────────────────────────────────────────────
function LambdaCard({ lambda }: { lambda: LambdaDef }) {
  const [expanded, setExpanded] = useState(false);
  const phase = phaseConfig[lambda.phase];

  return (
    <Card className={cn('border transition-all duration-200 hover:shadow-2xl', lambda.color)}>
      <button
        className="w-full text-left"
        onClick={() => setExpanded(p => !p)}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center border shrink-0', lambda.color)}>
                {lambda.icon}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                    {lambda.id}
                  </span>
                  <Badge className={cn('text-[9px] font-black uppercase', priorityConfig[lambda.priority])}>
                    {lambda.priority}
                  </Badge>
                  <Badge variant="outline" className={cn('text-[9px] font-black uppercase', phase.color)}>
                    {phase.label}
                  </Badge>
                  <Badge variant="outline" className="text-[9px] font-mono text-slate-500 border-white/10">
                    {lambda.httpMethod}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-black text-white font-mono">
                  {lambda.name}
                </CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end gap-0.5 text-right">
                <span className="text-[10px] font-mono text-slate-500">{lambda.runtime}</span>
                <span className="text-[10px] font-mono text-slate-600">{lambda.memory} · {lambda.timeout}</span>
              </div>
              {expanded
                ? <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                : <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
              }
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mt-1">{lambda.description}</p>

          <div className="flex items-start gap-2 mt-2 p-2 bg-black/30 rounded-lg border border-white/5">
            <Eye className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-300/80 leading-tight font-medium">
              <span className="font-black text-amber-400 uppercase">GUI Trigger:</span> {lambda.guiTrigger}
            </p>
          </div>
        </CardHeader>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 space-y-5 pb-5">
              <div className="h-px bg-white/5" />

              {/* Runtime info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Trigger', value: lambda.trigger },
                  { label: 'Runtime', value: lambda.runtime },
                  { label: 'Memory', value: lambda.memory },
                  { label: 'Timeout', value: lambda.timeout },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-900 border border-white/5 rounded-lg p-2.5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                    <p className="text-[11px] font-bold text-white mt-0.5 truncate" title={item.value}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Endpoint */}
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Endpoint</p>
                <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-lg px-3 py-2 font-mono text-xs text-primary">
                  <Code2 className="h-3 w-3 shrink-0 text-slate-500" />
                  <span className="text-warning">{lambda.httpMethod}</span>
                  <span className="text-slate-300">{lambda.endpoint}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Params */}
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Request Parameters</p>
                  <div className="space-y-1.5">
                    {lambda.params.map((p) => (
                      <div key={p.name} className="flex items-start gap-2 bg-slate-900 border border-white/5 rounded p-2">
                        <code className="text-[10px] font-mono text-cyan-400 shrink-0">{p.name}</code>
                        <span className="text-[9px] text-slate-600 font-mono shrink-0">{p.type}</span>
                        {p.required
                          ? <span className="text-[9px] text-red-400 font-black shrink-0">*</span>
                          : <span className="text-[9px] text-slate-700 font-black shrink-0">?</span>
                        }
                        <span className="text-[10px] text-slate-500 leading-tight">{p.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response */}
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Response Fields</p>
                  <div className="space-y-1.5">
                    {lambda.response.map((r) => (
                      <div key={r.field} className="flex items-start gap-2 bg-slate-900 border border-white/5 rounded p-2">
                        <code className="text-[10px] font-mono text-success shrink-0">{r.field}</code>
                        <span className="text-[9px] text-slate-600 font-mono shrink-0 max-w-[120px] truncate">{r.type}</span>
                        <span className="text-[10px] text-slate-500 leading-tight">{r.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Downstream */}
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Downstream Services</p>
                <div className="flex flex-wrap gap-2">
                  {lambda.downstreamServices.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 text-[10px] font-bold bg-slate-900 border border-white/5 px-2 py-1 rounded-full text-slate-300">
                      <Server className="h-2.5 w-2.5 text-primary shrink-0" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Architecture diagram ─────────────────────────────────────────────────────
function ArchDiagram() {
  const layers = [
    {
      label: 'Frontend (IABS-SIP React)',
      items: ['MuralhaModal', 'DispatchModal', 'MuralhaModal Filter Panel', 'DispatchMapContainer', 'FieldChat', 'AuditTimeline'],
      color: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
    },
    {
      label: 'API Gateway (REST + WebSocket)',
      items: ['POST /muralha/search', 'POST /muralha/priority-scan', 'GET /muralha/cameras', 'POST /dispatch/order', 'GET /units/live', 'WS /muralha-stream', 'WS /field-radio'],
      color: 'border-primary/30 bg-primary/5 text-primary',
    },
    {
      label: 'AWS Lambda Functions (10 total)',
      items: lambdas.map(l => l.id + ' ' + l.name),
      color: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
    },
    {
      label: 'Data Layer',
      items: ['DynamoDB (8 tables)', 'Kinesis Data Streams (3 streams)', 'ElastiCache Redis', 'SageMaker Endpoint', 'SNS + SQS', 'S3 (cold archive)'],
      color: 'border-success/30 bg-success/5 text-success',
    },
    {
      label: 'External Integrations',
      items: ['AWS Rekognition (face)', 'ABIS Gait Service', 'P12 IMEI Registry', 'ANATEL DB', 'ICP-Brasil Signing', 'Google Maps API'],
      color: 'border-red-500/30 bg-red-500/5 text-red-400',
    },
  ];

  return (
    <div className="space-y-2">
      {layers.map((layer, i) => (
        <div key={i}>
          <div className={cn('rounded-xl border p-3', layer.color)}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">{layer.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {layer.items.map((item) => (
                <span key={item} className="text-[10px] font-mono bg-black/40 border border-white/5 px-2 py-0.5 rounded-full text-slate-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
          {i < layers.length - 1 && (
            <div className="flex justify-center py-0.5">
              <ArrowRight className="h-3 w-3 rotate-90 text-slate-700" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── DynamoDB tables ──────────────────────────────────────────────────────────
const tables = [
  { name: 'muralha_targets_live',    pk: 'target_id',    sk: 'timestamp',    gsi: 'GSI_CLOTHING_META (clothing_attr, sector)',                   lambdas: ['L01'] },
  { name: 'p1_targets_priority',     pk: 'target_id',    sk: 'priority_level', gsi: 'GSI_SECTOR (sector, threat_level)',                         lambdas: ['L02'] },
  { name: 'ws_connections',          pk: 'connection_id', sk: 'operator_id', gsi: '—',                                                           lambdas: ['L03', 'L09'] },
  { name: 'imei_registry',           pk: 'imei',          sk: 'report_date',  gsi: 'GSI_CPF (cpf, status), GSI_SECTOR (camera_sector, ts)',       lambdas: ['L04'] },
  { name: 'trajectory_cache',        pk: 'target_id',     sk: 'timestamp',    gsi: '—',                                                          lambdas: ['L05'] },
  { name: 'sip_audit_logs',          pk: 'block_index',   sk: 'timestamp',    gsi: 'GSI_OPERATOR (operator_id, timestamp)',                       lambdas: ['L06'] },
  { name: 'camera_registry',         pk: 'camera_id',     sk: 'sector',       gsi: 'GSI_GEO (sector, status)',                                   lambdas: ['L07'] },
  { name: 'dispatch_orders',         pk: 'order_id',      sk: 'timestamp',    gsi: 'GSI_UNIT (unit_id, status), GSI_TARGET (target_id, status)',  lambdas: ['L08', 'L09'] },
  { name: 'field_units_live',        pk: 'unit_id',       sk: 'last_update',  gsi: 'GSI_SECTOR (sector, status)',                                lambdas: ['L10'] },
];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MuralhaBackendProposal() {
  const [activeFilter, setActiveFilter] = useState<LambdaDef['phase'] | 'ALL'>('ALL');

  const filtered = activeFilter === 'ALL'
    ? lambdas
    : lambdas.filter(l => l.phase === activeFilter);

  const phases: Array<LambdaDef['phase'] | 'ALL'> = ['ALL', 'SCAN', 'MATCH', 'DISPATCH', 'PERSIST', 'STREAM'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="p-6 bg-slate-900 rounded-xl border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #22D3EE 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 shrink-0">
              <Scan className="h-7 w-7 text-cyan-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-black">BRASIL SEM MEDO — P9</Badge>
                <Badge className="bg-red-600/20 text-red-400 border border-red-600/30 text-[10px] font-black animate-pulse">BACKEND PROPOSAL</Badge>
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Muralha Paulista — Lambda Architecture</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">
                10 Lambda Functions · 9 DynamoDB Tables · 3 Kinesis Streams · 1 SageMaker Endpoint
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <div className="flex items-center justify-end gap-2">
              <CheckCircle2 className="h-3 w-3 text-success" />
              <span className="text-[10px] font-mono text-success uppercase">GUI fully mapped</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <AlertTriangle className="h-3 w-3 text-warning" />
              <span className="text-[10px] font-mono text-warning uppercase">Supabase not yet connected</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Clock className="h-3 w-3 text-slate-500" />
              <span className="text-[10px] font-mono text-slate-500">2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flow summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(phaseConfig).map(([phase, cfg]) => {
          const count = lambdas.filter(l => l.phase === (phase as LambdaDef['phase'])).length;
          return (
            <button
              key={phase}
              onClick={() => setActiveFilter(activeFilter === phase ? 'ALL' : phase as LambdaDef['phase'])}
              className={cn(
                'p-3 rounded-xl border text-left transition-all hover:scale-105',
                cfg.color,
                activeFilter === phase && 'ring-2 ring-white/20',
              )}
            >
              <p className="text-[9px] font-black uppercase tracking-widest mb-1">{cfg.label}</p>
              <p className="text-2xl font-black text-white">{count}</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Lambda{count > 1 ? 's' : ''}</p>
            </button>
          );
        })}
      </div>

      {/* Phase filter pills */}
      <div className="flex flex-wrap gap-2">
        {phases.map(p => (
          <button
            key={p}
            onClick={() => setActiveFilter(p)}
            className={cn(
              'px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all',
              activeFilter === p
                ? 'bg-primary text-white border-primary'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10',
            )}
          >
            {p === 'ALL' ? `All (${lambdas.length})` : `${phaseConfig[p as LambdaDef['phase']].label} (${lambdas.filter(l => l.phase === p).length})`}
          </button>
        ))}
      </div>

      {/* Lambda cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map(lambda => (
            <motion.div
              key={lambda.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              <LambdaCard lambda={lambda} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Architecture diagram */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Full Stack Architecture Diagram</h2>
        </div>
        <ArchDiagram />
      </div>

      {/* DynamoDB tables */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-success" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">DynamoDB Tables &amp; GSI Design</h2>
        </div>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-900 border-b border-white/10">
                {['Table Name', 'PK', 'SK', 'GSI (Key + Sort)', 'Lambdas'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tables.map((t, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-primary font-bold whitespace-nowrap">{t.name}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300 whitespace-nowrap">{t.pk}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400 whitespace-nowrap">{t.sk}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-[10px]">{t.gsi}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {t.lambdas.map(l => (
                        <span key={l} className="font-mono text-[9px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded">{l}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration flow note */}
      <Card className="bg-slate-900 border-amber-500/20">
        <CardContent className="p-5 flex flex-wrap items-start gap-4">
          <GitBranch className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <p className="text-sm font-black text-amber-400 uppercase">Next Steps to Wire the Backend</p>
            <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Connect a <strong>Supabase project</strong> (or deploy DynamoDB tables via the schema in <code>supabase_schema.sql</code>) and update <code>src/lib/supabase.ts</code> credentials.</li>
              <li>Replace mock returns in <code>src/services/intelligenceService.ts</code> with real <code>fetch()</code> calls to each Lambda endpoint above.</li>
              <li>Deploy <strong>L03</strong> and <strong>L09</strong> (WebSocket Lambdas) first — the UI already listens on <code>wsStatus</code> and will automatically switch from "CONNECTING" to "CONNECTED".</li>
              <li>Deploy <strong>L01</strong> (GSI Search) and point the filter panel's "Iniciar Varredura" button to it.</li>
              <li>Wire <strong>L08</strong> (Dispatch Order Writer) to the "DESPACHAR AGORA" button and pass <code>is_offline=true</code> when <code>isOnline=false</code>.</li>
              <li>Enable the <strong>SQS offline queue</strong> to auto-drain via an EventBridge schedule every 30 s when connectivity is restored.</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
