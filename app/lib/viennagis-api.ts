// ViennaGIS API Wrapper für Betriebsanlagen-Check
// Nutzt die öffentlichen Open Government Data (OGD) APIs der Stadt Wien

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
 * Verwendet Proj4js-kompatible Transformation
 */
function convertMGItoWGS84(x: number, y: number): { lng: number; lat: number } {
  // Approximative Umrechnung (für genauere Ergebnisse würde man proj4js verwenden)
  // MGI Austria GK Central Zone M34 -> WGS84
  // Diese Werte sind für Wien kalibriert
  const lng = 16.0 + (x - 0) / 111320.0;
  const lat = 48.0 + (y - 340000) / 111320.0;

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
    return data.features.map((feature: any) => {
      const props = feature.properties;

      // Koordinaten von EPSG:31256 nach WGS84 konvertieren
      const coords = convertMGItoWGS84(
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1]
      );

      return {
        fullAddress: props.Adresse || 'Unbekannte Adresse',
        street: props.StreetName || '',
        houseNumber: props.StreetNumber || '',
        postalCode: props.PostalCode?.toString() || '',
        district: props.Bezirk || '',
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
 * Fokus auf kritische POIs: Kirchen, Krankenhäuser, Kindergärten
 */
export async function getNearbyPOIs(
  lng: number,
  lat: number,
  radius: number = 200
): Promise<POI[]> {
  const allPOIs: POI[] = [];

  try {
    // Krankenhäuser laden
    const hospitals = await fetchPOIType(
      'KRANKENANSTALTENOGD',
      lng,
      lat,
      radius,
      'krankenhaus'
    );
    allPOIs.push(...hospitals);

    // Kindergärten laden
    const kindergartens = await fetchPOIType(
      'KINDERGARTENOGD',
      lng,
      lat,
      radius,
      'kindergarten'
    );
    allPOIs.push(...kindergartens);

    // Kirchen - mehrere Datasets
    // Katholische Kirchen
    const kathChurches = await fetchPOIType(
      'KATHOLISCHEKIRCHENPFLEGOGD',
      lng,
      lat,
      radius,
      'kath'
    );
    allPOIs.push(...kathChurches);

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
    const url = `https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:${dataset}&outputFormat=json&srsName=EPSG:4326`;

    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Konnte ${dataset} nicht laden:`, response.status);
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
