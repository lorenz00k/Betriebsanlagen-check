import jsPDF from 'jspdf';
import type { FormularDaten } from './types';

export async function generiereEinfachesPDF(daten: FormularDaten) {
  const doc = new jsPDF();

  // Hilfsfunktionen
  let y = 20;
  const lineHeight = 7;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);

  const addText = (text: string, size: number = 12, isBold: boolean = false) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(size);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.text(text, margin, y);
    y += lineHeight;
  };

  const addWrappedText = (text: string, size: number = 10) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    for (const line of lines) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight - 1;
    }
  };

  const addSection = (title: string) => {
    y += 5;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(59, 130, 246); // bg-blue-600
    doc.rect(margin, y - 5, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 2, y);
    y += 10;
    doc.setTextColor(0, 0, 0);
  };

  const addField = (label: string, value: string) => {
    if (!value) value = '-';
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', margin, y);
    y += lineHeight - 1;
    addWrappedText(value, 10);
    y += 3;
  };

  // === TITEL ===
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Antrag auf Betriebsanlagengenehmigung', margin, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Stadt Wien', margin, y);
  y += 5;
  doc.text(`Erstellt am: ${new Date().toLocaleDateString('de-AT')}`, margin, y);
  y += 3;
  doc.setTextColor(0, 0, 0);

  // Horizontal line
  y += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // === DISCLAIMER ===
  doc.setFillColor(255, 243, 224); // amber-50
  doc.setDrawColor(245, 158, 11); // amber-500
  doc.setLineWidth(2);
  doc.rect(margin, y - 3, contentWidth, 20, 'FD');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('\u26A0\uFE0F WICHTIGER HINWEIS', margin + 3, y + 2);
  doc.setFont('helvetica', 'normal');
  const disclaimerText = 'Diese Ausf\u00FCllhilfe ist eine unabh\u00E4ngige Serviceleistung und ersetzt keine rechtliche Beratung. F\u00FCr rechtsverbindliche Ausk\u00FCnfte wenden Sie sich bitte an das zust\u00E4ndige Magistratische Bezirksamt.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 6);
  let disclaimerY = y + 8;
  for (const line of disclaimerLines) {
    doc.text(line, margin + 3, disclaimerY);
    disclaimerY += 4;
  }
  y += 25;
  doc.setLineWidth(0.5);

  // === ABSCHNITT 1: ANTRAGSTELLER ===
  addSection('1. Angaben zum Antragsteller');
  addField('Name und Anschrift', daten.name);
  addField('Kontaktdaten der Ansprechperson', daten.kontaktperson);
  addField('Telefonnummer', daten.telefon);
  addField('E-Mail-Adresse', daten.email);

  // === ABSCHNITT 2: STANDORT ===
  addSection('2. Standort der Betriebsanlage');
  addField('Bezirk', daten.bezirk ? `${daten.bezirk}. Bezirk, Wien` : '-');
  addField('Gemeinde', daten.gemeinde);
  addField('Stra\u00DFe, Hausnummer', daten.strasse);
  addField('Grundst\u00FCcksnum mer/n und Katastralgemeinde', daten.grundstueck);

  // Umgebungsanalyse wenn vorhanden
  if (daten.addressCheckerData) {
    y += 3;
    doc.setFillColor(239, 246, 255); // blue-50
    doc.rect(margin, y - 3, contentWidth, 15, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('\uD83D\uDCCD Umgebungsanalyse', margin + 2, y + 2);
    doc.setFont('helvetica', 'normal');
    const riskText = `${daten.addressCheckerData.pois.length} kritische Einrichtung(en) im Umkreis | Risikobewertung: ${
      daten.addressCheckerData.riskAssessment.overallRisk === 'high' ? 'Hoch' :
      daten.addressCheckerData.riskAssessment.overallRisk === 'medium' ? 'Mittel' : 'Gering'
    }`;
    doc.text(riskText, margin + 2, y + 7);

    if (daten.addressCheckerData.riskAssessment.warnings.length > 0) {
      doc.text('Hinweise: ' + daten.addressCheckerData.riskAssessment.warnings[0].substring(0, 100) + '...', margin + 2, y + 11);
    }
    y += 20;
  }

  // === ABSCHNITT 3: ANTRAGSTYP ===
  addSection('3. Art des Antrags');
  const antragstyp = daten.typ === 'neu'
    ? 'Errichtung und Betrieb einer neuen Betriebsanlage'
    : daten.typ === 'aenderung'
    ? '\u00C4nderung einer bestehenden genehmigten Betriebsanlage'
    : '-';
  addField('Art des Antrags', antragstyp);
  addField('Art der Anlage', daten.art_der_anlage);
  addField('Wesentliche Anlagenteile und T\u00E4tigkeiten', daten.anlagenteile);

  // === ABSCHNITT 4: BETRIEBSFL\u00C4CHEN ===
  addSection('4. Betriebsfl\u00E4chen');
  addField('Beschreibung aller gewerblich genutzten Fl\u00E4chen', daten.flaechen_beschreibung);
  addField('Gesamte betrieblich genutzte Fl\u00E4che', daten.gesamtflaeche ? `${daten.gesamtflaeche} m\u00B2` : '-');

  const anschlussText = daten.anschlussleistung === 'unter300'
    ? 'Unter 300 Kilowatt (vereinfachtes Verfahren m\u00F6glich)'
    : daten.anschlussleistung === 'ueber300'
    ? '\u00DCber 300 Kilowatt (normales Verfahren erforderlich)'
    : daten.anschlussleistung === 'keine'
    ? 'Keine Maschinen oder Ger\u00E4te vorhanden'
    : '-';
  addField('Gesamte elektrische Anschlussleistung', anschlussText);

  // === FOOTER ===
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Erstellt mit betriebsanlage-check.at | Unverbindliche Ausf\u00FCllhilfe', margin, 285);
  doc.setTextColor(0, 0, 0);

  // === DOWNLOAD ===
  const filename = `Betriebsanlagen-Antrag_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
