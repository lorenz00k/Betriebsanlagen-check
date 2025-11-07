'use client'

import { useState } from 'react'

export interface StepOption {
  value: string
  label: string
  emoji?: string
  description?: string
}

export interface StepConfig {
  id: string
  question: string
  type: 'choice' | 'number' | 'select' | 'boolean' | 'multiselect'
  options?: StepOption[]
  unit?: string
  min?: number
  max?: number
  placeholder?: string
  helpText?: string
}

interface WizardStepProps {
  step: StepConfig
  onComplete: (data: Record<string, any>) => void
  onBack: () => void
  canGoBack: boolean
}

export function WizardStep({ step, onComplete, onBack, canGoBack }: WizardStepProps) {
  const [value, setValue] = useState<any>(step.type === 'multiselect' ? [] : null)
  const [error, setError] = useState<string | null>(null)

  const handleMultiselectToggle = (optionValue: string) => {
    const currentValues = (value as string[]) || []

    // If "none" is selected, clear all others
    if (optionValue === 'none') {
      setValue(['none'])
      return
    }

    // If selecting something else, remove "none"
    let newValues = currentValues.filter(v => v !== 'none')

    if (newValues.includes(optionValue)) {
      // Remove if already selected
      newValues = newValues.filter(v => v !== optionValue)
    } else {
      // Add if not selected
      newValues.push(optionValue)
    }

    setValue(newValues)
  }

  const handleComplete = () => {
    // Validation
    if (step.type === 'multiselect') {
      if (!value || (value as string[]).length === 0) {
        setError('Bitte wählen Sie mindestens eine Option aus')
        return
      }
    } else if (value === null || value === undefined || value === '') {
      setError('Bitte wählen Sie eine Option aus')
      return
    }

    if (step.type === 'number') {
      const numValue = Number(value)
      if (isNaN(numValue)) {
        setError('Bitte geben Sie eine gültige Zahl ein')
        return
      }
      if (step.min !== undefined && numValue < step.min) {
        setError(`Minimum ist ${step.min}${step.unit || ''}`)
        return
      }
      if (step.max !== undefined && numValue > step.max) {
        setError(`Maximum ist ${step.max}${step.unit || ''}`)
        return
      }
    }

    setError(null)
    onComplete({ [step.id]: value })
  }

  const renderInput = () => {
    switch (step.type) {
      case 'choice':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {step.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => setValue(option.value)}
                className={`p-6 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                  value === option.value
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-gray-900 mb-1">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-sm text-gray-600">
                        {option.description}
                      </div>
                    )}
                  </div>
                  {value === option.value && (
                    <svg
                      className="w-6 h-6 text-blue-600 flex-shrink-0"
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
              </button>
            ))}
          </div>
        )

      case 'number':
        return (
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="number"
                value={value || ''}
                onChange={(e) => setValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComplete()}
                min={step.min}
                max={step.max}
                placeholder={step.placeholder}
                className="w-full px-6 py-4 text-2xl font-bold text-center border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
              {step.unit && (
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl text-gray-400 font-medium">
                  {step.unit}
                </span>
              )}
            </div>
            {step.min !== undefined && step.max !== undefined && (
              <div className="mt-3 text-sm text-gray-500 text-center">
                Zwischen {step.min} und {step.max} {step.unit}
              </div>
            )}
          </div>
        )

      case 'select':
        return (
          <div className="max-w-md mx-auto">
            <select
              value={value || ''}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none bg-white cursor-pointer"
            >
              <option value="">Bitte wählen...</option>
              {step.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )

      case 'boolean':
        return (
          <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto">
            <button
              onClick={() => setValue(true)}
              className={`group p-8 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                value === true
                  ? 'border-green-600 bg-green-50 shadow-sm'
                  : 'border-gray-200 hover:border-green-300 bg-white'
              }`}
            >
              <svg className="w-12 h-12 mx-auto mb-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="font-bold text-xl text-gray-900">Ja</div>
            </button>
            <button
              onClick={() => setValue(false)}
              className={`group p-8 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                value === false
                  ? 'border-red-600 bg-red-50 shadow-sm'
                  : 'border-gray-200 hover:border-red-300 bg-white'
              }`}
            >
              <svg className="w-12 h-12 mx-auto mb-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <div className="font-bold text-xl text-gray-900">Nein</div>
            </button>
          </div>
        )

      case 'multiselect':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {step.options?.map((option) => {
              const isSelected = (value as string[] || []).includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => handleMultiselectToggle(option.value)}
                  className={`p-6 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-gray-600">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Question */}
      <div className="text-center animate-fadeIn">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {step.question}
        </h2>
        {step.helpText && (
          <p className="text-gray-600 max-w-xl mx-auto">{step.helpText}</p>
        )}
      </div>

      {/* Input */}
      <div className="animate-slideUp">{renderInput()}</div>

      {/* Error */}
      {error && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          ← Zurück
        </button>
        <button
          onClick={handleComplete}
          disabled={
            step.type === 'multiselect'
              ? !value || (value as string[]).length === 0
              : value === null || value === undefined || value === ''
          }
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all disabled:hover:shadow-sm"
        >
          Weiter →
        </button>
      </div>
    </div>
  )
}
