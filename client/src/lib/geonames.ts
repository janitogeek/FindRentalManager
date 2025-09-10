// GeoNames API utilities for city validation
// Used to validate if a city exists in a specific country

interface GeoNamesResponse {
  geonames: Array<{
    name: string;
    countryName: string;
    countryCode: string;
    adminName1?: string;
    geonameId: number;
  }>;
}

// Country name to code mapping
const COUNTRY_CODES: Record<string, string> = {
  "USA": "US",
  "United States": "US",
  "Spain": "ES",
  "UK": "GB",
  "United Kingdom": "GB",
  "Germany": "DE",
  "France": "FR",
  "Australia": "AU",
  "Canada": "CA",
  "Italy": "IT",
  "Portugal": "PT",
  "Thailand": "TH",
  "Greece": "GR",
  "Albania": "AL",
  "Colombia": "CO",
  "Mexico": "MX",
  "Brazil": "BR",
  "Argentina": "AR",
  "Chile": "CL",
  "Peru": "PE",
  "Ecuador": "EC",
  "Uruguay": "UY",
  "Paraguay": "PY",
  "Bolivia": "BO",
  "Venezuela": "VE",
  "Guyana": "GY",
  "Suriname": "SR",
  "French Guiana": "GF",
  "Croatia": "HR",
  "Slovenia": "SI",
  "Serbia": "RS",
  "Montenegro": "ME",
  "Bosnia and Herzegovina": "BA",
  "North Macedonia": "MK",
  "Bulgaria": "BG",
  "Romania": "RO",
  "Moldova": "MD",
  "Ukraine": "UA",
  "Belarus": "BY",
  "Poland": "PL",
  "Czech Republic": "CZ",
  "Slovakia": "SK",
  "Hungary": "HU",
  "Austria": "AT",
  "Switzerland": "CH",
  "Liechtenstein": "LI",
  "Netherlands": "NL",
  "Belgium": "BE",
  "Luxembourg": "LU",
  "Denmark": "DK",
  "Sweden": "SE",
  "Norway": "NO",
  "Finland": "FI",
  "Iceland": "IS",
  "Ireland": "IE",
  "Estonia": "EE",
  "Latvia": "LV",
  "Lithuania": "LT",
  // Add more as needed
};

/**
 * Get country code from country name
 */
export function getCountryCode(countryName: string): string | null {
  return COUNTRY_CODES[countryName] || null;
}

/**
 * Validate if a city exists in a specific country using GeoNames API
 */
export async function validateCityInCountry(
  cityName: string, 
  countryName: string
): Promise<{ isValid: boolean; geonameId?: number; exactMatch?: string }> {
  const countryCode = getCountryCode(countryName);
  
  if (!countryCode) {
    console.warn(`⚠️ Country code not found for: ${countryName}`);
    return { isValid: false };
  }

  try {
    console.log(`🔍 Validating "${cityName}" in ${countryName} (${countryCode})`);
    
    const response = await fetch(
      `https://secure.geonames.org/searchJSON?name=${encodeURIComponent(cityName)}&country=${countryCode}&featureClass=P&maxRows=5&username=janito`
    );
    
    if (!response.ok) {
      console.error(`❌ GeoNames API error: ${response.status}`);
      return { isValid: false };
    }
    
    const data: GeoNamesResponse = await response.json();
    
    if (!data.geonames || data.geonames.length === 0) {
      console.log(`❌ No cities found for "${cityName}" in ${countryName}`);
      return { isValid: false };
    }
    
    // Look for exact match first
    const exactMatch = data.geonames.find(city => 
      city.name.toLowerCase() === cityName.toLowerCase()
    );
    
    if (exactMatch) {
      console.log(`✅ Exact match found: "${exactMatch.name}" in ${countryName}`);
      return { 
        isValid: true, 
        geonameId: exactMatch.geonameId,
        exactMatch: exactMatch.name 
      };
    }
    
    // If no exact match, use the first result (closest match)
    const firstResult = data.geonames[0];
    console.log(`✅ Closest match found: "${firstResult.name}" for "${cityName}" in ${countryName}`);
    
    return { 
      isValid: true, 
      geonameId: firstResult.geonameId,
      exactMatch: firstResult.name 
    };
    
  } catch (error) {
    console.error(`❌ Error validating city "${cityName}" in ${countryName}:`, error);
    return { isValid: false };
  }
}

/**
 * Batch validate multiple cities for multiple countries
 */
