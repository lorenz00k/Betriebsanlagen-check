'use client'

import { useState } from 'react'
import { WizardStep, type StepConfig } from './WizardStep'
import { AIAnalysisResult } from './AIAnalysisResult'
import { FollowUpChat } from './FollowUpChat'

interface FormData {
  businessType: string
  size: number
  district: string
  outdoorSeating: boolean
  openingHours: string
  employees: string
  specialFeatures: string[]
}

export function GastroKIWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps: StepConfig[] = [
    {
      id: 'businessType',
      question: 'Welche Art von Gastrobetrieb möchten Sie eröffnen?',
      type: 'choice',
      options: [
        { value: 'restaurant', label: 'Restaurant', description: 'Vollständige Küche mit Sitzplätzen' },
        { value: 'cafe', label: 'Café', description: 'Kaffee, Kuchen und Snacks' },
        { value: 'bar', label: 'Bar/Lounge', description: 'Getränke und Live-Musik' },
        { value: 'imbiss', label: 'Imbiss/Takeaway', description: 'Schnelle Speisen zum Mitnehmen' },
        { value: 'bistro', label: 'Bistro', description: 'Kleine Karte, gemütliche Atmosphäre' },
      ],
    },
    {
      id: 'size',
      question: 'Wie groß wird Ihr Betrieb ungefähr?',
      type: 'number',
      unit: 'm²',
      min: 1,
      max: 1000,
      placeholder: 'z.B. 80',
      helpText: 'Gesamtfläche inklusive Küche, Lager und Gästebereiche',
    },
    {
      id: 'district',
      question: 'In welchem Wiener Bezirk planen Sie?',
      type: 'select',
      options: [
        { value: '1010', label: '1010 - Innere Stadt' },
        { value: '1020', label: '1020 - Leopoldstadt' },
        { value: '1030', label: '1030 - Landstraße' },
        { value: '1040', label: '1040 - Wieden' },
        { value: '1050', label: '1050 - Margareten' },
        { value: '1060', label: '1060 - Mariahilf' },
        { value: '1070', label: '1070 - Neubau' },
        { value: '1080', label: '1080 - Josefstadt' },
        { value: '1090', label: '1090 - Alsergrund' },
        { value: '1100', label: '1100 - Favoriten' },
        { value: '1110', label: '1110 - Simmering' },
        { value: '1120', label: '1120 - Meidling' },
        { value: '1130', label: '1130 - Hietzing' },
        { value: '1140', label: '1140 - Penzing' },
        { value: '1150', label: '1150 - Rudolfsheim-Fünfhaus' },
        { value: '1160', label: '1160 - Ottakring' },
        { value: '1170', label: '1170 - Hernals' },
        { value: '1180', label: '1180 - Währing' },
        { value: '1190', label: '1190 - Döbling' },
        { value: '1200', label: '1200 - Brigittenau' },
        { value: '1210', label: '1210 - Floridsdorf' },
        { value: '1220', label: '1220 - Donaustadt' },
        { value: '1230', label: '1230 - Liesing' },
      ],
    },
    {
      id: 'outdoorSeating',
      question: 'Planen Sie Außengastronomie (Schanigarten)?',
      type: 'boolean',
      helpText: 'Tische und Stühle auf öffentlichem Grund oder Privatgrund vor dem Lokal',
    },
    {
      id: 'openingHours',
      question: 'Welche Öffnungszeiten planen Sie?',
      type: 'choice',
      options: [
        { value: 'standard', label: '06:00 - 22:00', description: 'Standard-Öffnungszeiten (GFVO-konform)' },
        { value: 'extended', label: '06:00 - 02:00', description: 'Erweiterte Öffnungszeiten (erfordert Genehmigung)' },
        { value: '24-7', label: '24/7 Betrieb', description: 'Rund um die Uhr geöffnet' },
      ],
    },
    {
      id: 'employees',
      question: 'Wie viele Mitarbeiter werden Sie beschäftigen?',
      type: 'choice',
      options: [
        { value: 'none', label: 'Keine (Einzelunternehmen)', description: 'Sie führen den Betrieb alleine' },
        { value: '1-3', label: '1-3 Mitarbeiter', description: 'Kleines Team' },
        { value: '4-10', label: '4-10 Mitarbeiter', description: 'Mittleres Team' },
        { value: '10+', label: 'Mehr als 10 Mitarbeiter', description: 'Größeres Team' },
      ],
    },
    {
      id: 'specialFeatures',
      question: 'Welche besonderen Einrichtungen planen Sie?',
      type: 'multiselect',
      helpText: 'Sie können mehrere Optionen auswählen',
      options: [
        { value: 'kitchen', label: 'Vollküche mit Kochbetrieb', description: 'Herd, Backofen, professionelle Küchengeräte' },
        { value: 'music', label: 'Live-Musik oder DJ', description: 'Regelmäßige Musikveranstaltungen' },
        { value: 'ventilation', label: 'Spezielle Lüftungsanlage', description: 'Über Standard-Lüftung hinaus' },
        { value: 'none', label: 'Keine besonderen Einrichtungen', description: 'Standard-Ausstattung' },
      ],
    },
  ]

  const handleStepComplete = (data: any) => {
    const newFormData = { ...formData, ...data }
    setFormData(newFormData)

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Alle Schritte durch → Analyse starten
      performAnalysis(newFormData as FormData)
    }
  }

  const performAnalysis = async (finalData: FormData) => {
    setIsAnalyzing(true)
    setError(null)

    try {
      // Konstruiere Query aus Form-Daten
      const query = buildQuery(finalData)

      // Build user context
      const userContext = {
        betriebsart: getBusinessTypeLabel(finalData.businessType),
        groesse: `${finalData.size}m²`,
        bezirk: finalData.district,
        aussengastronomie: finalData.outdoorSeating,
        oeffnungszeiten: getOpeningHoursLabel(finalData.openingHours),
        mitarbeiter: getEmployeesLabel(finalData.employees),
        besonderheiten: finalData.specialFeatures?.join(', ') || 'Keine',
      }

      console.log('🔍 Starting RAG Analysis:', { query, userContext })

      const response = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userContext,
        }),
      })

      if (!response.ok) {
        throw new Error('RAG-Anfrage fehlgeschlagen')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Analyse fehlgeschlagen')
      }

      setAnalysisResult(result)
    } catch (error) {
      console.error('[ERROR] Analyse failed:', error)
      setError(error instanceof Error ? error.message : 'Unbekannter Fehler')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const buildQuery = (data: FormData): string => {
    const businessType = getBusinessTypeLabel(data.businessType)

    // Build keyword-based query for better vector search results
    // Instead of long natural language question, use focused keywords
    const keywords = [
      'Betriebsanlagengenehmigung',
      'Gastro',
      businessType,
      'Wien',
      'Genehmigungsverfahren',
      'Unterlagen',
      'Genehmigung',
      'Antrag',
      'MA 36',
    ]

    // Add outdoor seating keywords if applicable
    if (data.outdoorSeating) {
      keywords.push('Schanigarten', 'Außengastronomie', 'Gastgarten')
    }

    // Add opening hours keywords if extended/24-7
    if (data.openingHours === 'extended' || data.openingHours === '24-7') {
      keywords.push('Öffnungszeiten', 'erweiterte Öffnungszeiten', 'Nachtbetrieb')
    }

    // Add employee-related keywords if larger team
    if (data.employees === '4-10' || data.employees === '10+') {
      keywords.push('Mitarbeiter', 'Arbeitnehmer', 'Personal')
    }

    // Add special features keywords
    if (data.specialFeatures && data.specialFeatures.length > 0) {
      if (data.specialFeatures.includes('music')) {
        keywords.push('Musik', 'Veranstaltung', 'Lärm')
      }
      if (data.specialFeatures.includes('kitchen')) {
        keywords.push('Küche', 'Kochbetrieb')
      }
      if (data.specialFeatures.includes('ventilation')) {
        keywords.push('Lüftung', 'Lüftungsanlage')
      }
    }

    // Join keywords with spaces for embedding
    return keywords.join(' ')
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
      standard: '06:00 - 22:00 (Standard)',
      extended: '06:00 - 02:00 (Erweitert)',
      '24-7': '24/7 Betrieb',
    }
    return labels[hours] || hours
  }

  const getEmployeesLabel = (employees: string): string => {
    const labels: Record<string, string> = {
      none: 'Keine (Einzelunternehmen)',
      '1-3': '1-3 Mitarbeiter',
      '4-10': '4-10 Mitarbeiter',
      '10+': 'Mehr als 10 Mitarbeiter',
    }
    return labels[employees] || employees
  }

  // Render Logic - Analysis Result
  if (analysisResult && !showFollowUp) {
    return (
      <AIAnalysisResult
        result={analysisResult}
        formData={formData as FormData}
        onStartOver={() => {
          setCurrentStep(0)
          setFormData({})
          setAnalysisResult(null)
          setError(null)
        }}
        onOpenFollowUp={() => setShowFollowUp(true)}
      />
    )
  }

  // Render Logic - Follow-up Chat
  if (showFollowUp) {
    return (
      <FollowUpChat
        initialContext={formData as FormData}
        previousAnalysis={analysisResult}
        onBack={() => setShowFollowUp(false)}
      />
    )
  }

  // Render Logic - Loading
  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Analysiere Ihre Anforderungen...
        </h3>
        <p className="text-gray-600 mb-6">
          Durchsuche Gesetze, Verordnungen und Vorschriften
        </p>
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-sm text-gray-500">Dies dauert etwa 5-10 Sekunden</p>
      </div>
    )
  }

  // Render Logic - Error State
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 border border-red-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-900 mb-3">Analyse fehlgeschlagen</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setError(null)
                performAnalysis(formData as FormData)
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
            >
              Erneut versuchen
            </button>
            <button
              onClick={() => {
                setCurrentStep(0)
                setFormData({})
                setError(null)
              }}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Von vorne beginnen
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render Logic - Wizard Steps
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Schritt {currentStep + 1} von {steps.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="flex gap-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                idx <= currentStep
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Step */}
      <WizardStep
        step={steps[currentStep]}
        onComplete={handleStepComplete}
        onBack={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
        canGoBack={currentStep > 0}
      />

      {/* Context Summary - Show what we've collected */}
      {currentStep > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Ihre Angaben bisher:</p>
          <div className="flex flex-wrap gap-2">
            {formData.businessType && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                {getBusinessTypeLabel(formData.businessType)}
              </span>
            )}
            {formData.size && (
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                {formData.size}m²
              </span>
            )}
            {formData.district && (
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                {formData.district}
              </span>
            )}
            {formData.outdoorSeating !== undefined && (
              <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                {formData.outdoorSeating ? 'Mit Schanigarten' : 'Ohne Schanigarten'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
