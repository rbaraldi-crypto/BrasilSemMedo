import { supabase } from '@/lib/supabase';
import { PenalCase, RecidivismRisk } from '@/types/intelligence';
import { logger } from '@/lib/logger';

/**
 * Penal Service: Execução e Ponto 11
 * Fix: Substituído console.error por logger.
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
      logger.error('PenalService', 'Falha ao buscar detalhes do caso', err);
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
      logger.error('PenalService', 'Falha ao registrar decisão judicial', err);
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
      logger.error('PenalService', 'Falha ao verificar Ponto 11', err);
      return false;
    }
  },

  async getRecidivismRisk(inmateId: string): Promise<RecidivismRisk> {
    await new Promise(resolve => setTimeout(resolve, 1500));

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
