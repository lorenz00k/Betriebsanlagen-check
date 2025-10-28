export type HelpTextLocale = "de" | "en"

type HelpTextKey =
  | "category"
  | "temporary"
  | "openingHours"
  | "seats"
  | "kitchen"
  | "noise"
  | "ventilation"
  | "chemicals"
  | "fireEscape"
  | "sanitation"

export const helpTexts: Record<HelpTextLocale, Record<HelpTextKey, string>> = {
  de: {
    category: "Wähle die Haupttätigkeit. Bsp.: Gastronomie, Einzelhandel, Werkstatt.",
    temporary: "Temporär = kürzer als 90 Tage, z. B. Pop-up, Messe, Marktstand.",
    openingHours: "Betrieb nach 22:00 Uhr kann zusätzliche Auflagen auslösen.",
    seats: "Innen- und Außenplätze getrennt angeben. Außenflächen oft gesondert.",
    kitchen: "Fettige Abluft (Fritteuse/Grill) → häufig Fettabscheider & Abluft ins Freie.",
    noise: "Lärmintensive Maschinen/Musik bitte angeben – wirkt auf Auflagen aus.",
    ventilation: "Gibt es Zu-/Abluft? Wohin wird die Abluft geführt (Dach, Innenhof)?",
    chemicals: "Gefahrstoffe (Farben/Lösungsmittel) mit Menge angeben – Grenzwerte beachten.",
    fireEscape: "Fluchtweg gekennzeichnet, Feuerlöscher nach Risikoklasse – je Nutzung.",
    sanitation: "WC-Anzahl richtet sich nach Sitzplätzen/Personal; Gäste-WC bei Gastro üblich.",
  },
  en: {
    category: "Select the main activity. E.g., hospitality, retail, workshop.",
    temporary: "Temporary = less than 90 days, e.g., pop-up, trade fair, market stall.",
    openingHours: "Operation after 10 pm may trigger additional requirements.",
    seats: "Report indoor and outdoor seats separately. Outdoor often separate permit.",
    kitchen: "Grease-laden exhaust (fryer/grill) → often grease trap & discharge outdoors.",
    noise: "Noisy machines/music? Specify – affects requirements (noise control).",
    ventilation: "Mechanical supply/exhaust? Where does exhaust go (roof, courtyard)?",
    chemicals: "List hazardous substances with quantities – thresholds may apply.",
    fireEscape: "Marked escape route, extinguishers by risk class – depends on use.",
    sanitation: "WC count depends on seats/staff; guest WC common for hospitality.",
  },
}
