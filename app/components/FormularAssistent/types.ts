import type { Address, POI } from '@/app/lib/viennagis-api';
import type { RiskAssessment } from '@/app/utils/poi-checker';

export interface FormularDaten {
  // Schritt 1: Antragsteller
  name: string;
  kontaktperson: string;
  telefon: string;
  email: string;

  // Schritt 2: Standort
  bezirk: string;
  gemeinde: string;
  strasse: string;
  grundstueck: string;
  addressCheckerData: {
    address: Address;
    pois: POI[];
    riskAssessment: RiskAssessment;
  } | null;

  // Schritt 3: Antragstyp
  typ: string; // 'neu' oder 'aenderung'
  art_der_anlage: string;
  anlagenteile: string;

  // Schritt 4: Flächen
  flaechen_beschreibung: string;
  gesamtflaeche: string;
  anschlussleistung: string; // 'unter300', 'ueber300', 'keine'
}

export interface Schritt {
  id: string;
  icon: string;
}
