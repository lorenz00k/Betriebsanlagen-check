'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Search, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { searchAddress, getNearbyPOIs } from '@/app/lib/viennagis-api';
import { analyzePOIs } from '@/app/utils/poi-checker';
import type { FormularDaten } from '../types';
import type { Address } from '@/app/lib/viennagis-api';
import ViennaGISMap from '@/app/components/ViennaGISMap';
import POIList from '@/app/components/POIList';

interface SchrittStandortProps {
  daten: FormularDaten;
  onChange: (feld: keyof FormularDaten, wert: any) => void;
}

export default function SchrittStandort({ daten, onChange }: SchrittStandortProps) {
  const t = useTranslations('formularAssistent.schritte.standort');
  const [adresssuche, setAdresssuche] = useState('');
  const [suchergebnisse, setSuchergebnisse] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddressChecker, setShowAddressChecker] = useState(false);

  const handleAdresssuche = async () => {
    if (!adresssuche.trim()) return;

    setLoading(true);
    try {
      const results = await searchAddress(adresssuche);
      setSuchergebnisse(results);
    } catch (error) {
      console.error('Adresssuche fehlgeschlagen:', error);
      alert('Fehler bei der Adresssuche');
    } finally {
      setLoading(false);
    }
  };

  const handleAdresseAuswaehlen = async (address: Address) => {
    // Adressdaten ins Formular übernehmen
    onChange('bezirk', address.district);
    onChange('strasse', `${address.street} ${address.houseNumber}`);

    // POIs laden und Risikobewertung durchführen
    setLoading(true);
    try {
      const pois = await getNearbyPOIs(address.coordinates.lng, address.coordinates.lat, 200);
      const riskAssessment = analyzePOIs(pois, address);

      // Alles im addressCheckerData speichern
      onChange('addressCheckerData', {
        address,
        pois,
        riskAssessment
      });

      setShowAddressChecker(true);
      setSuchergebnisse([]);
    } catch (error) {
      console.error('POI-Analyse fehlgeschlagen:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <MapPin className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('titel')}</h2>
          <p className="text-gray-600">{t('beschreibung')}</p>
        </div>
      </div>

      {/* Adresssuche */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Adresse automatisch finden
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={adresssuche}
            onChange={(e) => setAdresssuche(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdresssuche()}
            placeholder="z.B. Rathausstraße 1, 1010 Wien"
            className="flex-1 px-4 py-2 border-2 border-blue-300 rounded-lg focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleAdresssuche}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Suchen
          </button>
        </div>

        {/* Suchergebnisse */}
        {suchergebnisse.length > 0 && (
          <div className="mt-3 space-y-2">
            {suchergebnisse.map((result, index) => (
              <button
                key={index}
                onClick={() => handleAdresseAuswaehlen(result)}
                className="w-full text-left p-3 bg-white border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all"
              >
                <div className="font-medium text-gray-900">{result.fullAddress}</div>
                <div className="text-sm text-gray-600">{result.postalCode} {result.district}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bezirk */}
      <div>
        <label htmlFor="bezirk" className="block text-sm font-semibold text-gray-700 mb-2">
          {t('felder.bezirk.label')} <span className="text-red-500">*</span>
        </label>
        <select
          id="bezirk"
          value={daten.bezirk}
          onChange={(e) => onChange('bezirk', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          required
        >
          <option value="">Bitte wählen</option>
          {Array.from({ length: 23 }, (_, i) => i + 1).map(bezirk => (
            <option key={bezirk} value={bezirk.toString()}>
              {bezirk}. Bezirk
            </option>
          ))}
        </select>
      </div>

      {/* Straße */}
      <div>
        <label htmlFor="strasse" className="block text-sm font-semibold text-gray-700 mb-2">
          {t('felder.strasse.label')} <span className="text-red-500">*</span>
        </label>
        <input
          id="strasse"
          type="text"
          value={daten.strasse}
          onChange={(e) => onChange('strasse', e.target.value)}
          placeholder={t('felder.strasse.platzhalter')}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          required
        />
      </div>

      {/* Grundstück */}
      <div>
        <label htmlFor="grundstueck" className="block text-sm font-semibold text-gray-700 mb-2">
          {t('felder.grundstueck.label')} <span className="text-red-500">*</span>
        </label>
        <input
          id="grundstueck"
          type="text"
          value={daten.grundstueck}
          onChange={(e) => onChange('grundstueck', e.target.value)}
          placeholder={t('felder.grundstueck.platzhalter')}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          required
        />
        <p className="mt-1.5 text-sm text-gray-600">
          {t('felder.grundstueck.hilfe')}
        </p>
      </div>

      {/* Adressen-Checker Ergebnisse */}
      {showAddressChecker && daten.addressCheckerData && (
        <div className="mt-8 space-y-6">
          {/* Risiko-Badge */}
          <div className={`p-4 rounded-lg border-2 ${
            daten.addressCheckerData.riskAssessment.overallRisk === 'high'
              ? 'bg-red-50 border-red-300'
              : daten.addressCheckerData.riskAssessment.overallRisk === 'medium'
              ? 'bg-amber-50 border-amber-300'
              : 'bg-green-50 border-green-300'
          }`}>
            <div className="flex items-center gap-3">
              {daten.addressCheckerData.riskAssessment.overallRisk === 'high' ? (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              ) : daten.addressCheckerData.riskAssessment.overallRisk === 'medium' ? (
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
              <div>
                <h4 className="font-bold text-gray-900">Umgebungsanalyse für Ihren Standort</h4>
                <p className="text-sm text-gray-700">
                  Risikobewertung: <span className="font-semibold">
                    {daten.addressCheckerData.riskAssessment.overallRisk === 'high' ? 'Hoch' :
                     daten.addressCheckerData.riskAssessment.overallRisk === 'medium' ? 'Mittel' : 'Gering'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Karte */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Standortkarte</h4>
            <ViennaGISMap
              address={daten.addressCheckerData.address}
              pois={daten.addressCheckerData.pois}
            />
          </div>

          {/* POI-Liste */}
          {daten.addressCheckerData.pois.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3">
                Kritische Einrichtungen in der Nähe ({daten.addressCheckerData.pois.length})
              </h4>
              <POIList pois={daten.addressCheckerData.pois} />
            </div>
          )}

          {/* Warnungen */}
          {daten.addressCheckerData.riskAssessment.warnings.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <h4 className="font-bold text-amber-900 mb-2">⚠️ Wichtige Hinweise:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-900">
                {daten.addressCheckerData.riskAssessment.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Empfehlungen */}
          {daten.addressCheckerData.riskAssessment.recommendations.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <h4 className="font-bold text-blue-900 mb-2">💡 Empfehlungen:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-900">
                {daten.addressCheckerData.riskAssessment.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
