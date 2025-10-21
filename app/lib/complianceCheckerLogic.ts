// Comprehensive compliance checker logic for Austrian Betriebsanlagen, covering
// facility determination, GFVO exemptions, document requirements, occupational
// safety baselines, operational duties, and change notifications.

export type BusinessSector =
  | 'retail'
  | 'office'
  | 'gastronomyHotel'
  | 'accommodation'
  | 'workshop'
  | 'warehouse'
  | 'cosmetics'
  | 'dataCenter'
  | 'selfService'
  | 'other'

export type HospitalitySubtype = 'beherbergung' | 'iceSalon' | 'otherGastro'
export type WorkshopSubtype = 'tailor' | 'shoeService' | 'textilePickup' | 'otherWorkshop'

export type BooleanChoice = 'yes' | 'no'
export type OperatingPattern = 'gfvoWindow' | 'extendedHours' | 'roundTheClock'

export interface ComplianceInput {
  sector?: BusinessSector
  hospitalitySubtype?: HospitalitySubtype
  workshopSubtype?: WorkshopSubtype
  areaSqm?: number
  outdoorAreaSqm?: number
  bedCount?: number
  personCount?: number
  isStationary?: BooleanChoice
  isOnlyTemporary?: BooleanChoice
  zoningClarified?: BooleanChoice
  buildingConsentPresent?: BooleanChoice
  operatingPattern?: OperatingPattern
  hasExternalVentilation?: BooleanChoice
  storesRegulatedHazardous?: BooleanChoice
  storesLabelledHazardous?: BooleanChoice
  usesLoudMusic?: BooleanChoice
  ippcOrSevesoRelevant?: BooleanChoice
  expectedImpairments?: BooleanChoice
  locatedInInfrastructureSite?: BooleanChoice
  locatedInApprovedComplex?: BooleanChoice
  hasWellnessFacilities?: BooleanChoice
  servesFullMeals?: BooleanChoice
  buildingUseExclusive?: BooleanChoice
  existingPermitHistory?: BooleanChoice
}

export type ClassificationType =
  | 'noFacility'
  | 'freistellungGFVO'
  | 'needsPermit'
  | 'individualAssessment'

export interface ComplianceResult {
  isBetriebsanlage: boolean
  classification: ClassificationType
  classificationKey: string
  summaryKey: string
  gfvoCategoryKey?: string
  reasonKeys: string[]
  proceduralKeys: string[]
  documentGeneralKeys: string[]
  documentSectorKeys: string[]
  labourKeys: string[]
  operationalDutyKeys: string[]
  changeDutyKeys: string[]
  preCheckKeys: string[]
  specialNoteKeys: string[]
  quickReferenceKeys: string[]
  disclaimerKeys: string[]
}

const GFVO_EXEMPT_CATEGORIES: {
  key: string
  matches: (input: ComplianceInput) => boolean
  exemptFromOperatingWindow?: boolean
}[] = [
  {
    key: 'retail',
    matches: (input) => input.sector === 'retail' && (input.areaSqm ?? Infinity) <= 600,
  },
  {
    key: 'office',
    matches: (input) => input.sector === 'office',
  },
  {
    key: 'warehouse',
    matches: (input) => input.sector === 'warehouse' && (input.areaSqm ?? Infinity) <= 600,
  },
  {
    key: 'cosmetics',
    matches: (input) => input.sector === 'cosmetics',
  },
  {
    key: 'tailor',
    matches: (input) =>
      input.sector === 'workshop' && ['tailor', 'shoeService'].includes(input.workshopSubtype ?? ''),
  },
  {
    key: 'textilePickup',
    matches: (input) => input.sector === 'workshop' && input.workshopSubtype === 'textilePickup',
    exemptFromOperatingWindow: true,
  },
  {
    key: 'accommodation',
    matches: (input) =>
      (input.sector === 'accommodation' ||
        (input.sector === 'gastronomyHotel' && input.hospitalitySubtype === 'beherbergung')) &&
      (input.bedCount ?? Infinity) <= 30 &&
      input.buildingUseExclusive === 'yes' &&
      input.hasWellnessFacilities !== 'yes' &&
      input.servesFullMeals !== 'yes',
    exemptFromOperatingWindow: true,
  },
  {
    key: 'iceSalon',
    matches: (input) =>
      input.sector === 'gastronomyHotel' && input.hospitalitySubtype === 'iceSalon',
    exemptFromOperatingWindow: true,
  },
  {
    key: 'dataCenter',
    matches: (input) => input.sector === 'dataCenter',
    exemptFromOperatingWindow: true,
  },
  {
    key: 'infrastructureSite',
    matches: (input) => input.locatedInInfrastructureSite === 'yes',
    exemptFromOperatingWindow: true,
  },
  {
    key: 'embeddedFacility',
    matches: (input) =>
      input.locatedInApprovedComplex === 'yes' && (input.areaSqm ?? Infinity) <= 400,
    exemptFromOperatingWindow: true,
  },
]