export async function validateCitiesForCountries(
  cities: Array<{ name: string; geonameId?: number }>,
  countries: string[]
): Promise<Array<{
  cityName: string;
  countryName: string;
  isValid: boolean;
  geonameId?: number;
  validatedName?: string;
}>> {
  const results = [];
  
  for (const country of countries) {
    for (const city of cities) {
      const validation = await validateCityInCountry(city.name, country);
      
      results.push({
        cityName: city.name,
        countryName: country,
        isValid: validation.isValid,
        geonameId: validation.geonameId,
        validatedName: validation.exactMatch,
      });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

/**
 * Get comprehensive city information from GeoNames
 */
export async function getCityInfo(geonameId: number): Promise<any> {
  try {
    const response = await fetch(
      `https://secure.geonames.org/getJSON?geonameId=${geonameId}&username=janito`
    );
    
    if (!response.ok) {
      throw new Error(`GeoNames API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching city info for geonameId ${geonameId}:`, error);
    return null;
  }
}

/**
 * SOLUTION: Match city names to countries using GeoNames API
 * This takes a city name and list of countries, finds which country the city belongs to
 */
export async function matchCityToCountry(
  cityName: string, 
  possibleCountries: string[]
): Promise<{ cityName: string; countryName: string; fullLocation: string } | null> {
  try {
    console.log(`🔍 Matching city "${cityName}" to one of countries: ${possibleCountries.join(', ')}`);
    
    // Search for the city in GeoNames without country restriction
    const response = await fetch(
      `https://secure.geonames.org/searchJSON?name=${encodeURIComponent(cityName)}&featureClass=P&maxRows=10&username=janito`
    );
    
    if (!response.ok) {
      console.error(`❌ GeoNames API error: ${response.status}`);
      return null;
    }
    
    const data: GeoNamesResponse = await response.json();
    
    if (!data.geonames || data.geonames.length === 0) {
      console.log(`❌ No cities found for "${cityName}"`);
      return null;
    }
    
    // Find the first result that matches one of our possible countries
    for (const city of data.geonames) {
      const cityCountry = city.countryName;
      
      // Check if this city's country matches any of our possible countries
      const matchedCountry = possibleCountries.find(country => 
        country.toLowerCase() === cityCountry.toLowerCase() ||
        country.toLowerCase() === city.countryCode.toLowerCase()
      );
      
      if (matchedCountry) {
        const fullLocation = `${city.name}, ${city.adminName1 || city.countryName}, ${city.countryName}`;
        console.log(`✅ MATCH FOUND: "${cityName}" belongs to "${matchedCountry}" - Full: ${fullLocation}`);
        
        return {
          cityName: city.name,
          countryName: matchedCountry,
          fullLocation: fullLocation
        };
      }
    }
    
    console.log(`❌ No match found: "${cityName}" doesn't belong to any of: ${possibleCountries.join(', ')}`);
    return null;
    
  } catch (error) {
    console.error(`❌ Error matching city "${cityName}" to countries:`, error);
    return null;
  }
}

/**
 * BATCH SOLUTION: Match multiple cities to their correct countries
 */
export async function matchCitiesToCountries(
  cities: string[], 
  possibleCountries: string[]
): Promise<Array<{ cityName: string; countryName: string; fullLocation: string }>> {
  const results = [];
  
  for (const cityName of cities) {
    const match = await matchCityToCountry(cityName.trim(), possibleCountries);
    if (match) {
      results.push(match);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return results;
}

/**
 * OPTIMIZED BATCH SOLUTION: Match cities with caching and reduced API calls
 */
const cityCountryCache = new Map<string, { cityName: string; countryName: string; fullLocation: string } | null>();

export async function matchCitiesToCountriesOptimized(
  cities: string[], 
  possibleCountries: string[]
): Promise<Array<{ cityName: string; countryName: string; fullLocation: string }>> {
  const results = [];
  const uncachedCities = [];
  
  // First, check cache
  for (const cityName of cities) {
    const cacheKey = `${cityName.trim()}-${possibleCountries.join(',')}`;
    const cached = cityCountryCache.get(cacheKey);
    
    if (cached !== undefined) {
      if (cached) {
        results.push(cached);
        console.log(`📋 CACHED: ${cityName} → ${cached.countryName}`);
      }
    } else {
      uncachedCities.push(cityName.trim());
    }
  }
  
  // Process uncached cities with smaller delays
  for (const cityName of uncachedCities) {
    const cacheKey = `${cityName}-${possibleCountries.join(',')}`;
    
    try {
      const match = await matchCityToCountry(cityName, possibleCountries);
      
      // Cache the result (even if null)
      cityCountryCache.set(cacheKey, match);
      
      if (match) {
        results.push(match);
        console.log(`🌍 API: ${cityName} → ${match.countryName}`);
      }
    } catch (error) {
      console.error(`❌ Error matching city ${cityName}:`, error);
      // Cache the failure
      cityCountryCache.set(cacheKey, null);
    }
    
    // Shorter delay for optimization
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
} 