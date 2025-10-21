"use client"

// ResultPageClient presents the checker evaluation with detailed reasoning,
// document lists, occupational safety guidance, and operational obligations.
import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import Link from "next/link"

import type { ComplianceResult } from "@/app/lib/complianceCheckerLogic"

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResult = sessionStorage.getItem("complianceResult")
    if (storedResult) {
      setResult(JSON.parse(storedResult) as ComplianceResult)
    } else {
      router.push(`/${locale}/check`)
    }
    setLoading(false)
  }, [locale, router])

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
      {
        title: t("sections.quickReferences"),
        items: result.quickReferenceKeys.map((key) => translate(key)),
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

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 md:p-8 mt-10">
          <h3 className="text-xl font-semibold text-yellow-800 mb-4">{t("disclaimer.title")}</h3>
          <ul className="space-y-3">
            {result.disclaimerKeys.map((key) => (
              <li key={key} className="text-yellow-900 leading-relaxed">{translate(key)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
