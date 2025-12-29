"use client"

import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import Link from "next/link"
import FAQStacked from "./FAQStacked"
import styles from "./FAQPageClient.module.css"

type Group = { id: string; questions: readonly string[] }

type FAQPageClientProps = {
  locale: string
  groups: readonly Group[]
}

export default function FAQPageClient({ locale, groups }: FAQPageClientProps) {
  const t = useTranslations("faq")
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  const toggleQuestion = (q: string) => setOpenQuestion(prev => (prev === q ? null : q))

  const uiGroups = useMemo(
    () =>
      groups.map(g => ({
        ...g,
        title: t(`groups.${g.id}.title`),
        description: t(`groups.${g.id}.description`),
      })),
    [groups, t],
  )

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

      <div className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.subtitle}>{t("subtitle")}</p>
          </header>

          <FAQStacked groups={uiGroups} openQuestion={openQuestion} onToggle={toggleQuestion} t={t} />

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
