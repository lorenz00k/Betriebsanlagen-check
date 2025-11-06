'use client';

import { useTranslations } from 'next-intl';
import { User, Phone, Mail, Users } from 'lucide-react';
import AutoGrid from '@/components/ui/AutoGrid';
import BreakText from '@/components/ui/BreakText';
import type { FormularDaten } from '../types';

interface SchrittAntragstellerProps {
  daten: FormularDaten;
  onChange: (feld: keyof FormularDaten, wert: string) => void;
}

export default function SchrittAntragsteller({ daten, onChange }: SchrittAntragstellerProps) {
  const t = useTranslations('formularAssistent.schritte.antragsteller');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 min-w-0">
            <BreakText className="block">{t('titel')}</BreakText>
          </h2>
          <BreakText className="block text-gray-600">{t('beschreibung')}</BreakText>
        </div>
      </div>

      <AutoGrid min="18rem" className="gap-y-6">
        {/* Name und Anschrift */}
        <div className="min-w-0">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            <BreakText>
              {t('felder.name.label')} <span className="text-red-500">*</span>
            </BreakText>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="name"
              type="text"
              value={daten.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder={t('felder.name.platzhalter')}
              className="input-with-icon w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              required
            />
          </div>
          <BreakText className="mt-1.5 block text-sm text-gray-600">
            {t('felder.name.hilfe')}
          </BreakText>
        </div>

        {/* Kontaktperson */}
        <div className="min-w-0">
          <label htmlFor="kontaktperson" className="block text-sm font-semibold text-gray-700 mb-2">
            <BreakText>
              {t('felder.kontaktperson.label')} <span className="text-red-500">*</span>
            </BreakText>
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="kontaktperson"
              type="text"
              value={daten.kontaktperson}
              onChange={(e) => onChange('kontaktperson', e.target.value)}
              placeholder={t('felder.kontaktperson.platzhalter')}
              className="input-with-icon w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              required
            />
          </div>
          <BreakText className="mt-1.5 block text-sm text-gray-600">
            {t('felder.kontaktperson.hilfe')}
          </BreakText>
        </div>

        {/* Telefon */}
        <div className="min-w-0">
          <label htmlFor="telefon" className="block text-sm font-semibold text-gray-700 mb-2">
            <BreakText>
              {t('felder.telefon.label')} <span className="text-red-500">*</span>
            </BreakText>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="telefon"
              type="tel"
              value={daten.telefon}
              onChange={(e) => onChange('telefon', e.target.value)}
              placeholder={t('felder.telefon.platzhalter')}
              className="input-with-icon w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="min-w-0">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            <BreakText>
              {t('felder.email.label')} <span className="text-red-500">*</span>
            </BreakText>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={daten.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder={t('felder.email.platzhalter')}
              className="input-with-icon w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              required
            />
          </div>
          <BreakText className="mt-1.5 block text-sm text-gray-600">
            {t('felder.email.hilfe')}
          </BreakText>
        </div>
      </AutoGrid>
    </div>
  );
}
