'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import type { Schritt } from './types';

interface FortschrittsAnzeigeProps {
  schritte: Schritt[];
  aktuellerSchritt: number;
  onSchrittClick: (index: number) => void;
}

export default function FortschrittsAnzeige({
  schritte,
  aktuellerSchritt,
  onSchrittClick
}: FortschrittsAnzeigeProps) {
  const t = useTranslations('formularAssistent');

  return (
    <div className="relative">
      {/* Desktop Version */}
      <div className="hidden md:flex justify-between items-start gap-6">
        {schritte.map((schritt, index) => {
          const istAbgeschlossen = index < aktuellerSchritt;
          const istAktuell = index === aktuellerSchritt;
          const istZukuenftig = index > aktuellerSchritt;

          return (
            <div key={schritt.id} className="flex-1 relative">
              {/* Verbindungslinie */}
              {index < schritte.length - 1 && (
                <div
                  className="absolute top-6 left-[50%] w-full h-[3px] -z-10 transition-all duration-300"
                  style={{
                    background: istAbgeschlossen
                      ? 'var(--color-success)'
                      : 'color-mix(in srgb, var(--color-muted) 25%, white 75%)',
                  }}
                />
              )}

              {/* Schritt */}
              <button
                onClick={() => onSchrittClick(index)}
                disabled={istZukuenftig}
                className={`flex flex-col items-center gap-2 w-full transition-all ${
                  istZukuenftig ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'
                }`}
              >
                {/* Kreis */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold border-2 transition-all duration-300"
                  style={{
                    background: istAbgeschlossen
                      ? 'var(--color-success)'
                      : istAktuell
                      ? 'var(--color-accent)'
                      : 'var(--color-surface)',
                    color: istAbgeschlossen || istAktuell ? '#fff' : 'var(--color-muted)',
                    borderColor: istAbgeschlossen
                      ? 'var(--color-success)'
                      : istAktuell
                      ? 'var(--color-accent)'
                      : 'var(--color-border)',
                    boxShadow: istAktuell
                      ? '0 0 0 6px color-mix(in srgb, var(--color-accent) 20%, transparent)'
                      : 'none',
                  }}
                >
                  {istAbgeschlossen ? <Check className="w-6 h-6" /> : schritt.icon}
                </div>

                {/* Titel */}
                <div className="text-center">
                  <div
                    className="text-sm font-semibold"
                    style={{
                      color: istAktuell
                        ? 'var(--color-accent)'
                        : istAbgeschlossen
                        ? 'var(--color-success)'
                        : 'var(--color-muted)',
                    }}
                  >
                    {t(`schritte.${schritt.id}.titel`)}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'color-mix(in srgb, var(--color-muted) 60%, white 40%)' }}>
                    Schritt {index + 1} von {schritte.length}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>
            Schritt {aktuellerSchritt + 1} von {schritte.length}
          </span>
          <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
            {t(`schritte.${schritte[aktuellerSchritt].id}.titel`)}
          </span>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full rounded-full h-2.5"
          style={{ background: 'color-mix(in srgb, var(--color-muted) 18%, white 82%)' }}
        >
          <div
            className="h-2.5 rounded-full transition-all duration-300"
            role="presentation"
            aria-hidden
            data-testid="progress-indicator"
            style={{
              width: `${((aktuellerSchritt + 1) / schritte.length) * 100}%`,
              background: 'var(--color-accent)',
            }}
          />
        </div>

        {/* Schritt-Icons */}
        <div className="flex justify-between mt-3">
          {schritte.map((schritt, index) => {
            const istAbgeschlossen = index < aktuellerSchritt;
            const istAktuell = index === aktuellerSchritt;

            return (
              <div
                key={schritt.id}
                className={`text-2xl transition-all ${
                  istAbgeschlossen ? 'opacity-50' : istAktuell ? 'scale-125 text-[color:var(--color-accent)]' : 'opacity-30'
                }`}
              >
                {schritt.icon}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
