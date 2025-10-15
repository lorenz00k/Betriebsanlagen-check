// Business facility permit questionnaire logic based on Austrian Trade Act

export type BusinessType =
  | 'retail'
  | 'office'
  | 'warehouse'
  | 'beauty'
  | 'tailor'
  | 'photography'
  | 'dental'
  | 'accommodation'
  | 'gastronomy'
  | 'textilePickup'
  | 'dataCenter'
  | 'specialized'
  | 'other'

export interface QuestionnaireData {
  businessType?: BusinessType
  address?: {
    street: string
    postalCode: string
    city: string
  }
  businessArea?: 'upTo400' | 'upTo600' | 'over600'
  guestBeds?: 'upTo30' | 'over30'
  buildingUse?: 'accommodationOnly' | 'accommodationAndPrivate' | 'accommodationAndCommercial'
  swimmingPool?: 'yes' | 'no'
  meals?: 'breakfastOnly' | 'fullMeals'
  operatingHours?: 'compliant' | 'nonCompliant'
  ventilation?: 'yes' | 'no'
  hazardousMaterials?: 'yes' | 'no'
  music?: 'yes' | 'no'
  ippcStorage?: 'yes' | 'no'
}

export interface Question {
  id: string
  type: 'select' | 'address' | 'radio'
  required: boolean
  showIf?: (data: QuestionnaireData) => boolean
}

export const questions: Question[] = [
  {
    id: 'businessType',
    type: 'select',
    required: true,
  },
  // Address question commented out - will be added back later for API integration
  // {
  //   id: 'address',
  //   type: 'address',
  //   required: true,
  // },
  {
    id: 'businessArea',
    type: 'radio',
    required: true,
    showIf: (data) => {
      // Required for retail (§1 Abs. 1 Z 1), warehouse (§1 Abs. 1 Z 3), and specialized facilities
      return ['retail', 'warehouse', 'specialized'].includes(data.businessType || '')
    },
  },
  {
    id: 'guestBeds',
    type: 'radio',
    required: true,
    showIf: (data) => data.businessType === 'accommodation',
  },
  {
    id: 'buildingUse',
    type: 'radio',
    required: true,
    showIf: (data) => data.businessType === 'accommodation',
  },
  {
    id: 'swimmingPool',
    type: 'radio',
    required: true,
    showIf: (data) => data.businessType === 'accommodation',
  },
  {
    id: 'meals',
    type: 'radio',
    required: true,
    showIf: (data) => data.businessType === 'accommodation',
  },
  {
    id: 'operatingHours',
    type: 'radio',
    required: true,
    showIf: (data) => {
      // Not applicable for certain business types (§1 Abs. 2)
      const exemptTypes = ['accommodation', 'gastronomy', 'textilePickup', 'dataCenter', 'specialized']
      return !exemptTypes.includes(data.businessType || '')
    },
  },
  {
    id: 'ventilation',
    type: 'radio',
    required: true,
  },
  {
    id: 'hazardousMaterials',
    type: 'radio',
    required: true,
    showIf: (data) => data.businessType === 'warehouse',
  },
  {
    id: 'music',
    type: 'radio',
    required: true,
  },
  {
    id: 'ippcStorage',
    type: 'radio',
    required: true,
    showIf: (data) => data.businessType === 'warehouse',
  },
]

export function getVisibleQuestions(data: QuestionnaireData): Question[] {
  return questions.filter((q) => !q.showIf || q.showIf(data))
}

export function evaluatePermitNeed(data: QuestionnaireData): {
  needsPermit: boolean
  reasons: string[]
} {
  const reasons: string[] = []

  // § 2 - Exclusions (these always require a permit)
  if (data.ventilation === 'yes') {
    reasons.push('Mechanische Anlagenteile außerhalb der Gebäudehülle (§2 Z 2)')
    return { needsPermit: true, reasons }
  }

  if (data.hazardousMaterials === 'yes') {
    reasons.push('Lagerung gefährlicher Stoffe (§2 Z 4)')
    return { needsPermit: true, reasons }
  }

  if (data.music === 'yes') {
    reasons.push('Musizieren oder Musikwiedergabe (§2 Z 5)')
    return { needsPermit: true, reasons }
  }

  if (data.ippcStorage === 'yes') {
    reasons.push('IPPC-Lagerung (§2 Z 6)')
    return { needsPermit: true, reasons }
  }

  // Check operating hours compliance
  if (data.operatingHours === 'nonCompliant') {
    const exemptTypes = ['accommodation', 'gastronomy', 'textilePickup', 'dataCenter', 'specialized']
    if (!exemptTypes.includes(data.businessType || '')) {
      reasons.push('Betriebszeiten außerhalb der erlaubten Zeiten (§1 Abs. 2)')
      return { needsPermit: true, reasons }
    }
  }

  // § 1 Abs. 1 - Check if business type is exempt
  switch (data.businessType) {
    case 'retail':
      // § 1 Abs. 1 Z 1: Retail up to 600 m²
      if (data.businessArea === 'over600') {
        reasons.push('Einzelhandel über 600 m² benötigt Genehmigung')
        return { needsPermit: true, reasons }
      }
      break

    case 'office':
      // § 1 Abs. 1 Z 2: Office businesses are always exempt
      break

    case 'warehouse':
      // § 1 Abs. 1 Z 3: Warehouse up to 600 m² in closed buildings
      if (data.businessArea === 'over600') {
        reasons.push('Lager über 600 m² benötigt Genehmigung')
        return { needsPermit: true, reasons }
      }
      break

    case 'beauty':
    case 'tailor':
    case 'photography':
    case 'dental':
    case 'gastronomy':
    case 'textilePickup':
    case 'dataCenter':
      // These are always exempt under § 1 Abs. 1 Z 4-11
      break

    case 'accommodation':
      // § 1 Abs. 1 Z 8: Complex accommodation rules
      if (data.guestBeds === 'over30') {
        reasons.push('Beherbergung mit mehr als 30 Betten benötigt Genehmigung')
        return { needsPermit: true, reasons }
      }
      if (data.swimmingPool === 'yes') {
        reasons.push('Beherbergung mit Schwimmbädern benötigt Genehmigung (§1 Abs. 1 Z 8c)')
        return { needsPermit: true, reasons }
      }
      if (data.meals === 'fullMeals') {
        reasons.push('Beherbergung mit vollständigen Mahlzeiten benötigt Genehmigung')
        return { needsPermit: true, reasons }
      }
      break

    case 'specialized':
      // § 1 Abs. 1 Z 13: Up to 400 m² within approved facilities
      if (data.businessArea === 'upTo600' || data.businessArea === 'over600') {
        reasons.push('Spezialisierte Anlagen über 400 m² benötigen Genehmigung')
        return { needsPermit: true, reasons }
      }
      break

    case 'other':
      reasons.push('Dieser Betriebstyp ist nicht in der Freistellungsverordnung enthalten')
      return { needsPermit: true, reasons }
  }

  // If no reasons found, no permit is needed
  return { needsPermit: false, reasons: ['Ihre Betriebsanlage erfüllt die Kriterien für Genehmigungsfreiheit'] }
}
