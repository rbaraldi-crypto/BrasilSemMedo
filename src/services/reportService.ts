import { logger } from '@/lib/logger';

/**
 * reportService: Refatorado para Dynamic Imports (P2)
 * Fix: Substituído console.error por logger + tipo explícito nos handlers.
 */

export const reportService = {
  async generateCaptureDossier(target: { name: string; id: string; match: string; location: string }, unit: { callsign: string; type: string; lat: number; lng: number }) {
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const slate = [15, 23, 42];
    const success = [34, 197, 94];

    doc.setFillColor(slate[0], slate[1], slate[2]);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('IABS-SIP: ORDEM DE CAPTURA TÁTICA', 15, 20);
    
    doc.setFontSize(8);
    doc.text('PROGRAMA BRASIL SEM MEDO - PROTOCOLO DE INTERCEPTAÇÃO GEOESPACIAL', 15, 28);
    doc.text(`ID OPERAÇÃO: ${Math.random().toString(36).toUpperCase().substr(2, 12)}`, 15, 33);
    doc.text(`EMISSÃO: ${new Date().toLocaleString()}`, 15, 38);

    doc.setDrawColor(success[0], success[1], success[2]);
    doc.setLineWidth(0.8);
    doc.circle(175, 75, 18, 'S');
    doc.setTextColor(success[0], success[1], success[2]);
    doc.setFontSize(7);
    doc.text('ASSINADO DIGITALMENTE', 160, 72);
    doc.text('ICP-BRASIL', 168, 76);
    doc.text('VALIDADE JURÍDICA', 162, 80);

    doc.setTextColor(slate[0], slate[1], slate[2]);
    doc.setFontSize(12);
    doc.text('1. IDENTIFICAÇÃO DO ALVO DETECTADO', 15, 60);
    doc.line(15, 62, 140, 62);
    doc.setFontSize(10);
    doc.text(`Nome Completo: ${target.name}`, 15, 72);
    doc.text(`ID IABS-SIP: ${target.id}`, 15, 79);
    doc.text(`Confiança Biométrica: ${target.match}`, 15, 86);
    doc.text(`Localização GPS: ${target.location}`, 15, 93);
    
    doc.setFontSize(12);
    doc.text('2. UNIDADE DE RESPOSTA DESIGNADA', 15, 115);
    doc.line(15, 117, 195, 117);
    doc.setFontSize(10);
    doc.text(`Indicativo de Chamada: ${unit.callsign}`, 15, 127);
    doc.text(`Tipo de Unidade: ${unit.type}`, 15, 134);
    doc.text(`Coordenadas da Unidade: ${unit.lat.toFixed(6)}, ${unit.lng.toFixed(6)}`, 15, 141);
    doc.text(`Status da Missão: ORDEM DE INTERCEPTAÇÃO IMEDIATA`, 15, 148);

    doc.setFillColor(245, 245, 245);
    doc.rect(15, 165, 180, 40, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('TERMO DE ATUAÇÃO: Esta ordem é emitida sob a égide do Programa Brasil Sem Medo.', 20, 175);
    doc.text('O uso de força deve ser proporcional e estritamente necessário para a captura.', 20, 180);
    doc.text('A assinatura digital ICP-Brasil garante a integridade e a não-repudiação desta ordem.', 20, 185);

    doc.save(`Ordem_Captura_ICP_${target.id}.pdf`);
    logger.info('ReportService', `Dossiê de captura gerado: ${target.id}`);
  },

  async generateFinancialDossier(element: HTMLElement, summary: { totalBlocked: string; totalInvestment: string; roi: string }) {
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#020617' });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(11, 60, 93);
    pdf.rect(0, 0, pdfWidth, 60, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text('DOSSIÊ DE ASFIXIA FINANCEIRA', 15, 25);
    pdf.setFontSize(10);
    pdf.text('PROGRAMA BRASIL SEM MEDO - RELATÓRIO ESTRATÉGICO SISBAJUD', 15, 35);

    pdf.setTextColor(11, 60, 93);
    pdf.setFontSize(14);
    pdf.text('SUMÁRIO EXECUTIVO', 15, 75);
    pdf.setFontSize(10);
    pdf.text(`Total Bloqueado: ${summary.totalBlocked}`, 15, 85);
    pdf.text(`Investimento (Ponto 8): ${summary.totalInvestment}`, 15, 92);
    pdf.text(`ROI de Segurança: ${summary.roi}`, 15, 99);

    const imgWidth = pdfWidth - 30;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 15, 110, imgWidth, imgHeight);

    pdf.save(`Dossie_Financeiro_Ministerial_${new Date().getTime()}.pdf`);
    logger.info('ReportService', 'Dossiê financeiro ministerial gerado');
  },

  async generateMinisterialRoadmapReport(roadmapData: { id: number; eixo: string; status: string }[]) {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF('p', 'mm', 'a4');

    doc.setFillColor(11, 60, 93);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('AUDITORIA ESTRATÉGICA: 12 PONTOS', 15, 20);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    let y = 60;
    roadmapData.forEach((item) => {
      doc.text(`${item.id}. ${item.eixo}`, 15, y);
      doc.text(`Status: ${item.status}`, 140, y);
      doc.line(15, y + 2, 195, y + 2);
      y += 15;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.save('Auditoria_Brasil_Sem_Medo.pdf');
    logger.info('ReportService', 'Relatório de auditoria gerado');
  }
};
