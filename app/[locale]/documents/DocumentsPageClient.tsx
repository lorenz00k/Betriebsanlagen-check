'use client'

// DocumentsPageClient renders the localized permitting checklist, helper content,
// and HowTo structured data that describes the submission process in each language.
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  Phone,
  Mail,
  Globe,
  FileText,
  CheckCircle,
  MapPin,
  Building,
  Clock,
  AlertCircle,
  Info,
  Volume2,
  Wind,
  Flame,
  Euro,
  FileSearch,
  Wrench,
  CalendarClock,
  FolderOpen,
  Handshake,
  ClipboardList,
  RotateCw,
  BookOpen
} from 'lucide-react'

import BreakText from '@/components/ui/BreakText'
import DocumentCard from '@/app/components/Documents/DocumentCard'
import { DOCUMENTS } from '@/app/config/documents'

const STEP_IDS = ['step1', 'step2', 'step3', 'step4'] as const

const STEP2_ITEMS = ['applicationForm', 'businessLicense', 'plans', 'technicalDescription', 'neighbors', 'tenancy'] as const
const STEP3_OPTIONS = ['inPerson', 'mail'] as const
const STEP4_ITEMS = ['confirmation', 'assessment', 'questions', 'decision'] as const
const EXPERT_REPORTS = ['noise', 'ventilation', 'fireProtection'] as const
const FEES = ['federalFees', 'expertFees', 'ownExperts', 'time'] as const
const TIPS = ['planEarly', 'contactAuthority', 'useChecklists', 'stayFlexible'] as const
const STEP1_CONTACT = ['phone', 'email', 'website'] as const

