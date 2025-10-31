'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, FileDown, Save, AlertCircle } from 'lucide-react';
import FortschrittsAnzeige from './FortschrittsAnzeige';
import SchrittAntragsteller from './schritte/SchrittAntragsteller';
import SchrittStandort from './schritte/SchrittStandort';
import SchrittAntragstyp from './schritte/SchrittAntragstyp';
import SchrittFlaechen from './schritte/SchrittFlaechen';
import SchrittZusammenfassung from './schritte/SchrittZusammenfassung';
import { generiereEinfachesPDF } from './PDFGenerator';
import type { FormularDaten } from './types';

const SCHRITTE = [
  { id: 'antragsteller', icon: '👤' },
  { id: 'standort', icon: '📍' },
  { id: 'antragstyp', icon: '📋' },
  { id: 'flaechen', icon: '📐' },
  { id: 'zusammenfassung', icon: '✓' },
];

export default function FormularWizard() {
  const t = useTranslations('formularAssistent');
  const [aktuellerSchritt, setAktuellerSchritt] = useState(0);
  const [formularDaten, setFormularDaten] = useState<FormularDaten>({
    // Schritt 1: Antragsteller
    name: '',
    kontaktperson: '',
    telefon: '',
    email: '',

    // Schritt 2: Standort
    bezirk: '',
    gemeinde: 'Wien',
    strasse: '',
    grundstueck: '',
    addressCheckerData: null, // Wird vom Adressen-Checker gefüllt

    // Schritt 3: Antragstyp
    typ: '',
    art_der_anlage: '',
    anlagenteile: '',

    // Schritt 4: Flächen
    flaechen_beschreibung: '',
    gesamtflaeche: '',
    anschlussleistung: '',
  });

  // LocalStorage: Auto-Save alle 30 Sekunden
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('formular_entwurf', JSON.stringify({
        daten: formularDaten,
        schritt: aktuellerSchritt,
        zeitstempel: new Date().toISOString()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, [formularDaten, aktuellerSchritt]);

  // LocalStorage: Wiederherstellen beim Laden
  useEffect(() => {
    const entwurf = localStorage.getItem('formular_entwurf');
    if (entwurf) {
      try {
        const { daten, schritt } = JSON.parse(entwurf);
        const wiederherstellen = window.confirm(t('entwurfGefunden'));
        if (wiederherstellen) {
          setFormularDaten(daten);
          setAktuellerSchritt(schritt);
        } else {
          localStorage.removeItem('formular_entwurf');
        }
      } catch (error) {
        console.error('Fehler beim Wiederherstellen:', error);
      }
    }
  }, [t]);

  const handleChange = (feld: keyof FormularDaten, wert: any) => {
    setFormularDaten(prev => ({
      ...prev,
      [feld]: wert
    }));
  };

  const naechsterSchritt = () => {
    if (aktuellerSchritt < SCHRITTE.length - 1) {
      setAktuellerSchritt(aktuellerSchritt + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const vorherigerSchritt = () => {
    if (aktuellerSchritt > 0) {
      setAktuellerSchritt(aktuellerSchritt - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePDFErstellen = async () => {
    try {
      await generiereEinfachesPDF(formularDaten);
      // Erfolgreiche Erstellung - Entwurf löschen
      localStorage.removeItem('formular_entwurf');
      alert(t('pdfErfolgreich'));
    } catch (error) {
      console.error('Fehler bei PDF-Generierung:', error);
      alert(t('pdfFehler'));
    }
  };

  const handleEntwurfSpeichern = () => {
    localStorage.setItem('formular_entwurf', JSON.stringify({
      daten: formularDaten,
      schritt: aktuellerSchritt,
      zeitstempel: new Date().toISOString()
    }));
    alert(t('entwurfGespeichert'));
  };

  // Validierung für aktuellen Schritt
  const istSchrittValid = (): boolean => {
    switch (aktuellerSchritt) {
      case 0: // Antragsteller
        return !!(formularDaten.name && formularDaten.kontaktperson && formularDaten.telefon && formularDaten.email);
      case 1: // Standort
        return !!(formularDaten.bezirk && formularDaten.strasse && formularDaten.grundstueck);
      case 2: // Antragstyp
        return !!(formularDaten.typ && formularDaten.art_der_anlage && formularDaten.anlagenteile);
      case 3: // Flächen
        return !!(formularDaten.flaechen_beschreibung && formularDaten.gesamtflaeche && formularDaten.anschlussleistung);
      default:
        return true;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {t('titel')}
        </h1>
        <p className="text-gray-600 mb-4">
          {t('beschreibung')}
        </p>

        {/* Disclaimer */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900">
              {t('disclaimer')}
            </p>
          </div>
        </div>
      </div>

      {/* Fortschrittsanzeige */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
        <FortschrittsAnzeige
          schritte={SCHRITTE}
          aktuellerSchritt={aktuellerSchritt}
          onSchrittClick={(index) => {
            // Nur zu bereits besuchten Schritten springen
            if (index <= aktuellerSchritt) {
              setAktuellerSchritt(index);
            }
          }}
        />
      </div>

      {/* Haupt-Formular */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
        {aktuellerSchritt === 0 && (
          <SchrittAntragsteller
            daten={formularDaten}
            onChange={handleChange}
          />
        )}
        {aktuellerSchritt === 1 && (
          <SchrittStandort
            daten={formularDaten}
            onChange={handleChange}
          />
        )}
        {aktuellerSchritt === 2 && (
          <SchrittAntragstyp
            daten={formularDaten}
            onChange={handleChange}
          />
        )}
        {aktuellerSchritt === 3 && (
          <SchrittFlaechen
            daten={formularDaten}
            onChange={handleChange}
          />
        )}
        {aktuellerSchritt === 4 && (
          <SchrittZusammenfassung
            daten={formularDaten}
            onZurueck={() => setAktuellerSchritt(0)}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-3">
          <button
            onClick={handleEntwurfSpeichern}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {t('entwurfSpeichern')}
          </button>
        </div>

        <div className="flex gap-3">
          {aktuellerSchritt > 0 && (
            <button
              onClick={vorherigerSchritt}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              {t('zurueck')}
            </button>
          )}

          {aktuellerSchritt < SCHRITTE.length - 1 ? (
            <button
              onClick={naechsterSchritt}
              disabled={!istSchrittValid()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {t('weiter')}
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handlePDFErstellen}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              <FileDown className="w-5 h-5" />
              {t('pdfErstellen')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
