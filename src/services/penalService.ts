import { supabase } from '@/lib/supabase';
import { PenalCase, RecidivismRisk } from '@/types/intelligence';

/**
 * Penal Service: Execução e Ponto 11
 * Integrado com a tabela penal_cases do Supabase/DynamoDB.
 */
export const penalService = {
  async getCaseDetails(caseId: string): Promise<PenalCase | null> {
    try {
      const { data, error } = await supabase
        .from('penal_cases')
        .select('*')
        .eq('id', caseId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } catch (err) {
      return null;
    }
  },

  async recordDecision(caseId: string, decision: string, operatorId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('penal_cases')
        .update({ 
          last_decision: decision,
          status: 'Julgado',
          operator_id: operatorId,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);
      
      if (error) throw error;
    } catch (err) {
      console.error("IABS-SIP: Falha ao registrar decisão judicial", err);
    }
  },

  async checkPoint11(inmateCpf: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('penal_cases')
        .select('is_point_11')
        .eq('inmate_cpf', inmateCpf)
        .maybeSingle();
      
      if (error) return false;
      return data?.is_point_11 || false;
    } catch (err) {
      return false;
    }
  },

  /**
   * getRecidivismRisk (Opção 1): Motor de Análise Preditiva.
   * Simula o cruzamento de dados de inteligência para apoiar o Magistrado.
   */
  async getRecidivismRisk(inmateId: string): Promise<RecidivismRisk> {
    // Simulação de latência de processamento AWS
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Lógica mockada baseada no ID para Carlos Eduardo (Ponto 11)
    const isHighRisk = inmateId.includes('001');

    return {
      score: isHighRisk ? 92 : 34,
      level: isHighRisk ? 'CRÍTICO' : 'BAIXO',
      factors: [
        { name: 'Vínculo Facção', value: isHighRisk ? 95 : 10, fullMark: 100 },
        { name: 'Gravidade Crime', value: isHighRisk ? 98 : 40, fullMark: 100 },
        { name: 'Histórico Penal', value: isHighRisk ? 88 : 25, fullMark: 100 },
        { name: 'Comportamento', value: isHighRisk ? 40 : 90, fullMark: 100 },
        { name: 'Rede Social', value: isHighRisk ? 85 : 30, fullMark: 100 }
      ],
      redFlags: isHighRisk ? [
        "Vínculo ativo com Sintonia Financeira (PCC)",
        "Tentativa de fuga registrada em 2023",
        "Liderança negativa em pavilhão de segurança máxima",
        "Patrimônio oculto identificado via SISBAJUD"
      ] : [
        "Réu primário",
        "Vínculo familiar estável",
        "Bom comportamento carcerário ininterrupto"
      ]
    };
  }
};
