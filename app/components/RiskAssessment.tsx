'use client';

import { useTranslations } from 'next-intl';
import type { RiskAssessment as RiskAssessmentType } from '@/app/utils/poi-checker';
import { AlertTriangle, Lightbulb, Info } from 'lucide-react';

interface RiskAssessmentProps {
  assessment: RiskAssessmentType;
}

export default function RiskAssessment({ assessment }: RiskAssessmentProps) {
  const t = useTranslations('addressChecker.risk');

  // Risk level styling
  const riskColors = {
    high: {
      border: '#dc2626',
      bg: '#fee2e2',
      text: '#991b1b',
      fill: '#dc2626'
    },
    medium: {
      border: '#f59e0b',
      bg: '#fef3c7',
      text: '#92400e',
      fill: '#f59e0b'
    },
    low: {
      border: '#10b981',
      bg: '#d1fae5',
      text: '#065f46',
      fill: '#10b981'
    }
  };

  const colors = riskColors[assessment.overallRisk];

  return (
    <div className="surface-card space-y-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--color-fg)]">{t('title')}</h2>

      {/* Risk Score Card */}
      <div
        className="rounded-[var(--radius)] p-6 border"
        style={{ borderColor: colors.border, backgroundColor: colors.bg }}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="text-2xl md:text-3xl font-semibold" style={{ color: colors.text }}>
            {t(`levels.${assessment.overallRisk}`)}
          </span>
          <span className="text-lg md:text-xl font-medium text-[color:var(--color-muted)]">
            {assessment.riskPoints}/100 {t('points')}
          </span>
        </div>

        {/* Progress Bar */}
        <div
          className="mt-4 h-3 rounded-full"
          style={{ background: 'color-mix(in srgb, var(--color-muted) 18%, white 82%)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${assessment.riskPoints}%`,
              backgroundColor: colors.fill
            }}
          />
        </div>
      </div>

      {/* Warnings */}
      {assessment.warnings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[color:var(--color-fg)] flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[color:var(--color-warning)]" />
            {t('warnings')}
          </h3>
          <ul className="space-y-3">
            {assessment.warnings.map((warning, index) => (
              <li
                key={index}
                className="flex gap-3 rounded-[var(--radius-sm)] border border-[color-mix(in srgb, var(--color-warning) 40%, transparent)] bg-[color-mix(in srgb, var(--color-warning) 12%, white 88%)] p-4"
              >
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <p className="text-[color:var(--color-fg)] leading-relaxed">{warning}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {assessment.recommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[color:var(--color-fg)] flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-[color:var(--color-accent)]" />
            {t('recommendations')}
          </h3>
          <ul className="space-y-3">
            {assessment.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex gap-3 rounded-[var(--radius-sm)] border border-[color-mix(in srgb, var(--color-accent) 35%, transparent)] bg-[color-mix(in srgb, var(--color-accent) 12%, white 88%)] p-4"
              >
                <span className="text-2xl flex-shrink-0">💡</span>
                <p className="text-[color:var(--color-fg)] leading-relaxed">{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-[var(--radius-sm)] border border-[color-mix(in srgb, var(--color-success) 35%, transparent)] bg-[color-mix(in srgb, var(--color-success) 12%, white 88%)] p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-[color:var(--color-success)] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[color:var(--color-success)] mb-1">{t('disclaimer.title')}</h4>
            <p className="text-sm text-[color:var(--color-success)] leading-relaxed">{t('disclaimer.text')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
