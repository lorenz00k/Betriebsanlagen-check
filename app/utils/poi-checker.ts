// POI-Analyse und Risikobewertung für Betriebsanlagengenehmigung

import type { POI, Address } from '@/app/lib/viennagis-api';

export interface RiskAssessment {
  riskPoints: number; // 0-100
  overallRisk: 'low' | 'medium' | 'high';
  warnings: string[];
  recommendations: string[];
  categorizedPOIs: {
    churches: POI[];
    hospitals: POI[];
    schools: POI[];
    other: POI[];
  };
}

/**
 * POIs analysieren und Risikobewertung erstellen
 */
export function analyzePOIs(pois: POI[], address: Address): RiskAssessment {
  let riskPoints = 0;
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // POI-Kategorien
  const churchTypes = ['kath', 'evangkirche', 'orthodox', 'islam', 'israel', 'juedwien', 'buddh'];
  const hospitalTypes = ['krankenhaus'];
  const schoolTypes = ['kindergarten'];

  // POIs kategorisieren
  const categorizedPOIs = {
    churches: pois.filter(p => churchTypes.includes(p.type)),
    hospitals: pois.filter(p => hospitalTypes.includes(p.type)),
    schools: pois.filter(p => schoolTypes.includes(p.type)),
    other: pois.filter(p => !churchTypes.includes(p.type) && !hospitalTypes.includes(p.type) && !schoolTypes.includes(p.type))
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
      warnings.push(
        `${nearSchools.length} ${nearSchools.length === 1 ? 'Kindergarten' : 'Kindergärten'} in unmittelbarer Nähe (unter 100m). ` +
        `Besondere Auflagen für Sicherheit und Emissionen sind zu erwarten.`
      );
      recommendations.push(
        'Stellen Sie sicher, dass keine gefährlichen Stoffe oder Maschinen für Kinder zugänglich sind.'
      );
      recommendations.push(
        'Vermeiden Sie Lärmbelästigung während der Betreuungszeiten (Mo-Fr 7:00-17:00 Uhr).'
      );
    } else {
      riskPoints += 10;
      warnings.push(
        `${categorizedPOIs.schools.length} ${categorizedPOIs.schools.length === 1 ? 'Kindergarten' : 'Kindergärten'} in der Umgebung.`
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
    kath: 'Katholische Kirche',
    evangkirche: 'Evangelische Kirche',
    orthodox: 'Orthodoxe Kirche',
    islam: 'Moschee',
    israel: 'Synagoge',
    juedwien: 'Jüdische Einrichtung',
    buddh: 'Buddhistischer Tempel',
    kindergarten: 'Kindergarten',
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
    kath: '⛪',
    evangkirche: '⛪',
    orthodox: '☦️',
    islam: '🕌',
    israel: '🕍',
    juedwien: '✡️',
    buddh: '🛕',
    kindergarten: '👶',
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
  const churchTypes = ['kath', 'evangkirche', 'orthodox', 'islam', 'israel', 'juedwien', 'buddh'];

  if (churchTypes.includes(type)) return 'high';
  if (type === 'krankenhaus') return 'medium';
  if (type === 'kindergarten') return 'medium';

  return 'low';
}
