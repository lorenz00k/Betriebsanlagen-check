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
      <div className="hidden md:flex justify-between items-start">
        {schritte.map((schritt, index) => {
          const istAbgeschlossen = index < aktuellerSchritt;
          const istAktuell = index === aktuellerSchritt;
          const istZukuenftig = index > aktuellerSchritt;

          return (
            <div key={schritt.id} className="flex-1 relative">
              {/* Verbindungslinie */}
              {index < schritte.length - 1 && (
                <div
                  className={`absolute top-6 left-[50%] w-full h-1 -z-10 transition-all duration-300 ${
                    istAbgeschlossen ? 'bg-green-500' : 'bg-gray-200'
                  }`}
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
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 transition-all duration-300 ${
                    istAbgeschlossen
                      ? 'bg-green-500 border-green-500 text-white'
                      : istAktuell
                      ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-200'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {istAbgeschlossen ? <Check className="w-6 h-6" /> : schritt.icon}
                </div>

                {/* Titel */}
                <div className="text-center">
                  <div
                    className={`text-sm font-semibold ${
                      istAktuell ? 'text-blue-600' : istAbgeschlossen ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {t(`schritte.${schritt.id}.titel`)}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
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
          <span className="text-sm font-semibold text-gray-700">
            Schritt {aktuellerSchritt + 1} von {schritte.length}
          </span>
          <span className="text-sm text-gray-600">
            {t(`schritte.${schritte[aktuellerSchritt].id}.titel`)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((aktuellerSchritt + 1) / schritte.length) * 100}%` }}
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
                className={`text-2xl ${
                  istAbgeschlossen ? 'opacity-50' : istAktuell ? 'scale-125' : 'opacity-30'
                } transition-all`}
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
