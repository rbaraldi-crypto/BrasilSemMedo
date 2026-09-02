import { supabase } from '@/lib/supabase';
import { FinancialBlock } from '@/types/intelligence';
import { logger } from '@/lib/logger';

/**
 * Financial Service: Asfixia Financeira (Ponto 1 e 8)
 * Fix: Substituído console.error por logger.
 */
export const financialService = {
  async recordFinancialBlock(block: Omit<FinancialBlock, 'id'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('financial_blocks')
        .insert([block]);
      if (error) throw error;
    } catch (err) {
      logger.error('FinancialService', 'Falha ao registrar bloqueio SISBAJUD', err);
    }
  },

  async getFinancialStats(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from('financial_blocks')
        .select('amount, org_id, timestamp')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      logger.error('FinancialService', 'Falha ao buscar estatísticas financeiras', err);
      return [];
    }
  },

  async getRecentEvents(limit = 5): Promise<FinancialBlock[]> {
    try {
      const { data, error } = await supabase
        .from('financial_blocks')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      logger.error('FinancialService', 'Falha ao buscar eventos recentes', err);
      return [];
    }
  }
};
