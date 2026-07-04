-- IABS-SIP: Script de Infraestrutura de Banco de Dados
-- Preparado para Supabase (Postgres) com compatibilidade DynamoDB (Bridge)

-- 1. Organizações (Facções Narcoterroristas)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    acronym TEXT NOT NULL,
    type TEXT DEFAULT 'Facção',
    classification TEXT DEFAULT 'Narcoterrorista',
    threat_level TEXT DEFAULT 'Crítico',
    active_members INTEGER DEFAULT 0,
    territory TEXT,
    financial_power TEXT DEFAULT 'Alto',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Hierarquia de Comando
CREATE TABLE IF NOT EXISTS hierarchy_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'Ativo',
    type TEXT DEFAULT 'Operacional',
    location TEXT,
    level INTEGER CHECK (level IN (1, 2, 3)),
    parent_id UUID REFERENCES hierarchy_nodes(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Unidades de Campo (Monitoramento GPS Real-time)
CREATE TABLE IF NOT EXISTS field_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    callsign TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'patrolling',
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    type TEXT DEFAULT 'Viatura',
    last_update TIMESTAMPTZ DEFAULT now()
);

-- 4. Bloqueios Financeiros (SISBAJUD - Ponto 1)
CREATE TABLE IF NOT EXISTS financial_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id),
    amount NUMERIC(15, 2) NOT NULL,
    institution TEXT NOT NULL,
    target_cpf TEXT NOT NULL,
    protocol_id TEXT NOT NULL UNIQUE,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- 5. Processos Penais (HITL - Ponto 11)
CREATE TABLE IF NOT EXISTS penal_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number TEXT NOT NULL UNIQUE,
    inmate_id TEXT NOT NULL,
    inmate_name TEXT NOT NULL,
    inmate_cpf TEXT NOT NULL,
    crime_type TEXT NOT NULL,
    is_point_11 BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'Aguardando Análise',
    last_decision TEXT,
    operator_id TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Log de Auditoria Ministerial
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT now(),
    type TEXT NOT NULL,
    target_name TEXT NOT NULL,
    details TEXT,
    operator_id TEXT,
    audit_hash TEXT,
    is_synced BOOLEAN DEFAULT true
);

-- 7. Configurações de Usuário (Persistência de Workspace - U6)
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    settings_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, settings_type)
);

-- Habilitar Realtime para Viaturas
ALTER PUBLICATION supabase_realtime ADD TABLE field_units;
