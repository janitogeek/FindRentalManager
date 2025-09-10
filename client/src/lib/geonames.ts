/**
 * GeoNames API Integration for City Selection
 */

const GEONAMES_USERNAME = 'bookdirectstays'; // Replace with your username

export interface GeoNamesCity {
  geonameId: number;
  name: string;
  countryName: string;
  adminName1: string; // State/Region
  lat: string;
  lng: string;
  population: number;
  countryCode: string;
}

export interface ProcessedCity {
  id: number;
  fullName: string; // "Paris, Île-de-France, France"
  city: string;     // "Paris"
  region: string;   // "Île-de-France" 
  country: string;  // "France"
  population: number;
}

// Cache for API results
const cityCache = new Map<string, GeoNamesCity[]>();

export const searchCities = async (query: string, maxRows: number = 10): Promise<ProcessedCity[]> => {
  if (!query || query.length < 2) return [];
  
  const cacheKey = `${query}-${maxRows}`;
  if (cityCache.has(cacheKey)) {
    return processCities(cityCache.get(cacheKey)!);
  }

  try {
    const response = await fetch(
      `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(query)}&maxRows=${maxRows}&username=${GEONAMES_USERNAME}&featureClass=P&orderby=population&cities=cities15000`
    );

    if (!response.ok) {
      throw new Error(`GeoNames API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status) {
      throw new Error(`GeoNames API error: ${data.status.message}`);
    }

    const cities = data.geonames || [];
    cityCache.set(cacheKey, cities);
    
    return processCities(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

const processCities = (cities: GeoNamesCity[]): ProcessedCity[] => {
  return cities.map(city => ({
    id: city.geonameId,
    fullName: `${city.name}, ${city.adminName1 || city.countryName}, ${city.countryName}`,
    city: city.name,
    region: city.adminName1 || '',
    country: city.countryName,
    population: city.population || 0
  }));
};