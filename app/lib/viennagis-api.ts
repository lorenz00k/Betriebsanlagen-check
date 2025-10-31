// ViennaGIS API Wrapper für Betriebsanlagen-Check
// Nutzt die öffentlichen Open Government Data (OGD) APIs der Stadt Wien

import proj4 from 'proj4';

// Definiere Koordinatensysteme
// EPSG:31256 - MGI Austria GK Central (M34)
// EPSG:4326 - WGS84 (Standard für GPS/Leaflet)
proj4.defs('EPSG:31256', '+proj=tmerc +lat_0=0 +lon_0=13.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs');
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

    console.log('🔍 Adresssuche URL:', url);
    console.log('🔤 Query:', query);

    const response = await fetch(url);

    console.log('📡 Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`Adresssuche fehlgeschlagen: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Response:', {
      type: data.type,
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
    console.error('Fehler bei der Adresssuche:', error);
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
    console.error('Fehler beim Laden der POIs:', error);
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
      console.warn(`Konnte ${dataset} nicht laden:`, response.status);
      return [];
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('xml')) {
      console.warn(`${dataset} gibt XML zurück - überspringe`);
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
    console.error(`Fehler beim Laden von ${type}:`, error);
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
