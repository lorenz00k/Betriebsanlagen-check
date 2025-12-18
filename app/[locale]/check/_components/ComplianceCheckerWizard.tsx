"use client"

import React, { useMemo, useState, type ChangeEvent } from "react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"

import {
    type BusinessSector,
    type HospitalitySubtype,
    type WorkshopSubtype,
    type BooleanChoice,
    type OperatingPattern,
    type ComplianceInput,
    evaluateCompliance,
} from "@/app/lib/complianceCheckerLogic"
import { defaultLocale } from "@/i18n"
import { InfoBox } from "../../_components/info-box"
import { helpTexts } from "../../_data/help-texts"

export type StepId = "basics" | "location" | "operations" | "context"
const steps: StepId[] = ["basics", "location", "operations", "context"]

interface Option<T extends string> {
    value: T
    label: string
    description?: string
}

const BOOLEAN_OPTIONS = (t: (key: string) => string): Option<BooleanChoice>[] => [
    { value: "yes", label: t("form.options.yes") },
    { value: "no", label: t("form.options.no") },
]

function parseNumber(value: string): number | undefined {
    if (!value) return undefined
    const parsed = Number(value.replace(",", "."))
    return Number.isFinite(parsed) ? parsed : undefined
}

function SelectionGrid<T extends string>({
    options,
    selected,
    onSelect,
}: {
    options: Option<T>[]
    selected?: T
    onSelect: (value: T) => void
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onSelect(option.value)}
                    type="button"
                    className={`group p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${selected === option.value
                        ? "border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                >
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold text-gray-900">{option.label}</span>
                        {option.description ? (
                            <span className="text-sm text-gray-600 leading-relaxed">{option.description}</span>
                        ) : null}
                    </div>
                </button>
            ))}
        </div>
    )
}

export type ComplianceCheckerWizardProps = {
    initialStep?: StepId
    initialForm?: ComplianceInput

    /**
     * "page": zeigt den kompletten Page-Chrome (Background, max-width, etc.)
     * "embed": nur der Inhalt (für Landing Page Container)
     */
    variant?: "page" | "embed"

    /**
     * Wenn gesetzt: Bei Next in Step "basics" wird NICHT intern weitergeschaltet,
     * sondern dieser Callback aufgerufen (z.B. speichern + zu /check navigieren).
     */
    onCompleteBasics?: (form: ComplianceInput) => void
}

export default function ComplianceCheckerWizard({
    initialStep = "basics",
    initialForm = {},
    variant = "page",
    onCompleteBasics,
}: ComplianceCheckerWizardProps) {
    const t = useTranslations("complianceChecker")
    const router = useRouter()
    const params = useParams<{ locale: string }>()
    const paramLocale = params?.locale
    const locale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale

    const infoLocale: "de" | "en" = locale === "en" ? "en" : "de"
    const info = helpTexts[infoLocale]

    const [currentStep, setCurrentStep] = useState<StepId>(initialStep)
    const [form, setForm] = useState<ComplianceInput>(initialForm)

    const stepIndex = steps.indexOf(currentStep)

    const sectorOptions = useMemo<Option<BusinessSector>[]>(
        () => [
            { value: "retail", label: t("form.sector.options.retail") },
            { value: "office", label: t("form.sector.options.office") },
            { value: "gastronomyHotel", label: t("form.sector.options.gastronomyHotel") },
            { value: "accommodation", label: t("form.sector.options.accommodation") },
            { value: "workshop", label: t("form.sector.options.workshop") },
            { value: "warehouse", label: t("form.sector.options.warehouse") },
            { value: "cosmetics", label: t("form.sector.options.cosmetics") },
            { value: "dataCenter", label: t("form.sector.options.dataCenter") },
            { value: "selfService", label: t("form.sector.options.selfService") },
            { value: "other", label: t("form.sector.options.other") },
        ],
        [t],
    )

    const hospitalityOptions: Option<HospitalitySubtype>[] = useMemo(
        () => [
            {
                value: "beherbergung",
                label: t("form.hospitalitySubtype.options.beherbergung"),
                description: t("form.hospitalitySubtype.descriptions.beherbergung"),
            },
            {
                value: "iceSalon",
                label: t("form.hospitalitySubtype.options.iceSalon"),
                description: t("form.hospitalitySubtype.descriptions.iceSalon"),
            },
            {
                value: "otherGastro",
                label: t("form.hospitalitySubtype.options.otherGastro"),
                description: t("form.hospitalitySubtype.descriptions.otherGastro"),
            },
        ],
        [t],
    )

    const workshopOptions: Option<WorkshopSubtype>[] = useMemo(
        () => [
            { value: "tailor", label: t("form.workshopSubtype.options.tailor") },
            { value: "shoeService", label: t("form.workshopSubtype.options.shoeService") },
            { value: "textilePickup", label: t("form.workshopSubtype.options.textilePickup") },
            { value: "otherWorkshop", label: t("form.workshopSubtype.options.otherWorkshop") },
        ],
        [t],
    )

    const operatingOptions: Option<OperatingPattern>[] = useMemo(
        () => [
            {
                value: "gfvoWindow",
                label: t("form.operatingPattern.options.gfvoWindow"),
                description: t("form.operatingPattern.descriptions.gfvoWindow"),
            },
            {
                value: "extendedHours",
                label: t("form.operatingPattern.options.extendedHours"),
                description: t("form.operatingPattern.descriptions.extendedHours"),
            },
            {
                value: "roundTheClock",
                label: t("form.operatingPattern.options.roundTheClock"),
                description: t("form.operatingPattern.descriptions.roundTheClock"),
            },
        ],
        [t],
    )

    const setField = <K extends keyof ComplianceInput>(field: K, value: ComplianceInput[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    // ✅ strikt typisiert: nur Felder, die BooleanChoice|undefined sind
    type BooleanField = Extract<{
        [K in keyof ComplianceInput]: ComplianceInput[K] extends BooleanChoice | undefined ? K : never
    }[keyof ComplianceInput],
        string
    >

    const setBooleanField = (field: BooleanField, value: BooleanChoice) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleNumericChange =
        (field: keyof ComplianceInput) => (event: ChangeEvent<HTMLInputElement>) => {
            setField(field, parseNumber(event.target.value) as ComplianceInput[typeof field])
        }

    const canProceed = useMemo(() => {
        if (currentStep === "basics") {
            if (!form.sector || !form.isStationary || !form.isOnlyTemporary) return false

            if (
                (form.sector === "gastronomyHotel" || form.sector === "accommodation") &&
                !form.hospitalitySubtype
            ) {
                return false
            }

            if (form.sector === "workshop" && !form.workshopSubtype) return false
            if (form.areaSqm === undefined) return false

            if (
                (form.sector === "accommodation" || form.hospitalitySubtype === "beherbergung") &&
                ((form.bedCount ?? undefined) === undefined ||
                    !form.buildingUseExclusive ||
                    form.hasWellnessFacilities === undefined ||
                    form.servesFullMeals === undefined)
            ) {
                return false
            }

            return true
        }

        if (currentStep === "location") return Boolean(form.zoningClarified && form.buildingConsentPresent)

        if (currentStep === "operations") {
            return Boolean(
                form.operatingPattern &&
                form.hasExternalVentilation &&
                form.storesRegulatedHazardous &&
                form.storesLabelledHazardous &&
                form.usesLoudMusic &&
                form.ippcOrSevesoRelevant,
            )
        }

        if (currentStep === "context") {
            return Boolean(
                form.expectedImpairments &&
                form.locatedInInfrastructureSite &&
                form.locatedInApprovedComplex &&
                form.existingPermitHistory,
            )
        }

        return false
    }, [currentStep, form])

    const handleNext = () => {
        // EMBED: nach Step 1 raus in /check
        if (currentStep === "basics" && onCompleteBasics) {
            onCompleteBasics(form)
            return
        }

        if (stepIndex === steps.length - 1) {
            const result = evaluateCompliance(form)
            sessionStorage.setItem("complianceResult", JSON.stringify(result))
            sessionStorage.setItem("complianceInput", JSON.stringify(form))
            router.push(`/${locale}/check/result`)
            return
        }

        setCurrentStep(steps[stepIndex + 1])
    }

    const handleBack = () => {
        if (stepIndex === 0) return
        setCurrentStep(steps[stepIndex - 1])
    }

    const renderStep = () => {
        switch (currentStep) {
            case "basics":
                return (
                    <div className="space-y-8">
                        <div>
                            <div className="mb-3 flex items-start gap-2">
                                <h2 className="text-2xl font-bold text-gray-900">{t("form.sector.question")}</h2>
                                <InfoBox text={info.category} />
                            </div>
                            <p className="text-gray-600 mb-4">{t("form.sector.helper")}</p>
                            <SelectionGrid<BusinessSector>
                                options={sectorOptions}
                                selected={form.sector}
                                onSelect={(value) => {
                                    setField("sector", value)
                                    if (value !== "gastronomyHotel" && value !== "accommodation") {
                                        setField("hospitalitySubtype", undefined)
                                    }
                                    if (value === "accommodation") {
                                        setField("hospitalitySubtype", "beherbergung")
                                    }
                                    if (value !== "workshop") setField("workshopSubtype", undefined)
                                }}
                            />
                        </div>

                        {(form.sector === "gastronomyHotel" || form.sector === "accommodation") && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {t("form.hospitalitySubtype.question")}
                                </h3>
                                <SelectionGrid<HospitalitySubtype>
                                    options={hospitalityOptions}
                                    selected={form.hospitalitySubtype}
                                    onSelect={(value) => setField("hospitalitySubtype", value)}
                                />
                            </div>
                        )}

                        {form.sector === "workshop" && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {t("form.workshopSubtype.question")}
                                </h3>
                                <SelectionGrid<WorkshopSubtype>
                                    options={workshopOptions}
                                    selected={form.workshopSubtype}
                                    onSelect={(value) => setField("workshopSubtype", value)}
                                />
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="areaSqm" className="block text-sm font-medium text-gray-700 mb-2">
                                    {t("form.areaSqm.label")}
                                </label>
                                <input
                                    id="areaSqm"
                                    type="number"
                                    min={0}
                                    value={form.areaSqm ?? ""}
                                    onChange={handleNumericChange("areaSqm")}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={t("form.areaSqm.placeholder")}
                                />
                            </div>

                            <div>
                                <div className="mb-2 flex items-start gap-2">
                                    <label htmlFor="personCount" className="text-sm font-medium text-gray-700">
                                        {t("form.personCount.label")}
                                    </label>
                                    <InfoBox text={info.seats} />
                                </div>
                                <input
                                    id="personCount"
                                    type="number"
                                    min={0}
                                    value={form.personCount ?? ""}
                                    onChange={handleNumericChange("personCount")}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={t("form.personCount.placeholder")}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {t("form.isStationary.question")}
                                </label>
                                <SelectionGrid<BooleanChoice>
                                    options={BOOLEAN_OPTIONS(t)}
                                    selected={form.isStationary}
                                    onSelect={(value) => setField("isStationary", value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        {t("form.isOnlyTemporary.question")}
                                    </span>
                                    <InfoBox text={info.temporary} />
                                </div>
                                <SelectionGrid<BooleanChoice>
                                    options={BOOLEAN_OPTIONS(t)}
                                    selected={form.isOnlyTemporary}
                                    onSelect={(value) => setField("isOnlyTemporary", value)}
                                />
                            </div>
                        </div>

                        {(form.sector === "accommodation" || form.hospitalitySubtype === "beherbergung") && (
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <div className="mb-2 flex items-start gap-2">
                                            <label htmlFor="bedCount" className="text-sm font-medium text-gray-700">
                                                {t("form.bedCount.label")}
                                            </label>
                                            <InfoBox text={info.sanitation} />
                                        </div>
                                        <input
                                            id="bedCount"
                                            type="number"
                                            min={0}
                                            value={form.bedCount ?? ""}
                                            onChange={handleNumericChange("bedCount")}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder={t("form.bedCount.placeholder")}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                {t("form.buildingUseExclusive.question")}
                                            </span>
                                            <InfoBox text={info.fireEscape} />
                                        </div>
                                        <SelectionGrid<BooleanChoice>
                                            options={BOOLEAN_OPTIONS(t)}
                                            selected={form.buildingUseExclusive}
                                            onSelect={(value) => setField("buildingUseExclusive", value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t("form.hasWellnessFacilities.question")}
                                        </label>
                                        <SelectionGrid<BooleanChoice>
                                            options={BOOLEAN_OPTIONS(t)}
                                            selected={form.hasWellnessFacilities}
                                            onSelect={(value) => setField("hasWellnessFacilities", value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            {t("form.servesFullMeals.question")}
                                        </span>
                                        <InfoBox text={info.kitchen} />
                                    </div>
                                    <SelectionGrid<BooleanChoice>
                                        options={BOOLEAN_OPTIONS(t)}
                                        selected={form.servesFullMeals}
                                        onSelect={(value) => setField("servesFullMeals", value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )

            case "location":
                return (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("form.location.heading")}</h2>
                            <p className="text-gray-600">{t("form.location.helper")}</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {t("form.zoningClarified.question")}
                                </label>
                                <SelectionGrid<BooleanChoice>
                                    options={BOOLEAN_OPTIONS(t)}
                                    selected={form.zoningClarified}
                                    onSelect={(value) => setField("zoningClarified", value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {t("form.buildingConsentPresent.question")}
                                </label>
                                <SelectionGrid<BooleanChoice>
                                    options={BOOLEAN_OPTIONS(t)}
                                    selected={form.buildingConsentPresent}
                                    onSelect={(value) => setField("buildingConsentPresent", value)}
                                />
                            </div>
                        </div>
                    </div>
                )

            case "operations":
                return (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("form.operations.heading")}</h2>
                            <p className="text-gray-600">{t("form.operations.helper")}</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        {t("form.operatingPattern.question")}
                                    </span>
                                    <InfoBox text={info.openingHours} />
                                </div>

                                <SelectionGrid<OperatingPattern>
                                    options={operatingOptions}
                                    selected={form.operatingPattern}
                                    onSelect={(value) => setField("operatingPattern", value)}
                                />
                            </div>

                            {(
                                [
                                    ["hasExternalVentilation", info.ventilation],
                                    ["storesRegulatedHazardous", info.chemicals],
                                    ["storesLabelledHazardous", info.chemicals],
                                    ["usesLoudMusic", info.noise],
                                ] as const
                            ).map(([field, infoText]) => (
                                <div key={field} className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            {t(`form.${field}.question`)}
                                        </span>
                                        <InfoBox text={infoText} />
                                    </div>

                                    <SelectionGrid<BooleanChoice>
                                        options={BOOLEAN_OPTIONS(t)}
                                        selected={form[field]}
                                        onSelect={(value) => setBooleanField(field, value)}
                                    />
                                </div>
                            ))}

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {t("form.ippcOrSevesoRelevant.question")}
                                </label>
                                <SelectionGrid<BooleanChoice>
                                    options={BOOLEAN_OPTIONS(t)}
                                    selected={form.ippcOrSevesoRelevant}
                                    onSelect={(value) => setField("ippcOrSevesoRelevant", value)}
                                />
                            </div>
                        </div>
                    </div>
                )

            case "context":
                return (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("form.context.heading")}</h2>
                            <p className="text-gray-600">{t("form.context.helper")}</p>
                        </div>

                        <div className="space-y-6">
                            {(
                                [
                                    "expectedImpairments",
                                    "locatedInInfrastructureSite",
                                    "locatedInApprovedComplex",
                                    "existingPermitHistory",
                                ] as const
                            ).map((field) => (
                                <div key={field} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t(`form.${field}.question`)}
                                    </label>

                                    <SelectionGrid<BooleanChoice>
                                        options={BOOLEAN_OPTIONS(t)}
                                        selected={form[field]}
                                        onSelect={(value) => setBooleanField(field, value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )
        }
    }

    return (
        <div
            className={
                variant === "page"
                    ? "min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12"
                    : ""
            }
        >
            <div className={variant === "page" ? "max-w-5xl mx-auto px-4" : ""}>
                <div
                    className={
                        variant === "page"
                            ? "bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100"
                            : ""
                    }
                >
                    {variant === "page" ? (
                        <>
                            <div className="mb-10 text-center">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                                    {t("badge")}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
                                    {t("title")}
                                </h1>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t("subtitle")}</p>
                            </div>

                            <div className="flex items-center justify-between mb-10">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full mr-4">
                                    <div
                                        className="h-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-300"
                                        style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-600">
                                    {t("progress", { current: stepIndex + 1, total: steps.length })}
                                </span>
                            </div>
                        </>
                    ) : null}

                    <div className="space-y-8">{renderStep()}</div>

                    <div className="mt-12 flex flex-col md:flex-row gap-4 justify-between">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={stepIndex === 0 || Boolean(onCompleteBasics)}
                            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            {t("actions.back")}
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={!canProceed}
                            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {stepIndex === steps.length - 1 ? t("actions.finish") : t("actions.next")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
