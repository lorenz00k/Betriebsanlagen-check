// Umgebungsanalyse für Betriebsanlagengenehmigung

import type { POI } from '@/app/lib/viennagis-api';

export interface EnvironmentAnalysis {
  summary: string; // Kurze Zusammenfassung
  insights: string[]; // Neutrale Hinweise zur Umgebung
  recommendations: string[]; // Empfehlungen
  poiGroups: POIGroup[];
}

export interface POIGroup {
  category: 'religion' | 'health' | 'education' | 'cemetery' | 'other';
  label: string; // z.B. "Religiöse Einrichtungen"
  icon: string;
  count: number;
  pois: POI[];
  nearbyCount: number; // Anzahl unter 100m
}

// Legacy interface for backwards compatibility
export interface RiskAssessment {
  riskPoints: number;
  overallRisk: 'low' | 'medium' | 'high';
  warnings: string[];
  recommendations: string[];
  categorizedPOIs: {
    churches: POI[];
    hospitals: POI[];
    schools: POI[];
    cemeteries: POI[];
    other: POI[];
  };
}

/**
 * Neue Umgebungsanalyse ohne Risikobewertung (neutral)
 */
export function analyzeEnvironment(pois: POI[]): EnvironmentAnalysis {
  const insights: string[] = [];
  const recommendations: string[] = [];

  // POIs kategorisieren
  const groups = createPOIGroups(pois);

  // Zusammenfassung erstellen
  const totalCount = pois.length;
  const summary = totalCount === 0
    ? 'Keine sensiblen Einrichtungen in unmittelbarer Nähe gefunden.'
    : `${totalCount} ${totalCount === 1 ? 'Einrichtung' : 'Einrichtungen'} in der Umgebung gefunden, die bei der Genehmigung relevant sein ${totalCount === 1 ? 'kann' : 'können'}.`;

  // Insights für jede Kategorie mit POIs
  for (const group of groups) {
    if (group.count === 0) continue;

    const nearby = group.nearbyCount;
    const distanceInfo = nearby > 0
      ? `${nearby} davon in unmittelbarer Nähe (unter 100m)`
      : 'alle über 100m entfernt';

    switch (group.category) {
      case 'religion':
        insights.push(
          `${group.count} religiöse ${group.count === 1 ? 'Einrichtung' : 'Einrichtungen'} gefunden, ${distanceInfo}.`
        );
        if (nearby > 0) {
          recommendations.push(
            'Berücksichtigen Sie Ruhezeiten, besonders an Sonn- und Feiertagen.'
          );
          recommendations.push(
            'Bei Lärm- oder Geruchsemissionen: Planen Sie entsprechende Schutzmaßnahmen ein.'
          );
        }
        break;

      case 'health':
        insights.push(
          `${group.count} Gesundheitseinrichtung${group.count > 1 ? 'en' : ''} gefunden, ${distanceInfo}.`
        );
        if (nearby > 0) {
          recommendations.push(
            'Gesundheitseinrichtungen haben besondere Anforderungen an Lärmschutz.'
          );
        }
        break;

      case 'education':
        insights.push(
          `${group.count} Bildungseinrichtung${group.count > 1 ? 'en' : ''} gefunden, ${distanceInfo}.`
        );
        if (nearby > 0) {
          recommendations.push(
            'Bei Schulen/Kindergärten: Beachten Sie Betreuungszeiten (Mo-Fr 7:00-17:00 Uhr).'
          );
        }
        break;

      case 'cemetery':
        insights.push(
          `${group.count} Friedhof${group.count > 1 ? 'e' : ''} gefunden, ${distanceInfo}.`
        );
        if (nearby > 0) {
          recommendations.push(
            'Friedhöfe: Besondere Auflagen für Geruchsemissionen und Pietät möglich.'
          );
        }
        break;
    }
  }

  // Allgemeine Empfehlungen
  if (totalCount === 0) {
    recommendations.push(
      'Die Umgebung scheint für eine Betriebsanlage grundsätzlich geeignet zu sein.'
    );
    recommendations.push(
      'Beachten Sie dennoch alle allgemeinen Auflagen der Betriebsanlagengenehmigung.'
    );
  } else if (groups.some(g => g.nearbyCount > 0)) {
    recommendations.push(
      'Wir empfehlen eine unverbindliche Vorabklärung mit der MA 36 für konkrete Auflagen.'
    );
    recommendations.push(
      'Kontakt MA 36: +43 1 4000-25310 oder post@ma36.wien.gv.at'
    );
  } else {
    recommendations.push(
      'Dokumentieren Sie alle geplanten Schutzmaßnahmen für den Genehmigungsantrag.'
    );
  }

  return {
    summary,
    insights,
    recommendations,
    poiGroups: groups
  };
}

