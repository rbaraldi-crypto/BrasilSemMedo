/**
 * voiceService: Expansão de Comandos Táticos (Ponto 3 do polimento).
 * Suporta consultas contextuais e ações críticas.
 */

export type TacticalCommand = 
  | 'ABRIR_MURALHA' 
  | 'ABRIR_MAPA' 
  | 'ABRIR_ESTATISTICAS' 
  | 'BLOQUEAR_SISTEMA' 
  | 'MODO_TACTICO' 
  | 'FECHAR_MODAIS'
  | 'VER_RISCO_CARLOS'
  | 'BLOQUEAR_ATIVOS_PCC';

const COMMAND_MAP: Record<string, TacticalCommand> = {
  'abrir muralha': 'ABRIR_MURALHA',
  'muralha brasileira': 'ABRIR_MURALHA',
  'abrir mapa': 'ABRIR_MAPA',
  'ver território': 'ABRIR_MAPA',
  'abrir estatísticas': 'ABRIR_ESTATISTICAS',
  'ver finanças': 'ABRIR_ESTATISTICAS',
  'bloquear sistema': 'BLOQUEAR_SISTEMA',
  'emergência': 'BLOQUEAR_SISTEMA',
  'modo táctico': 'MODO_TACTICO',
  'visão noturna': 'MODO_TACTICO',
  'fechar tudo': 'FECHAR_MODAIS',
  'limpar tela': 'FECHAR_MODAIS',
  // Expansão: Consultas Específicas
  'risco para carlos eduardo': 'VER_RISCO_CARLOS',
  'mostrar risco carlos': 'VER_RISCO_CARLOS',
  'bloquear ativos pcc': 'BLOQUEAR_ATIVOS_PCC',
  'asfixia pcc': 'BLOQUEAR_ATIVOS_PCC'
};

class VoiceControlService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.lang = 'pt-BR';
      this.recognition.interimResults = false;
    }
  }

  start(onCommand: (cmd: TacticalCommand) => void) {
    if (!this.recognition || this.isListening) return;

    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript.toLowerCase().trim();
      
      console.log('IABS-SIP [VOICE]:', text);

      for (const [phrase, cmd] of Object.entries(COMMAND_MAP)) {
        if (text.includes(phrase)) {
          onCommand(cmd);
          break;
        }
      }
    };

    this.recognition.start();
    this.isListening = true;
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  getStatus() {
    return this.isListening;
  }
}

export const voiceService = new VoiceControlService();
