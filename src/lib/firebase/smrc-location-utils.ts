/**
 * Pure helpers for SMRC state/city filtering (no Firebase deps).
 * Used by smrc-service and by unit tests.
 */

/** US state full name (lowercase) -> abbreviation. */
const US_STATE_FULL_TO_ABBR: Record<string, string> = {
  alabama: 'al', alaska: 'ak', arizona: 'az', arkansas: 'ar', california: 'ca', colorado: 'co',
  connecticut: 'ct', delaware: 'de', 'district of columbia': 'dc', florida: 'fl', georgia: 'ga',
  hawaii: 'hi', idaho: 'id', illinois: 'il', indiana: 'in', iowa: 'ia', kansas: 'ks',
  kentucky: 'ky', louisiana: 'la', maine: 'me', maryland: 'md', massachusetts: 'ma',
  michigan: 'mi', minnesota: 'mn', mississippi: 'ms', missouri: 'mo', montana: 'mt',
  nebraska: 'ne', nevada: 'nv', 'new hampshire': 'nh', 'new jersey': 'nj', 'new mexico': 'nm',
  'new york': 'ny', 'north carolina': 'nc', 'north dakota': 'nd', ohio: 'oh', oklahoma: 'ok',
  oregon: 'or', pennsylvania: 'pa', 'rhode island': 'ri', 'south carolina': 'sc',
  'south dakota': 'sd', tennessee: 'tn', texas: 'tx', utah: 'ut', vermont: 'vt',
  virginia: 'va', washington: 'wa', 'west virginia': 'wv', wisconsin: 'wi', wyoming: 'wy',
};

/**
 * Canonical state for comparison: US states normalize to lowercase abbreviation so
 * "Texas", "TX", "Texas, USA" all match. Non-US state strings are lowercased as-is.
 */
export function stateCanonical(state: string | null | undefined): string {
  let s = (state ?? '').trim().toLowerCase();
  if (!s) return '';
  s = s.replace(/,?\s*(?:usa|us)\s*$/i, '').trim();
  const inParen = /\(([a-z]{2})\)$/i.exec(s);
  if (inParen) {
    const abbr = inParen[1].toLowerCase();
    if (abbr.length === 2) return abbr;
  }
  const abbr = US_STATE_FULL_TO_ABBR[s];
  if (abbr) return abbr;
  if (s.length === 2) return s;
  const firstToken = s.split(/[,\s]/)[0];
  if (firstToken && firstToken !== s) {
    const firstAbbr = US_STATE_FULL_TO_ABBR[firstToken];
    if (firstAbbr) return firstAbbr;
    if (firstToken.length === 2) return firstToken;
  }
  return s;
}

/**
 * Returns true if a review should be included when filtering by optional state/city.
 * - If state in query: include when review's state (canonical) matches.
 * - If city in query: include when review's city (case-insensitive) matches.
 * - If both: include when state matches OR city matches (state-level aggregation).
 */
export function reviewMatchesLocationFilter(
  doc: { state?: string | null; city?: string | null },
  queryState: string | null | undefined,
  queryCity: string | null | undefined,
): boolean {
  const qState = queryState?.trim() || null;
  const qCity = queryCity?.trim() ? queryCity.trim().toLowerCase() : null;
  if (!qState && !qCity) return true;
  const docStateCanon = stateCanonical(doc.state);
  const docCityLower = (doc.city ?? '').trim().toLowerCase();
  const queryStateCanon = qState ? stateCanonical(qState) : null;
  const stateMatch = queryStateCanon != null && queryStateCanon !== '' && docStateCanon === queryStateCanon;
  const cityMatch = qCity != null && qCity !== '' && docCityLower === qCity;
  return stateMatch || cityMatch;
}