/**
 * Helper: POIs in Gruppen kategorisieren
 */
function createPOIGroups(pois: POI[]): POIGroup[] {
  type CategoryConfig = {
    types: string[];
    label: string;
    icon: string;
  };

  const categories: Record<string, CategoryConfig> = {
    religion: {
      types: ['religion', 'kath', 'evangkirche', 'orthodox', 'islam', 'israel', 'juedwien', 'buddh'],
      label: 'Religiöse Einrichtungen',
      icon: '🛐'
    },
    health: {
      types: ['krankenhaus'],
      label: 'Gesundheitseinrichtungen',
      icon: '🏥'
    },
    education: {
      types: ['kindergarten', 'schule'],
      label: 'Bildungseinrichtungen',
      icon: '🏫'
    },
    cemetery: {
      types: ['friedhof'],
      label: 'Friedhöfe',
      icon: '🪦'
    },
    other: {
      types: [],
      label: 'Sonstige',
      icon: '📍'
    }
  };

  const groups: POIGroup[] = [];

  for (const [category, config] of Object.entries(categories)) {
    const categoryPOIs = category === 'other'
      ? pois.filter(p => !Object.values(categories)
          .filter((c: CategoryConfig) => c.types.length > 0)
          .some((c: CategoryConfig) => c.types.includes(p.type)))
      : pois.filter(p => config.types.includes(p.type));

    const nearbyCount = categoryPOIs.filter(p => p.distance < 100).length;

    groups.push({
      category: category as POIGroup['category'],
      label: config.label,
      icon: config.icon,
      count: categoryPOIs.length,
      pois: categoryPOIs.sort((a, b) => a.distance - b.distance), // Nach Distanz sortieren
      nearbyCount
    });
  }

  // Nur Gruppen mit POIs zurückgeben, sortiert nach Anzahl
  return groups
    .filter(g => g.count > 0)
    .sort((a, b) => b.count - a.count);
}

/**
 * Legacy: POIs analysieren und Risikobewertung erstellen
 * @deprecated Use analyzeEnvironment() instead
 */
