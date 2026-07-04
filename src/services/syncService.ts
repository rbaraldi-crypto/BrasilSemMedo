/**
 * syncService: Gerencia a fila de ações offline para o IABS-SIP.
 * Implementa o Ponto S1 (Background Sync).
 */

export interface PendingAction {
  id: string;
  type: 'DISPATCH' | 'LOG' | 'FINANCIAL_BLOCK';
  payload: any;
  timestamp: string;
}

const SYNC_QUEUE_KEY = 'iabs_sip_sync_queue';

export const syncService = {
  // Adiciona uma ação à fila de espera
  queueAction(type: PendingAction['type'], payload: any) {
    const queue = this.getQueue();
    const newAction: PendingAction = {
      id: `act-${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      timestamp: new Date().toISOString()
    };
    
    queue.push(newAction);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    console.log(`IABS-SIP [S1]: Ação ${type} enfileirada (Offline).`);
    return newAction;
  },

  // Recupera a fila atual
  getQueue(): PendingAction[] {
    const stored = localStorage.getItem(SYNC_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Remove uma ação após sucesso
  dequeueAction(id: string) {
    const queue = this.getQueue().filter(a => a.id !== id);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  },

  // Limpa a fila
  clearQueue() {
    localStorage.removeItem(SYNC_QUEUE_KEY);
  }
};
