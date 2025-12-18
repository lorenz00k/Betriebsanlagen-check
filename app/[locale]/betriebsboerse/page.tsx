'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  Building2, Search, ArrowRight, CheckCircle, Heart, Star, Award,
  Clock, Euro, Handshake, Target, Lightbulb, Play, Image as ImageIcon,
  TrendingUp, Users, Shield
} from 'lucide-react';
import AutoGrid from '@/components/ui/AutoGrid';
import BreakText from '@/components/ui/BreakText';

export default function BetriebsboersePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Hell und klar */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-6xl mx-auto">
            <AutoGrid min="28rem" className="items-center gap-12">
              {/* Text */}
              <div>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <BreakText>Beta Version - Kostenlos testen</BreakText>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  <BreakText className="block">Wiener</BreakText>
                  <span className="text-blue-600">Betriebsbörse</span>
                </h1>

                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  <BreakText className="block">
                    Die moderne Plattform für erfolgreiche Betriebsübernahmen in Wien.
                    Finden Sie Nachfolger für Ihr Lebenswerk oder starten Sie mit einem
                    etablierten Geschäft durch.
                  </BreakText>
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/${locale}/betriebsboerse/inserat-erstellen`}
                    className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Building2 className="w-5 h-5" />
                    <BreakText>Betrieb inserieren</BreakText>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href={`/${locale}/betriebsboerse/inserate`}
                    className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    <BreakText>Inserate durchsuchen</BreakText>
                  </Link>
                </div>
              </div>

              {/* Platzhalter für Bild/Video */}
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-2xl flex items-center justify-center group hover:shadow-3xl transition-shadow">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <p className="text-gray-600 font-medium">
                      <BreakText>Video-Platzhalter</BreakText>
                    </p>
                    <p className="text-sm text-gray-500">
                      <BreakText>Erklärvideo zur Plattform</BreakText>
                    </p>
                  </div>
                </div>
              </div>
            </AutoGrid>
          </div>
        </div>
      </div>

      {/* Warum Betriebsübernahme? Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                <BreakText className="block">Warum Betriebsübernahme?</BreakText>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                <BreakText className="block">
                  Tausende Unternehmer in Österreich suchen Nachfolger.
                  Eine Betriebsübernahme bietet Chancen für beide Seiten.
                </BreakText>
              </p>
            </div>

            <AutoGrid min="20rem" className="gap-8">
              <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-100">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  <BreakText>Etablierter Kundenstamm</BreakText>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <BreakText className="block">
                    Übernehmen Sie ein Geschäft mit bestehenden Kunden,
                    laufendem Umsatz und bewährten Prozessen.
                  </BreakText>
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-8 border-2 border-green-100">
                <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  <BreakText>Schnellerer Start</BreakText>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <BreakText className="block">
                    Umgehen Sie die riskante Gründungsphase und starten
                    Sie direkt mit einem funktionierenden Betrieb.
                  </BreakText>
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-8 border-2 border-purple-100">
                <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  <BreakText>Bewährtes Geschäftsmodell</BreakText>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <BreakText className="block">
                    Profitieren Sie von erprobten Abläufen, bestehenden
                    Lieferantenbeziehungen und Marktkenntnis.
                  </BreakText>
                </p>
              </div>
            </AutoGrid>
          </div>
        </div>
      </div>

      {/* Betriebsanlagengenehmigung Section - WICHTIG! */}
      <div className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 border-y-4 border-green-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6">
                <CheckCircle className="w-5 h-5" />
                <BreakText>Der entscheidende Vorteil</BreakText>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                <BreakText className="block">Betriebsanlagengenehmigung inklusive!</BreakText>
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                <BreakText className="block">
                  Bei einer Betriebsübernahme wird die bestehende Betriebsanlagengenehmigung
                  automatisch mitübernommen. Sie sparen sich Zeit, Kosten und den
                  bürokratischen Aufwand einer Neubeantragung!
                </BreakText>
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
              <AutoGrid min="22rem" className="gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    <BreakText>Warum ist das so wichtig?</BreakText>
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          <BreakText>Keine Wartezeit</BreakText>
                        </div>
                        <p className="text-gray-600">
                          <BreakText>Starten Sie sofort - keine monatelange Genehmigungsphase</BreakText>
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          <BreakText>Kosten sparen</BreakText>
                        </div>
                        <p className="text-gray-600">
                          <BreakText>Vermeiden Sie teure Gutachten und Behördengebühren</BreakText>
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          <BreakText>Rechtssicherheit</BreakText>
                        </div>
                        <p className="text-gray-600">
                          <BreakText>Der Betrieb ist bereits behördlich genehmigt und geprüft</BreakText>
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          <BreakText>Weniger Risiko</BreakText>
                        </div>
                        <p className="text-gray-600">
                          <BreakText>Keine Unsicherheit ob die Genehmigung erteilt wird</BreakText>
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border-2 border-blue-200">
                  <div className="bg-white rounded-lg p-6 mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-green-600 mb-2">0€</div>
                      <p className="text-gray-700 font-semibold">
                        <BreakText>Neugenehmigung bei Übernahme</BreakText>
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-red-600 mb-2">~5.000€+</div>
                      <p className="text-gray-700 font-semibold">
                        <BreakText>Kosten bei Neugründung</BreakText>
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        <BreakText>+ mehrere Monate Wartezeit</BreakText>
                      </p>
                    </div>
                  </div>
                </div>
              </AutoGrid>
            </div>

            {/* Verbindung zu anderen Tools */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  <BreakText>Unsere Tools helfen Ihnen bei jedem Schritt</BreakText>
                </h3>
                <p className="text-gray-600">
                  <BreakText className="block">
                    Nutzen Sie unsere kostenlosen Tools für eine erfolgreiche Betriebsübernahme
                  </BreakText>
                </p>
              </div>

              <AutoGrid min="18rem" className="gap-6">
                <Link
                  href={`/${locale}/adressen-check`}
                  className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 border-2 border-blue-200 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">
                      <BreakText>Adressen-Check</BreakText>
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    <BreakText className="block">
                      Prüfen Sie vor der Übernahme den Standort: Flächenwidmung,
                      Nachbarschaft und mehr
                    </BreakText>
                  </p>
                </Link>

                <Link
                  href={`/${locale}/formular-assistent`}
                  className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl p-6 border-2 border-purple-200 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">
                      <BreakText>Formular-Assistent</BreakText>
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    <BreakText className="block">
                      Falls Umbau geplant: Neue Genehmigung einfach online beantragen
                    </BreakText>
                  </p>
                </Link>

                <Link
                  href={`/${locale}/gastro-ki`}
                  className="group bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl p-6 border-2 border-orange-200 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">
                      <BreakText>Gastro KI</BreakText>
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    <BreakText className="block">
                      Speziell für Gastro-Betriebe: KI-gestützte Beratung für Ihre Übernahme
                    </BreakText>
                  </p>
                </Link>
              </AutoGrid>
            </div>
          </div>
        </div>
      </div>

      {/* Für Verkäufer & Käufer Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <AutoGrid min="28rem" className="gap-12">
              {/* Für Verkäufer */}
              <div className="bg-white rounded-2xl shadow-lg p-10 border-2 border-blue-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Handshake className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    <BreakText>Für Verkäufer</BreakText>
                  </h3>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  <BreakText className="block">
                    Sie möchten Ihr Lebenswerk in gute Hände übergeben?
                  </BreakText>
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        <BreakText>Würdevoller Ruhestand</BreakText>
                      </div>
                      <p className="text-gray-600 text-sm">
                        <BreakText>Ihr Betrieb wird erfolgreich weitergeführt</BreakText>
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        <BreakText>Faire Bewertung</BreakText>
                      </div>
                      <p className="text-gray-600 text-sm">
                        <BreakText>Erzielen Sie den bestmöglichen Verkaufspreis</BreakText>
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        <BreakText>Diskretion garantiert</BreakText>
                      </div>
                      <p className="text-gray-600 text-sm">
                        <BreakText>Vertraulicher Verkaufsprozess</BreakText>
                      </p>
                    </div>
                  </li>
                </ul>

                {/* Platzhalter für Bild */}
                <div className="mt-8 aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      <BreakText>Bild: Zufriedener Verkäufer</BreakText>
                    </p>
                  </div>
                </div>
              </div>

              {/* Für Käufer */}
              <div className="bg-white rounded-2xl shadow-lg p-10 border-2 border-green-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    <BreakText>Für Käufer</BreakText>
                  </h3>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  <BreakText className="block">
                    Sie träumen von Ihrem eigenen Geschäft?
                  </BreakText>
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        <BreakText>Geringeres Risiko</BreakText>
                      </div>
                      <p className="text-gray-600 text-sm">
                        <BreakText>Starten Sie mit bewährtem Konzept statt bei Null</BreakText>
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        <BreakText>Sofortiger Cashflow</BreakText>
                      </div>
                      <p className="text-gray-600 text-sm">
                        <BreakText>Ab Tag 1 Umsatz mit bestehenden Kunden</BreakText>
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        <BreakText>Großes Angebot</BreakText>
                      </div>
                      <p className="text-gray-600 text-sm">
                        <BreakText>Wählen Sie aus vielen Betrieben in ganz Wien</BreakText>
                      </p>
                    </div>
                  </li>
                </ul>

                {/* Platzhalter für Bild */}
                <div className="mt-8 aspect-video bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      <BreakText>Bild: Erfolgreicher Käufer</BreakText>
                    </p>
                  </div>
                </div>
              </div>
            </AutoGrid>
          </div>
        </div>
      </div>

      {/* Statistiken Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                <BreakText className="block">Betriebsübernahme in Zahlen</BreakText>
              </h2>
            </div>

            <AutoGrid min="16rem" className="gap-8">
              <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-5xl font-bold text-blue-600 mb-2">35%</div>
                <p className="text-gray-700 font-medium">
                  <BreakText>aller Unternehmer sind über 50</BreakText>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <BreakText>Quelle: WKO Nachfolge-Report</BreakText>
                </p>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-5xl font-bold text-green-600 mb-2">70%</div>
                <p className="text-gray-700 font-medium">
                  <BreakText>höhere Erfolgsquote als Neugründung</BreakText>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <BreakText>durch etablierte Strukturen</BreakText>
                </p>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-5xl font-bold text-purple-600 mb-2">Wien</div>
                <p className="text-gray-700 font-medium">
                  <BreakText>23 Bezirke, tausende Betriebe</BreakText>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <BreakText>Fokus auf lokale Geschäfte</BreakText>
                </p>
              </div>
            </AutoGrid>
          </div>
        </div>
      </div>

      {/* So funktioniert's Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                <BreakText className="block">So funktioniert&apos;s</BreakText>
              </h2>
              <p className="text-xl text-gray-600">
                <BreakText className="block">In drei einfachen Schritten zum Erfolg</BreakText>
              </p>
            </div>

            <AutoGrid min="20rem" className="gap-8">
              {/* Schritt 1 */}
              <div className="relative bg-white rounded-xl p-8 shadow-md border-2 border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  1
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 mt-4">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  <BreakText>Inserat erstellen</BreakText>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <BreakText className="block">
                    Beschreiben Sie Ihren Betrieb mit allen Details, Fotos und Standort.
                    Oder durchsuchen Sie bestehende Inserate.
                  </BreakText>
                </p>
              </div>

              {/* Schritt 2 */}
              <div className="relative bg-white rounded-xl p-8 shadow-md border-2 border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  2
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 mt-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  <BreakText>Kontakt aufnehmen</BreakText>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <BreakText className="block">
                    Interessenten melden sich bei Ihnen. Tauschen Sie sich direkt
                    über die Plattform aus.
                  </BreakText>
                </p>
              </div>

              {/* Schritt 3 */}
              <div className="relative bg-white rounded-xl p-8 shadow-md border-2 border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  3
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 mt-4">
                  <Handshake className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  <BreakText>Deal abschließen</BreakText>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <BreakText className="block">
                    Vereinbaren Sie Besichtigungen, klären Sie Details und
                    schließen Sie die Übernahme ab.
                  </BreakText>
                </p>
              </div>
            </AutoGrid>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <BreakText className="block">Bereit für den nächsten Schritt?</BreakText>
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              <BreakText className="block">
                Starten Sie jetzt kostenlos und finden Sie Ihre perfekte Betriebsübernahme
              </BreakText>
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={`/${locale}/betriebsboerse/inserat-erstellen`}
                className="px-10 py-5 bg-white hover:bg-gray-50 text-blue-600 rounded-lg font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center gap-2"
              >
                <Building2 className="w-6 h-6" />
                <BreakText>Jetzt Betrieb inserieren</BreakText>
              </Link>

              <Link
                href={`/${locale}/betriebsboerse/inserate`}
                className="px-10 py-5 bg-blue-500 hover:bg-blue-400 text-white border-2 border-white rounded-lg font-bold text-lg transition-all flex items-center gap-2"
              >
                <Search className="w-6 h-6" />
                <BreakText>Inserate durchsuchen</BreakText>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Wichtiger Hinweis Section */}
      <div className="bg-amber-50 border-t-4 border-amber-400 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-3">
                  <BreakText className="block">Wichtiger Hinweis zur Betriebsübernahme</BreakText>
                </h3>
                <p className="text-amber-800 leading-relaxed mb-3">
                  <BreakText className="block">
                    Diese Plattform vermittelt ausschließlich Kontakte zwischen Verkäufern und Käufern.
                    Wir bieten keine Rechtsberatung, Finanzierungsberatung oder Bewertungsdienstleistungen an.
                  </BreakText>
                </p>
                <p className="text-amber-800 leading-relaxed">
                  <BreakText className="block">
                    Für rechtliche, steuerliche und finanzielle Fragen bei Betriebsübernahmen empfehlen wir
                    die Konsultation von Fachanwälten, Steuerberatern und der{' '}
                  </BreakText>
                  <a
                    href="https://www.wko.at"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-900 font-semibold underline hover:text-amber-700"
                  >
                    Wirtschaftskammer Wien
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