// Displays localized document instructions and emits a HowTo schema for search engines.
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
        "@type": 'HowToDirection',
        text: t(`steps.${stepId}.description`),
      },
    ]

    if (stepId === 'step1') {
      STEP1_CONTACT.forEach(contactId => {
        const value = t(`steps.step1.contact.${contactId}.value`)

        if (!value) return

        if (contactId === 'website') {
          elements.push({
            "@type": 'HowToDirection',
            text: value,
            url: normalizeUrl(value),
          })
          return
        }

        const label = t(`steps.step1.contact.${contactId}.label`)
        const direction: Record<string, unknown> = {
          "@type": 'HowToDirection',
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
          "@type": 'HowToSupply',
          name: t(`steps.step2.items.${itemId}.title`),
          description: t(`steps.step2.items.${itemId}.description`),
        })
      })
    }

    if (stepId === 'step3') {
      STEP3_OPTIONS.forEach(optionId => {
        elements.push({
          "@type": 'HowToDirection',
          name: t(`steps.step3.options.${optionId}.title`),
          text: `${t(`steps.step3.options.${optionId}.line1`)} ${t(`steps.step3.options.${optionId}.line2`)}`.trim(),
        })
      })
    }

    if (stepId === 'step4') {
      STEP4_ITEMS.forEach(itemId => {
        elements.push({
          "@type": 'HowToDirection',
          name: t(`steps.step4.items.${itemId}.title`),
          text: t(`steps.step4.items.${itemId}.description`),
        })
      })

      elements.push({
        "@type": 'HowToTip',
        text: t('steps.step4.processingTime'),
      })
    }

    return elements
  }

  const howToSchema = {
    "@context": 'https://schema.org',
    "@type": 'HowTo',
    name: t('title'),
    description: t('intro'),
    step: STEP_IDS.map((stepId, index) => ({
      "@type": 'HowToStep',
      position: index + 1,
      name: t(`steps.${stepId}.title`),
      itemListElement: howToStepElements(stepId),
    })),
    tool: EXPERT_REPORTS.map(reportId => ({
      "@type": 'HowToTool',
      name: t(`expertReports.items.${reportId}.title`),
      description: t(`expertReports.items.${reportId}.description`),
    })),
  }

  const howToSchemaJson = JSON.stringify(howToSchema)
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E')
    .replace(/&/g, '\\u0026')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-16 overflow-x-hidden">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: howToSchemaJson }}
      />
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <BreakText className="block">{t('title')}</BreakText>
          </h1>
          <p className="text-xl text-gray-600 font-normal">
            <BreakText className="block">{t('subtitle')}</BreakText>
          </p>
        </div>

        {/* Intro Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-12 border border-gray-200 animate-fadeIn" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-600" strokeWidth={2} />
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed font-normal">
              <BreakText className="block">{t('intro')}</BreakText>
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {STEP_IDS.map((stepId, index) => (
            <div
              key={stepId}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 card-lift transition-all duration-200 w-full max-w-full"
              style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              {/* Step Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg">
                    <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <BreakText className="block">{t(`steps.${stepId}.title`)}</BreakText>
                  </h2>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6 sm:p-8">
                <p className="text-gray-700 mb-6 leading-relaxed font-normal">
                  <BreakText className="block">{t(`steps.${stepId}.description`)}</BreakText>
                </p>

                {stepId === 'step1' && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Handshake className="w-5 h-5 text-blue-600" strokeWidth={2} />
                      <BreakText>{t('steps.step1.contactTitle')}</BreakText>
                    </h3>
                    <ul className="space-y-3">
                      {STEP1_CONTACT.map(contactId => {
                        const href =
                          contactId === 'phone'
                            ? 'tel:+431400025310'
                            : contactId === 'email'
                              ? 'mailto:post@ma36.wien.gv.at'
                              : 'https://www.wien.gv.at/ma36'

                        const icon = contactId === 'phone' ? <Phone className="w-4 h-4" /> :
                                     contactId === 'email' ? <Mail className="w-4 h-4" /> :
                                     <Globe className="w-4 h-4" />

                        return (
                          <li key={contactId} className="flex items-center gap-3 text-gray-700 min-w-0">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                              {icon}
                            </div>
                            {contactId === 'website' ? (
                              <a
                                href={href}
                                className="hover:text-blue-600 transition-colors font-medium"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <BreakText className="block">{t(`steps.step1.contact.${contactId}.value`)}</BreakText>
                              </a>
                            ) : (
                              <span className="font-normal flex-1 min-w-0">
                                <BreakText className="font-semibold">{t(`steps.step1.contact.${contactId}.label`)}:</BreakText>{' '}
                                {contactId === 'email' ? (
                                  <a href={href} className="hover:text-blue-600 transition-colors">
                                    <BreakText>{t(`steps.step1.contact.${contactId}.value`)}</BreakText>
                                  </a>
                                ) : (
                                  <BreakText>{t(`steps.step1.contact.${contactId}.value`)}</BreakText>
                                )}
                              </span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}

                {stepId === 'step2' && (
                  <div className="space-y-4">
                    {STEP2_ITEMS.map(itemId => {
                      const itemIcon = itemId === 'applicationForm' ? <FileText className="w-5 h-5" strokeWidth={2} /> :
                                       itemId === 'businessLicense' ? <CheckCircle className="w-5 h-5" strokeWidth={2} /> :
                                       itemId === 'plans' ? <MapPin className="w-5 h-5" strokeWidth={2} /> :
                                       itemId === 'technicalDescription' ? <FileSearch className="w-5 h-5" strokeWidth={2} /> :
                                       itemId === 'neighbors' ? <Handshake className="w-5 h-5" strokeWidth={2} /> :
                                       <Building className="w-5 h-5" strokeWidth={2} />

                      return (
                        <div key={itemId} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            {itemIcon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <strong className="text-gray-900 font-semibold block mb-1">
                              <BreakText className="block">{t(`steps.step2.items.${itemId}.title`)}</BreakText>
                            </strong>
                            <p className="text-sm text-gray-600 font-normal leading-relaxed">
                              <BreakText className="block">{t(`steps.step2.items.${itemId}.description`)}</BreakText>
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {stepId === 'step3' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {STEP3_OPTIONS.map(optionId => {
                      const optionIcon = optionId === 'inPerson' ? <Building className="w-6 h-6" strokeWidth={2} /> :
                                        <Mail className="w-6 h-6" strokeWidth={2} />

                      return (
                        <div key={optionId} className="bg-blue-50 rounded-xl p-6 border border-blue-200 min-w-0">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                              {optionIcon}
                            </div>
                            <h3 className="font-bold text-gray-900">
                              <BreakText className="block">
                                {t(`steps.step3.options.${optionId}.title`).replace(/[📮✉️]/g, '').trim()}
                              </BreakText>
                            </h3>
                          </div>
                          <p className="text-sm text-gray-700 font-normal mb-2">
                            <BreakText className="block">{t(`steps.step3.options.${optionId}.line1`)}</BreakText>
                          </p>
                          <p className="text-sm text-gray-700 font-normal">
                            <BreakText className="block">{t(`steps.step3.options.${optionId}.line2`)}</BreakText>
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}

                {stepId === 'step4' && (
                  <>
                    <div className="space-y-4">
                      {STEP4_ITEMS.map(itemId => {
                        const itemIcon = itemId === 'confirmation' ? <CheckCircle className="w-5 h-5" strokeWidth={2} /> :
                                        itemId === 'assessment' ? <FileSearch className="w-5 h-5" strokeWidth={2} /> :
                                        itemId === 'questions' ? <Phone className="w-5 h-5" strokeWidth={2} /> :
                                        <FileText className="w-5 h-5" strokeWidth={2} />

                        return (
                          <div key={itemId} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                              {itemIcon}
                            </div>
                            <div className="min-w-0">
                              <strong className="text-gray-900 font-semibold block mb-1">
                                <BreakText className="block">{t(`steps.step4.items.${itemId}.title`)}</BreakText>
                              </strong>
                              <p className="text-sm text-gray-600 font-normal leading-relaxed">
                                <BreakText className="block">{t(`steps.step4.items.${itemId}.description`)}</BreakText>
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <p className="text-sm text-blue-900 font-normal">
                        <BreakText className="block">{t('steps.step4.processingTime')}</BreakText>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Downloads / Formulare */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Formulare zum Download
          </h2>

          {/* Disclaimer */}
          <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
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
                {t('filter.all')} ({totalDocumentsCount})
              </button>
              <button
                onClick={() => setFilter('required')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'required'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {t('filter.required')} ({requiredDocumentsCount})
              </button>
              <button
                onClick={() => setFilter('guide')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'guide'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {t('filter.guides')} ({guideDocumentsCount})
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

        {/* Additional Information Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {/* Expert Reports */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileSearch className="w-5 h-5 text-blue-600" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                <BreakText className="block">{t('expertReports.title')}</BreakText>
              </h3>
            </div>
            <ul className="space-y-4">
              {EXPERT_REPORTS.map(reportId => {
                const reportIcon = reportId === 'noise' ? <Volume2 className="w-5 h-5" strokeWidth={2} /> :
                                   reportId === 'ventilation' ? <Wind className="w-5 h-5" strokeWidth={2} /> :
                                   <Flame className="w-5 h-5" strokeWidth={2} />

                return (
                  <li key={reportId} className="flex items-start gap-3 min-w-0">
                    <div className="flex-shrink-0 w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                      {reportIcon}
                    </div>
                    <div className="min-w-0">
                      <strong className="text-gray-900 font-semibold block mb-1">
                        <BreakText className="block">{t(`expertReports.items.${reportId}.title`)}</BreakText>
                      </strong>
                      <p className="text-sm text-gray-600 font-normal leading-relaxed">
                        <BreakText className="block">{t(`expertReports.items.${reportId}.description`)}</BreakText>
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Fees */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Euro className="w-5 h-5 text-blue-600" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                <BreakText className="block">{t('fees.title')}</BreakText>
              </h3>
            </div>
            <ul className="space-y-4">
              {FEES.map(feeId => {
                const feeIcon = feeId === 'federalFees' ? <Euro className="w-5 h-5" strokeWidth={2} /> :
                                feeId === 'expertFees' ? <FileText className="w-5 h-5" strokeWidth={2} /> :
                                feeId === 'ownExperts' ? <Wrench className="w-5 h-5" strokeWidth={2} /> :
                                <CalendarClock className="w-5 h-5" strokeWidth={2} />

                return (
                  <li key={feeId} className="flex items-start gap-3 min-w-0">
                    <div className="flex-shrink-0 w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                      {feeIcon}
                    </div>
                    <div className="min-w-0">
                      <strong className="text-gray-900 font-semibold block mb-1">
                        <BreakText className="block">{t(`fees.items.${feeId}.title`)}</BreakText>
                      </strong>
                      <p className="text-sm text-gray-600 font-normal leading-relaxed">
                        <BreakText className="block">{t(`fees.items.${feeId}.description`)}</BreakText>
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-6 sm:p-8 md:p-10 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              <BreakText className="block">{t('tips.title')}</BreakText>
            </h3>
          </div>
          <ul className="grid md:grid-cols-2 gap-6">
            {TIPS.map(tipId => {
              const tipIcon = tipId === 'planEarly' ? <FolderOpen className="w-5 h-5" strokeWidth={2} /> :
                             tipId === 'contactAuthority' ? <Handshake className="w-5 h-5" strokeWidth={2} /> :
                             tipId === 'useChecklists' ? <ClipboardList className="w-5 h-5" strokeWidth={2} /> :
                             <RotateCw className="w-5 h-5" strokeWidth={2} />

              return (
                <li key={tipId} className="flex items-start gap-4 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    {tipIcon}
                  </div>
                  <div className="min-w-0">
                    <strong className="text-gray-900 font-bold block mb-1">
                      <BreakText className="block">{t(`tips.items.${tipId}.title`)}</BreakText>
                    </strong>
                    <p className="text-sm text-gray-700 font-normal leading-relaxed">
                      <BreakText className="block">{t(`tips.items.${tipId}.description`)}</BreakText>
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