const CLASSIFICATION_KEYS: Record<ClassificationType, { title: string; summary: string }> = {
  noFacility: {
    title: 'complianceResult.classifications.noFacility.title',
    summary: 'complianceResult.classifications.noFacility.summary',
  },
  freistellungGFVO: {
    title: 'complianceResult.classifications.freistellungGFVO.title',
    summary: 'complianceResult.classifications.freistellungGFVO.summary',
  },
  needsPermit: {
    title: 'complianceResult.classifications.needsPermit.title',
    summary: 'complianceResult.classifications.needsPermit.summary',
  },
  individualAssessment: {
    title: 'complianceResult.classifications.individualAssessment.title',
    summary: 'complianceResult.classifications.individualAssessment.summary',
  },
}

const GENERAL_DOCUMENT_KEYS = [
  'complianceResult.documents.general.application',
  'complianceResult.documents.general.description',
  'complianceResult.documents.general.sitePlans',
  'complianceResult.documents.general.ventilationPlan',
  'complianceResult.documents.general.machineList',
  'complianceResult.documents.general.emissionStatement',
  'complianceResult.documents.general.wasteConcept',
  'complianceResult.documents.general.wasteWater',
]

const GASTRO_DOCUMENT_KEYS = [
  'complianceResult.documents.sector.gastroExhaust',
  'complianceResult.documents.sector.guestSanitary',
  'complianceResult.documents.sector.hygiene',
]

const SELF_SERVICE_KEYS = ['complianceResult.specialNotes.selfService']

const LABOUR_KEYS = [
  'complianceResult.labour.roomHeight',
  'complianceResult.labour.daylight',
  'complianceResult.labour.ventilation',
  'complianceResult.labour.exhaustDischarge',
  'complianceResult.labour.escapeRoutes',
  'complianceResult.labour.escapeWidths',
  'complianceResult.labour.emergencyDoors',
  'complianceResult.labour.safetyLighting',
  'complianceResult.labour.staffSanitary',
]

const OPERATIONAL_DUTY_KEYS = [
  'complianceResult.operationalDuties.startAfterPermit',
  'complianceResult.operationalDuties.periodicInspection',
  'complianceResult.operationalDuties.inspectionScope',
  'complianceResult.operationalDuties.inspectionCertificate',
  'complianceResult.operationalDuties.deficiencyDuties',
]

const CHANGE_DUTY_KEYS = [
  'complianceResult.changeDuties.notifyChanges',
  'complianceResult.changeDuties.operationAfterNotice',
]

const PRE_CHECK_KEYS = [
  'complianceResult.preCheck.contactChamber',
  'complianceResult.preCheck.clarifyBuildingLaw',
  'complianceResult.preCheck.engageNeighbours',
  'complianceResult.preCheck.reviewOSH',
  'complianceResult.preCheck.clarifyPermitNeed',
  'complianceResult.preCheck.prepareCompleteSet',
]

