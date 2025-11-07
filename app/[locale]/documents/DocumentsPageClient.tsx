'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  Clock,
  Euro,
  FileText,
  Flame,
  FolderOpen,
  Globe,
  Mail,
  Phone,
  Users,
  Volume2,
  Wind,
  Wrench,
} from 'lucide-react'

import DocumentCard from '@/app/components/Documents/DocumentCard'
import { DOCUMENTS } from '@/app/config/documents'
import BreakText from '@/components/ui/BreakText'

const STEP_IDS = ['step1', 'step2', 'step3', 'step4'] as const
const STEP2_ITEMS = ['applicationForm', 'businessLicense', 'plans', 'technicalDescription', 'neighbors', 'tenancy'] as const
const STEP3_OPTIONS = ['inPerson', 'mail'] as const
const STEP4_ITEMS = ['confirmation', 'assessment', 'questions', 'decision'] as const
const EXPERT_REPORTS = ['noise', 'ventilation', 'fireProtection'] as const
const FEES = ['federalFees', 'expertFees', 'ownExperts', 'time'] as const
const TIPS = ['planEarly', 'contactAuthority', 'useChecklists', 'stayFlexible'] as const
const STEP1_CONTACT = ['phone', 'email', 'website'] as const

export default function DocumentsPageClient() {
  const t = useTranslations('documents')
  const activeLocale = useLocale()
  const [filter, setFilter] = useState<'all' | 'required' | 'optional' | 'guide'>('all')

  const filteredDocuments = filter === 'all'
    ? DOCUMENTS
    : DOCUMENTS.filter(doc => doc.category === filter)

  const totalDocumentsCount = DOCUMENTS.length
  const requiredDocumentsCount = DOCUMENTS.filter(doc => doc.category === 'required').length
  const guideDocumentsCount = DOCUMENTS.filter(doc => doc.category === 'guide').length

  const normalizeUrl = (value: string) => {
    if (/^https?:\/\//i.test(value)) return value
    return `https://${value}`
  }

  const normalizeTel = (value: string) => value.replace(/[^+\d]/g, '')

  const howToStepElements = (stepId: (typeof STEP_IDS)[number]) => {
    const elements: Record<string, unknown>[] = [
      {
        '@type': 'HowToDirection',
        text: t(`steps.${stepId}.description`),
      },
    ]

    if (stepId === 'step1') {
      STEP1_CONTACT.forEach(contactId => {
        const value = t(`steps.step1.contact.${contactId}.value`)

        if (!value) return

        if (contactId === 'website') {
          elements.push({
            '@type': 'HowToDirection',
            text: value,
            url: normalizeUrl(value),
          })
          return
        }

        const label = t(`steps.step1.contact.${contactId}.label`)
        const direction: Record<string, unknown> = {
          '@type': 'HowToDirection',
          text: `${label}: ${value}`,
        }

        if (contactId === 'phone') {
          direction.url = `tel:${normalizeTel(value)}`
        }

        if (contactId === 'email') {
          direction.url = `mailto:${value}`
        }

        elements.push(direction)
      })
    }

    if (stepId === 'step2') {
      STEP2_ITEMS.forEach(itemId => {
        elements.push({
          '@type': 'HowToSupply',
          name: t(`steps.step2.items.${itemId}.title`),
          description: t(`steps.step2.items.${itemId}.description`),
        })
      })
    }

    if (stepId === 'step3') {
      STEP3_OPTIONS.forEach(optionId => {
        elements.push({
          '@type': 'HowToDirection',
          name: t(`steps.step3.options.${optionId}.title`),
          text: `${t(`steps.step3.options.${optionId}.line1`)} ${t(`steps.step3.options.${optionId}.line2`)}`.trim(),
        })
      })
    }

    if (stepId === 'step4') {
      STEP4_ITEMS.forEach(itemId => {
        elements.push({
          '@type': 'HowToDirection',
          name: t(`steps.step4.items.${itemId}.title`),
          text: t(`steps.step4.items.${itemId}.description`),
        })
      })

      elements.push({
        '@type': 'HowToTip',
        text: t('steps.step4.processingTime'),
      })
    }

    return elements
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('title'),
    description: t('intro'),
    step: STEP_IDS.map((stepId, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: t(`steps.${stepId}.title`),
      itemListElement: howToStepElements(stepId),
    })),
    tool: EXPERT_REPORTS.map(reportId => ({
      '@type': 'HowToTool',
      name: t(`expertReports.items.${reportId}.title`),
      description: t(`expertReports.items.${reportId}.description`),
    })),
  }

  const howToSchemaJson = JSON.stringify(howToSchema)
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E')
    .replace(/&/g, '\\u0026')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: howToSchemaJson }}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              <BreakText className="block">{t('title')}</BreakText>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              <BreakText className="block">{t('subtitle')}</BreakText>
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Intro */}
        <div className="mb-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <p className="text-gray-700 leading-relaxed">
            <BreakText className="block">{t('intro')}</BreakText>
          </p>
        </div>

        {/* Schritt-für-Schritt Anleitung */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-blue-600" />
            <BreakText className="block">{t('steps.step1.title')}</BreakText>
          </h2>

          {/* Step 1: Vorprüfung */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              1. <BreakText className="inline">{t('steps.step1.title')}</BreakText>
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              <BreakText className="block">{t('steps.step1.description')}</BreakText>
            </p>

            <h4 className="font-bold text-gray-900 mb-4">
              <BreakText className="block">{t('steps.step1.contactTitle')}</BreakText>
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="tel:+4314000-25310"
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    <BreakText className="block">{t('steps.step1.contact.phone.label')}</BreakText>
                  </div>
                  <div className="text-sm text-gray-600">
                    <BreakText className="block">{t('steps.step1.contact.phone.value')}</BreakText>
                  </div>
                </div>
              </a>

              <a
                href="mailto:post@ma36.wien.gv.at"
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    <BreakText className="block">{t('steps.step1.contact.email.label')}</BreakText>
                  </div>
                  <div className="text-sm text-gray-600">
                    <BreakText className="block">{t('steps.step1.contact.email.value')}</BreakText>
                  </div>
                </div>
              </a>

              <a
                href="https://www.wien.gv.at/kontakte/ma36/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    <BreakText className="block">Website</BreakText>
                  </div>
                  <div className="text-sm text-gray-600">
                    <BreakText className="block">{t('steps.step1.contact.website.value')}</BreakText>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Step 2: Dokumente vorbereiten */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              2. <BreakText className="inline">{t('steps.step2.title')}</BreakText>
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              <BreakText className="block">{t('steps.step2.description')}</BreakText>
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-gray-900 mb-2">
                  <BreakText className="block">{t('steps.step2.items.applicationForm.title')}</BreakText>
                </h4>
                <p className="text-sm text-gray-600">
                  <BreakText className="block">{t('steps.step2.items.applicationForm.description')}</BreakText>
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-gray-900 mb-2">
                  <BreakText className="block">{t('steps.step2.items.businessLicense.title')}</BreakText>
                </h4>
                <p className="text-sm text-gray-600">
                  <BreakText className="block">{t('steps.step2.items.businessLicense.description')}</BreakText>
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <FolderOpen className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-gray-900 mb-2">
                  <BreakText className="block">{t('steps.step2.items.plans.title')}</BreakText>
                </h4>
                <p className="text-sm text-gray-600">
                  <BreakText className="block">{t('steps.step2.items.plans.description')}</BreakText>
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <Wrench className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-gray-900 mb-2">
                  <BreakText className="block">{t('steps.step2.items.technicalDescription.title')}</BreakText>
                </h4>
                <p className="text-sm text-gray-600">
                  <BreakText className="block">{t('steps.step2.items.technicalDescription.description')}</BreakText>
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-gray-900 mb-2">
                  <BreakText className="block">{t('steps.step2.items.neighbors.title')}</BreakText>
                </h4>
                <p className="text-sm text-gray-600">
                  <BreakText className="block">{t('steps.step2.items.neighbors.description')}</BreakText>
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-gray-900 mb-2">
                  <BreakText className="block">{t('steps.step2.items.tenancy.title')}</BreakText>
                </h4>
                <p className="text-sm text-gray-600">
                  <BreakText className="block">{t('steps.step2.items.tenancy.description')}</BreakText>
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Antrag einreichen */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              3. <BreakText className="inline">{t('steps.step3.title')}</BreakText>
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              <BreakText className="block">{t('steps.step3.description')}</BreakText>
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3">
                  <BreakText className="block">{t('steps.step3.options.inPerson.title')}</BreakText>
                </h4>
                <p className="text-gray-700 mb-2">
                  <BreakText className="block">{t('steps.step3.options.inPerson.line1')}</BreakText>
                </p>
                <p className="text-sm text-gray-600">
                  <BreakText className="block">{t('steps.step3.options.inPerson.line2')}</BreakText>
                </p>
              </div>

              <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3">
                  <BreakText className="block">{t('steps.step3.options.mail.title')}</BreakText>
                </h4>
                <p className="text-gray-700 mb-2">
                  <BreakText className="block">{t('steps.step3.options.mail.line1')}</BreakText>
                </p>
                <p className="text-sm text-gray-600">
                  <BreakText className="block">{t('steps.step3.options.mail.line2')}</BreakText>
                </p>
              </div>
            </div>
          </div>

          {/* Step 4: Nach der Einreichung */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              4. <BreakText className="inline">{t('steps.step4.title')}</BreakText>
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              <BreakText className="block">{t('steps.step4.description')}</BreakText>
            </p>

            <div className="space-y-4 mb-6">
              {STEP4_ITEMS.map(itemId => (
                <div key={itemId} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{t(`steps.step4.items.${itemId}.icon`)}</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      <BreakText className="block">{t(`steps.step4.items.${itemId}.title`)}</BreakText>
                    </h4>
                    <p className="text-sm text-gray-600">
                      <BreakText className="block">{t(`steps.step4.items.${itemId}.description`)}</BreakText>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-bold text-gray-900">
                <BreakText className="block">{t('steps.step4.processingTime')}</BreakText>
              </p>
            </div>
          </div>
        </div>

        {/* Häufig benötigte Fachgutachten */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <BreakText className="block">{t('expertReports.title')}</BreakText>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <Volume2 className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <BreakText className="block">{t('expertReports.items.noise.title')}</BreakText>
              </h3>
              <p className="text-gray-600">
                <BreakText className="block">{t('expertReports.items.noise.description')}</BreakText>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <Wind className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <BreakText className="block">{t('expertReports.items.ventilation.title')}</BreakText>
              </h3>
              <p className="text-gray-600">
                <BreakText className="block">{t('expertReports.items.ventilation.description')}</BreakText>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <Flame className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <BreakText className="block">{t('expertReports.items.fireProtection.title')}</BreakText>
              </h3>
              <p className="text-gray-600">
                <BreakText className="block">{t('expertReports.items.fireProtection.description')}</BreakText>
              </p>
            </div>
          </div>
        </div>

        {/* Kosten & Gebühren */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Euro className="w-8 h-8 text-blue-600" />
            <BreakText className="block">{t('fees.title')}</BreakText>
          </h2>

          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {FEES.map(feeId => (
                <div key={feeId} className="flex items-start gap-4">
                  <span className="text-3xl">{t(`fees.items.${feeId}.icon`)}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      <BreakText className="block">{t(`fees.items.${feeId}.title`)}</BreakText>
                    </h3>
                    <p className="text-gray-600">
                      <BreakText className="block">{t(`fees.items.${feeId}.description`)}</BreakText>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tipps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-blue-600" />
            <BreakText className="block">{t('tips.title')}</BreakText>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {TIPS.map(tipId => (
              <div key={tipId} className="bg-white rounded-xl shadow-md p-6">
                <span className="text-3xl mb-3 block">{t(`tips.items.${tipId}.icon`)}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  <BreakText className="block">{t(`tips.items.${tipId}.title`)}</BreakText>
                </h3>
                <p className="text-gray-600">
                  <BreakText className="block">{t(`tips.items.${tipId}.description`)}</BreakText>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Download-Sektion */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <BreakText className="block">Formulare zum Download</BreakText>
          </h2>

          {/* Disclaimer */}
          <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2 text-lg">
                  <BreakText className="block">{t('disclaimer.title')}</BreakText>
                </h3>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  <BreakText className="block">{t('disclaimer.text')}</BreakText>
                </p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <BreakText className="block">{t('filter.all')}</BreakText> ({totalDocumentsCount})
              </button>
              <button
                onClick={() => setFilter('required')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'required'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <BreakText className="block">{t('filter.required')}</BreakText> ({requiredDocumentsCount})
              </button>
              <button
                onClick={() => setFilter('guide')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'guide'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <BreakText className="block">{t('filter.guides')}</BreakText> ({guideDocumentsCount})
              </button>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                language={activeLocale}
              />
            ))}
          </div>

          {/* Source Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>
                <BreakText className="block">{t('officialSource')}</BreakText> |
              </span>
              <a
                href="https://www.wien.gv.at/amtswege/genehmigung-betriebsanlage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                wien.gv.at/betriebsanlage
              </a>
            </p>
          </div>
        </div>

        {/* Help Box */}
        <div className="p-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 rounded-2xl text-blue-900 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/60 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">
                <BreakText className="block">{t('needHelp.title')}</BreakText>
              </h3>
              <p className="text-blue-800 mb-4 leading-relaxed">
                <BreakText className="block">{t('needHelp.text')}</BreakText>
              </p>
              <Link
                href={`/${activeLocale}/check`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md transition-colors hover:bg-blue-700"
              >
                <BreakText className="inline">{t('startChecker')}</BreakText>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
