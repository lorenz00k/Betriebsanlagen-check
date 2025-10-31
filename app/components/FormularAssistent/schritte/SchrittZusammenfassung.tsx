'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle, Edit, User, MapPin, FileText, Ruler, AlertTriangle } from 'lucide-react';
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
          <h2 className="text-2xl font-bold text-gray-900">{t('titel')}</h2>
          <p className="text-gray-600">{t('beschreibung')}</p>
        </div>
      </div>

      {/* Antragsteller */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Antragsteller</h3>
          </div>
          <button
            onClick={onZurueck}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <Edit className="w-4 h-4" />
            Bearbeiten
          </button>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-semibold text-gray-700">Name und Anschrift</dt>
            <dd className="text-gray-600 mt-1">{daten.name || '-'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">Kontaktperson</dt>
            <dd className="text-gray-600 mt-1">{daten.kontaktperson || '-'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">Telefon</dt>
            <dd className="text-gray-600 mt-1">{daten.telefon || '-'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">E-Mail</dt>
            <dd className="text-gray-600 mt-1">{daten.email || '-'}</dd>
          </div>
        </dl>
      </div>

      {/* Standort */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Standort</h3>
          </div>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-semibold text-gray-700">Bezirk</dt>
            <dd className="text-gray-600 mt-1">{daten.bezirk ? `${daten.bezirk}. Bezirk` : '-'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">Straße, Hausnummer</dt>
            <dd className="text-gray-600 mt-1">{daten.strasse || '-'}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-semibold text-gray-700">Grundstücksnummer</dt>
            <dd className="text-gray-600 mt-1">{daten.grundstueck || '-'}</dd>
          </div>
        </dl>

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
              <div className="text-sm">
                <span className="font-semibold">Umgebungsanalyse:</span>{' '}
                {daten.addressCheckerData.pois.length} kritische Einrichtung(en) im Umkreis • Risiko:{' '}
                {daten.addressCheckerData.riskAssessment.overallRisk === 'high' ? 'Hoch' :
                 daten.addressCheckerData.riskAssessment.overallRisk === 'medium' ? 'Mittel' : 'Gering'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Antragstyp */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Antragstyp</h3>
          </div>
        </div>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-gray-700">Art des Antrags</dt>
            <dd className="text-gray-600 mt-1">
              {daten.typ === 'neu' ? 'Errichtung und Betrieb einer neuen Betriebsanlage' :
               daten.typ === 'aenderung' ? 'Änderung einer bestehenden genehmigten Betriebsanlage' : '-'}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">Art der Anlage</dt>
            <dd className="text-gray-600 mt-1">{daten.art_der_anlage || '-'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">Anlagenteile und Tätigkeiten</dt>
            <dd className="text-gray-600 mt-1 whitespace-pre-wrap">{daten.anlagenteile || '-'}</dd>
          </div>
        </dl>
      </div>

      {/* Flächen */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Betriebsflächen</h3>
          </div>
        </div>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-gray-700">Beschreibung der Flächen</dt>
            <dd className="text-gray-600 mt-1 whitespace-pre-wrap font-mono text-xs bg-gray-50 p-3 rounded">
              {daten.flaechen_beschreibung || '-'}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">Gesamte Fläche</dt>
            <dd className="text-gray-600 mt-1">
              {daten.gesamtflaeche ? `${daten.gesamtflaeche} m²` : '-'}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">Elektrische Anschlussleistung</dt>
            <dd className="text-gray-600 mt-1">
              {daten.anschlussleistung === 'unter300' ? 'Unter 300 Kilowatt (vereinfachtes Verfahren möglich)' :
               daten.anschlussleistung === 'ueber300' ? 'Über 300 Kilowatt (normales Verfahren erforderlich)' :
               daten.anschlussleistung === 'keine' ? 'Keine Maschinen oder Geräte vorhanden' : '-'}
            </dd>
          </div>
        </dl>
      </div>

      {/* Hinweis */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Tipp:</strong> Überprüfen Sie alle Angaben sorgfältig. Sie können jederzeit zurück zu den einzelnen Schritten gehen, um Änderungen vorzunehmen. Mit Klick auf "PDF erstellen & herunterladen" wird das ausgefüllte Formular als PDF generiert.
        </p>
      </div>
    </div>
  );
}
