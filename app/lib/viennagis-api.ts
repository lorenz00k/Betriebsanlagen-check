// ViennaGIS API Wrapper für Betriebsanlagen-Check
// Nutzt die öffentlichen Open Government Data (OGD) APIs der Stadt Wien

import proj4 from 'proj4';
import { logger } from '@/app/lib/utils/logger';

// Definiere Koordinatensysteme
// EPSG:31256 - MGI Austria GK Central (M34) - Central meridian at 16.333°E for Vienna
// EPSG:4326 - WGS84 (Standard für GPS/Leaflet)
proj4.defs('EPSG:31256', '+proj=tmerc +lat_0=0 +lon_0=16.3333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs +type=crs');
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');

export interface Address {
  fullAddress: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  district: string;
  coordinates: {
    lng: number; // WGS84 Längengrad
    lat: number; // WGS84 Breitengrad
  };
}

export interface POI {
  type: string;
  name: string;
  distance: number; // in Metern
  coordinates: {
    lng: number;
    lat: number;
  };
}

export interface ZoningInfo {
  widmung: string; // z.B. "Wohngebiet", "Mischgebiet", "Betriebsgebiet"
  widmungCode: string; // z.B. "W", "G", "GB"
  details: string;
  found: boolean;
}

export interface BuildingPlanInfo {
  bauklasse?: string; // z.B. "III" (3 Vollgeschosse)
  bebauungsdichte?: number; // z.B. 60 (max. 60% Grundfläche)
  bauhoehe?: number; // in Metern
  details: string;
  found: boolean;
}

/**
 * Koordinaten von EPSG:31256 (MGI Austria GK Central) nach EPSG:4326 (WGS84) konvertieren
 * Verwendet Proj4js für präzise Transformation
 */
function convertMGItoWGS84(x: number, y: number): { lng: number; lat: number } {
  // Transformiere von MGI (EPSG:31256) nach WGS84 (EPSG:4326)
  const [lng, lat] = proj4('EPSG:31256', 'EPSG:4326', [x, y]);

  return { lng, lat };
}

/**
 * Adresse in Wien suchen
 * Nutzt den OGDAddressService der Stadt Wien
 */
export async function searchAddress(query: string): Promise<Address[]> {
  try {
    // Wien OGD Address Service
    // Dokumentation: https://www.data.gv.at/katalog/dataset/stadt-wien_adressservicewien

    const encodedQuery = encodeURIComponent(query);
    const url = `https://data.wien.gv.at/daten/OGDAddressService.svc/GetAddressInfo?Address=${encodedQuery}`;

    logger.debug('Address search request', {
      component: 'viennagis',
      action: 'searchAddress',
      queryLength: query.length
    });

    const response = await fetch(url);

    if (!response.ok) {
      logger.warn('Address search API error', {
        component: 'viennagis',
        action: 'searchAddress',
        status: response.status
      });
      throw new Error(`Adresssuche fehlgeschlagen: ${response.status}`);
    }

    const data = await response.json();
    logger.debug('Address search response', {
      component: 'viennagis',
      action: 'searchAddress',
      featuresCount: data.features?.length || 0
    });

    // Keine Ergebnisse gefunden
    if (!data.features || data.features.length === 0) {
      return [];
    }

    // Features zu Address-Objekten umwandeln
    return data.features.map((feature: { properties: Record<string, unknown>; geometry: { coordinates: [number, number] } }) => {
      const props = feature.properties;

      // Koordinaten von EPSG:31256 nach WGS84 konvertieren
      const coords = convertMGItoWGS84(
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1]
      );

      return {
        fullAddress: (props.Adresse as string) || 'Unbekannte Adresse',
        street: (props.StreetName as string) || '',
        houseNumber: (props.StreetNumber as string) || '',
        postalCode: props.PostalCode?.toString() || '',
        district: (props.Bezirk as string) || '',
        coordinates: coords
      };
    });
  } catch (error) {
    logger.error('Address search failed', error, { component: 'viennagis', action: 'searchAddress' });
    throw error;
  }
}

/**
 * POIs in der Nähe einer Adresse finden
 * Fokus auf kritische POIs: Kirchen, Krankenhäuser, Kindergärten, Schulen, Friedhöfe
 */
