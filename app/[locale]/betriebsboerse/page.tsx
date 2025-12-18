'use client';

import { use } from 'react';
import Link from 'next/link';
import { Building2, TrendingUp, Users, Shield, Search, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';
import AutoGrid from '@/components/ui/AutoGrid';
import BreakText from '@/components/ui/BreakText';

export default function BetriebsboersePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-900">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20" />

        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Beta Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <BreakText>Beta Version - Jetzt testen!</BreakText>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <BreakText className="block mb-2">Wiener Betriebsbörse</BreakText>
              <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Ihr Geschäft. Ihre Chance.
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              <BreakText className="block">
                Die moderne Plattform für Betriebsübernahmen in Wien.
                Verkaufen Sie Ihren Betrieb oder finden Sie Ihr Traumgeschäft.
              </BreakText>
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={`/${locale}/betriebsboerse/inserat-erstellen`}
                className="group px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                <BreakText>Betrieb inserieren</BreakText>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={`/${locale}/betriebsboerse/inserate`}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold transition-all flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                <BreakText>Inserate durchsuchen</BreakText>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <AutoGrid min="14rem" className="text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                0
              </div>
              <div className="text-gray-600 font-medium">
                <BreakText>Aktive Inserate</BreakText>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Wien
              </div>
              <div className="text-gray-600 font-medium">
                <BreakText>Fokus auf Wiener Betriebe</BreakText>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                23
              </div>
              <div className="text-gray-600 font-medium">
                <BreakText>Bezirke abgedeckt</BreakText>
              </div>
            </div>
          </AutoGrid>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <BreakText className="block">So funktioniert&apos;s</BreakText>
            </h2>
            <p className="text-xl text-gray-600">
              <BreakText className="block">In drei einfachen Schritten zu Ihrer Betriebsübernahme</BreakText>
            </p>
          </div>

          <AutoGrid min="18rem" className="gap-8">
            {/* Step 1 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-100">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <div className="mb-6 mt-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                <BreakText className="block">Inserat erstellen</BreakText>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                <BreakText className="block">
                  Beschreiben Sie Ihren Betrieb mit allen wichtigen Details.
                  Fotos hochladen und Standort angeben - fertig!
                </BreakText>
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-100">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <div className="mb-6 mt-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                <BreakText className="block">Käufer finden</BreakText>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                <BreakText className="block">
                  Interessenten durchsuchen die Plattform und entdecken Ihr Inserat.
                  Sie erhalten Anfragen direkt über die Plattform.
                </BreakText>
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-green-100">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <div className="mb-6 mt-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                <BreakText className="block">Kontakt aufnehmen</BreakText>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                <BreakText className="block">
                  Sichere Kommunikation über die Plattform.
                  Besichtigungstermine vereinbaren und Details klären.
                </BreakText>
              </p>
            </div>
          </AutoGrid>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                <BreakText className="block">Warum Wiener Betriebsbörse?</BreakText>
              </h2>
              <p className="text-xl text-blue-200">
                <BreakText className="block">Die moderne Plattform mit allen Features</BreakText>
              </p>
            </div>

            <AutoGrid min="18rem" className="gap-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
                <TrendingUp className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  <BreakText className="block">Fokus auf Wien</BreakText>
                </h3>
                <p className="text-blue-100">
                  <BreakText className="block">Spezialisiert auf Wiener Betriebe mit lokalem Know-how</BreakText>
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
                <Shield className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  <BreakText className="block">Sicher & DSGVO-konform</BreakText>
                </h3>
                <p className="text-blue-100">
                  <BreakText className="block">Ihre Daten sind geschützt. Volle Transparenz bei jedem Schritt</BreakText>
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
                <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  <BreakText className="block">Einfach & Modern</BreakText>
                </h3>
                <p className="text-blue-100">
                  <BreakText className="block">Intuitive Bedienung, moderne Technologie, mobile-optimiert</BreakText>
                </p>
              </div>
            </AutoGrid>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            <BreakText className="block">Bereit für den nächsten Schritt?</BreakText>
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            <BreakText className="block">
              Starten Sie jetzt und finden Sie Ihre perfekte Betriebsübernahme
            </BreakText>
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`/${locale}/betriebsboerse/inserat-erstellen`}
              className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              <BreakText>Jetzt Betrieb inserieren</BreakText>
            </Link>

            <Link
              href={`/${locale}/betriebsboerse/inserate`}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <BreakText>Inserate durchsuchen</BreakText>
            </Link>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-amber-50 border-y-2 border-amber-200 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  <BreakText className="block">Wichtiger Hinweis zur Betriebsübernahme</BreakText>
                </h3>
                <p className="text-amber-800 leading-relaxed mb-4">
                  <BreakText className="block">
                    Diese Plattform vermittelt ausschließlich Kontakte zwischen Verkäufern und Käufern.
                    Wir bieten keine Rechtsberatung, Finanzierungsberatung oder Bewertungsdienstleistungen an.
                  </BreakText>
                </p>
                <p className="text-amber-800 leading-relaxed">
                  <BreakText className="block">
                    Für rechtliche, steuerliche und finanzielle Fragen bei Betriebsübernahmen empfehlen wir die
                    Konsultation von Fachanwälten, Steuerberatern und der Wirtschaftskammer Wien.
                  </BreakText>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
