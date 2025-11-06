'use client';

import { useTranslations } from 'next-intl';
import { Ruler, Zap } from 'lucide-react';
import BreakText from '@/components/ui/BreakText';
import type { FormularDaten } from '../types';

interface SchrittFlaechenProps {
  daten: FormularDaten;
  onChange: (feld: keyof FormularDaten, wert: string) => void;
}

export default function SchrittFlaechen({ daten, onChange }: SchrittFlaechenProps) {
  const t = useTranslations('formularAssistent.schritte.flaechen');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Ruler className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 min-w-0">
            <BreakText className="block">{t('titel')}</BreakText>
          </h2>
          <BreakText className="block text-gray-600">{t('beschreibung')}</BreakText>
        </div>
      </div>

      {/* Beschreibung aller Flächen */}
      <div>
        <label htmlFor="flaechen_beschreibung" className="block text-sm font-semibold text-gray-700 mb-2">
          <BreakText>
            {t('felder.beschreibung.label')} <span className="text-red-500">*</span>
          </BreakText>
        </label>
        <textarea
          id="flaechen_beschreibung"
          value={daten.flaechen_beschreibung}
          onChange={(e) => onChange('flaechen_beschreibung', e.target.value)}
          placeholder={t('felder.beschreibung.platzhalter')}
          rows={8}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none font-mono text-sm"
          required
        />
        <BreakText className="mt-1.5 block text-sm text-gray-600">
          {t('felder.beschreibung.hilfe')}
        </BreakText>
      </div>

      {/* Gesamtfläche */}
      <div>
        <label htmlFor="gesamtflaeche" className="block text-sm font-semibold text-gray-700 mb-2">
          <BreakText>
            {t('felder.gesamtflaeche.label')} <span className="text-red-500">*</span>
          </BreakText>
        </label>
        <div className="relative">
          <input
            id="gesamtflaeche"
            type="number"
            min="1"
            value={daten.gesamtflaeche}
            onChange={(e) => onChange('gesamtflaeche', e.target.value)}
            placeholder="z.B. 415"
            className="input-with-unit w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            required
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            m²
          </div>
        </div>
        <BreakText className="mt-1.5 block text-sm text-gray-600">
          {t('felder.gesamtflaeche.hilfe')}
        </BreakText>
      </div>

      {/* Anschlussleistung */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <BreakText>
            {t('felder.anschlussleistung.label')} <span className="text-red-500">*</span>
          </BreakText>
        </label>
        <div className="space-y-3">
          {/* Unter 300 kW */}
          <button
            type="button"
            onClick={() => onChange('anschlussleistung', 'unter300')}
            className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
              daten.anschlussleistung === 'unter300'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-300'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Zap className={`w-5 h-5 ${daten.anschlussleistung === 'unter300' ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900">
                    <BreakText className="block">{t('felder.anschlussleistung.optionen.unter300.label')}</BreakText>
                  </div>
                  <BreakText className="block text-sm text-gray-600">
                    {t('felder.anschlussleistung.optionen.unter300.info')}
                  </BreakText>
                </div>
              </div>
              {daten.anschlussleistung === 'unter300' && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>

          {/* Über 300 kW */}
          <button
            type="button"
            onClick={() => onChange('anschlussleistung', 'ueber300')}
            className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
              daten.anschlussleistung === 'ueber300'
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-300 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Zap className={`w-5 h-5 ${daten.anschlussleistung === 'ueber300' ? 'text-amber-600' : 'text-gray-400'}`} />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900">
                    <BreakText className="block">{t('felder.anschlussleistung.optionen.ueber300.label')}</BreakText>
                  </div>
                  <BreakText className="block text-sm text-gray-600">
                    {t('felder.anschlussleistung.optionen.ueber300.info')}
                  </BreakText>
                </div>
              </div>
              {daten.anschlussleistung === 'ueber300' && (
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>

          {/* Keine */}
          <button
            type="button"
            onClick={() => onChange('anschlussleistung', 'keine')}
            className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
              daten.anschlussleistung === 'keine'
                ? 'border-gray-500 bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Zap className={`w-5 h-5 ${daten.anschlussleistung === 'keine' ? 'text-gray-600' : 'text-gray-400'}`} />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900">
                    <BreakText className="block">{t('felder.anschlussleistung.optionen.keine.label')}</BreakText>
                  </div>
                </div>
              </div>
              {daten.anschlussleistung === 'keine' && (
                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        </div>
        <BreakText className="mt-3 block text-sm text-gray-600">
          {t('felder.anschlussleistung.hilfe')}
        </BreakText>
      </div>
    </div>
  );
}
