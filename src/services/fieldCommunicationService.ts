import { FieldMessage, FieldUnit } from '@/types/intelligence';
import { tacticalAudio } from '@/lib/audioUtils';

/**
 * fieldCommunicationService: Simula a comunicação de rádio digital (C2)
 * entre o terminal central e as unidades de campo.
 */
export const fieldCommunicationService = {
  // Gera uma sequência de respostas táticas baseada na unidade selecionada
  async simulateUnitResponse(unit: FieldUnit, onMessage: (msg: FieldMessage) => void) {
    const scripts = [
      { delay: 2000, text: "Ordem recebida via link satelital. Iniciando deslocamento prioritário.", type: 'STATUS' },
      { delay: 5000, text: `Unidade ${unit.callsign} em aproximação do Terminal 3. ETA: 3 minutos.`, type: 'INFO' },
      { delay: 8000, text: "CONTATO VISUAL ESTABELECIDO. Alvo identificado conforme biometria.", type: 'ACTION' },
      { delay: 12000, text: "Iniciando abordagem tática. Solicitando apoio de perímetro.", type: 'ALERT' },
      { delay: 15000, text: "ALVO CUSTODIADO. Iniciando extração para viatura.", type: 'STATUS' }
    ];

    for (const step of scripts) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      
      const message: FieldMessage = {
        id: `msg-${Math.random().toString(36).substr(2, 9)}`,
        unitId: unit.id,
        callsign: unit.callsign,
        text: step.text,
        timestamp: new Date().toLocaleTimeString(),
        type: step.type as any
      };

      tacticalAudio.playScan(); // Bipe discreto de nova mensagem
      onMessage(message);
    }
  }
};
