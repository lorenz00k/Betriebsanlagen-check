'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle, Edit, User, MapPin, FileText, Ruler, AlertTriangle } from 'lucide-react';
import AutoGrid from '@/components/ui/AutoGrid';
import BreakText from '@/components/ui/BreakText';
import type { FormularDaten } from '../types';

interface SchrittZusammenfassungProps {
  daten: FormularDaten;
  onZurueck: () => void;
}

export default function SchrittZusammenfassung({ daten, onZurueck }: SchrittZusammenfassungProps) {
  const t = useTranslations('formularAssistent.schritte.zusammenfassung');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 min-w-0">
            <BreakText className="block">{t('titel')}</BreakText>
          </h2>
          <BreakText className="block text-gray-600">{t('beschreibung')}</BreakText>
        </div>
      </div>

      {/* Antragsteller */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900 min-w-0">
              <BreakText className="block">Antragsteller</BreakText>
            </h3>
          </div>
          <button
            onClick={onZurueck}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <Edit className="w-4 h-4" />
            <BreakText>Bearbeiten</BreakText>
          </button>
        </div>
        <AutoGrid min="18rem" className="gap-y-4 text-sm">
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">Name und Anschrift</BreakText>
            <BreakText className="text-gray-600 mt-1 block">{daten.name || '-'}</BreakText>
          </div>
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">Kontaktperson</BreakText>
            <BreakText className="text-gray-600 mt-1 block">{daten.kontaktperson || '-'}</BreakText>
          </div>
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">Telefon</BreakText>
            <BreakText className="text-gray-600 mt-1 block">{daten.telefon || '-'}</BreakText>
          </div>
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">E-Mail</BreakText>
            <BreakText className="text-gray-600 mt-1 block">{daten.email || '-'}</BreakText>
          </div>
        </AutoGrid>
      </div>

      {/* Standort */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4 min-w-0">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900 min-w-0">
            <BreakText className="block">Standort</BreakText>
          </h3>
        </div>
        <AutoGrid min="18rem" className="gap-y-4 text-sm">
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">Bezirk</BreakText>
            <BreakText className="text-gray-600 mt-1 block">{daten.bezirk ? `${daten.bezirk}. Bezirk` : '-'}</BreakText>
          </div>
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">Straße, Hausnummer</BreakText>
            <BreakText className="text-gray-600 mt-1 block">{daten.strasse || '-'}</BreakText>
          </div>
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">Grundstücksnummer</BreakText>
            <BreakText className="text-gray-600 mt-1 block">{daten.grundstueck || '-'}</BreakText>
          </div>
        </AutoGrid>

        {/* Risikobewertung falls vorhanden */}
        {daten.addressCheckerData && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              daten.addressCheckerData.riskAssessment.overallRisk === 'high'
                ? 'bg-red-50 text-red-900'
                : daten.addressCheckerData.riskAssessment.overallRisk === 'medium'
                ? 'bg-amber-50 text-amber-900'
                : 'bg-green-50 text-green-900'
            }`}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <BreakText className="text-sm">
                <span className="font-semibold">Umgebungsanalyse:</span>{' '}
                {daten.addressCheckerData.pois.length} kritische Einrichtung(en) im Umkreis • Risiko:{' '}
                {daten.addressCheckerData.riskAssessment.overallRisk === 'high' ? 'Hoch' :
                 daten.addressCheckerData.riskAssessment.overallRisk === 'medium' ? 'Mittel' : 'Gering'}
              </BreakText>
            </div>
          </div>
        )}
      </div>

      {/* Antragstyp */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4 min-w-0">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900 min-w-0">
            <BreakText className="block">Antragstyp</BreakText>
          </h3>
        </div>
        <div className="space-y-4 text-sm">
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">Art des Antrags</BreakText>
            <BreakText className="text-gray-600 mt-1 block">
              {daten.typ === 'neu' ? 'Errichtung und Betrieb einer neuen Betriebsanlage' :
               daten.typ === 'aenderung' ? 'Änderung einer bestehenden genehmigten Betriebsanlage' : '-'}
            </BreakText>
          </div>
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">Art der Anlage</BreakText>
            <BreakText className="text-gray-600 mt-1 block">{daten.art_der_anlage || '-'}</BreakText>
          </div>
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">Anlagenteile und Tätigkeiten</BreakText>
            <BreakText className="text-gray-600 mt-1 block whitespace-pre-wrap">{daten.anlagenteile || '-'}</BreakText>
          </div>
        </div>
      </div>

      {/* Flächen */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4 min-w-0">
          <Ruler className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900 min-w-0">
            <BreakText className="block">Betriebsflächen</BreakText>
          </h3>
        </div>
        <div className="space-y-4 text-sm">
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">Beschreibung der Flächen</BreakText>
            <BreakText className="text-gray-600 mt-1 block whitespace-pre-wrap font-mono text-xs bg-gray-50 p-3 rounded">
              {daten.flaechen_beschreibung || '-'}
            </BreakText>
          </div>
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">Gesamte Fläche</BreakText>
            <BreakText className="text-gray-600 mt-1 block">
              {daten.gesamtflaeche ? `${daten.gesamtflaeche} m²` : '-'}
            </BreakText>
          </div>
          <div className="min-w-0">
            <BreakText className="font-semibold text-gray-700 block">Elektrische Anschlussleistung</BreakText>
            <BreakText className="text-gray-600 mt-1 block">
              {daten.anschlussleistung === 'unter300' ? 'Unter 300 Kilowatt (vereinfachtes Verfahren möglich)' :
               daten.anschlussleistung === 'ueber300' ? 'Über 300 Kilowatt (normales Verfahren erforderlich)' :
               daten.anschlussleistung === 'keine' ? 'Keine Maschinen oder Geräte vorhanden' : '-'}
            </BreakText>
          </div>
        </div>
      </div>

      {/* Hinweis */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <BreakText className="text-sm text-blue-900 block">
          💡 <strong>Tipp:</strong> Überprüfen Sie alle Angaben sorgfältig. Sie können jederzeit zurück zu den einzelnen Schritten gehen, um Änderungen vorzunehmen. Mit Klick auf &quot;PDF erstellen & herunterladen&quot; wird das ausgefüllte Formular als PDF generiert.
        </BreakText>
      </div>
    </div>
  );
}
