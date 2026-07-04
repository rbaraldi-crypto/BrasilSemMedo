import { tacticalAudio } from '@/lib/audioUtils';

/**
 * Serviço de Notificações Nativas IABS-SIP
 * Gerencia alertas do sistema operacional (Windows/macOS/Linux)
 */

export const notificationService = {
  // Solicita permissão ao usuário
  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("Este navegador não suporta notificações nativas.");
      return false;
    }

    if (Notification.permission === "granted") return true;

    const permission = await Notification.requestPermission();
    return permission === "granted";
  },

  // Verifica status da permissão
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  },

  // Dispara alerta nativo
  sendAlert(title: string, body: string, iconUrl?: string) {
    if (Notification.permission !== "granted") return;

    // Só dispara se o usuário não estiver vendo a aba ou se for crítico
    const notification = new Notification(title, {
      body,
      icon: iconUrl || 'https://i.ibb.co/HLfD5wgf/dualite-favicon.png',
      badge: 'https://i.ibb.co/HLfD5wgf/dualite-favicon.png',
      silent: false, // O áudio será controlado pelo nosso tacticalAudio
      tag: 'iabs-sip-alert'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Reforço sonoro tático
    tacticalAudio.playMatch();
  }
};
