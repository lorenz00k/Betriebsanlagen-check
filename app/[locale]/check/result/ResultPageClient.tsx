"use client"

// ResultPageClient presents the checker evaluation with detailed reasoning,
// document lists, occupational safety guidance, and operational obligations.
// Now includes AI-powered RAG analysis for personalized recommendations.
import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import Link from "next/link"

import type { ComplianceResult, ComplianceInput } from "@/app/lib/complianceCheckerLogic"

interface RAGSource {
  title: string
  content: string
  page?: number
  section?: string
  score: number
}

interface RAGResponse {
  success: boolean
  answer: string
  sources: RAGSource[]
  metadata: {
    model: string
    usage: {
      input_tokens: number
      output_tokens: number
      total_tokens: number
    }
    duration_ms: number
    documents_found: number
    documents_used: number
  }
}

type ResultPageClientProps = {
  locale: string
}

type Section = {
  title: string
  items: string[]
}

// Displays the localized compliance checker result and falls back to the wizard if no data is present.
export default function ResultPageClient({ locale }: ResultPageClientProps) {
  const t = useTranslations("complianceResult")
  const translate = useTranslations()
  const homeT = useTranslations("home")
  const router = useRouter()
  const [result, setResult] = useState<ComplianceResult | null>(null)
  const [formInput, setFormInput] = useState<ComplianceInput | null>(null)
  const [loading, setLoading] = useState(true)

  // RAG State
  const [ragResponse, setRagResponse] = useState<RAGResponse | null>(null)
  const [ragLoading, setRagLoading] = useState(false)
  const [ragError, setRagError] = useState<string | null>(null)
  const [showSources, setShowSources] = useState(false)

  useEffect(() => {
    const storedResult = sessionStorage.getItem("complianceResult")
    const storedInput = sessionStorage.getItem("complianceInput")

    if (storedResult) {
      setResult(JSON.parse(storedResult) as ComplianceResult)
    } else {
      router.push(`/${locale}/check`)
    }

    if (storedInput) {
      setFormInput(JSON.parse(storedInput) as ComplianceInput)
    }

    setLoading(false)
  }, [locale, router])

  // Function to call RAG API with user context
  const performAIAnalysis = async () => {
    if (!formInput) return

    setRagLoading(true)
    setRagError(null)

    try {
      // Map form data to business-friendly context
      const businessType = formInput.sector === 'gastronomyHotel'
        ? `Gastronomie (${formInput.hospitalitySubtype || 'Sonstiges'})`
        : formInput.sector === 'workshop'
        ? `Werkstätte (${formInput.workshopSubtype || 'Sonstiges'})`
        : formInput.sector || 'Unbekannt'

      const userContext = {
        betriebsart: businessType,
        groesse: formInput.areaSqm ? `${formInput.areaSqm}m²` : undefined,
        personenanzahl: formInput.personCount,
        bettenanzahl: formInput.bedCount,
        oeffnungszeiten: formInput.operatingPattern
          ? (formInput.operatingPattern === 'gfvoWindow' ? '06:00-22:00'
            : formInput.operatingPattern === 'extendedHours' ? 'Erweiterte Öffnungszeiten'
            : '24/7')
          : undefined,
        features: [
          formInput.hasExternalVentilation === 'yes' ? 'Externe Lüftung' : null,
          formInput.usesLoudMusic === 'yes' ? 'Live-Musik/Lautmusik' : null,
          formInput.hasWellnessFacilities === 'yes' ? 'Wellnessbereich' : null,
          formInput.servesFullMeals === 'yes' ? 'Vollküche' : null,
          formInput.storesRegulatedHazardous === 'yes' ? 'Gefahrenstoffe' : null,
        ].filter(Boolean)
      }

      // Generate contextual query based on classification
      const query = result?.classification === 'freistellungGFVO'
        ? 'Welche Voraussetzungen muss ich für die GFVO-Freistellung erfüllen und welche Dokumente brauche ich?'
        : result?.classification === 'needsPermit'
        ? 'Welche Genehmigungen brauche ich für meinen Betrieb und wie ist der genaue Ablauf des Genehmigungsverfahrens?'
        : 'Welche rechtlichen Anforderungen gelten für meinen Betrieb in Wien?'

      const response = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          userContext,
        }),
      })

      if (!response.ok) {
        throw new Error('RAG-Anfrage fehlgeschlagen')
      }

      const data: RAGResponse = await response.json()
      setRagResponse(data)
    } catch (error) {
      console.error('AI-Analyse fehlgeschlagen:', error)
      setRagError(error instanceof Error ? error.message : 'Unbekannter Fehler')
    } finally {
      setRagLoading(false)
    }
  }

  const sections: Section[] = useMemo(() => {
    if (!result) return []

    return [
      {
        title: t("sections.procedural"),
        items: result.proceduralKeys.map((key) => translate(key)),
      },
      {
        title: t("sections.documents"),
        items: [
          ...result.documentGeneralKeys.map((key) => translate(key)),
          ...result.documentSectorKeys.map((key) => translate(key)),
        ],
      },
      {
        title: t("sections.labour"),
        items: result.labourKeys.map((key) => translate(key)),
      },
      {
        title: t("sections.operationalDuties"),
        items: result.operationalDutyKeys.map((key) => translate(key)),
      },
      {
        title: t("sections.changeDuties"),
        items: result.changeDutyKeys.map((key) => translate(key)),
      },
      {
        title: t("sections.preCheck"),
        items: result.preCheckKeys.map((key) => translate(key)),
      },
      {
        title: t("sections.specialNotes"),
        items: result.specialNoteKeys.map((key) => translate(key)),
      },
    ].filter((section) => section.items.length > 0)
  }, [result, t, translate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  const classificationTitle = translate(result.classificationKey)
  const classificationSummary = translate(result.summaryKey)

  // Helper function: Only show AI analysis for gastronomy businesses
  const shouldShowAIAnalysis = (): boolean => {
    // Only show for gastronomyHotel sector since RAG is trained on gastronomy documents
    return formInput?.sector === 'gastronomyHotel'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-900">{t("title")}</h1>
          <Link
            href={`/${locale}/check`}
            className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-800"
          >
            <span className="text-lg">{t("actions.restart")}</span>
          </Link>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 md:p-8 mb-10">
          <h3 className="text-xl font-semibold text-yellow-800 mb-4">{t("disclaimer.title")}</h3>
          <ul className="space-y-3">
            {result.disclaimerKeys.map((key) => (
              <li key={key} className="text-yellow-900 leading-relaxed">{translate(key)}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-blue-100 mb-10">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
              {homeT("card1Title")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-3">{classificationTitle}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{classificationSummary}</p>
          </div>

          {result.gfvoCategoryKey ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-emerald-700 mb-2">{t("gfvoMatch.title")}</h3>
              <p className="text-emerald-800">{translate(result.gfvoCategoryKey)}</p>
            </div>
          ) : null}

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t("reasons.title")}</h3>
            <ul className="space-y-3">
              {result.reasonKeys.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-600 mt-2"></span>
                  <span className="text-gray-700 leading-relaxed">{translate(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* AI-Powered Analysis Section - Only for Gastronomy */}
        {shouldShowAIAnalysis() && (
        <div className="mt-12 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-3xl p-8 md:p-10 border-2 border-indigo-200 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              KI-POWERED
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Personalisierte Rechtsanalyse
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Erhalten Sie eine auf Ihre spezifischen Angaben zugeschnittene Analyse basierend auf den aktuellen Gesetzen und Verordnungen.
            </p>
          </div>

          {/* User Context Summary */}
          {formInput && !ragResponse && (
            <div className="bg-white rounded-xl p-6 mb-6 border border-indigo-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Ihre Eingaben:
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span className="text-gray-700">
                    {formInput.sector === 'gastronomyHotel'
                      ? `Gastronomie${formInput.hospitalitySubtype ? ` (${formInput.hospitalitySubtype})` : ''}`
                      : formInput.sector || 'Unbekannt'}
                  </span>
                </div>
                {formInput.areaSqm && (
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">•</span>
                    <span className="text-gray-700">{formInput.areaSqm}m²</span>
                  </div>
                )}
                {formInput.operatingPattern && (
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">•</span>
                    <span className="text-gray-700">
                      {formInput.operatingPattern === 'gfvoWindow' ? 'Standard-Öffnungszeiten'
                        : formInput.operatingPattern === 'extendedHours' ? 'Erweiterte Öffnungszeiten'
                        : '24/7 Betrieb'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Analysis Button */}
          {!ragResponse && !ragLoading && (
            <div className="flex justify-center">
              <button
                onClick={performAIAnalysis}
                disabled={!formInput}
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Jetzt KI-Analyse starten
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}

          {/* Loading State */}
          {ragLoading && (
            <div className="text-center py-12">
              <div className="inline-flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-900">KI analysiert Ihre Angaben...</p>
                  <p className="text-sm text-gray-600">Durchsuche Gesetze und Verordnungen</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {ragError && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-lg font-semibold text-red-900 mb-2">Analyse fehlgeschlagen</h4>
              <p className="text-sm text-red-700 mb-4">{ragError}</p>
              <button
                onClick={performAIAnalysis}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Erneut versuchen
              </button>
            </div>
          )}

          {/* AI Response */}
          {ragResponse && (
            <div className="space-y-6">
              {/* Main Answer */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      KI-Analyse für Ihren Betrieb
                    </h4>
                    <div className="text-sm text-gray-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {ragResponse.metadata.documents_used} Quellen
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {(ragResponse.metadata.duration_ms / 1000).toFixed(1)}s
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {ragResponse.metadata.model.includes('haiku') ? 'Claude 3.5 Haiku' : ragResponse.metadata.model}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {ragResponse.answer}
                  </div>
                </div>
              </div>

              {/* Sources Section */}
              {ragResponse.sources.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <button
                    onClick={() => setShowSources(!showSources)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="font-semibold text-gray-900">
                        Rechtsgrundlagen ({ragResponse.sources.length})
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${showSources ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showSources && (
                    <div className="mt-4 space-y-3">
                      {ragResponse.sources.map((source, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-gray-900 text-sm">
                              {source.title}
                              {source.page && ` (Seite ${source.page})`}
                            </h5>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                              {(source.score * 100).toFixed(0)}% Relevanz
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {source.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setRagResponse(null)
                    setRagError(null)
                  }}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Neue Analyse
                </button>
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Die KI-Analyse dient nur zur Information und ersetzt keine Rechtsberatung
            </p>
          </div>
        </div>
        )}

        {/* Info Box for Non-Gastronomy Businesses */}
        {!shouldShowAIAnalysis() && formInput && (
          <div className="mt-12">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-8 text-center shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                KI-Analyse in Entwicklung
              </h3>
              <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
                Die KI-gestützte Rechtsanalyse ist aktuell nur für <strong>Gastronomiebetriebe</strong> verfügbar.
                Wir arbeiten daran, weitere Branchen hinzuzufügen!
              </p>
              <div className="mt-6 text-sm text-gray-500">
                <p>Ihre Branche: <strong className="text-gray-700">{formInput.sector}</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* Documents Download Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl">
          <div className="text-center text-white mb-6">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              {t('downloadDocuments.title') || 'Benötigte Dokumente herunterladen'}
            </h3>
            <p className="text-blue-100 leading-relaxed max-w-2xl mx-auto">
              {t('downloadDocuments.description') || 'Laden Sie alle erforderlichen Formulare für Ihren Antrag bei der MA 36 herunter.'}
            </p>
          </div>
          <div className="flex justify-center">
            <Link
              href={`/${locale}/dokumente`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-xl font-bold transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('downloadDocuments.button') || 'Zu den Dokumenten'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
