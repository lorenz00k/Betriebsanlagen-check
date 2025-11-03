'use client';

import { useTranslations } from 'next-intl';
import { User, Phone, Mail, Users } from 'lucide-react';
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
        <span className="stat-icon !w-12 !h-12">
          <User className="w-6 h-6" />
        </span>
        <div>
          <h2 className="text-2xl font-semibold text-[color:var(--color-fg)]">{t('titel')}</h2>
          <p className="text-[color:var(--color-muted)]">{t('beschreibung')}</p>
        </div>
      </div>

      {/* Name und Anschrift */}
      <div>
        <label htmlFor="name">
          {t('felder.name.label')} <span style={{ color: 'var(--color-danger)' }}>*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--color-muted)]" />
          <input
            id="name"
            type="text"
            value={daten.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder={t('felder.name.platzhalter')}
            className="w-full pl-12 pr-4"
            required
          />
        </div>
        <p className="mt-1.5 text-sm" style={{ color: 'color-mix(in srgb, var(--color-muted) 80%, white 20%)' }}>
          {t('felder.name.hilfe')}
        </p>
      </div>

      {/* Kontaktperson */}
      <div>
        <label htmlFor="kontaktperson">
          {t('felder.kontaktperson.label')} <span style={{ color: 'var(--color-danger)' }}>*</span>
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--color-muted)]" />
          <input
            id="kontaktperson"
            type="text"
            value={daten.kontaktperson}
            onChange={(e) => onChange('kontaktperson', e.target.value)}
            placeholder={t('felder.kontaktperson.platzhalter')}
            className="w-full pl-12 pr-4"
            required
          />
        </div>
        <p className="mt-1.5 text-sm" style={{ color: 'color-mix(in srgb, var(--color-muted) 80%, white 20%)' }}>
          {t('felder.kontaktperson.hilfe')}
        </p>
      </div>

      {/* Telefon */}
      <div>
        <label htmlFor="telefon">
          {t('felder.telefon.label')} <span style={{ color: 'var(--color-danger)' }}>*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--color-muted)]" />
          <input
            id="telefon"
            type="tel"
            value={daten.telefon}
            onChange={(e) => onChange('telefon', e.target.value)}
            placeholder={t('felder.telefon.platzhalter')}
            className="w-full pl-12 pr-4"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email">
          {t('felder.email.label')} <span style={{ color: 'var(--color-danger)' }}>*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--color-muted)]" />
          <input
            id="email"
            type="email"
            value={daten.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder={t('felder.email.platzhalter')}
            className="w-full pl-12 pr-4"
            required
          />
        </div>
        <p className="mt-1.5 text-sm" style={{ color: 'color-mix(in srgb, var(--color-muted) 80%, white 20%)' }}>
          {t('felder.email.hilfe')}
        </p>
      </div>
    </div>
  );
}