export function analyzePOIs(pois: POI[]): RiskAssessment {
  let riskPoints = 0;
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // POI-Kategorien
  const churchTypes = ['religion', 'kath', 'evangkirche', 'orthodox', 'islam', 'israel', 'juedwien', 'buddh'];
  const hospitalTypes = ['krankenhaus'];
  const schoolTypes = ['kindergarten', 'schule'];
  const cemeteryTypes = ['friedhof'];

  // POIs kategorisieren
  const categorizedPOIs = {
    churches: pois.filter(p => churchTypes.includes(p.type)),
    hospitals: pois.filter(p => hospitalTypes.includes(p.type)),
    schools: pois.filter(p => schoolTypes.includes(p.type)),
    cemeteries: pois.filter(p => cemeteryTypes.includes(p.type)),
    other: pois.filter(p =>
      !churchTypes.includes(p.type) &&
      !hospitalTypes.includes(p.type) &&
      !schoolTypes.includes(p.type) &&
      !cemeteryTypes.includes(p.type)
    )
  };

  // KIRCHEN - Höchstes Risiko
  if (categorizedPOIs.churches.length > 0) {
    const nearChurches = categorizedPOIs.churches.filter(p => p.distance < 100);

    if (nearChurches.length > 0) {
      riskPoints += 40;
      warnings.push(
        `${nearChurches.length} religiöse ${nearChurches.length === 1 ? 'Einrichtung' : 'Einrichtungen'} im Umkreis von 100m gefunden. ` +
        `Dies kann die Genehmigung deutlich erschweren, besonders bei Lärm- oder Geruchsemissionen.`
      );
      recommendations.push(
        'Planen Sie umfassende Lärmschutzmaßnahmen ein und beschränken Sie laute Tätigkeiten auf Werktage (Mo-Fr).'
      );
      recommendations.push(
        'Vermeiden Sie Betriebszeiten während Gottesdiensten (So + Feiertage, insbesondere vormittags).'
      );
    } else {
      const midRangeChurches = categorizedPOIs.churches.filter(p => p.distance >= 100 && p.distance < 200);
      if (midRangeChurches.length > 0) {
        riskPoints += 15;
        warnings.push(
          `${midRangeChurches.length} religiöse ${midRangeChurches.length === 1 ? 'Einrichtung' : 'Einrichtungen'} in der Nähe (100-200m). ` +
          `Beachten Sie Ruhezeiten, besonders an Sonn- und Feiertagen.`
        );
      }
    }
  }

  // KRANKENHÄUSER
  if (categorizedPOIs.hospitals.length > 0) {
    const nearHospitals = categorizedPOIs.hospitals.filter(p => p.distance < 150);

    if (nearHospitals.length > 0) {
      riskPoints += 30;
      warnings.push(
        `${nearHospitals.length} ${nearHospitals.length === 1 ? 'Krankenhaus' : 'Krankenhäuser'} in unmittelbarer Nähe (unter 150m). ` +
        `Lärmemissionen sind besonders kritisch.`
      );
      recommendations.push(
        'Implementieren Sie umfassende Lärmschutzmaßnahmen (Schallschutzwände, Dämmung).'
      );
      recommendations.push(
        'Vermeiden Sie Nachtbetrieb (22:00 - 6:00 Uhr) und Wochenendarbeiten.'
      );
    } else {
      riskPoints += 10;
      warnings.push(
        `${categorizedPOIs.hospitals.length} ${categorizedPOIs.hospitals.length === 1 ? 'Krankenhaus' : 'Krankenhäuser'} in der weiteren Umgebung. ` +
        `Beachten Sie allgemeine Lärmschutzauflagen.`
      );
    }
  }

  // KINDERGÄRTEN/SCHULEN
  if (categorizedPOIs.schools.length > 0) {
    const nearSchools = categorizedPOIs.schools.filter(p => p.distance < 100);

    if (nearSchools.length > 0) {
      riskPoints += 25;
      const type = nearSchools.some(s => s.type === 'schule') ? 'Schule/Kindergarten' : 'Kindergarten';
      warnings.push(
        `${nearSchools.length} ${type}${nearSchools.length > 1 ? 'en' : ''} in unmittelbarer Nähe (unter 100m). ` +
        `Besondere Auflagen für Sicherheit und Emissionen sind zu erwarten.`
      );
      recommendations.push(
        'Stellen Sie sicher, dass keine gefährlichen Stoffe oder Maschinen für Kinder zugänglich sind.'
      );
      recommendations.push(
        'Vermeiden Sie Lärmbelästigung während der Unterrichts-/Betreuungszeiten (Mo-Fr 7:00-17:00 Uhr).'
      );
    } else {
      riskPoints += 10;
      const type = categorizedPOIs.schools.some(s => s.type === 'schule') ? 'Schulen/Kindergärten' : 'Kindergärten';
      warnings.push(
        `${categorizedPOIs.schools.length} ${type} in der Umgebung.`
      );
    }
  }

  // FRIEDHÖFE
  if (categorizedPOIs.cemeteries.length > 0) {
    const nearCemeteries = categorizedPOIs.cemeteries.filter(p => p.distance < 100);

    if (nearCemeteries.length > 0) {
      riskPoints += 20;
      warnings.push(
        `${nearCemeteries.length} ${nearCemeteries.length === 1 ? 'Friedhof' : 'Friedhöfe'} in unmittelbarer Nähe (unter 100m). ` +
        `Besondere Auflagen für Geruchsemissionen und Pietät sind zu erwarten.`
      );
      recommendations.push(
        'Vermeiden Sie Geruchsemissionen (Gastronomie, Produktion). Lärm während Beerdigungen minimieren.'
      );
    } else {
      riskPoints += 5;
      warnings.push(
        `${categorizedPOIs.cemeteries.length} ${categorizedPOIs.cemeteries.length === 1 ? 'Friedhof' : 'Friedhöfe'} in der Umgebung.`
      );
    }
  }

  // Gesamtrisiko bestimmen
  let overallRisk: 'low' | 'medium' | 'high';

  if (riskPoints >= 60) {
    overallRisk = 'high';
    recommendations.push(
      '⚠️ Bei diesem Risikoprofil empfehlen wir dringend eine Vorabklärung mit der MA 36 (Technische Gewerbeangelegenheiten).'
    );
    recommendations.push(
      'Kontakt MA 36: +43 1 4000-25310 oder post@ma36.wien.gv.at'
    );
  } else if (riskPoints >= 30) {
    overallRisk = 'medium';
    recommendations.push(
      'Eine sorgfältige Planung der Lärmschutz- und Emissionsminderungsmaßnahmen ist ratsam.'
    );
    recommendations.push(
      'Dokumentieren Sie alle geplanten Schutzmaßnahmen für den Genehmigungsantrag.'
    );
  } else {
    overallRisk = 'low';
    if (warnings.length === 0) {
      warnings.push('✅ Keine besonderen Probleme mit der Umgebung erkennbar.');
    }
    recommendations.push(
      'Die Umgebung scheint für eine Betriebsanlage grundsätzlich geeignet zu sein.'
    );
    recommendations.push(
      'Beachten Sie dennoch alle allgemeinen Auflagen der Betriebsanlagengenehmigung.'
    );
  }

  // Allgemeine Empfehlung wenn POIs vorhanden
  if (pois.length > 0 && !recommendations.some(r => r.includes('Vorabklärung'))) {
    recommendations.push(
      'Erwägen Sie eine unverbindliche Vorabklärung mit der MA 36 für konkrete Auflagen.'
    );
  }

  return {
    riskPoints,
    overallRisk,
    warnings,
    recommendations,
    categorizedPOIs
  };
}

