import { faker } from '@faker-js/faker/locale/pt_BR';

faker.seed(42);

export const generateCases = (count = 12) =>
  Array.from({ length: count }, (_, i) => ({
    id: `FDE-${String(2024000 + i + 1).padStart(7, '0')}`,
    title: faker.helpers.arrayElement([
      'Operação Asfixia Digital', 'Operação Espelho', 'Operação Fronteira Zero',
      'Operação Cobra Coral', 'Operação Rio Seco', 'Operação Névoa Financeira'
    ]) + ` #${i + 1}`,
    org: faker.helpers.arrayElement(['PCC', 'CV', 'Milícia Norte', 'Cartel SP', 'Organização X']),
    status: faker.helpers.arrayElement(['EM_ANÁLISE', 'ESCALADO', 'FECHADO', 'PENDENTE_HITL']),
    priority: faker.helpers.arrayElement(['CRÍTICA', 'ALTA', 'MÉDIA', 'BAIXA']),
    score: faker.number.int({ min: 40, max: 99 }),
    amount: faker.number.float({ min: 100000, max: 50000000, fractionDigits: 2 }),
    entities: faker.number.int({ min: 2, max: 18 }),
    transactions: faker.number.int({ min: 10, max: 450 }),
    createdAt: faker.date.recent({ days: 90 }).toLocaleDateString('pt-BR'),
    analyst: faker.person.fullName(),
    phase: faker.helpers.arrayElement(['Investigação', 'Análise Financeira', 'Jurídico', 'Decisão']),
  }));

export const generateTransactions = (count = 20) =>
  Array.from({ length: count }, () => ({
    id: `TXN-${faker.string.alphanumeric(8).toUpperCase()}`,
    from: faker.finance.accountNumber(),
    fromName: faker.company.name(),
    to: faker.finance.accountNumber(),
    toName: faker.company.name(),
    amount: faker.number.float({ min: 1000, max: 5000000, fractionDigits: 2 }),
    date: faker.date.recent({ days: 60 }).toLocaleDateString('pt-BR'),
    type: faker.helpers.arrayElement(['PIX', 'TED', 'DOC', 'Criptoativo', 'Espécie']),
    risk: faker.helpers.arrayElement(['ALTO', 'MÉDIO', 'BAIXO']),
    flags: faker.helpers.arrayElements(['Estruturação', 'Lavagem', 'Smurfing', 'Layering', 'Integração'], { min: 0, max: 2 }),
    status: faker.helpers.arrayElement(['ANALISADO', 'PENDENTE', 'BLOQUEADO']),
  }));

export const generateEntities = (count = 15) =>
  Array.from({ length: count }, () => ({
    id: `ENT-${faker.string.alphanumeric(6).toUpperCase()}`,
    name: faker.helpers.arrayElement([faker.person.fullName, faker.company.name])(),
    type: faker.helpers.arrayElement(['PESSOA_FÍSICA', 'PESSOA_JURÍDICA', 'CONTA_BANCÁRIA', 'CRIPTOATIVO']),
    cpfCnpj: faker.helpers.arrayElement([faker.string.numeric(11), faker.string.numeric(14)]),
    riskScore: faker.number.int({ min: 20, max: 99 }),
    status: faker.helpers.arrayElement(['ATIVO', 'MONITORADO', 'BLOQUEADO_JUDICIAL']),
    role: faker.helpers.arrayElement(['Gestor Financeiro', 'Laranja', 'Beneficiário Final', 'Intermediário']),
    linkedOrg: faker.helpers.arrayElement(['PCC', 'CV', 'Milícia Norte', 'N/A']),
  }));

export const generateAssets = (count = 10) =>
  Array.from({ length: count }, () => ({
    id: `AST-${faker.string.alphanumeric(6).toUpperCase()}`,
    type: faker.helpers.arrayElement(['Imóvel', 'Veículo', 'Aeronave', 'Embarcação', 'Criptoativo', 'Conta Bancária']),
    description: faker.helpers.arrayElement([
      faker.location.streetAddress(), `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
      'Bitcoin Wallet', 'Conta Corrente BB', 'Apartamento de Luxo'
    ]),
    value: faker.number.float({ min: 50000, max: 10000000, fractionDigits: 2 }),
    owner: faker.person.fullName(),
    status: faker.helpers.arrayElement(['IDENTIFICADO', 'BLOQUEIO_SOLICITADO', 'BLOQUEADO_JUDICIAL']),
    origin: faker.helpers.arrayElement(['Declarado', 'Suspeito', 'Produto de Crime']),
    registry: faker.string.alphanumeric(12).toUpperCase(),
  }));

export const generateAlerts = (count = 8) =>
  Array.from({ length: count }, () => ({
    id: `ALT-${faker.string.alphanumeric(6).toUpperCase()}`,
    type: faker.helpers.arrayElement(['ESTRUTURAÇÃO', 'LAYERING', 'CRIPTOATIVO_SUSPEITO', 'MULA_FINANCEIRA', 'SMURFING']),
    severity: faker.helpers.arrayElement(['CRÍTICO', 'ALTO', 'MÉDIO']),
    entity: faker.person.fullName(),
    amount: faker.number.float({ min: 10000, max: 2000000, fractionDigits: 2 }),
    timestamp: faker.date.recent({ days: 7 }).toLocaleString('pt-BR'),
    ruleId: `RULE-${faker.string.alphanumeric(4).toUpperCase()}`,
    acknowledged: faker.datatype.boolean(),
  }));

export const generateHITLQueue = (count = 6) =>
  Array.from({ length: count }, () => ({
    id: `HITL-${faker.string.alphanumeric(6).toUpperCase()}`,
    caseId: `FDE-${faker.string.numeric(7)}`,
    type: faker.helpers.arrayElement(['Aprovação de Bloqueio', 'Escalonamento', 'Revisão de Score', 'Liberação de Evidência']),
    priority: faker.helpers.arrayElement(['URGENTE', 'ALTA', 'NORMAL']),
    requestedBy: 'Sistema IA',
    assignedTo: faker.person.fullName(),
    deadline: faker.date.soon({ days: 3 }).toLocaleDateString('pt-BR'),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['PENDENTE', 'EM_REVISÃO', 'APROVADO', 'REJEITADO']),
  }));

export const fdeMockData = {
  cases: generateCases(12),
  transactions: generateTransactions(20),
  entities: generateEntities(15),
  assets: generateAssets(10),
  alerts: generateAlerts(8),
  hitlQueue: generateHITLQueue(6),
  kpis: {
    totalBlocked: 142822450,
    activeInvestigations: 47,
    entitiesMonitored: 1284,
    alertsOpen: 23,
    hitlPending: 8,
    avgScore: 76.4,
  }
};
