'use client'

import { useTranslations } from 'next-intl'

const STEP_IDS = ['step1', 'step2', 'step3', 'step4'] as const
const STEP_GRADIENTS: Record<(typeof STEP_IDS)[number], string> = {
  step1: 'from-blue-600 to-blue-700',
  step2: 'from-green-600 to-green-700',
  step3: 'from-purple-600 to-purple-700',
  step4: 'from-pink-600 to-pink-700',
}

const STEP_BADGE_COLORS: Record<(typeof STEP_IDS)[number], string> = {
  step1: 'text-blue-600',
  step2: 'text-green-600',
  step3: 'text-purple-600',
  step4: 'text-pink-600',
}

const STEP_NUMBERS: Record<(typeof STEP_IDS)[number], string> = {
  step1: '1',
  step2: '2',
  step3: '3',
  step4: '4',
}

const STEP2_ITEMS = ['applicationForm', 'businessLicense', 'plans', 'technicalDescription', 'neighbors', 'tenancy'] as const
const STEP3_OPTIONS = ['inPerson', 'mail'] as const
const STEP4_ITEMS = ['confirmation', 'assessment', 'questions', 'decision'] as const
const EXPERT_REPORTS = ['noise', 'ventilation', 'fireProtection'] as const
const FEES = ['federalFees', 'expertFees', 'ownExperts', 'time'] as const
const TIPS = ['planEarly', 'contactAuthority', 'useChecklists', 'stayFlexible'] as const
const STEP1_CONTACT = ['phone', 'email', 'website'] as const

export default function DocumentsPageClient() {
  const t = useTranslations('documents')

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: howToSchemaJson }}
      />
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <p className="text-lg text-gray-700 leading-relaxed">{t('intro')}</p>
        </div>

        <div className="space-y-6">
          {STEP_IDS.map(stepId => (
            <div
              key={stepId}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className={`bg-gradient-to-r ${STEP_GRADIENTS[stepId]} px-6 py-4`}>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <span
                    className={`flex items-center justify-center w-8 h-8 bg-white ${STEP_BADGE_COLORS[stepId]} rounded-full font-bold`}
                  >
                    {STEP_NUMBERS[stepId]}
                  </span>
                  {t(`steps.${stepId}.title`)}
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">{t(`steps.${stepId}.description`)}</p>

                {stepId === 'step1' && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{t('steps.step1.contactTitle')}</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {STEP1_CONTACT.map(contactId => {
                        const href =
                          contactId === 'phone'
                            ? 'tel:+431400025310'
                            : contactId === 'email'
                              ? 'mailto:post@ma36.wien.gv.at'
                              : 'https://www.wien.gv.at/ma36'

                        return (
                          <li key={contactId} className="flex items-center gap-2">
                            <span>{t(`steps.step1.contact.${contactId}.icon`)}</span>
                            {contactId === 'website' ? (
                              <a
                                href={href}
                                className="hover:text-blue-600 hover:underline transition-colors"
                                target="_blank"
                                rel="noreferrer"
                              >
                                {t(`steps.step1.contact.${contactId}.value`)}
                              </a>
                            ) : (
                              <span>
                                <strong>{t(`steps.step1.contact.${contactId}.label`)}:</strong>{' '}
                                {contactId === 'email' ? (
                                  <a href={href} className="hover:text-blue-600 hover:underline transition-colors">
                                    {t(`steps.step1.contact.${contactId}.value`)}
                                  </a>
                                ) : (
                                  t(`steps.step1.contact.${contactId}.value`)
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
                  <ul className="space-y-3">
                    {STEP2_ITEMS.map(itemId => (
                      <li key={itemId} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <strong className="text-gray-900">{t(`steps.step2.items.${itemId}.title`)}</strong>
                          <p className="text-sm text-gray-600">{t(`steps.step2.items.${itemId}.description`)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {stepId === 'step3' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {STEP3_OPTIONS.map(optionId => (
                      <div key={optionId} className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{t(`steps.step3.options.${optionId}.title`)}</h3>
                        <p className="text-sm text-gray-700">{t(`steps.step3.options.${optionId}.line1`)}</p>
                        <p className="text-sm text-gray-700">{t(`steps.step3.options.${optionId}.line2`)}</p>
                      </div>
                    ))}
                  </div>
                )}

                {stepId === 'step4' && (
                  <>
                    <ul className="space-y-3">
                      {STEP4_ITEMS.map(itemId => (
                        <li key={itemId} className="flex items-start gap-3">
                          <span className="text-xl">{t(`steps.step4.items.${itemId}.icon`)}</span>
                          <div>
                            <strong className="text-gray-900">{t(`steps.step4.items.${itemId}.title`)}</strong>
                            <p className="text-sm text-gray-600">{t(`steps.step4.items.${itemId}.description`)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                      {t('steps.step4.processingTime')}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('expertReports.title')}</h3>
            <ul className="space-y-3 text-gray-700">
              {EXPERT_REPORTS.map(reportId => (
                <li key={reportId} className="flex items-start gap-3">
                  <span className="text-2xl">{t(`expertReports.items.${reportId}.icon`)}</span>
                  <div>
                    <strong className="text-gray-900">{t(`expertReports.items.${reportId}.title`)}</strong>
                    <p className="text-sm text-gray-600">{t(`expertReports.items.${reportId}.description`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('fees.title')}</h3>
            <ul className="space-y-3 text-gray-700">
              {FEES.map(feeId => (
                <li key={feeId} className="flex items-start gap-3">
                  <span className="text-2xl">{t(`fees.items.${feeId}.icon`)}</span>
                  <div>
                    <strong className="text-gray-900">{t(`fees.items.${feeId}.title`)}</strong>
                    <p className="text-sm text-gray-600">{t(`fees.items.${feeId}.description`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mt-10 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('tips.title')}</h3>
          <ul className="grid md:grid-cols-2 gap-6 text-gray-700">
            {TIPS.map(tipId => (
              <li key={tipId} className="flex items-start gap-4">
                <span className="text-3xl">{t(`tips.items.${tipId}.icon`)}</span>
                <div>
                  <strong className="text-gray-900">{t(`tips.items.${tipId}.title`)}</strong>
                  <p className="text-sm text-gray-600">{t(`tips.items.${tipId}.description`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
