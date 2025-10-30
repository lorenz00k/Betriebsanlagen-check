'use client';

import { useEffect, useRef } from 'react';
import type { Address, POI } from '@/app/lib/viennagis-api';
import { MapPin } from 'lucide-react';

interface ViennaGISMapProps {
  address: Address;
  pois: POI[];
}

export default function ViennaGISMap({ address, pois }: ViennaGISMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Placeholder for future map integration
    // Could use Leaflet.js or similar mapping library
    // with Vienna basemap tiles
    console.log('Map data:', { address, pois });
  }, [address, pois]);

  return (
    <div className="space-y-3">
      {/* Map Container - Placeholder for now */}
      <div
        ref={mapContainerRef}
        className="aspect-video bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex flex-col items-center justify-center border-2 border-gray-200 relative overflow-hidden"
      >
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-gray-400" />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-700 font-semibold mb-2">
            Interaktive Karte
          </p>
          <p className="text-sm text-gray-600 max-w-xs">
            Die Kartenansicht wird in einer zukünftigen Version verfügbar sein
          </p>
        </div>

        {/* Address Badge */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {address.fullAddress}
              </p>
              <p className="text-xs text-gray-600">
                {address.postalCode} Wien, {address.district}. Bezirk
              </p>
            </div>
          </div>
        </div>

        {/* POI Count Badge */}
        {pois.length > 0 && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
            {pois.length} {pois.length === 1 ? 'POI' : 'POIs'}
          </div>
        )}
      </div>

      {/* Future Implementation Note */}
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
        <span>
          Zukünftig: Interaktive Karte mit Wien Basemap und POI-Markierungen
        </span>
      </div>
    </div>
  );
}
