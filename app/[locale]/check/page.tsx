'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import type { QuestionnaireData, BusinessType } from '@/app/lib/questionnaireLogic'
import { getVisibleQuestions, evaluatePermitNeed } from '@/app/lib/questionnaireLogic'
import { defaultLocale } from '@/i18n'

export default function QuestionnairePage() {
  const t = useTranslations('questionnaire')
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const paramLocale = params?.locale
  const locale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<QuestionnaireData>({})
  const [questionAnimation, setQuestionAnimation] = useState(true)

  const visibleQuestions = getVisibleQuestions(data)
  const currentQuestion = visibleQuestions[currentStep]
  const isLastQuestion = currentStep === visibleQuestions.length - 1

  // Trigger animation on step change
  useEffect(() => {
    setQuestionAnimation(false)
    const timer = setTimeout(() => setQuestionAnimation(true), 50)
    return () => clearTimeout(timer)
  }, [currentStep])

  const handleBusinessTypeChange = (value: string) => {
    setData({ ...data, businessType: value as BusinessType })
  }

  const handleAddressChange = (field: string, value: string) => {
    setData({
      ...data,
      address: {
        ...data.address,
        street: field === 'street' ? value : data.address?.street || '',
        postalCode: field === 'postalCode' ? value : data.address?.postalCode || '',
        city: field === 'city' ? value : data.address?.city || '',
      },
    })
  }

  const handleRadioChange = (questionId: string, value: string) => {
    setData({ ...data, [questionId]: value } as QuestionnaireData)
  }

  const canProceed = () => {
    if (!currentQuestion) return false

    switch (currentQuestion.id) {
      case 'businessType':
        return !!data.businessType
      case 'address':
        return !!(data.address?.street && data.address?.postalCode && data.address?.city)
      default:
        return !!(data as Record<string, unknown>)[currentQuestion.id]
    }
  }

  const handleNext = () => {
    if (canProceed()) {
      if (isLastQuestion) {
        // Calculate result and navigate to result page
        const result = evaluatePermitNeed(data)
        sessionStorage.setItem('questionnaireResult', JSON.stringify(result))
        sessionStorage.setItem('questionnaireData', JSON.stringify(data))
        router.push(`/${locale}/check/result`)
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderQuestion = () => {
    if (!currentQuestion) return null

    switch (currentQuestion.id) {
      case 'businessType':
        return (
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              {t('businessType.question')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'retail',
                'office',
                'warehouse',
                'beauty',
                'tailor',
                'photography',
                'dental',
                'accommodation',
                'gastronomy',
                'textilePickup',
                'dataCenter',
                'specialized',
                'other',
              ].map((type, index) => (
                <button
                  key={type}
                  onClick={() => handleBusinessTypeChange(type)}
                  className={`group p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 hover:shadow-md ${
                    data.businessType === type
                      ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      data.businessType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                    }`}>
                      {type === 'retail' && '🏪'}
                      {type === 'office' && '🏢'}
                      {type === 'warehouse' && '📦'}
                      {type === 'beauty' && '💅'}
                      {type === 'tailor' && '✂️'}
                      {type === 'photography' && '📸'}
                      {type === 'dental' && '🦷'}
                      {type === 'accommodation' && '🏨'}
                      {type === 'gastronomy' && '🍦'}
                      {type === 'textilePickup' && '👔'}
                      {type === 'dataCenter' && '💻'}
                      {type === 'specialized' && '⚙️'}
                      {type === 'other' && '🏭'}
                    </div>
                    <span className="font-medium text-gray-900">{t(`businessType.${type}`)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 'address':
        return (
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              {t('address.question')}
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('address.street')}
                </label>
                <input
                  type="text"
                  value={data.address?.street || ''}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('address.streetPlaceholder')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('address.postalCode')}
                  </label>
                  <input
                    type="text"
                    value={data.address?.postalCode || ''}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('address.postalCodePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('address.city')}
                  </label>
                  <input
                    type="text"
                    value={data.address?.city || ''}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('address.cityPlaceholder')}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'businessArea':
      case 'guestBeds':
      case 'buildingUse':
      case 'swimmingPool':
      case 'meals':
      case 'operatingHours':
      case 'ventilation':
      case 'hazardousMaterials':
      case 'music':
      case 'ippcStorage':
        const options =
          currentQuestion.id === 'businessArea'
            ? ['upTo400', 'upTo600', 'over600']
            : currentQuestion.id === 'guestBeds'
            ? ['upTo30', 'over30']
            : currentQuestion.id === 'buildingUse'
            ? ['accommodationOnly', 'accommodationAndPrivate', 'accommodationAndCommercial']
            : currentQuestion.id === 'swimmingPool'
            ? ['yes', 'no']
            : currentQuestion.id === 'meals'
            ? ['breakfastOnly', 'fullMeals']
            : currentQuestion.id === 'operatingHours'
            ? ['compliant', 'nonCompliant']
            : ['yes', 'no']

        return (
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              {t(`${currentQuestion.id}.question`)}
            </label>
            {currentQuestion.id === 'operatingHours' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 mb-2 font-medium">Erlaubte Betriebszeiten:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {t('operatingHours.monFri')}</li>
                  <li>• {t('operatingHours.saturday')}</li>
                </ul>
              </div>
            )}
            <div className="space-y-3">
              {options.map((option, index) => (
                <button
                  key={option}
                  onClick={() => handleRadioChange(currentQuestion.id, option)}
                  className={`group w-full p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-102 ${
                    (data as Record<string, unknown>)[currentQuestion.id] === option
                      ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        (data as Record<string, unknown>)[currentQuestion.id] === option
                          ? 'border-blue-600 bg-blue-600 scale-110'
                          : 'border-gray-300 group-hover:border-blue-400'
                      }`}
                    >
                      {(data as Record<string, unknown>)[currentQuestion.id] === option && (
                        <div className="w-2 h-2 bg-white rounded-full animate-scaleIn"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{t(`${currentQuestion.id}.${option}`)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Frage {currentStep + 1} von {visibleQuestions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(((currentStep + 1) / visibleQuestions.length) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / visibleQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question card */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100 transition-all duration-500 ${
          questionAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {renderQuestion()}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              {t('back')}
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`button-shine flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              canProceed()
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isLastQuestion ? t('submit') : t('next')}
              {!isLastQuestion && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
