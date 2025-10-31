'use client';

import { useTranslations } from 'next-intl';
import { FileText, Factory, RefreshCw } from 'lucide-react';
import type { FormularDaten } from '../types';

interface SchrittAntragstyp

Props {
  daten: FormularDaten;
  onChange: (feld: keyof FormularDaten, wert: string) => void;
}

export default function SchrittAntragstyp({ daten, onChange }: SchrittAntragsty pProps) {
  const t = useTranslations('formularAssistent.schritte.antragstyp');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('titel')}</h2>
          <p className="text-gray-600">{t('beschreibung')}</p>
        </div>
      </div>

      {/* Typ: Neu oder Änderung */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {t('felder.typ.label')} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Neu */}
          <button
            type="button"
            onClick={() => onChange('typ', 'neu')}
            className={`p-4 border-2 rounded-lg transition-all text-left ${
              daten.typ === 'neu'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  daten.typ === 'neu' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  <Factory className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">
                  {t('felder.typ.optionen.neu.label')}
                </div>
                <div className="text-sm text-gray-600">
                  {t('felder.typ.optionen.neu.beschreibung')}
                </div>
              </div>
            </div>
          </button>

          {/* Änderung */}
          <button
            type="button"
            onClick={() => onChange('typ', 'aenderung')}
            className={`p-4 border-2 rounded-lg transition-all text-left ${
              daten.typ === 'aenderung'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  daten.typ === 'aenderung' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  <RefreshCw className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">
                  {t('felder.typ.optionen.aenderung.label')}
                </div>
                <div className="text-sm text-gray-600">
                  {t('felder.typ.optionen.aenderung.beschreibung')}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Art der Anlage */}
      <div>
        <label htmlFor="art_der_anlage" className="block text-sm font-semibold text-gray-700 mb-2">
          {t('felder.art.label')} <span className="text-red-500">*</span>
        </label>
        <input
          id="art_der_anlage"
          type="text"
          value={daten.art_der_anlage}
          onChange={(e) => onChange('art_der_anlage', e.target.value)}
          placeholder={t('felder.art.platzhalter')}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          required
        />
        <p className="mt-1.5 text-sm text-gray-600">
          {t('felder.art.hilfe')}
        </p>
      </div>

      {/* Anlagenteile und Tätigkeiten */}
      <div>
        <label htmlFor="anlagenteile" className="block text-sm font-semibold text-gray-700 mb-2">
          {t('felder.anlagenteile.label')} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="anlagenteile"
          value={daten.anlagenteile}
          onChange={(e) => onChange('anlagenteile', e.target.value)}
          placeholder={t('felder.anlagenteile.platzhalter')}
          rows={6}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
          required
        />
        <p className="mt-1.5 text-sm text-gray-600">
          {t('felder.anlagenteile.hilfe')}
        </p>
      </div>
    </div>
  );
}
