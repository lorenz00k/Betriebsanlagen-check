'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { defaultLocale } from '@/i18n'

interface Result {
  needsPermit: boolean
  reasons: string[]
}

export default function ResultPage() {
  const t = useTranslations('result')
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const paramLocale = params?.locale
  const locale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResult = sessionStorage.getItem('questionnaireResult')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      router.push(`/${locale}/check`)
    }
    setLoading(false)
  }, [locale, router])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Result Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
        </div>

        {/* Result Card */}
        <div
          className={`bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-6 border-4 ${
            result.needsPermit ? 'border-red-400' : 'border-green-400'
          }`}
        >
          {/* Icon and Main Result */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
                result.needsPermit ? 'bg-red-100' : 'bg-green-100'
              }`}
            >
              {result.needsPermit ? (
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                result.needsPermit ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {result.needsPermit ? t('permitNeeded') : t('noPermitNeeded')}
            </h2>
            <p className="text-lg text-gray-600">
              {result.needsPermit ? t('permitDescription') : t('noPermitDescription')}
            </p>
          </div>

          {/* Reasons */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              {result.needsPermit ? t('reasonsTitlePermit') : t('reasonsTitleNoPermit')}
            </h3>
            <ul className="space-y-2">
              {result.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className={`mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                      result.needsPermit ? 'bg-red-600' : 'bg-green-600'
                    }`}
                  ></span>
                  <span className="text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next Steps */}
          {result.needsPermit && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('nextSteps')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{t('contactAuthority')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{t('prepareDocuments')}</span>
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/${locale}/check`}
              className="flex-1 text-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              {t('startOver')}
            </Link>
            {result.needsPermit && (
              <Link
                href={`/${locale}/documents`}
                className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                {t('viewDocuments')}
              </Link>
            )}
          </div>
        </div>

        {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-700">
            <strong>{t('disclaimerTitle')}</strong> {t('disclaimerText')}
          </p>
        </div>
      </div>
    </div>
  )
}