const PROCEDURAL_KEYS = [
  'complianceResult.procedural.authority',
  'complianceResult.procedural.projectProcedure',
  'complianceResult.procedural.permitEffect',
  'complianceResult.procedural.eignungsfeststellung',
  'complianceResult.procedural.projectSprech',
  'complianceResult.procedural.feeHint',
]

const QUICK_REFERENCE_KEYS = [
  'complianceResult.quickReferences.definition',
  'complianceResult.quickReferences.gfvo',
  'complianceResult.quickReferences.guideline',
  'complianceResult.quickReferences.gastro',
  'complianceResult.quickReferences.procedure',
  'complianceResult.quickReferences.section82b',
]

const DISCLAIMER_KEYS = [
  'complianceResult.disclaimer.orientation',
  'complianceResult.disclaimer.legal',
]

function determineGfvoCategory(input: ComplianceInput): string | undefined {
  const match = GFVO_EXEMPT_CATEGORIES.find((entry) => entry.matches(input))
  return match?.key
}

function isOperatingWindowCompliant(input: ComplianceInput, gfvoKey?: string): boolean {
  if (!gfvoKey) {
    return input.operatingPattern !== 'gfvoWindow'
      ? input.operatingPattern !== 'extendedHours' && input.operatingPattern !== 'roundTheClock'
      : true
  }

  const rule = GFVO_EXEMPT_CATEGORIES.find((entry) => entry.key === gfvoKey)
  if (rule?.exemptFromOperatingWindow) {
    return true
  }

  return input.operatingPattern !== 'extendedHours' && input.operatingPattern !== 'roundTheClock'
}

function hasExclusion(input: ComplianceInput): { excluded: boolean; reasons: string[] } {
  const reasons: string[] = []

  if (input.hasExternalVentilation === 'yes') {
    reasons.push('complianceResult.reasons.externalVentilation')
  }
  if (input.storesRegulatedHazardous === 'yes') {
    reasons.push('complianceResult.reasons.regulatedHazardousStorage')
  }
  if (input.storesLabelledHazardous === 'yes') {
    reasons.push('complianceResult.reasons.labelledHazardousStorage')
  }
  if (input.usesLoudMusic === 'yes') {
    reasons.push('complianceResult.reasons.musicExclusion')
  }
  if (input.ippcOrSevesoRelevant === 'yes') {
    reasons.push('complianceResult.reasons.ippcSeveso')
  }

  return { excluded: reasons.length > 0, reasons }
}

function getSectorDocumentKeys(input: ComplianceInput): string[] {
  const keys: string[] = []

  if (
    input.sector === 'gastronomyHotel' ||
    input.sector === 'accommodation' ||
    input.hospitalitySubtype === 'beherbergung'
  ) {
    keys.push(...GASTRO_DOCUMENT_KEYS)
  }

  return keys
}

