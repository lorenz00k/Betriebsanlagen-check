"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { defaultLocale } from "@/i18n"
import type { ComplianceInput } from "@/app/lib/complianceCheckerLogic"
import ComplianceCheckerWizard, { StepId } from "./_components/ComplianceCheckerWizard"

const STORAGE_INPUT = "complianceInput"
const STORAGE_START_STEP = "complianceStartStep" // optional (z.B. von Landing Page gesetzt)

export default function Page() {
  const params = useParams<{ locale: string }>()
  const paramLocale = params?.locale
  const locale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale
  void locale // (nur damit eslint nicht meckert, falls du locale hier nicht brauchst)

  const [initialForm, setInitialForm] = useState<ComplianceInput>({})
  const [initialStep, setInitialStep] = useState<StepId>("basics")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const rawForm = sessionStorage.getItem(STORAGE_INPUT)
      if (rawForm) setInitialForm(JSON.parse(rawForm) as ComplianceInput)

      const rawStep = sessionStorage.getItem(STORAGE_START_STEP)
      if (rawStep === "basics" || rawStep === "location" || rawStep === "operations" || rawStep === "context") {
        setInitialStep(rawStep)
        // optional: einmalig verwenden und dann löschen
        sessionStorage.removeItem(STORAGE_START_STEP)
      }
    } catch {
      // ignoriere parse errors
    } finally {
      setHydrated(true)
    }
  }, [])

  if (!hydrated) return null

  return <ComplianceCheckerWizard initialStep={initialStep} initialForm={initialForm} variant="page" />
}
