"use client"

import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import Link from "next/link"
import FAQStacked from "./FAQStacked" // neu

type Group = { id: string; questions: readonly string[] }

type FAQPageClientProps = {
  locale: string
  groups: readonly Group[]
}

export default function FAQPageClient({ locale, groups }: FAQPageClientProps) {
  const t = useTranslations("faq")
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  const toggleQuestion = (q: string) => setOpenQuestion(prev => (prev === q ? null : q))

  // UI-Texte aus i18n ableiten (hier passiert das, nicht im Server)
  const uiGroups = useMemo(
    () =>
      groups.map(g => ({
        ...g,
        title: t(`groups.${g.id}.title`),
        description: t(`groups.${g.id}.description`),
      })),
    [groups, t],
  )

  // Für Schema brauchst du alle Fragen flach
  const allQuestions = useMemo(() => groups.flatMap(g => [...g.questions]), [groups])

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: allQuestions.map(q => ({
        "@type": "Question",
        name: t(`questions.${q}.question`),
        acceptedAnswer: { "@type": "Answer", text: t(`questions.${q}.answer`) },
      })),
    }),
    [allQuestions, t],
  )

  const faqSchemaJson = JSON.stringify(faqSchema)
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/&/g, "\\u0026")

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: faqSchemaJson }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">{t("subtitle")}</p>
          </div>

          {/* Stacked Themen-Cards + Accordion innen */}
          <FAQStacked
            groups={uiGroups}
            openQuestion={openQuestion}
            onToggle={toggleQuestion}
            t={t}
          />

          {/* CTA */}
          <div className="cta-panel mt-10">
            <h2 className="block">{t("cta.title")}</h2>
            <p className="block">{t("cta.description")}</p>
            <Link href={`/${locale}/check`} className="btn btn-secondary">
              {t("cta.button")}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