/**
 * POI-Typ zu menschenlesbarer Bezeichnung
 */
export function getPOILabel(type: string): string {
  const labels: Record<string, string> = {
    krankenhaus: 'Krankenhaus',
    religion: 'Religiöse Einrichtung',
    kath: 'Katholische Kirche',
    evangkirche: 'Evangelische Kirche',
    orthodox: 'Orthodoxe Kirche',
    islam: 'Moschee',
    israel: 'Synagoge',
    juedwien: 'Jüdische Einrichtung',
    buddh: 'Buddhistischer Tempel',
    kindergarten: 'Kindergarten',
    schule: 'Schule',
    friedhof: 'Friedhof',
    baustelle: 'Baustelle',
    polizei: 'Polizei'
  };

  return labels[type] || type;
}

/**
 * POI-Typ zu Icon-Emoji
 */
export function getPOIIcon(type: string): string {
  const icons: Record<string, string> = {
    krankenhaus: '🏥',
    religion: '🛐',
    kath: '⛪',
    evangkirche: '⛪',
    orthodox: '☦️',
    islam: '🕌',
    israel: '🕍',
    juedwien: '✡️',
    buddh: '🛕',
    kindergarten: '👶',
    schule: '🏫',
    friedhof: '🪦',
    baustelle: '🚧',
    polizei: '👮'
  };

  return icons[type] || '📍';
}

/**
 * Risiko-Level eines POI-Typs
 */
export function getPOIRiskLevel(type: string): 'high' | 'medium' | 'low' {
  const churchTypes = ['religion', 'kath', 'evangkirche', 'orthodox', 'islam', 'israel', 'juedwien', 'buddh'];

  if (churchTypes.includes(type)) return 'high';
  if (type === 'krankenhaus') return 'medium';
  if (type === 'kindergarten') return 'medium';
  if (type === 'schule') return 'medium';
  if (type === 'friedhof') return 'medium';

  return 'low';
}
