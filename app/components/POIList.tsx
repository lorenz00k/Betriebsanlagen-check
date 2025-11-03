'use client';

import { useTranslations } from 'next-intl';
import type { POI } from '@/app/lib/viennagis-api';
import { getPOIIcon, getPOIRiskLevel } from '@/app/utils/poi-checker';

interface POIListProps {
  pois: POI[];
}

export default function POIList({ pois }: POIListProps) {
  const t = useTranslations('addressChecker');

  // POIs nach Typ gruppieren
  const groupedPOIs = pois.reduce((acc, poi) => {
    if (!acc[poi.type]) {
      acc[poi.type] = [];
    }
    acc[poi.type].push(poi);
    return acc;
  }, {} as Record<string, POI[]>);

  if (pois.length === 0) {
    return (
      <div className="p-8 text-center bg-green-50 border-2 border-green-200 rounded-xl">
        <span className="text-4xl mb-3 block">✅</span>
        <p className="text-green-800 font-medium">
          {t('pois.empty')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedPOIs).map(([type, items]) => {
        const riskLevel = getPOIRiskLevel(type);
        const icon = getPOIIcon(type);
        const categoryName = t(`pois.categories.${type}`);

        // Risk badge styling
        const riskBadgeClasses = {
          high: 'bg-red-100 text-red-800 border-red-200',
          medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          low: 'bg-blue-100 text-blue-800 border-blue-200'
        }[riskLevel];

        return (
          <div key={type} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="text-2xl">{icon}</span>
                {categoryName}
                <span className="text-sm font-normal text-gray-500">({items.length})</span>
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${riskBadgeClasses}`}>
                {t(`badges.${riskLevel}`)}
              </span>
            </div>

            {/* POI Items */}
            <ul className="space-y-2">
              {items.map((poi, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-800 font-medium">{poi.name || 'Unbenannt'}</span>
                  <span className="text-sm font-semibold text-gray-600">
                    {poi.distance ? `${Math.round(poi.distance)}m` : t('pois.nearby')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