export function evaluateCompliance(input: ComplianceInput): ComplianceResult {
  const reasonKeys: string[] = []
  const gfvoCategoryKey = determineGfvoCategory(input)

  const isBetriebsanlage =
    input.isStationary === 'yes' && (input.isOnlyTemporary === 'no' || input.isOnlyTemporary === undefined)

  if (!isBetriebsanlage) {
    reasonKeys.push('complianceResult.reasons.noFacilityDefinition')
    return {
      isBetriebsanlage,
      classification: 'noFacility',
      classificationKey: CLASSIFICATION_KEYS.noFacility.title,
      summaryKey: CLASSIFICATION_KEYS.noFacility.summary,
      gfvoCategoryKey: undefined,
      reasonKeys,
      proceduralKeys: PROCEDURAL_KEYS,
      documentGeneralKeys: [],
      documentSectorKeys: getSectorDocumentKeys(input),
      labourKeys: [],
      operationalDutyKeys: [],
      changeDutyKeys: [],
      preCheckKeys: PRE_CHECK_KEYS,
      specialNoteKeys: input.sector === 'selfService' ? [...SELF_SERVICE_KEYS] : [],
      quickReferenceKeys: QUICK_REFERENCE_KEYS,
      disclaimerKeys: DISCLAIMER_KEYS,
    }
  }

  const exclusion = hasExclusion(input)
  reasonKeys.push(...exclusion.reasons)

  if (!isOperatingWindowCompliant(input, gfvoCategoryKey)) {
    reasonKeys.push('complianceResult.reasons.operatingHours')
  }

  if (
    (gfvoCategoryKey === 'retail' || gfvoCategoryKey === 'warehouse') &&
    (input.areaSqm ?? 0) > 600
  ) {
    reasonKeys.push('complianceResult.reasons.areaExceeded')
  }

  if (gfvoCategoryKey === 'accommodation') {
    if ((input.bedCount ?? 0) > 30) {
      reasonKeys.push('complianceResult.reasons.accommodationBeds')
    }
    if (input.buildingUseExclusive !== 'yes') {
      reasonKeys.push('complianceResult.reasons.accommodationBuildingUse')
    }
    if (input.hasWellnessFacilities === 'yes') {
      reasonKeys.push('complianceResult.reasons.accommodationWellness')
    }
    if (input.servesFullMeals === 'yes') {
      reasonKeys.push('complianceResult.reasons.accommodationMeals')
    }
  }

  const hasPermitReasons =
    exclusion.excluded || reasonKeys.includes('complianceResult.reasons.operatingHours')

  if (input.expectedImpairments === 'yes') {
    reasonKeys.push('complianceResult.reasons.expectedImpairments')
  }

  let classification: ClassificationType = 'individualAssessment'

  if (
    hasPermitReasons ||
    reasonKeys.includes('complianceResult.reasons.expectedImpairments')
  ) {
    classification = 'needsPermit'
  } else if (gfvoCategoryKey) {
    classification = 'freistellungGFVO'
  }

  if (!gfvoCategoryKey && classification === 'individualAssessment') {
    reasonKeys.push('complianceResult.reasons.individualAssessment')
  }

  if (classification === 'freistellungGFVO' && reasonKeys.length === 0) {
    reasonKeys.push('complianceResult.reasons.freistellungSummary')
  }

  const documentGeneralKeys =
    classification === 'needsPermit' || classification === 'individualAssessment'
      ? GENERAL_DOCUMENT_KEYS
      : []

  const specialNoteKeys = [
    ...(input.sector === 'selfService' ? SELF_SERVICE_KEYS : []),
    'complianceResult.specialNotes.buildingProcedure',
  ]

  if (input.existingPermitHistory === 'yes') {
    specialNoteKeys.push('complianceResult.specialNotes.existingPermits')
  }

  const labourKeys = LABOUR_KEYS
  const operationalDutyKeys = OPERATIONAL_DUTY_KEYS
  const changeDutyKeys = CHANGE_DUTY_KEYS

  return {
    isBetriebsanlage,
    classification,
    classificationKey: CLASSIFICATION_KEYS[classification].title,
    summaryKey: CLASSIFICATION_KEYS[classification].summary,
    gfvoCategoryKey: gfvoCategoryKey ? `complianceResult.gfvoCategories.${gfvoCategoryKey}` : undefined,
    reasonKeys,
    proceduralKeys: PROCEDURAL_KEYS,
    documentGeneralKeys,
    documentSectorKeys: getSectorDocumentKeys(input),
    labourKeys,
    operationalDutyKeys,
    changeDutyKeys,
    preCheckKeys: PRE_CHECK_KEYS,
    specialNoteKeys,
    quickReferenceKeys: QUICK_REFERENCE_KEYS,
    disclaimerKeys: DISCLAIMER_KEYS,
  }
}