export async function getNearbyPOIs(
  lng: number,
  lat: number,
  radius: number = 200
): Promise<POI[]> {
  const allPOIs: POI[] = [];

  // Liste aller POI-Typen die geladen werden sollen
  // Korrekte Namen von GetCapabilities: https://data.wien.gv.at/daten/geo?service=WFS&request=GetCapabilities
  const poiTypes = [
    // Hochkritisch
    { dataset: 'KRANKENHAUSOGD', type: 'krankenhaus' },
    { dataset: 'RELIGIONOGD', type: 'religion' }, // Alle religiösen Einrichtungen

    // Kritisch
    { dataset: 'KINDERGARTENOGD', type: 'kindergarten' },
    { dataset: 'SCHULEOGD', type: 'schule' },

    // Potenziell kritisch
    { dataset: 'FRIEDHOFOGD', type: 'friedhof' },
  ];

  try {
    // Alle POI-Typen parallel laden (schneller!)
    const results = await Promise.allSettled(
      poiTypes.map(({ dataset, type }) =>
        fetchPOIType(dataset, lng, lat, radius, type)
      )
    );

    // Erfolgreiche Ergebnisse sammeln
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allPOIs.push(...result.value);
      }
    });

  } catch (error) {
    logger.error('Failed to load POIs', error, { component: 'viennagis', action: 'getNearbyPOIs' });
  }

  return allPOIs;
}

/**
 * Helper: POIs eines bestimmten Typs laden
 */
async function fetchPOIType(
  dataset: string,
  lng: number,
  lat: number,
  radius: number,
  type: string
): Promise<POI[]> {
  try {
    // outputFormat muss 'application/json' sein (nicht 'json')
    const url = `https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:${dataset}&outputFormat=application/json&srsName=EPSG:4326`;

    const response = await fetch(url);

    if (!response.ok) {
      logger.debug('POI dataset not available', {
        component: 'viennagis',
        action: 'fetchPOIType',
        dataset,
        status: response.status
      });
      return [];
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('xml')) {
      logger.debug('POI dataset returned XML, skipping', {
        component: 'viennagis',
        action: 'fetchPOIType',
        dataset
      });
      return [];
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return [];
    }

    // POIs filtern die im Radius liegen
    const pois: POI[] = [];

    for (const feature of data.features) {
      if (!feature.geometry || !feature.geometry.coordinates) {
        continue;
      }

      const poiLng = feature.geometry.coordinates[0];
      const poiLat = feature.geometry.coordinates[1];

      const distance = calculateDistance(lat, lng, poiLat, poiLng);

      if (distance <= radius) {
        pois.push({
          type,
          name: feature.properties.NAME ||
                feature.properties.BEZEICHNUNG ||
                feature.properties.EINRICHTUNG ||
                'Unbenannt',
          distance,
          coordinates: {
            lng: poiLng,
            lat: poiLat
          }
        });
      }
    }

    return pois;
  } catch (error) {
    logger.error('Failed to fetch POI type', error, {
      component: 'viennagis',
      action: 'fetchPOIType',
      poiType: type
    });
    return [];
  }
}

/**
 * Distanz zwischen zwei Punkten berechnen (Haversine-Formel)
 * @returns Distanz in Metern
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Erdradius in Metern
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Flächenwidmung für eine Adresse abrufen
 * Nutzt den WFS-Service der Stadt Wien (FLAECHENWIDMUNGOGD)
 */
