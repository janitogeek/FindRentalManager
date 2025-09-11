/**
 * Geonames Record Parser
 * Parses semicolon-separated city records and extracts countries/cities
 * Example: "Barcelona,Catalonia,Spain;Madrid,Madrid,Spain;..."
 */

export interface GeonamesCity {
  city: string;
  region: string;
  country: string;
  slug: string;
}

export interface GeonamesCountry {
  country: string;
  cities: GeonamesCity[];
  slug: string;
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

/**
 * Parse a semicolon-separated geonames record
 * Format: "City,Region,Country;City,Region,Country;..."
 */
export function parseGeonamesRecord(geonamesRecord: string): GeonamesCity[] {
  if (!geonamesRecord || typeof geonamesRecord !== 'string') {
    return [];
  }

  const cities: GeonamesCity[] = [];
  const entries = geonamesRecord.split(';');

  for (const entry of entries) {
    const trimmed = entry.trim();
    if (!trimmed) continue;

    const parts = trimmed.split(',').map(part => part.trim());
    if (parts.length >= 3) {
      const city = parts[0];
      const region = parts[1];
      const country = parts[2];

      if (city && region && country) {
        cities.push({
          city,
          region,
          country,
          slug: generateSlug(city)
        });
      }
    }
  }

  return cities;
}

/**
 * Group cities by country from geonames records
 */
export function groupCitiesByCountry(geonamesRecord: string): GeonamesCountry[] {
  const cities = parseGeonamesRecord(geonamesRecord);
  const countryMap = new Map<string, GeonamesCity[]>();

  // Group cities by country
  for (const city of cities) {
    if (!countryMap.has(city.country)) {
      countryMap.set(city.country, []);
    }
    countryMap.get(city.country)!.push(city);
  }

  // Convert to array and sort
  const countries: GeonamesCountry[] = [];
  for (const [country, countryCities] of countryMap.entries()) {
    countries.push({
      country,
      cities: countryCities.sort((a, b) => a.city.localeCompare(b.city)),
      slug: generateSlug(country)
    });
  }

  return countries.sort((a, b) => a.country.localeCompare(b.country));
}

/**
 * Extract all unique countries from geonames records
 */
export function extractCountriesFromGeonames(submissions: any[]): string[] {
  const countriesSet = new Set<string>();

  for (const submission of submissions) {
    if (submission.citiesRegions && typeof submission.citiesRegions === 'string') {
      const cities = parseGeonamesRecord(submission.citiesRegions);
      for (const city of cities) {
        countriesSet.add(city.country);
      }
    }
  }

  return Array.from(countriesSet).sort();
}

/**
 * Extract all unique cities for a specific country from geonames records
 */
export function extractCitiesForCountry(submissions: any[], targetCountry: string): GeonamesCity[] {
  const citiesSet = new Map<string, GeonamesCity>();

  for (const submission of submissions) {
    if (submission.citiesRegions && typeof submission.citiesRegions === 'string') {
      const cities = parseGeonamesRecord(submission.citiesRegions);
      for (const city of cities) {
        if (city.country.toLowerCase() === targetCountry.toLowerCase()) {
          const key = `${city.city}-${city.region}`;
          if (!citiesSet.has(key)) {
            citiesSet.set(key, city);
          }
        }
      }
    }
  }

  return Array.from(citiesSet.values()).sort((a, b) => a.city.localeCompare(b.city));
}

/**
 * Find submissions that operate in a specific country
 */
export function findSubmissionsForCountry(submissions: any[], targetCountry: string): any[] {
  return submissions.filter(submission => {
    if (submission.citiesRegions && typeof submission.citiesRegions === 'string') {
      const cities = parseGeonamesRecord(submission.citiesRegions);
      return cities.some(city => city.country.toLowerCase() === targetCountry.toLowerCase());
    }
    return false;
  });
}

/**
 * Find submissions that operate in a specific city
 */
export function findSubmissionsForCity(submissions: any[], targetCountry: string, targetCity: string): any[] {
  return submissions.filter(submission => {
    if (submission.citiesRegions && typeof submission.citiesRegions === 'string') {
      const cities = parseGeonamesRecord(submission.citiesRegions);
      return cities.some(city => 
        city.country.toLowerCase() === targetCountry.toLowerCase() &&
        city.city.toLowerCase() === targetCity.toLowerCase()
      );
    }
    return false;
  });
}

