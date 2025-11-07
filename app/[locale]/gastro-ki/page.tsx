import { GastroKIWizard } from '@/app/components/gastro-ki/GastroKIWizard'

export default function GastroKIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex flex-col items-center gap-4 mb-6">
              {/* Modern Badge Icon */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl rotate-6 shadow-lg flex items-center justify-center">
                  <svg className="w-9 h-9 text-white -rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1">
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs font-bold shadow-md">
                    Beta
                  </span>
                </div>
              </div>

              <h1 className="text-5xl font-bold text-gray-900">
                Gastro KI-Assistent
              </h1>
            </div>

            <p className="text-xl text-gray-700 mb-4 font-medium">
              Ihr intelligenter Begleiter für Betriebsanlagengenehmigungen im Gastgewerbe
            </p>

            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Statt eines starren Fragebogens führen wir ein <strong>Gespräch</strong> mit Ihnen.
              Die KI analysiert Ihre Situation in Echtzeit und Sie können <strong>Follow-up-Fragen</strong> stellen!
            </p>

            {/* Features */}
            <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="font-semibold text-gray-900 mb-1">Conversational</div>
                <div className="text-sm text-gray-600">Natürliches Gespräch statt starrem Formular</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="font-semibold text-gray-900 mb-1">KI-Powered</div>
                <div className="text-sm text-gray-600">Basiert auf aktuellen Gesetzen & Verordnungen</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="font-semibold text-gray-900 mb-1">Sofort-Antworten</div>
                <div className="text-sm text-gray-600">Personalisierte Analyse in Sekunden</div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-bold text-yellow-900 mb-1">Wichtiger Hinweis</h3>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  Diese KI-Analyse dient ausschließlich der Information und ersetzt keine Rechtsberatung.
                  Für verbindliche Auskünfte wenden Sie sich bitte an einen Fachanwalt oder die zuständige Behörde (MA 36).
                </p>
              </div>
            </div>
          </div>

          {/* Wizard Component */}
          <GastroKIWizard />
        </div>
      </div>
    </div>
  )
}
