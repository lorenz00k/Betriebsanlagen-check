'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ListChecks,
  Sparkles,
} from 'lucide-react'
import {
  type EvaluationResult,
  type GfvoCategoryId,
  defaultExclusionState,
  evaluateGfvo,
  gfvoCategories,
  gfvoExclusions,
  getCategoryById,
} from '@/app/lib/gfvoCheckerLogic'

type Step = 'category' | 'operatingTimes' | 'exclusions' | 'result'
type FlowStep = Exclude<Step, 'result'>

const stepOrder: Step[] = ['category', 'operatingTimes', 'exclusions']

export default function GfvoCheckerPage() {
  const t = useTranslations('gfvoChecker')
  const [currentStep, setCurrentStep] = useState<Step>('category')
  const [selectedCategory, setSelectedCategory] = useState<GfvoCategoryId | 'none' | null>(null)
  const [operatingTimes, setOperatingTimes] = useState<boolean | null>(null)
  const [exclusions, setExclusions] = useState({ ...defaultExclusionState })
  const [result, setResult] = useState<EvaluationResult | null>(null)

  const activeCategory = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'none') {
      return undefined
    }
    return getCategoryById(selectedCategory)
  }, [selectedCategory])

  const timeCheckRequired = activeCategory ? !activeCategory.timeExempt : false

  useEffect(() => {
    if (!selectedCategory || selectedCategory === 'none') {
      setOperatingTimes(null)
      setExclusions({ ...defaultExclusionState })
      return
    }

    setExclusions({ ...defaultExclusionState })

    if (timeCheckRequired) {
      setOperatingTimes(null)
    } else {
      setOperatingTimes(true)
    }
  }, [selectedCategory, timeCheckRequired])

  const evaluatedCategory = useMemo(() => {
    if (!result?.categoryId) {
      return undefined
    }
    return getCategoryById(result.categoryId)
  }, [result])

  const currentStepIndex = currentStep === 'result' ? stepOrder.length : stepOrder.indexOf(currentStep) + 1

  const handleReset = () => {
    setCurrentStep('category')
    setSelectedCategory(null)
    setOperatingTimes(null)
    setExclusions({ ...defaultExclusionState })
    setResult(null)
  }

  const goToResult = (evaluation: EvaluationResult) => {
    setResult(evaluation)
    setCurrentStep('result')
  }

  const getAdjustStep = (): FlowStep => {
    if (!result) {
      return 'category'
    }

    if (result.reasons.some((reason) => reason.key === 'categoryMissing')) {
      return 'category'
    }

    if (result.reasons.some((reason) => reason.key === 'operatingTimesMissing')) {
      return 'operatingTimes'
    }

    if (
      result.reasons.some((reason) =>
        ['externalVentilation', 'regulatedStorage', 'unregulatedHazards', 'loudMusic', 'ippcSeveso'].includes(reason.key),
      )
    ) {
      return 'exclusions'
    }

    if (!selectedCategory || selectedCategory === 'none') {
      return 'category'
    }

    return 'category'
  }

  const handleCategoryNext = () => {
    if (selectedCategory === null) return

    if (selectedCategory === 'none') {
      const evaluation = evaluateGfvo({
        categoryId: 'none',
        operatingTimesCompliant: false,
        timeCheckRequired: false,
        exclusions: { ...defaultExclusionState },
      })
      goToResult(evaluation)
      return
    }

    if (!timeCheckRequired) {
      setCurrentStep('exclusions')
      return
    }

    setCurrentStep('operatingTimes')
  }

  const handleOperatingTimesNext = () => {
    if (operatingTimes === null || !selectedCategory || selectedCategory === 'none') {
      return
    }

    if (!operatingTimes) {
      const evaluation = evaluateGfvo({
        categoryId: selectedCategory,
        operatingTimesCompliant: false,
        timeCheckRequired: true,
        exclusions,
      })
      goToResult(evaluation)
      return
    }

    setCurrentStep('exclusions')
  }

  const handleFinish = () => {
    if (!selectedCategory || selectedCategory === 'none') {
      const evaluation = evaluateGfvo({
        categoryId: 'none',
        operatingTimesCompliant: false,
        timeCheckRequired: false,
        exclusions,
      })
      goToResult(evaluation)
      return
    }

    const evaluation = evaluateGfvo({
      categoryId: selectedCategory,
      operatingTimesCompliant: operatingTimes ?? false,
      timeCheckRequired,
      exclusions,
    })
    goToResult(evaluation)
  }

  const renderReasonText = (key: EvaluationResult['reasons'][number]['key']) => {
    const categoryLabel = evaluatedCategory ? t(evaluatedCategory.translationKey) : activeCategory ? t(activeCategory.translationKey) : ''
    const safeCategoryLabel = categoryLabel || t('result.reasons.genericCategoryLabel')

    switch (key) {
      case 'categoryMet':
        return t('result.reasons.categoryMet', { category: safeCategoryLabel })
      case 'operatingTimesMet':
        return t('result.reasons.operatingTimesMet')
      case 'operatingTimesExempt':
        return t('result.reasons.operatingTimesExempt', { category: safeCategoryLabel })
      case 'noExclusions':
        return t('result.reasons.noExclusions')
      case 'categoryMissing':
        return t('result.reasons.categoryMissing')
      case 'operatingTimesMissing':
        return t('result.reasons.operatingTimesMissing')
      case 'externalVentilation':
        return t('result.reasons.externalVentilation')
      case 'regulatedStorage':
        return t('result.reasons.regulatedStorage')
      case 'unregulatedHazards':
        return t('result.reasons.unregulatedHazards')
      case 'loudMusic':
        return t('result.reasons.loudMusic')
      case 'ippcSeveso':
        return t('result.reasons.ippcSeveso')
      default:
        return ''
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            {t('badge')}
          </span>
          <h1 className="text-4xl font-bold text-slate-900">{t('title')}</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">{t('intro')}</p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm whitespace-pre-line">
          {t('disclaimer')}
        </div>

        {currentStep !== 'result' && (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('progress.title')}</p>
              <p className="text-lg font-semibold text-slate-900">
                {t('progress.step', { current: currentStepIndex, total: stepOrder.length })}
              </p>
            </div>
            <div className="flex gap-2">
              {stepOrder.map((step) => {                const isActive = step === currentStep
                const isCompleted = stepOrder.indexOf(step) < stepOrder.indexOf(currentStep)

                return (
                  <span
                    key={step}
                    className={`h-2 w-8 rounded-full ${
                      isActive
                        ? 'bg-blue-600'
                        : isCompleted
                        ? 'bg-blue-300'
                        : 'bg-slate-200'
                    }`}
                  />
                )
              })}
            </div>
          </div>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-100/30 md:p-10">
          {currentStep === 'category' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900">{t('steps.category.title')}</h2>
                <p className="text-slate-600">{t('steps.category.description')}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {gfvoCategories.map((category) => {
                  const isSelected = selectedCategory === category.id
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`text-left rounded-2xl border-2 p-5 transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100'
                          : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/60'
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-slate-900">{t(category.translationKey)}</h3>
                      <p className="mt-2 text-sm text-slate-600">{t(category.descriptionKey)}</p>
                      {category.timeExempt && (
                        <span className="mt-3 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                          {t('steps.category.timeExemptBadge')}
                        </span>
                      )}
                    </button>
                  )
                })}

                <button
                  type="button"
                  onClick={() => setSelectedCategory('none')}
                  className={`text-left rounded-2xl border-2 p-5 transition-all ${
                    selectedCategory === 'none'
                      ? 'border-amber-500 bg-amber-50 shadow-lg shadow-amber-100'
                      : 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/70'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-slate-900">{t('categories.none.title')}</h3>
                  <p className="mt-2 text-sm text-slate-600">{t('categories.none.description')}</p>
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">{t('steps.category.hint')}</span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCategoryNext}
                    disabled={selectedCategory === null}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                      selectedCategory === null
                        ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                    }`}
                  >
                    {t('buttons.next')}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'operatingTimes' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900">{t('steps.operatingTimes.title')}</h2>
                <p className="text-slate-600">{t('steps.operatingTimes.description')}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setOperatingTimes(true)}
                  className={`rounded-2xl border-2 p-5 text-left transition-all ${
                    operatingTimes === true
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100'
                      : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/70'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-slate-900">{t('steps.operatingTimes.options.compliant.title')}</h3>
                  <p className="mt-2 text-sm text-slate-600">{t('steps.operatingTimes.options.compliant.description')}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setOperatingTimes(false)}
                  className={`rounded-2xl border-2 p-5 text-left transition-all ${
                    operatingTimes === false
                      ? 'border-rose-500 bg-rose-50 shadow-lg shadow-rose-100'
                      : 'border-slate-200 hover:border-rose-400 hover:bg-rose-50/70'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-slate-900">{t('steps.operatingTimes.options.notCompliant.title')}</h3>
                  <p className="mt-2 text-sm text-slate-600">{t('steps.operatingTimes.options.notCompliant.description')}</p>
                </button>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                {t('steps.operatingTimes.reminder')}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('category')}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('buttons.back')}
                </button>
                <button
                  type="button"
                  onClick={handleOperatingTimesNext}
                  disabled={operatingTimes === null}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                    operatingTimes === null
                      ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                  }`}
                >
                  {t('buttons.next')}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 'exclusions' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900">{t('steps.exclusions.title')}</h2>
                <p className="text-slate-600">{t('steps.exclusions.description')}</p>
              </div>
              <div className="space-y-4">
                {gfvoExclusions.map((exclusion) => (
                  <label
                    key={exclusion.id}
                    className={`flex items-start gap-4 rounded-2xl border-2 p-5 transition-all ${
                      exclusions[exclusion.id]
                        ? 'border-rose-500 bg-rose-50 shadow-lg shadow-rose-100'
                        : 'border-slate-200 hover:border-rose-400 hover:bg-rose-50/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={exclusions[exclusion.id]}
                      onChange={(event) =>
                        setExclusions((prev) => ({
                          ...prev,
                          [exclusion.id]: event.target.checked,
                        }))
                      }
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{t(exclusion.questionKey)}</p>
                      <p className="mt-2 text-sm text-slate-600">{t(exclusion.descriptionKey)}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <ListChecks className="mb-2 h-5 w-5" />
                <p>{t('steps.exclusions.reminder')}</p>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(getAdjustStep())}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('buttons.back')}
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700"
                >
                  {t('buttons.finish')}
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 'result' && result && (
            <div className="space-y-6">
              <div className={`rounded-3xl border p-6 ${
                result.status === 'free'
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                  : 'border-rose-400 bg-rose-50 text-rose-900'
              }`}>
                <div className="flex items-start gap-4">
                  {result.status === 'free' ? (
                    <CheckCircle2 className="mt-1 h-8 w-8" />
                  ) : (
                    <AlertTriangle className="mt-1 h-8 w-8" />
                  )}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">
                      {result.status === 'free'
                        ? t('result.permitFree.title')
                        : t('result.permitRequired.title')}
                    </h2>
                    <p className="text-base">
                      {result.status === 'free'
                        ? t('result.permitFree.subtitle')
                        : t('result.permitRequired.subtitle')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">{t('result.reasonsTitle')}</h3>
                <ul className="space-y-2">
                  {result.reasons.map((reason) => (
                    <li
                      key={reason.key}
                      className={`rounded-2xl border p-4 text-sm ${
                        reason.type === 'success'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                          : 'border-rose-200 bg-rose-50 text-rose-900'
                      }`}
                    >
                      {renderReasonText(reason.key)}
                    </li>
                  ))}
                </ul>
              </div>
              {result.status === 'free' && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900">
                  {t('result.permitFree.note')}
                </div>
              )}

              {result.status === 'permit' && (
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900">{t('result.permitRequired.nextStepsTitle')}</h3>
                  <p className="text-sm text-slate-700">{t('result.permitRequired.nextStepsIntro')}</p>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{t('result.permitRequired.documentsTitle')}</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {t.raw('result.permitRequired.documents').map((item: string) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-slate-700">{t('result.permitRequired.contactHint')}</p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('buttons.startOver')}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(getAdjustStep())}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700"
                >
                  {t('buttons.adjustAnswers')}
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm text-slate-600 shadow-sm whitespace-pre-line">
                {t('disclaimer')}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
