export type GfvoCategoryId =
  | 'retail'
  | 'office'
  | 'warehouse'
  | 'beauty'
  | 'tailor'
  | 'photography'
  | 'dental'
  | 'accommodation'
  | 'iceCreamParlor'
  | 'textilePickup'
  | 'dataCenter'
  | 'insideInfrastructure'
  | 'withinComplex'

export type GfvoCategoryOption = {
  id: GfvoCategoryId
  translationKey: string
  descriptionKey: string
  timeExempt: boolean
}

export const gfvoCategories: GfvoCategoryOption[] = [
  { id: 'retail', translationKey: 'categories.retail.title', descriptionKey: 'categories.retail.description', timeExempt: false },
  { id: 'office', translationKey: 'categories.office.title', descriptionKey: 'categories.office.description', timeExempt: false },
  { id: 'warehouse', translationKey: 'categories.warehouse.title', descriptionKey: 'categories.warehouse.description', timeExempt: false },
  { id: 'beauty', translationKey: 'categories.beauty.title', descriptionKey: 'categories.beauty.description', timeExempt: false },
  { id: 'tailor', translationKey: 'categories.tailor.title', descriptionKey: 'categories.tailor.description', timeExempt: false },
  { id: 'photography', translationKey: 'categories.photography.title', descriptionKey: 'categories.photography.description', timeExempt: false },
  { id: 'dental', translationKey: 'categories.dental.title', descriptionKey: 'categories.dental.description', timeExempt: false },
  { id: 'accommodation', translationKey: 'categories.accommodation.title', descriptionKey: 'categories.accommodation.description', timeExempt: true },
  { id: 'iceCreamParlor', translationKey: 'categories.iceCreamParlor.title', descriptionKey: 'categories.iceCreamParlor.description', timeExempt: true },
  { id: 'textilePickup', translationKey: 'categories.textilePickup.title', descriptionKey: 'categories.textilePickup.description', timeExempt: true },
  { id: 'dataCenter', translationKey: 'categories.dataCenter.title', descriptionKey: 'categories.dataCenter.description', timeExempt: true },
  { id: 'insideInfrastructure', translationKey: 'categories.insideInfrastructure.title', descriptionKey: 'categories.insideInfrastructure.description', timeExempt: true },
  { id: 'withinComplex', translationKey: 'categories.withinComplex.title', descriptionKey: 'categories.withinComplex.description', timeExempt: true },
]

export type GfvoExclusionId =
  | 'externalVentilation'
  | 'regulatedStorage'
  | 'unregulatedHazards'
  | 'loudMusic'
  | 'ippcSeveso'

export type GfvoExclusionOption = {
  id: GfvoExclusionId
  questionKey: string
  descriptionKey: string
  reasonKey: ReasonKey
}

export const gfvoExclusions: GfvoExclusionOption[] = [
  {
    id: 'externalVentilation',
    questionKey: 'exclusions.externalVentilation.question',
    descriptionKey: 'exclusions.externalVentilation.description',
    reasonKey: 'externalVentilation',
  },
  {
    id: 'regulatedStorage',
    questionKey: 'exclusions.regulatedStorage.question',
    descriptionKey: 'exclusions.regulatedStorage.description',
    reasonKey: 'regulatedStorage',
  },
  {
    id: 'unregulatedHazards',
    questionKey: 'exclusions.unregulatedHazards.question',
    descriptionKey: 'exclusions.unregulatedHazards.description',
    reasonKey: 'unregulatedHazards',
  },
  {
    id: 'loudMusic',
    questionKey: 'exclusions.loudMusic.question',
    descriptionKey: 'exclusions.loudMusic.description',
    reasonKey: 'loudMusic',
  },
  {
    id: 'ippcSeveso',
    questionKey: 'exclusions.ippcSeveso.question',
    descriptionKey: 'exclusions.ippcSeveso.description',
    reasonKey: 'ippcSeveso',
  },
]

export type ReasonKey =
  | 'categoryMissing'
  | 'categoryMet'
  | 'operatingTimesMissing'
  | 'operatingTimesMet'
  | 'operatingTimesExempt'
  | 'noExclusions'
  | 'externalVentilation'
  | 'regulatedStorage'
  | 'unregulatedHazards'
  | 'loudMusic'
  | 'ippcSeveso'

export type ReasonType = 'success' | 'failure'

export interface ReasonEntry {
  key: ReasonKey
  type: ReasonType
}

export interface EvaluationResult {
  status: 'free' | 'permit'
  reasons: ReasonEntry[]
  categoryId?: GfvoCategoryId
  timeCheckRequired: boolean
}

export type GfvoEvaluationInput = {
  categoryId: GfvoCategoryId | 'none'
  operatingTimesCompliant: boolean
  timeCheckRequired: boolean
  exclusions: Record<GfvoExclusionId, boolean>
}

export const defaultExclusionState: Record<GfvoExclusionId, boolean> = gfvoExclusions.reduce(
  (acc, exclusion) => {
    acc[exclusion.id] = false
    return acc
  },
  {} as Record<GfvoExclusionId, boolean>,
)

export const getCategoryById = (id: GfvoCategoryId | undefined) =>
  gfvoCategories.find((category) => category.id === id)

export function evaluateGfvo(input: GfvoEvaluationInput): EvaluationResult {
  if (input.categoryId === 'none') {
    return {
      status: 'permit',
      reasons: [{ key: 'categoryMissing', type: 'failure' }],
      timeCheckRequired: false,
    }
  }

  if (input.timeCheckRequired && !input.operatingTimesCompliant) {
    return {
      status: 'permit',
      reasons: [{ key: 'operatingTimesMissing', type: 'failure' }],
      categoryId: input.categoryId,
      timeCheckRequired: input.timeCheckRequired,
    }
  }

  const triggeredExclusions = gfvoExclusions.filter((exclusion) => input.exclusions[exclusion.id])

  if (triggeredExclusions.length > 0) {
    return {
      status: 'permit',
      reasons: triggeredExclusions.map((exclusion) => ({ key: exclusion.reasonKey, type: 'failure' })),
      categoryId: input.categoryId,
      timeCheckRequired: input.timeCheckRequired,
    }
  }

  return {
    status: 'free',
    reasons: [
      { key: 'categoryMet', type: 'success' },
      { key: input.timeCheckRequired ? 'operatingTimesMet' : 'operatingTimesExempt', type: 'success' },
      { key: 'noExclusions', type: 'success' },
    ],
    categoryId: input.categoryId,
    timeCheckRequired: input.timeCheckRequired,
  }
}