export async function getZoningInfo(lng: number, lat: number): Promise<ZoningInfo> {
  try {
    // Buffer um den Punkt (5 Meter Radius für bessere Trefferquote)
    const buffer = 0.00005; // ca. 5 Meter in Grad
    const bbox = `${lng - buffer},${lat - buffer},${lng + buffer},${lat + buffer}`;

    const url = `https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FLAECHENWIDMUNGOGD&outputFormat=application/json&srsName=EPSG:4326&bbox=${bbox}`;

    logger.debug('Zoning info request', {
      component: 'viennagis',
      action: 'getZoningInfo'
    });

    const response = await fetch(url);

    if (!response.ok) {
      logger.warn('Zoning info not available', {
        component: 'viennagis',
        action: 'getZoningInfo',
        status: response.status
      });
      return {
        widmung: 'Unbekannt',
        widmungCode: '',
        details: 'Die Flächenwidmung konnte nicht ermittelt werden.',
        found: false
      };
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return {
        widmung: 'Keine Daten',
        widmungCode: '',
        details: 'Für diese Adresse sind keine Flächenwidmungsdaten verfügbar.',
        found: false
      };
    }

    // Erstes Feature nehmen (sollte das nächste sein)
    const feature = data.features[0];
    const props = feature.properties;

    // Widmungscode interpretieren (z.B. "W" = Wohngebiet, "G" = Gemischtes Gebiet, etc.)
    const widmungCode = (props.FWIDMUNG || props.WIDMUNG || '').toString();
    const widmung = interpretWidmung(widmungCode);

    return {
      widmung,
      widmungCode,
      details: props.FWIDMTXT || props.BEMERKUNG || 'Keine weiteren Details verfügbar',
      found: true
    };
  } catch (error) {
    logger.error('Failed to get zoning info', error, { component: 'viennagis', action: 'getZoningInfo' });
    return {
      widmung: 'Fehler',
      widmungCode: '',
      details: 'Beim Abrufen der Flächenwidmung ist ein Fehler aufgetreten.',
      found: false
    };
  }
}

/**
 * Bebauungsplan-Informationen für eine Adresse abrufen
 * Nutzt den WFS-Service der Stadt Wien (BEBAUUNGSPLANOGD)
 */
export async function getBuildingPlanInfo(lng: number, lat: number): Promise<BuildingPlanInfo> {
  try {
    // Buffer um den Punkt (5 Meter Radius)
    const buffer = 0.00005;
    const bbox = `${lng - buffer},${lat - buffer},${lng + buffer},${lat + buffer}`;

    const url = `https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:BEBAUUNGSPLANOGD&outputFormat=application/json&srsName=EPSG:4326&bbox=${bbox}`;

    logger.debug('Building plan request', {
      component: 'viennagis',
      action: 'getBuildingPlanInfo'
    });

    const response = await fetch(url);

    if (!response.ok) {
      logger.warn('Building plan not available', {
        component: 'viennagis',
        action: 'getBuildingPlanInfo',
        status: response.status
      });
      return {
        details: 'Der Bebauungsplan konnte nicht ermittelt werden.',
        found: false
      };
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return {
        details: 'Für diese Adresse sind keine Bebauungsplan-Daten verfügbar.',
        found: false
      };
    }

    // Erstes Feature nehmen
    const feature = data.features[0];
    const props = feature.properties;

    return {
      bauklasse: props.BAUKLASSE?.toString() || undefined,
      bebauungsdichte: props.BEBAUUNGSDICHTE ? parseFloat(props.BEBAUUNGSDICHTE) : undefined,
      bauhoehe: props.BAUHOEHE ? parseFloat(props.BAUHOEHE) : undefined,
      details: props.BPLAN_TXT || props.BEMERKUNG || 'Keine weiteren Details verfügbar',
      found: true
    };
  } catch (error) {
    logger.error('Failed to get building plan', error, { component: 'viennagis', action: 'getBuildingPlanInfo' });
    return {
      details: 'Beim Abrufen des Bebauungsplans ist ein Fehler aufgetreten.',
      found: false
    };
  }
}

/**
 * Widmungscode in menschenlesbare Form übersetzen
 */
function interpretWidmung(code: string): string {
  const widmungen: Record<string, string> = {
    'W': 'Wohngebiet',
    'WA': 'Allgemeines Wohngebiet',
    'WR': 'Reines Wohngebiet',
    'G': 'Gemischtes Gebiet',
    'GM': 'Gemischtes Gebiet',
    'GB': 'Betriebsbaugebiet',
    'I': 'Industriegebiet',
    'IG': 'Industriegebiet',
    'EKZ': 'Einkaufszentrum',
    'PARK': 'Parkanlage',
    'SPO': 'Sportanlage',
    'GF-BD': 'Grünfläche - Baudenkmal',
    'GF': 'Grünfläche',
    'LW': 'Land- und Forstwirtschaft',
    'V': 'Verkehrsfläche',
    'S': 'Sondergebiet',
  };

  // Versuche exakte Übereinstimmung
  if (widmungen[code]) {
    return widmungen[code];
  }

  // Versuche Teilübereinstimmung
  for (const [key, value] of Object.entries(widmungen)) {
    if (code.startsWith(key)) {
      return value;
    }
  }

  return code || 'Unbekannt';
}
