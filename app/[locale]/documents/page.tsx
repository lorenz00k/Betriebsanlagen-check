'use client'

import { useTranslations } from 'next-intl'

export default function DocumentsPage() {
  const t = useTranslations('documents')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <p className="text-lg text-gray-700 leading-relaxed">{t('intro')}</p>
        </div>

        {/* Main Content - Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-white text-blue-600 rounded-full font-bold">
                  1
                </span>
                Vorprüfung und Beratung
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Kontaktieren Sie die zuständige MA 36 (Technische Gewerbeangelegenheiten) für eine erste
                Beratung.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Kontakt:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>📞 Telefon: +43 1 4000-25310</li>
                  <li>📧 E-Mail: post@ma36.wien.gv.at</li>
                  <li>🌐 Website: www.wien.gv.at/ma36</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-white text-green-600 rounded-full font-bold">
                  2
                </span>
                Erforderliche Dokumente vorbereiten
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">Typischerweise benötigte Unterlagen:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <strong className="text-gray-900">Antragsformular</strong>
                    <p className="text-sm text-gray-600">Vollständig ausgefüllt und unterschrieben</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <strong className="text-gray-900">Gewerbeberechtigung</strong>
                    <p className="text-sm text-gray-600">Nachweis der Gewerbeberechtigung</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <strong className="text-gray-900">Pläne und Skizzen</strong>
                    <p className="text-sm text-gray-600">
                      Lagepläne, Grundrisse, Schnitte (maßstabsgetreu)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <strong className="text-gray-900">Technische Beschreibung</strong>
                    <p className="text-sm text-gray-600">
                      Detaillierte Beschreibung der Betriebsanlage und ihrer Einrichtungen
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <strong className="text-gray-900">Nachbarschaftsinformation</strong>
                    <p className="text-sm text-gray-600">Zustimmung oder Information der Nachbarn</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <strong className="text-gray-900">Miet-/Eigentumsnachweis</strong>
                    <p className="text-sm text-gray-600">
                      Nachweis über das Recht zur Nutzung der Räumlichkeiten
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-white text-purple-600 rounded-full font-bold">
                  3
                </span>
                Antrag einreichen
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Reichen Sie alle Unterlagen vollständig bei der MA 36 ein. Die Einreichung kann erfolgen:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">📮 Persönlich</h3>
                  <p className="text-sm text-gray-700">Dresdner Straße 73-75, 1200 Wien</p>
                  <p className="text-sm text-gray-700">Mo-Fr: 8:00-15:30 Uhr</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">✉️ Postweg</h3>
                  <p className="text-sm text-gray-700">MA 36 - Technische Gewerbeangelegenheiten</p>
                  <p className="text-sm text-gray-700">Dresdner Straße 73-75, 1200 Wien</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-white text-orange-600 rounded-full font-bold">
                  4
                </span>
                Verfahren und Genehmigung
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">Nach der Antragstellung:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Prüfung der Unterlagen durch die Behörde (ca. 2-4 Wochen)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Eventuell Nachforderung zusätzlicher Unterlagen</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Ggf. Verhandlung oder Augenschein vor Ort</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Bescheiderlassung (rechtskräftige Genehmigung oder Ablehnung)</span>
                </li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700">
                  <strong>⏱️ Dauer:</strong> Das gesamte Verfahren dauert in der Regel 2-6 Monate, abhängig
                  von der Komplexität der Betriebsanlage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Weitere Hilfe benötigt?</h2>
          <p className="mb-6">
            Die Wirtschaftskammer Wien bietet kostenlose Beratung für Gründer an. Nutzen Sie diese
            Unterstützung, um sicherzustellen, dass Ihr Antrag vollständig und korrekt ist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.wko.at/service/wirtschaftsrecht-gewerberecht/Betriebsanlagengenehmigung.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              WKO Infos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <a
              href="https://www.wien.gv.at/ma36"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              MA 36 Website
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
