/**
 * Reverse geocode (lat, lng) to get country code via Google Geocoding API.
 * Used for out-of-region map click: show modal when country is not US.
 */

const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "";

interface GeocodeAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodeResult {
  address_components?: GeocodeAddressComponent[];
}

interface GeocodeResponse {
  results?: GeocodeResult[];
  status?: string;
}

/**
 * Forward geocode (address string) to lat, lng via Google Geocoding API.
 * Returns null if no key, request fails, or no valid result.
 */
export async function forwardGeocode(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  if (!GOOGLE_MAP_KEY || !address?.trim()) return null;
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address.trim())}&key=${encodeURIComponent(GOOGLE_MAP_KEY)}`,
    );
    const json = (await res.json()) as { results?: Array<{ geometry?: { location?: { lat: number; lng: number } } }>; status?: string };
    const results = json?.results;
    if (!results?.length || json?.status !== "OK") return null;
    const loc = results[0]?.geometry?.location;
    if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") return null;
    return { lat: loc.lat, lng: loc.lng };
  } catch {
    return null;
  }
}

/**
 * Reverse geocode (lat, lng) and return the country short_name (e.g. "US", "CA", "MX").
 * Returns null if no key, request fails, or no country in the response (e.g. ocean).
 */
export async function reverseGeocodeCountry(
  lat: number,
  lng: number,
): Promise<{ countryCode: string | null }> {
  if (!GOOGLE_MAP_KEY) return { countryCode: null };
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${encodeURIComponent(GOOGLE_MAP_KEY)}`,
    );
    const json = (await res.json()) as GeocodeResponse;
    const results = json?.results;
    if (!results?.length) return { countryCode: null };
    for (const result of results) {
      const components = result?.address_components ?? [];
      for (const c of components) {
        if (c.types?.includes("country")) {
          return { countryCode: c.short_name ?? null };
        }
      }
    }
    return { countryCode: null };
  } catch {
    return { countryCode: null };
  }
}
