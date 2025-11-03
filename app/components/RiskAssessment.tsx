'use client';

import { useTranslations } from 'next-intl';
import type { RiskAssessment as RiskAssessmentType } from '@/app/utils/poi-checker';
import type { Address } from '@/app/lib/viennagis-api';
import { AlertTriangle, Lightbulb, Info } from 'lucide-react';

interface RiskAssessmentProps {
  assessment: RiskAssessmentType;
  address: Address;
}

export default function RiskAssessment({ assessment, address }: RiskAssessmentProps) {
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
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        {t('title')}
      </h2>

      {/* Risk Score Card */}
      <div
        className="rounded-xl p-6 mb-6 border-4"
        style={{ borderColor: colors.border, backgroundColor: colors.bg }}
      >
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-2xl md:text-3xl font-bold"
            style={{ color: colors.text }}
          >
            {t(`levels.${assessment.overallRisk}`)}
          </span>
          <span className="text-lg md:text-xl font-semibold text-gray-600">
            {assessment.riskPoints}/100 {t('points')}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{
              width: `${assessment.riskPoints}%`,
              backgroundColor: colors.fill
            }}
          />
        </div>
      </div>

      {/* Warnings */}
      {assessment.warnings.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            {t('warnings')}
          </h3>
          <ul className="space-y-3">
            {assessment.warnings.map((warning, index) => (
              <li
                key={index}
                className="flex gap-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg"
              >
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <p className="text-gray-800 leading-relaxed">{warning}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {assessment.recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            {t('recommendations')}
          </h3>
          <ul className="space-y-3">
            {assessment.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex gap-3 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg"
              >
                <span className="text-2xl flex-shrink-0">💡</span>
                <p className="text-gray-800 leading-relaxed">{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-900 mb-1">{t('disclaimer.title')}</h4>
            <p className="text-sm text-green-800 leading-relaxed">
              {t('disclaimer.text')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
