'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Loader2, MapPin, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  searchAddress,
  getNearbyPOIs,
  getZoningInfo,
  getBuildingPlanInfo,
  type Address,
  type POI,
  type ZoningInfo,
  type BuildingPlanInfo
} from '@/app/lib/viennagis-api';
import { analyzeEnvironment, type EnvironmentAnalysis } from '@/app/utils/poi-checker';
import ViennaGISMap from './ViennaGISMap';
import AutoGrid from '@/components/ui/AutoGrid';
import BreakText from '@/components/ui/BreakText';

export default function AddressChecker() {
  const t = useTranslations('addressChecker');

  // State
  const [address, setAddress] = useState('');
  const [searchResults, setSearchResults] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [nearbyPOIs, setNearbyPOIs] = useState<POI[]>([]);
  const [environmentAnalysis, setEnvironmentAnalysis] = useState<EnvironmentAnalysis | null>(null);
  const [zoningInfo, setZoningInfo] = useState<ZoningInfo | null>(null);
  const [buildingPlanInfo, setBuildingPlanInfo] = useState<BuildingPlanInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState(200); // Default: 200m
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set()); // Welche POI-Gruppen sind ausgeklappt

  // Adresssuche
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults([]);
    setSelectedAddress(null);
    setNearbyPOIs([]);
    setEnvironmentAnalysis(null);
    setZoningInfo(null);
    setBuildingPlanInfo(null);

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

  // Alle Umgebungsdaten laden (helper function)
  const loadEnvironmentData = async (addressData: Address, radius: number) => {
    setLoading(true);
    setError(null);

    try {
      const { lng, lat } = addressData.coordinates;

      // Alle Daten parallel laden
      const [pois, zoning, buildingPlan] = await Promise.all([
        getNearbyPOIs(lng, lat, radius),
        getZoningInfo(lng, lat),
        getBuildingPlanInfo(lng, lat)
      ]);

      setNearbyPOIs(pois);
      setZoningInfo(zoning);
      setBuildingPlanInfo(buildingPlan);

      // Umgebungsanalyse durchführen
      const analysis = analyzeEnvironment(pois);
      setEnvironmentAnalysis(analysis);
    } catch (err) {
      console.error('Environment data loading error:', err);
      setError('Fehler beim Laden der Umgebungsdaten.');
    } finally {
      setLoading(false);
    }
  };

  // Adresse auswählen
  const handleSelectAddress = async (addressData: Address) => {
    setSelectedAddress(addressData);
    setSearchResults([]);
    await loadEnvironmentData(addressData, searchRadius);
  };

  // Radius ändern
  const handleRadiusChange = async (newRadius: number) => {
    setSearchRadius(newRadius);
    if (selectedAddress) {
      await loadEnvironmentData(selectedAddress, newRadius);
    }
  };

  // Neue Suche
  const handleReset = () => {
    setAddress('');
    setSearchResults([]);
    setSelectedAddress(null);
    setNearbyPOIs([]);
    setEnvironmentAnalysis(null);
    setZoningInfo(null);
    setBuildingPlanInfo(null);
    setError(null);
    setExpandedGroups(new Set());
  };

  // POI-Gruppe ein/ausklappen
  const toggleGroup = (category: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Suchformular */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-3">
            <label htmlFor="address-input" className="block text-sm font-semibold text-gray-700">
              <BreakText>{t('search.label')}</BreakText>
            </label>
            <AutoGrid min="18rem" className="items-start">
              <div className="relative min-w-0">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="address-input"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="input-with-icon w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            </AutoGrid>
          </div>
        </form>

        {/* Fehleranzeige */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <BreakText className="text-red-800 font-medium block">{error}</BreakText>
          </div>
        )}

        {/* Mehrere Suchergebnisse */}
        {searchResults.length > 1 && (
          <div className="mt-6">
            <h3 className="font-bold text-gray-900 mb-3 min-w-0">
              <BreakText className="block">{t('search.multipleResults')}</BreakText>
            </h3>
            <ul className="space-y-2">
              {searchResults.map((result, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSelectAddress(result)}
                    className="w-full text-left p-4 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <div className="font-medium text-gray-900 min-w-0">
                      <BreakText className="block">{result.fullAddress}</BreakText>
                    </div>
                    <div className="text-sm text-gray-600 min-w-0">
                      <BreakText className="block">{result.postalCode} {result.district}</BreakText>
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
          {/* Zusammenfassungs-Card */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 min-w-0">
                    <BreakText className="block">{selectedAddress.fullAddress}</BreakText>
                  </h2>
                  <BreakText className="text-gray-600 block">
                    {selectedAddress.postalCode} Wien, {selectedAddress.district}
                  </BreakText>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-lg font-medium transition-colors flex-shrink-0"
              >
                <BreakText>{t('actions.newCheck')}</BreakText>
              </button>
            </div>

            {/* Zusammenfassung */}
            {environmentAnalysis && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-800 font-medium">
                  {environmentAnalysis.summary}
                </p>
              </div>
            )}
          </div>

          {/* Flächenwidmung & Bebauungsplan */}
          {(zoningInfo?.found || buildingPlanInfo?.found) && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Flächenwidmung & Bebauung
                </h3>
              </div>

              <AutoGrid min="20rem" className="gap-4">
                {/* Flächenwidmung */}
                {zoningInfo?.found && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <h4 className="font-semibold text-purple-900 mb-2">Widmung</h4>
                    <p className="text-lg font-bold text-purple-800 mb-1">{zoningInfo.widmung}</p>
                    {zoningInfo.widmungCode && (
                      <p className="text-sm text-purple-700 mb-2">Code: {zoningInfo.widmungCode}</p>
                    )}
                    <p className="text-sm text-gray-700">{zoningInfo.details}</p>
                  </div>
                )}

                {/* Bebauungsplan */}
                {buildingPlanInfo?.found && (
                  <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                    <h4 className="font-semibold text-pink-900 mb-2">Bebauung</h4>
                    <div className="space-y-1 text-sm">
                      {buildingPlanInfo.bauklasse && (
                        <p className="text-gray-800">
                          <span className="font-medium">Bauklasse:</span> {buildingPlanInfo.bauklasse}
                        </p>
                      )}
                      {buildingPlanInfo.bebauungsdichte && (
                        <p className="text-gray-800">
                          <span className="font-medium">Bebauungsdichte:</span> {buildingPlanInfo.bebauungsdichte}%
                        </p>
                      )}
                      {buildingPlanInfo.bauhoehe && (
                        <p className="text-gray-800">
                          <span className="font-medium">Bauhöhe:</span> {buildingPlanInfo.bauhoehe}m
                        </p>
                      )}
                      <p className="text-gray-700 mt-2">{buildingPlanInfo.details}</p>
                    </div>
                  </div>
                )}
              </AutoGrid>

              {/* Hinweis für Gewerbenutzung */}
              {zoningInfo?.found && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Die Widmung &ldquo;{zoningInfo.widmung}&rdquo; gibt Hinweise auf mögliche Nutzungseinschränkungen.
                      Kontaktieren Sie die MA 36 für Details zur gewerblichen Nutzbarkeit.
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Radius-Einstellung */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Suchradius anpassen
              </h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                {searchRadius}m
              </span>
            </div>

            <div className="space-y-4">
              <input
                type="range"
                min="100"
                max="500"
                step="50"
                value={searchRadius}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <div className="flex justify-between text-xs text-gray-600">
                <span>100m</span>
                <span>200m</span>
                <span>300m</span>
                <span>400m</span>
                <span>500m</span>
              </div>

              <BreakText className="text-sm text-gray-600 block">
                Zeigt Einrichtungen im Umkreis von {searchRadius} Metern an. Größerer Radius = umfassendere Analyse.
              </BreakText>
            </div>
          </div>

          {/* Karte */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 min-w-0">
              <BreakText className="block">Standort & Umgebung</BreakText>
            </h2>
            <ViennaGISMap address={selectedAddress} pois={nearbyPOIs} />
            <BreakText className="text-xs text-gray-500 mt-2 block">
              Datenquelle: Stadt Wien - data.wien.gv.at
            </BreakText>
          </div>

          {/* Umgebungsanalyse */}
          {environmentAnalysis && environmentAnalysis.poiGroups.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Einrichtungen in der Umgebung
                  </h3>
                  <p className="text-sm text-gray-600">
                    {environmentAnalysis.poiGroups.reduce((sum, g) => sum + g.count, 0)} Einrichtungen gefunden
                  </p>
                </div>
              </div>

              {/* Insights */}
              {environmentAnalysis.insights.length > 0 && (
                <div className="mb-4 space-y-2">
                  {environmentAnalysis.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-800 text-sm">{insight}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* POI-Gruppen (collapsible) */}
              <div className="space-y-3">
                {environmentAnalysis.poiGroups.map((group) => {
                  const isExpanded = expandedGroups.has(group.category);

                  return (
                    <div key={group.category} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleGroup(group.category)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{group.icon}</span>
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-900">
                              {group.label}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {group.count} {group.count === 1 ? 'Einrichtung' : 'Einrichtungen'}
                              {group.nearbyCount > 0 && (
                                <span className="text-orange-600 font-medium ml-1">
                                  ({group.nearbyCount} unter 100m)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <div className="space-y-2">
                            {group.pois.map((poi, idx) => (
                              <div key={idx} className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-gray-900 break-words">{poi.name}</p>
                                  <p className="text-sm text-gray-600 mt-0.5">
                                    {poi.distance.toFixed(0)}m entfernt
                                  </p>
                                </div>
                                {poi.distance < 100 && (
                                  <span className="flex-shrink-0 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">
                                    Sehr nah
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empfehlungen */}
          {environmentAnalysis && environmentAnalysis.recommendations.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Empfehlungen
                </h3>
              </div>

              <div className="space-y-3">
                {environmentAnalysis.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="text-gray-800">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {selectedAddress && loading && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <BreakText className="text-gray-600 block">Analysiere Umgebung...</BreakText>
        </div>
      )}
    </div>
  );
}
