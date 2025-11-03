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
  const [searchRadius, setSearchRadius] = useState(200); // Default: 200m

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

  // POIs laden (helper function)
  const loadPOIs = async (addressData: Address, radius: number) => {
    setLoading(true);
    setError(null);

    try {
      // POIs in der Nähe laden
      const pois = await getNearbyPOIs(
        addressData.coordinates.lng,
        addressData.coordinates.lat,
        radius
      );

      setNearbyPOIs(pois);

      // Risikobewertung durchführen
      const assessment = analyzePOIs(pois);
      setRiskAssessment(assessment);
    } catch (err) {
      console.error('POI loading error:', err);
      setError('Fehler beim Laden der Umgebungsdaten.');
    } finally {
      setLoading(false);
    }
  };

  // Adresse auswählen
  const handleSelectAddress = async (addressData: Address) => {
    setSelectedAddress(addressData);
    setSearchResults([]);
    await loadPOIs(addressData, searchRadius);
  };

  // Radius ändern
  const handleRadiusChange = async (newRadius: number) => {
    setSearchRadius(newRadius);
    if (selectedAddress) {
      await loadPOIs(selectedAddress, newRadius);
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
    <div className="space-y-8">
      {/* Suchformular */}
      <div className="surface-card space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="address-input">{t('search.label')}</label>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--color-muted)]" />
                <input
                  id="address-input"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full pl-12 pr-4"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !address.trim()}
                className="btn btn-primary whitespace-nowrap"
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
          <div
            className="rounded-[var(--radius-sm)] border p-4"
            style={{
              borderColor: 'rgba(182, 61, 61, 0.45)',
              background: 'color-mix(in srgb, var(--color-danger) 12%, white 88%)',
            }}
          >
            <p style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {/* Mehrere Suchergebnisse */}
        {searchResults.length > 1 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[color:var(--color-fg)]">{t('search.multipleResults')}</h3>
            <ul className="space-y-2">
              {searchResults.map((result, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSelectAddress(result)}
                    className="w-full text-left rounded-[var(--radius-sm)] border border-[color:var(--color-border)] px-4 py-3 transition hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-soft)] focus:outline-none"
                    style={{ background: 'var(--color-surface)' }}
                  >
                    <div className="font-medium text-[color:var(--color-fg)]">{result.fullAddress}</div>
                    <div className="text-sm text-[color:var(--color-muted)]">
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
          <div className="surface-card space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[color:var(--color-fg)]">
                  {selectedAddress.fullAddress}
                </h2>
                <p className="text-[color:var(--color-muted)]">
                  {selectedAddress.postalCode} Wien, {selectedAddress.district}. Bezirk
                </p>
              </div>
              <button onClick={handleReset} className="btn btn-ghost whitespace-nowrap">
                {t('actions.newCheck')}
              </button>
            </div>
          </div>

          {/* Radius-Einstellung */}
          <div className="surface-card space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[color:var(--color-fg)]">Suchradius anpassen</h3>
              <span className="badge badge-accent text-sm font-semibold">{searchRadius}m</span>
            </div>

            <div className="space-y-4">
              <input
                type="range"
                min="100"
                max="500"
                step="50"
                value={searchRadius}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: 'var(--color-accent)' }}
              />

              <div className="flex justify-between text-xs text-[color:var(--color-muted)]">
                <span>100m</span>
                <span>200m</span>
                <span>300m</span>
                <span>400m</span>
                <span>500m</span>
              </div>

              <p className="text-sm text-[color:var(--color-muted)]">
                Zeigt kritische Einrichtungen im Umkreis von {searchRadius} Metern an. Größerer Radius = mehr POIs, umfassendere Analyse.
              </p>
            </div>
          </div>

          {/* POI-Liste und Karte Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* POI-Liste */}
            <div className="surface-card space-y-4">
              <h2 className="text-2xl font-semibold text-[color:var(--color-fg)]">{t('pois.title')}</h2>
              <POIList pois={nearbyPOIs} />
            </div>

            {/* Karte */}
            <div className="surface-card space-y-4">
              <h2 className="text-2xl font-semibold text-[color:var(--color-fg)]">{t('map.title')}</h2>
              <ViennaGISMap address={selectedAddress} pois={nearbyPOIs} />
              <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--color-muted) 70%, white 30%)' }}>
                {t('map.attribution')}
              </p>
            </div>
          </div>

          {/* Risikobewertung */}
          {riskAssessment && <RiskAssessment assessment={riskAssessment} />}
        </>
      )}

      {/* Loading State */}
      {selectedAddress && loading && (
        <div className="surface-card p-12 text-center flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-[color:var(--color-accent)]" />
          <p className="text-[color:var(--color-muted)]">Analysiere Umgebung...</p>
        </div>
      )}
    </div>
  );
}
