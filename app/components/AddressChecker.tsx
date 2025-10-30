'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Loader2, MapPin } from 'lucide-react';
import { searchAddress, getNearbyPOIs, type Address, type POI } from '@/app/lib/viennagis-api';
import { analyzePOIs, type RiskAssessment as RiskAssessmentType } from '@/app/utils/poi-checker';
import POIList from './POIList';
import RiskAssessment from './RiskAssessment';
import ViennaGISMap from './ViennaGISMap';

export default function AddressChecker() {
  const t = useTranslations('addressChecker');

  // State
  const [address, setAddress] = useState('');
  const [searchResults, setSearchResults] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [nearbyPOIs, setNearbyPOIs] = useState<POI[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessmentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adresssuche
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults([]);
    setSelectedAddress(null);
    setNearbyPOIs([]);
    setRiskAssessment(null);

    try {
      const results = await searchAddress(address);

      if (results.length === 0) {
        setError(t('search.noResults'));
        return;
      }

      setSearchResults(results);

      // Wenn nur ein Ergebnis, direkt auswählen
      if (results.length === 1) {
        await handleSelectAddress(results[0]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(t('search.error'));
    } finally {
      setLoading(false);
    }
  };

  // Adresse auswählen
  const handleSelectAddress = async (addressData: Address) => {
    setSelectedAddress(addressData);
    setSearchResults([]);
    setLoading(true);
    setError(null);

    try {
      // POIs in der Nähe laden
      const pois = await getNearbyPOIs(
        addressData.coordinates.lng,
        addressData.coordinates.lat,
        200 // 200m Radius
      );

      setNearbyPOIs(pois);

      // Risikobewertung durchführen
      const assessment = analyzePOIs(pois, addressData);
      setRiskAssessment(assessment);
    } catch (err) {
      console.error('POI loading error:', err);
      setError('Fehler beim Laden der Umgebungsdaten.');
    } finally {
      setLoading(false);
    }
  };

  // Neue Suche
  const handleReset = () => {
    setAddress('');
    setSearchResults([]);
    setSelectedAddress(null);
    setNearbyPOIs([]);
    setRiskAssessment(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Suchformular */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="address-input" className="block text-sm font-semibold text-gray-700 mb-2">
              {t('search.label')}
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="address-input"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !address.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('search.searching')}
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    {t('search.button')}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Fehleranzeige */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Mehrere Suchergebnisse */}
        {searchResults.length > 1 && (
          <div className="mt-6">
            <h3 className="font-bold text-gray-900 mb-3">{t('search.multipleResults')}</h3>
            <ul className="space-y-2">
              {searchResults.map((result, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSelectAddress(result)}
                    className="w-full text-left p-4 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <div className="font-medium text-gray-900">{result.fullAddress}</div>
                    <div className="text-sm text-gray-600">
                      {result.postalCode} {result.district}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Ergebnisse */}
      {selectedAddress && !loading && (
        <>
          {/* Ausgewählte Adresse */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedAddress.fullAddress}
                </h2>
                <p className="text-gray-600">
                  {selectedAddress.postalCode} Wien, {selectedAddress.district}. Bezirk
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                {t('actions.newCheck')}
              </button>
            </div>
          </div>

          {/* POI-Liste und Karte Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* POI-Liste */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('pois.title')}
              </h2>
              <POIList pois={nearbyPOIs} />
            </div>

            {/* Karte */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('map.title')}
              </h2>
              <ViennaGISMap address={selectedAddress} pois={nearbyPOIs} />
              <p className="text-xs text-gray-500 mt-2">
                {t('map.attribution')}
              </p>
            </div>
          </div>

          {/* Risikobewertung */}
          {riskAssessment && (
            <RiskAssessment assessment={riskAssessment} address={selectedAddress} />
          )}
        </>
      )}

      {/* Loading State */}
      {selectedAddress && loading && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Analysiere Umgebung...</p>
        </div>
      )}
    </div>
  );
}
