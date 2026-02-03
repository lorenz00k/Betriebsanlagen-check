'use client'

import { useState } from 'react'
import ui from "./WizardStep.module.css";

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
  onComplete: (data: Record<string, unknown>) => void
  onBack: () => void
  canGoBack: boolean
}

export function WizardStep({ step, onComplete, onBack, canGoBack }: WizardStepProps) {
  const [value, setValue] = useState<string | string[] | boolean | null>(step.type === 'multiselect' ? [] : null)
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
          <div className={ui.gridTwo}>
            {step.options?.map((option) => {
              const selected = value === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setValue(option.value)}
                  className={`${ui.card} ${selected ? ui.selected : ""}`}
                >
                  <div className={ui.row}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={ui.title}>{option.label}</div>
                      {option.description && <div className={ui.desc}>{option.description}</div>}
                    </div>

                    {selected && (
                      <span className={ui.selectedBadge} aria-hidden="true">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    )}

                  </div>
                </button>
              )
            })}
          </div>
        )

      case 'number':
        return (
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="number"
                value={typeof value === 'string' || typeof value === 'number' ? value : ''}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleComplete()}
                min={step.min}
                max={step.max}
                placeholder={step.placeholder}
                className="px-6 py-4 text-2xl font-bold text-center"
              />
              {step.unit && (
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-medium"
                  style={{ color: "var(--color-muted)" }}
                >
                  {step.unit}
                </span>
              )}
            </div>
            {step.min !== undefined && step.max !== undefined && (
              <div className="mt-3 text-sm text-center" style={{ color: "var(--color-muted)" }}>
                Zwischen {step.min} und {step.max} {step.unit}
              </div>
            )}
          </div>
        )

      case 'select':
        return (
          <div className="max-w-md mx-auto">
            <select
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => setValue(e.target.value)}
              className="px-6 py-4 text-lg cursor-pointer appearance-none"
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
          <div className={`${ui.gridTwo} max-w-xl mx-auto`}>
            <button
              onClick={() => setValue(true)}
              className={`${ui.card} ${ui.booleanCard} ${value === true ? ui.yesSelected : ""}`}
            >
              <svg className={ui.booleanIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className={ui.booleanLabel}>Ja</div>
            </button>

            <button
              onClick={() => setValue(false)}
              className={`${ui.card} ${ui.booleanCard} ${value === false ? ui.noSelected : ""}`}
            >
              <svg className={ui.booleanIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <div className={ui.booleanLabel}>Nein</div>
            </button>
          </div>
        )


      case 'multiselect':
        return (
          <div className={ui.gridTwo}>
            {step.options?.map((option) => {
              const isSelected = ((value as string[]) || []).includes(option.value)

              return (
                <button
                  key={option.value}
                  onClick={() => handleMultiselectToggle(option.value)}
                  className={`${ui.card} ${isSelected ? ui.selected : ""}`}
                >
                  <div className={ui.row}>
                    <div className={`${ui.checkBox} ${isSelected ? ui.checkBoxSelected : ""}`}>
                      {isSelected && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={ui.title}>{option.label}</div>
                      {option.description && <div className={ui.desc}>{option.description}</div>}
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
        <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--color-fg)" }}>
          {step.question}
        </h2>

        {step.helpText && (
          <p className="max-w-xl mx-auto" style={{ color: "var(--color-fg-subtle)" }}>
            {step.helpText}
          </p>
        )}

      </div>

      {/* Input */}
      <div className="animate-slideUp">{renderInput()}</div>

      {/* Error */}
      {error && (
        <div className={ui.errorWrap}>
          <div className={ui.errorBox} role="alert" aria-live="polite">
            <svg className={ui.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div
        className="flex gap-4 justify-between pt-6 border-t"
        style={{ borderColor: "color-mix(in srgb, var(--color-border) 55%, transparent)" }}
      >
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="btn btn-previous"
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
          className="btn btn-next"
        >
          Weiter →
        </button>
      </div>
    </div>
  )
}
