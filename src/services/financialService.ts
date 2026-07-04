import { supabase } from '@/lib/supabase';
import { FinancialBlock } from '@/types/intelligence';

/**
 * Financial Service: Asfixia Financeira (Ponto 1 e 8)
 * Integrado com a tabela financial_blocks do Supabase/DynamoDB.
 */
export const financialService = {
  async recordFinancialBlock(block: Omit<FinancialBlock, 'id'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('financial_blocks')
        .insert([block]);
      if (error) throw error;
    } catch (err) {
      console.error("IABS-SIP: Falha ao registrar bloqueio SISBAJUD", err);
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
      return [];
    }
  }
};
