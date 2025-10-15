'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import Link from 'next/link'

export default function FAQPage() {
  const t = useTranslations('faq')
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  const questions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']

  const toggleQuestion = (q: string) => {
    setOpenQuestion(openQuestion === q ? null : q)
  }

  // Schema.org FAQPage structured data for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": t(`questions.${q}.question`),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": t(`questions.${q}.answer`)
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                onClick={() => toggleQuestion(q)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {t(`questions.${q}.question`)}
                </span>
                <svg
                  className={`w-6 h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                    openQuestion === q ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openQuestion === q
                    ? 'max-h-[1000px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-gray-700 leading-relaxed border-t border-gray-100">
                  {t(`questions.${q}.answer`)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Noch Fragen offen?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Nutzen Sie unseren kostenlosen Check und finden Sie heraus, ob Ihr
            Betrieb eine Genehmigung benötigt.
          </p>
          <Link
            href="/check"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Jetzt Check starten
          </Link>
        </div>
        </div>
      </div>
    </>
  )
}
