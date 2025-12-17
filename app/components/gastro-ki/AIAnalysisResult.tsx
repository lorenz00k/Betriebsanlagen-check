'use client'

import { useState } from 'react'
import PDFViewerModal from './PDFViewerModal'

interface FormData {
  businessType: string
  size: number
  district: string
  outdoorSeating: boolean
  openingHours: string
  employees: string
  specialFeatures: string[]
}

interface Source {
  title: string
  content: string
  page?: number
  section?: string
  score: number
}

interface AIAnalysisResultProps {
  result: {
    success: boolean
    answer: string
    sources: Source[]
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
  formData: FormData
  onStartOver: () => void
  onOpenFollowUp: () => void
}

export function AIAnalysisResult({
  result,
  formData,
  onStartOver,
  onOpenFollowUp,
}: AIAnalysisResultProps) {
  const [showSources, setShowSources] = useState(false)
  const [showMetadata, setShowMetadata] = useState(false)
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState<{ url: string; page: number; filename: string } | null>(null)

  const openPdfViewer = (source: Source) => {
    // Extract filename from source.title and construct PDF URL
    const filename = source.title
    const pdfUrl = `/documents/raw-pdfs/${filename}`

    setSelectedPdf({
      url: pdfUrl,
      page: source.page || 1,
      filename: source.title
    })
    setPdfViewerOpen(true)
  }

  const getBusinessTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      restaurant: 'Restaurant',
      cafe: 'Café',
      bar: 'Bar/Lounge',
      imbiss: 'Imbiss',
      bistro: 'Bistro',
    }
    return labels[type] || type
  }

  const getOpeningHoursLabel = (hours: string): string => {
    const labels: Record<string, string> = {
      standard: '06:00 - 22:00',
      extended: '06:00 - 02:00',
      '24-7': '24/7',
    }
    return labels[hours] || hours
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Success Header */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg className="w-16 h-16 mx-auto mb-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-green-900 mb-2">
          Analyse abgeschlossen!
        </h2>
        <p className="text-green-700">
          Ihre personalisierte Genehmigungsanalyse ist fertig
        </p>
      </div>

      {/* Context Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ihre Angaben
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-600">Betriebsart</div>
              <div className="font-semibold text-gray-900">{getBusinessTypeLabel(formData.businessType)}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-600">Fläche</div>
              <div className="font-semibold text-gray-900">{formData.size}m²</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-600">Bezirk</div>
              <div className="font-semibold text-gray-900">Wien {formData.district}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-600">Außengastronomie</div>
              <div className="font-semibold text-gray-900">{formData.outdoorSeating ? 'Ja (Schanigarten)' : 'Nein'}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-600">Öffnungszeiten</div>
              <div className="font-semibold text-gray-900">{getOpeningHoursLabel(formData.openingHours)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis - Modern Design */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-lg p-8 border border-blue-100">
        {/* Header with Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Deine persönliche Analyse
              </h3>
              <p className="text-sm text-gray-600">Basierend auf aktuellen Gesetzen und Verordnungen</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700">KI-generiert</span>
          </div>
        </div>

        {/* AI Answer with better formatting */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed space-y-4" style={{ whiteSpace: 'pre-wrap' }}>
              {result.answer.split('\n\n').map((paragraph, idx) => (
                <div key={idx} className="paragraph-block">
                  {paragraph.startsWith('✓') ? (
                    // Checklist items
                    <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-800">{paragraph.replace('✓', '').trim()}</span>
                    </div>
                  ) : paragraph.toLowerCase().includes('nach §') || paragraph.toLowerCase().includes('gewerbeordnung') || paragraph.toLowerCase().includes('gfvo') ? (
                    // Legal references
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-gray-800">{paragraph}</span>
                      </div>
                    </div>
                  ) : paragraph.toLowerCase().startsWith('wichtig') || paragraph.toLowerCase().startsWith('achtung') || paragraph.toLowerCase().startsWith('hinweis') ? (
                    // Important notes
                    <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-gray-800">{paragraph}</span>
                      </div>
                    </div>
                  ) : paragraph.toLowerCase().startsWith('nächste') || paragraph.toLowerCase().includes('kontaktiere') ? (
                    // Next steps
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="text-gray-800">{paragraph}</span>
                      </div>
                    </div>
                  ) : (
                    // Regular text
                    <p className="text-gray-800">{paragraph}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meta Info Footer */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {result.metadata.documents_used} Rechtsquellen analysiert
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Antwort in {(result.metadata.duration_ms / 1000).toFixed(1)}s generiert
          </span>
        </div>
      </div>

      {/* Required Documents */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-900">
            Benötigte Dokumente
          </h3>
        </div>

        <p className="text-gray-600 mb-6">
          Für Ihren {getBusinessTypeLabel(formData.businessType)} benötigen Sie folgende Unterlagen für die Betriebsanlagengenehmigung:
        </p>

        <div className="space-y-4">
          {[
            {
              title: 'Grundrissplan (Maßstab 1:100)',
              description: 'Zeigt alle Räume, Türen, Fenster und Gerätepositionen. Muss von einem befugten Planer erstellt werden.',
              required: true
            },
            {
              title: 'Betriebsbeschreibung',
              description: 'Detaillierte Beschreibung Ihrer gastgewerblichen Tätigkeit, Betriebszeiten und geplante Betriebsweise.',
              required: true
            },
            {
              title: 'Maschinen- und Geräteliste',
              description: 'Auflistung aller Geräte mit Leistungsangaben (kW), inkl. Kühlgeräte, Herd, Backofen, Lüftung.',
              required: true
            },
            {
              title: 'Lageplan',
              description: 'Zeigt Ihr Grundstück und Nachbargrundstücke, relevant für Lärm- und Emissionsbeurteilung.',
              required: true
            },
            {
              title: 'Gewerbeberechtigung',
              description: 'Nachweis über die gewerberechtliche Berechtigung (Gewerbeschein).',
              required: true
            },
            ...(formData.outdoorSeating ? [{
              title: 'Schanigarten-Bewilligung',
              description: 'Separate Bewilligung für Gastgarten auf öffentlichem Grund. Muss bei der MA 59 beantragt werden.',
              required: true
            }] : [])
          ].map((doc, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                  {doc.required && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                      Pflicht
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <strong>Hinweis:</strong> Alle Pläne müssen in 4-facher Ausfertigung eingereicht werden. Die technischen Pläne müssen von einem befugten Planer (Architekt, Baumeister) mit Stempel und Unterschrift versehen sein.
            </div>
          </div>
        </div>
      </div>

      {/* Sources - Als Hilfestellung */}
      {result.sources.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <button
            onClick={() => setShowSources(!showSources)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-lg text-gray-900">
                  Verwendete Rechtsquellen
                </span>
                <p className="text-xs text-gray-600">
                  {result.sources.length} {result.sources.length === 1 ? 'Dokument' : 'Dokumente'} als Grundlage
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs text-gray-500">
                {showSources ? 'Ausblenden' : 'Details anzeigen'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform ${showSources ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {showSources && (
            <div className="mt-6 space-y-3 animate-slideDown">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Diese Quellen wurden zur Beantwortung deiner Frage herangezogen. Klicke auf eine Quelle, um das Original-Dokument anzusehen.
                  </span>
                </p>
              </div>

              {result.sources.map((source, idx) => (
                <button
                  key={idx}
                  onClick={() => openPdfViewer(source)}
                  className="w-full text-left p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 group-hover:bg-blue-200 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold transition-colors">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title and Relevance */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h5 className="font-semibold text-gray-900 text-sm flex items-center gap-2 group-hover:text-blue-700 transition-colors">
                          <span className="truncate">{source.title}</span>
                          {source.section && (
                            <span className="flex-shrink-0 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                              {source.section}
                            </span>
                          )}
                        </h5>
                        <div className="flex-shrink-0 flex items-center gap-1">
                          {source.page && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              S. {source.page}
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">
                            {(source.score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 group-hover:text-gray-900 mb-2">
                        {source.content.length > 200 ? source.content.substring(0, 200) + '...' : source.content}
                      </p>

                      {/* Action Hint */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-blue-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>PDF öffnen und vollständigen Text lesen</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Metadata (Optional) */}
      <button
        onClick={() => setShowMetadata(!showMetadata)}
        className="w-full bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-sm text-gray-600 transition-colors"
      >
        {showMetadata ? '▼' : '▶'} Technische Details
      </button>

      {showMetadata && (
        <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2 animate-slideDown">
          <div className="flex justify-between">
            <span className="text-gray-600">Dokumente gefunden:</span>
            <span className="font-medium">{result.metadata.documents_found}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dokumente verwendet:</span>
            <span className="font-medium">{result.metadata.documents_used}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tokens verarbeitet:</span>
            <span className="font-medium">{result.metadata.usage.total_tokens.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Verarbeitungszeit:</span>
            <span className="font-medium">{(result.metadata.duration_ms / 1000).toFixed(2)}s</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={onOpenFollowUp}
          className="flex-1 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>Weitere Fragen stellen</span>
          </span>
        </button>
        <button
          onClick={onStartOver}
          className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Neue Analyse starten</span>
          </span>
        </button>
      </div>

      {/* Info */}
      <div className="text-center text-sm text-gray-500">
        <p className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Diese Analyse dient nur zur Information und ersetzt keine Rechtsberatung
        </p>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <PDFViewerModal
          isOpen={pdfViewerOpen}
          onClose={() => setPdfViewerOpen(false)}
          pdfUrl={selectedPdf.url}
          initialPage={selectedPdf.page}
          filename={selectedPdf.filename}
        />
      )}
    </div>
  )
}
