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
      <div className="surface-card text-center space-y-3">
        <span className="text-4xl">✅</span>
        <p className="font-medium" style={{ color: 'var(--color-success)' }}>
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

        const riskStyles = {
          high: {
            background: 'color-mix(in srgb, var(--color-danger) 18%, white 82%)',
            color: 'var(--color-danger)'
          },
          medium: {
            background: 'color-mix(in srgb, var(--color-warning) 22%, white 78%)',
            color: 'var(--color-warning)'
          },
          low: {
            background: 'color-mix(in srgb, var(--color-accent) 16%, white 84%)',
            color: 'var(--color-accent-strong)'
          }
        }[riskLevel];

        return (
          <div key={type} className="border-b border-[color:var(--color-border)] pb-6 last:border-b-0 last:pb-0">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-3 gap-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-[color:var(--color-fg)]">
                <span className="text-2xl">{icon}</span>
                {categoryName}
                <span className="text-sm font-normal text-[color:var(--color-muted)]">({items.length})</span>
              </h3>
              <span
                className="badge text-xs"
                style={{
                  background: riskStyles.background,
                  color: riskStyles.color,
                  border: '1px solid color-mix(in srgb, currentColor 25%, transparent)',
                }}
              >
                {t(`badges.${riskLevel}`)}
              </span>
            </div>

            {/* POI Items */}
            <ul className="space-y-2">
              {items.map((poi, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-3 transition hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-soft)]"
                >
                  <span className="font-medium text-[color:var(--color-fg)]">{poi.name || 'Unbenannt'}</span>
                  <span className="text-sm font-semibold text-[color:var(--color-muted)]">
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
