'use client'

// FAQPageClient renders the interactive accordion and structured FAQ schema for
// the currently selected locale using translated question and answer content.
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import Link from 'next/link'

type FAQPageClientProps = {
  locale: string
}

// Displays localized FAQ copy with accordion interactions and emits FAQPage JSON-LD.
export default function FAQPageClient({ locale }: FAQPageClientProps) {
  const t = useTranslations('faq')
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  const questions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']

  const toggleQuestion = (q: string) => {
    setOpenQuestion(openQuestion === q ? null : q)
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": t(`questions.${q}.question`),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": t(`questions.${q}.answer`),
      },
    })),
  }

  const faqSchemaJson = JSON.stringify(faqSchema)
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E')
    .replace(/&/g, '\\u0026')

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: faqSchemaJson }}
      />
      <div className="section">
        <div className="layout-container max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-balance">{t('title')}</h1>
            <p className="mx-auto text-lg md:text-xl text-[color:var(--color-muted)] max-w-3xl">{t('subtitle')}</p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q} className="faq-item" style={{ animation: 'fade-up 0.4s ease forwards' }}>
                <button onClick={() => toggleQuestion(q)} className="faq-trigger">
                  <span className="flex-1 text-left text-balance">{t(`questions.${q}.question`)}</span>
                  <svg
                    className={`w-5 h-5 text-[color:var(--color-accent)] transition-transform ${openQuestion === q ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
                  style={{
                    maxHeight: openQuestion === q ? '480px' : '0px',
                    opacity: openQuestion === q ? 1 : 0,
                  }}
                >
                  <div className="faq-content">{t(`questions.${q}.answer`)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="surface-card text-center space-y-4" style={{ background: 'var(--color-surface-muted)' }}>
            <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--color-fg)]">{t('cta.title')}</h2>
            <p className="text-lg text-[color:var(--color-muted)]">{t('cta.description')}</p>
            <Link
              href={`/${locale}/check`}
              className="btn btn-primary inline-flex"
              style={{ justifyContent: 'center' }}
            >
              {t('cta.button')}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
