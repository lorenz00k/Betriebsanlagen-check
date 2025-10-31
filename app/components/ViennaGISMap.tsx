'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import type { Address, POI } from '@/app/lib/viennagis-api';
import { ExternalLink } from 'lucide-react';
import { getPOIIcon, getPOILabel, getPOIRiskLevel } from '@/app/utils/poi-checker';
import 'leaflet/dist/leaflet.css';

interface ViennaGISMapProps {
  address: Address;
  pois: POI[];
}

export default function ViennaGISMap({ address, pois }: ViennaGISMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Dynamic import for Leaflet (client-side only)
    import('leaflet').then((L) => {
      // Clean up existing map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      if (!mapContainerRef.current) return;

      // Create map centered on address
      const map = L.map(mapContainerRef.current).setView(
        [address.coordinates.lat, address.coordinates.lng],
        16
      );

      mapRef.current = map;

      // Add OpenStreetMap tiles (free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Create custom icon for address marker (blue)
      const addressIcon = L.divIcon({
        html: `<div style="background-color: #2563eb; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;">📍</div>`,
        className: 'custom-address-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      // Add address marker
      const addressMarker = L.marker(
        [address.coordinates.lat, address.coordinates.lng],
        { icon: addressIcon }
      ).addTo(map);

      addressMarker.bindPopup(
        `<div style="text-align: center; min-width: 150px;">
          <div style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">Ihre Adresse</div>
          <div style="font-size: 12px; color: #666;">${address.fullAddress}</div>
        </div>`
      );

      // Add POI markers
      pois.forEach((poi) => {
        const riskLevel = getPOIRiskLevel(poi.type);
        const icon = getPOIIcon(poi.type);
        const label = getPOILabel(poi.type);

        // Color based on risk level
        const color = riskLevel === 'high' ? '#dc2626' : riskLevel === 'medium' ? '#f59e0b' : '#10b981';

        const poiIcon = L.divIcon({
          html: `<div style="background-color: ${color}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 2px solid white;">${icon}</div>`,
          className: 'custom-poi-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const poiMarker = L.marker(
          [poi.coordinates.lat, poi.coordinates.lng],
          { icon: poiIcon }
        ).addTo(map);

        poiMarker.bindPopup(
          `<div style="text-align: center; min-width: 150px;">
            <div style="font-size: 20px; margin-bottom: 4px;">${icon}</div>
            <div style="font-weight: bold; margin-bottom: 4px; font-size: 13px;">${poi.name}</div>
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">${label}</div>
            <div style="font-size: 11px; color: #666;">Entfernung: ${Math.round(poi.distance)}m</div>
            <div style="margin-top: 4px; padding: 2px 6px; background-color: ${color}; color: white; border-radius: 4px; font-size: 10px; display: inline-block;">
              ${riskLevel === 'high' ? 'Hohes Risiko' : riskLevel === 'medium' ? 'Mittleres Risiko' : 'Geringes Risiko'}
            </div>
          </div>`
        );
      });

      // Fit map to show all markers if there are POIs
      if (pois.length > 0) {
        const bounds = L.latLngBounds([
          [address.coordinates.lat, address.coordinates.lng] as [number, number],
          ...pois.map(poi => [poi.coordinates.lat, poi.coordinates.lng] as [number, number])
        ]);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [address, pois]);

  return (
    <div className="space-y-3">
      {/* Leaflet Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-[400px] rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden"
        style={{ zIndex: 0 }}
      />

      {/* Map Legend */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="text-xs font-semibold text-gray-700 mb-2">Legende:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">📍</div>
            <span className="text-gray-700">Ihre Adresse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white">⛪</div>
            <span className="text-gray-700">Hohes Risiko</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white">🏥</div>
            <span className="text-gray-700">Mittleres Risiko</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white">📍</div>
            <span className="text-gray-700">Geringes Risiko</span>
          </div>
        </div>
      </div>

      {/* Link zum offiziellen Wiener Stadtplan */}
      <a
        href={`https://www.wien.gv.at/stadtplan/?map=${address.coordinates.lng},${address.coordinates.lat},16&layer=basemap&address=${encodeURIComponent(address.fullAddress)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
      >
        <ExternalLink className="w-4 h-4" />
        Im offiziellen Wiener Stadtplan öffnen
      </a>
    </div>
  );
}
