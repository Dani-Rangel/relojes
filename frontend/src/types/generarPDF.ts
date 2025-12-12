// src/utils/generarPDF.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generarPDF = async (elementId: string, filename = 'factura.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Elemento con ID "${elementId}" no encontrado`);

    // ✅ html2canvas sin `scale`, solo con opciones compatibles
    const canvas = await html2canvas(element, {
      useCORS: true,
      logging: false,
      // 👇 Sin `scale` → evita el error de TypeScript
    });

    // ✅ Escalado manual (más confiable y compatible)
    const scale = 2;
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = canvas.width * scale;
    scaledCanvas.height = canvas.height * scale;
    const ctx = scaledCanvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo obtener contexto 2D');
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height);

    const imgData = scaledCanvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width
    const pageHeight = 297; // A4 height
    const imgHeight = (scaledCanvas.height * imgWidth) / scaledCanvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar el PDF. Ver consola para más detalles.');
  }
};