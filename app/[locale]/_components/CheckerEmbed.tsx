"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"

import type { ComplianceInput } from "@/app/lib/complianceCheckerLogic"
import ComplianceCheckerWizard from "@/app/[locale]/check/_components/ComplianceCheckerWizard"
import { defaultLocale } from "@/i18n"

const STORAGE_INPUT = "complianceInput"
const STORAGE_START_STEP = "complianceStartStep"

export default function CheckerEmbed() {
    const router = useRouter()
    const params = useParams<{ locale: string }>()
    const paramLocale = params?.locale
    const locale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale

    return (
        <ComplianceCheckerWizard
            variant="embed"
            initialStep="basics"
            onCompleteBasics={(form: ComplianceInput) => {
                sessionStorage.setItem(STORAGE_INPUT, JSON.stringify(form))
                sessionStorage.setItem(STORAGE_START_STEP, "location") // Step 2 starten
                router.push(`/${locale}/check`)
            }}
        />
    )
}
