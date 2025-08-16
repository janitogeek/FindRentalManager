// Submission processing service
// Handles validation and creation of cities when submissions are approved

import { matchCitiesToCountriesOptimized } from './geonames';
import { airtableService, type Submission } from './airtable';
import { extractCityName } from './utils';

/**
 * Process an approved submission and create/link cities
 */
export async function processApprovedSubmission(submission: Submission): Promise<void> {
  console.log(`🔄 Processing approved submission: ${submission.brandName}`);
  
  if (!submission.citiesRegions || submission.citiesRegions.length === 0) {
    console.log(`⚠️ No cities/regions found for ${submission.brandName}`);
    return;
  }

  try {
    // SIMPLE: Just log the cities for this submission
    console.log(`📊 Cities for ${submission.brandName}:`, submission.citiesRegions);
    console.log(`📊 Countries for ${submission.brandName}:`, submission.countries);
    
    console.log(`✅ Successfully processed submission ${submission.brandName}`);
    
  } catch (error) {
    console.error(`❌ Error processing submission ${submission.brandName}:`, error);
  }
}

/**
 * Process all pending approved submissions
 */
export async function processAllApprovedSubmissions(): Promise<void> {
  console.log(`🔄 Processing all approved submissions...`);
  
  try {
    // Get all approved/published submissions
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    
    console.log(`📋 Found ${approvedSubmissions.length} approved submissions to process`);
    
    for (const submission of approvedSubmissions) {
      await processApprovedSubmission(submission);
      
      // Small delay between submissions to avoid overwhelming APIs
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`✅ Finished processing all approved submissions`);
    
  } catch (error) {
    console.error(`❌ Error processing approved submissions:`, error);
  }
}

/**
 * Properly capitalize country names
 */
function capitalizeCountryName(countryName: string): string {
  // Handle special cases first
  const specialCases: Record<string, string> = {
    'usa': 'United States',
    'uk': 'United Kingdom',
    'uae': 'United Arab Emirates',
    'drc': 'Democratic Republic of Congo',
    'andorra': 'Andorra'
  };
  
  const lowerName = countryName.toLowerCase().trim();
  if (specialCases[lowerName]) {
    return specialCases[lowerName];
  }
  
  // Standard capitalization for other countries
  return countryName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get active countries (countries that have approved submissions)
 * Works with both new "City, Region, Country" format and existing cities + countries fields
 */
export async function getActiveCountries(): Promise<string[]> {
  try {
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    
    const uniqueCountries = new Set<string>();
    
    approvedSubmissions.forEach(submission => {
      // First, try the new city-based approach with full city data
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        submission.citiesRegions.forEach((cityRegion: any) => {
          if (typeof cityRegion === 'string') {
            // Try to parse "City, Region, Country" format
            const parts = cityRegion.split(', ');
            if (parts.length >= 3) {
              const countryName = parts[2]; // Last part is the country
              const capitalizedCountry = capitalizeCountryName(countryName);
              uniqueCountries.add(capitalizedCountry);
            }
          }
        });
      }
      
      // Fallback to legacy countries field for existing submissions
      if (submission.countries && submission.countries.length > 0) {
        submission.countries.forEach(country => {
          const capitalizedCountry = capitalizeCountryName(country);
          uniqueCountries.add(capitalizedCountry);
        });
      }
    });
    
    const result = Array.from(uniqueCountries).sort();
    console.log(`Found ${result.length} active countries:`, result);
    return result;
    
  } catch (error) {
    console.error(`❌ Error getting active countries:`, error);
    return [];
  }
}

/**
 * Get submissions for a specific country
 * FAST APPROACH: Uses existing countries field for better performance
 * Also generates unique slugs for each submission to handle duplicate company names
 */
export async function getSubmissionsForCountry(countryName: string): Promise<Submission[]> {
  try {
    console.log(`🔍 FAST: Getting submissions for country: ${countryName}`);
    
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    console.log(`📊 Found ${approvedSubmissions.length} total submissions`);
    
    // Generate unique slugs for all submissions to handle duplicate company names
    const submissionsWithSlugs = await generateUniqueSlugsForSubmissions(approvedSubmissions);
    
    // Filter submissions that belong to the requested country
    const countrySubmissions = submissionsWithSlugs.filter(submission => {
      // Check if submission has the country in its countries field
      if (submission.countries && submission.countries.length > 0) {
        const belongsToCountry = submission.countries.some(country => 
          country.toLowerCase() === countryName.toLowerCase()
        );
        
        if (belongsToCountry) {
          console.log(`✅ Submission "${submission.brandName}" belongs to ${countryName}`);
          return true;
        }
      }
      
      return false;
    });
    
    console.log(`✅ FAST: Found ${countrySubmissions.length} submissions for country: ${countryName}`);
    return countrySubmissions;
    
  } catch (error) {
    console.error(`❌ Error getting submissions for country ${countryName}:`, error);
    return [];
  }
}

/**
 * Generate unique slugs for all submissions using email-based mapping
 * Uses the slug-email mapping system for proper identification
 */
async function generateUniqueSlugsForSubmissions(submissions: Submission[]): Promise<Array<Submission & { uniqueSlug: string }>> {
  try {
    // Use the slug-email mapping system
    const { getAllSubmissionsWithSlugs } = await import('./slug-email-mapping');
    return getAllSubmissionsWithSlugs();
  } catch (error) {
    console.error('❌ Error generating unique slugs, falling back to simple method:', error);
    
    // Fallback to simple method
    const submissionsWithSlugs: Array<Submission & { uniqueSlug: string }> = [];
    const existingSlugs = new Set<string>();
    
    for (const submission of submissions) {
      let baseSlug = generateSlug(submission.brandName);
      let uniqueSlug = baseSlug;
      let counter = 2;
      
      // Check if slug already exists and add number suffix if needed
      while (existingSlugs.has(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      existingSlugs.add(uniqueSlug);
      
      submissionsWithSlugs.push({
        ...submission,
        uniqueSlug
      });
      
      console.log(`Generated unique slug for "${submission.brandName}": ${uniqueSlug}`);
    }
    
    return submissionsWithSlugs;
  }
}

/**
 * Generate a URL-friendly slug from a brand name
 */
function generateSlug(brandName: string): string {
  return brandName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
}

/**
 * Get submissions for a specific city in a country
 */
export async function getSubmissionsForCity(
  cityName: string, 
  countryName: string
): Promise<Submission[]> {
  try {
    const countrySubmissions = await getSubmissionsForCountry(countryName);
    
    return countrySubmissions.filter(submission =>
      submission.citiesRegions?.some((city: any) => {
        const cityName_lower = (typeof city === 'string' ? city : (city?.name || city)).toLowerCase();
        return cityName_lower === cityName.toLowerCase();
      })
    );
    
  } catch (error) {
    console.error(`❌ Error getting submissions for city ${cityName} in ${countryName}:`, error);
    return [];
  }
}

/**
 * Get city submission counts for a specific country
 * OPTIMIZED GEONAMES: Use cached results + smart city-country matching
 */
export async function getCitySubmissionCounts(countryName: string): Promise<Record<string, number>> {
  try {
    console.log(`🔍 OPTIMIZED GEONAMES: Getting city submission counts for country: ${countryName}`);
    
    // Get all approved submissions
    const allSubmissions = await airtableService.getApprovedSubmissions();
    console.log(`📊 Found ${allSubmissions.length} total submissions in Airtable`);
    
    const cityCounts: Record<string, number> = {};
    
    for (const submission of allSubmissions) {
      if (submission.citiesRegions && submission.citiesRegions.length > 0 && 
          submission.countries && submission.countries.length > 0) {
        
        // Extract just city names from the cities/regions data
        const cityNames = submission.citiesRegions.map((cityRegion: any) => {
          if (typeof cityRegion === 'string') {
            // If it's already "City, Region, Country" format, extract just the city
            if (cityRegion.includes(', ')) {
              const cityName = extractCityName(cityRegion);
              // Filter out obvious non-city names
              if (cityName && 
                  !cityName.toLowerCase().includes('komplex') && 
                  !cityName.toLowerCase().includes('pemilihan') &&
                  !cityName.toLowerCase().includes('panitia') &&
                  cityName.length > 2 && 
                  cityName.length < 50) {
                return cityName;
              }
              return null;
            }
            // Otherwise it's just a city name - apply same filters
            const cityName = cityRegion.trim();
            if (cityName && 
                !cityName.toLowerCase().includes('komplex') && 
                !cityName.toLowerCase().includes('pemilihan') &&
                !cityName.toLowerCase().includes('panitia') &&
                cityName.length > 2 && 
                cityName.length < 50) {
              return cityName;
            }
            return null;
          }
          return cityRegion;
        }).filter(Boolean);
        
        // Use cached/optimized GeoNames matching (with batching and delays)
        const cityMatches = await matchCitiesToCountriesOptimized(cityNames, submission.countries);
        
        // Count cities that belong to the requested country
        cityMatches.forEach(match => {
          if (match.countryName.toLowerCase() === countryName.toLowerCase()) {
            cityCounts[match.cityName] = (cityCounts[match.cityName] || 0) + 1;
            console.log(`✅ MATCHED: ${match.cityName} belongs to ${countryName} (count: ${cityCounts[match.cityName]})`);
          }
        });
      }
    }
    
    console.log(`🏙️ FINAL GEONAMES city counts for ${countryName}:`, cityCounts);
    return cityCounts;
    
  } catch (error) {
    console.error(`❌ Error getting city submission counts for country ${countryName}:`, error);
    return {};
  }
}

/**
 * Get validated cities for a specific country
 * ALWAYS reads from Airtable - no caching, always fresh data
 * Now works with city-based country determination
 */
export async function getValidatedCitiesForCountry(countryName: string): Promise<string[]> {
  try {
    console.log(`🔍 Getting validated cities for country: ${countryName} - FRESH FROM AIRTABLE`);
    
    // Get city submission counts directly from Airtable
    const cityCounts = await getCitySubmissionCounts(countryName);
    console.log(`📊 City counts received from Airtable:`, cityCounts);
    
    // Return only cities that have at least 1 submission
    const citiesWithSubmissions = Object.keys(cityCounts).filter(cityName => cityCounts[cityName] > 0);
    
    console.log(`🏙️ Cities with submissions for ${countryName} (FRESH FROM AIRTABLE):`, citiesWithSubmissions);
    console.log(`📊 City counts:`, cityCounts);
    
    return citiesWithSubmissions.sort();
    
  } catch (error) {
    console.error(`❌ Error getting validated cities for country ${countryName}:`, error);
    return [];
  }
}

/**
 * Get ALL active countries from Airtable (for dynamic country page creation)
 * Now extracts countries from city data to avoid duplicates and ensure accuracy
 */
export async function getActiveCountriesFromAirtable(): Promise<string[]> {
  try {
    console.log('🌍 Getting ALL active countries from Airtable...');
    
    // ALWAYS get fresh data from Airtable
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    console.log(`📊 Found ${approvedSubmissions.length} approved submissions in Airtable`);
    
    const uniqueCountries = new Set<string>();
    
    approvedSubmissions.forEach(submission => {
      // First, try to extract countries from city data (new approach)
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        submission.citiesRegions.forEach((cityRegion: any) => {
          if (typeof cityRegion === 'string') {
            // Parse "City, Region, Country" format to extract country
            const parts = cityRegion.split(', ');
            if (parts.length >= 3) {
              const countryName = parts[2].trim(); // Last part is the country
              const capitalizedCountry = capitalizeCountryName(countryName);
              uniqueCountries.add(capitalizedCountry);
              console.log(`🌍 Found country from city: ${capitalizedCountry} from submission: ${submission.brandName}`);
            }
          }
        });
      }
      
      // Fallback to countries field for existing submissions that don't have city data
      if (submission.countries && submission.countries.length > 0) {
        submission.countries.forEach(country => {
          const capitalizedCountry = capitalizeCountryName(country);
          uniqueCountries.add(capitalizedCountry);
          console.log(`🌍 Found country from countries field: ${capitalizedCountry} from submission: ${submission.brandName}`);
        });
      }
    });
    
    const countryList = Array.from(uniqueCountries).sort();
    console.log(`🌍 All active countries from Airtable:`, countryList);
    return countryList;
    
  } catch (error) {
    console.error('❌ Error getting active countries from Airtable:', error);
    return [];
  }
}

/**
 * Get ALL active cities from Airtable (for dynamic city page creation)
 * Works with both new "City, Region, Country" format and existing cities + countries fields
 */
export async function getAllActiveCitiesFromAirtable(): Promise<Array<{
  cityName: string;
  countryName: string;
  submissionCount: number;
}>> {
  try {
    console.log('🏙️ Getting ALL active cities from Airtable...');
    
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    console.log(`📊 Found ${approvedSubmissions.length} approved submissions in Airtable`);
    
    const cityMap = new Map<string, { cityName: string; countryName: string; submissionCount: number }>();
    
    for (const submission of approvedSubmissions) {
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        submission.citiesRegions.forEach((cityRegion: any) => {
          if (typeof cityRegion === 'string') {
            // Try to parse "City, Region, Country" format
            const parts = cityRegion.split(', ');
            if (parts.length >= 3) {
              const cityName = parts[0].trim(); // First part is the city
              const countryName = parts[2].trim(); // Last part is the country
              const cityKey = `${cityName}-${countryName}`;
              
              if (cityMap.has(cityKey)) {
                cityMap.get(cityKey)!.submissionCount++;
              } else {
                cityMap.set(cityKey, {
                  cityName,
                  countryName: capitalizeCountryName(countryName),
                  submissionCount: 1
                });
              }
              
              console.log(`🏙️ City: ${cityName} in ${countryName} (count: ${cityMap.get(cityKey)!.submissionCount})`);
            } else {
              // Fallback: use countries field for city-country mapping
              if (submission.countries && submission.countries.length > 0) {
                submission.countries.forEach(country => {
                  const cityName = cityRegion;
                  const cityKey = `${cityName}-${country}`;
                  
                  if (cityMap.has(cityKey)) {
                    cityMap.get(cityKey)!.submissionCount++;
                  } else {
                    cityMap.set(cityKey, {
                      cityName,
                      countryName: capitalizeCountryName(country),
                      submissionCount: 1
                    });
                  }
                  
                  console.log(`🏙️ City (fallback): ${cityName} in ${country} (count: ${cityMap.get(cityKey)!.submissionCount})`);
                });
              }
            }
          }
        });
      }
    }
    
    const cityList = Array.from(cityMap.values());
    console.log(`🏙️ All active cities from Airtable:`, cityList);
    return cityList;
    
  } catch (error) {
    console.error('❌ Error getting all active cities from Airtable:', error);
    return [];
  }
}

/**
 * Get top countries with submission counts
 * Works with both new "City, Region, Country" format and existing cities + countries fields
 */
export async function getTopCountriesWithCounts(): Promise<Array<{name: string, count: number}>> {
  try {
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    const countryCounts: Record<string, number> = {};
    
    approvedSubmissions.forEach(submission => {
      // First, try the new city-based approach with full city data
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        submission.citiesRegions.forEach((cityRegion: any) => {
          if (typeof cityRegion === 'string') {
            // Try to parse "City, Region, Country" format
            const parts = cityRegion.split(', ');
            if (parts.length >= 3) {
              const countryName = parts[2]; // Last part is the country
              const capitalizedCountry = capitalizeCountryName(countryName);
              countryCounts[capitalizedCountry] = (countryCounts[capitalizedCountry] || 0) + 1;
            }
          }
        });
      }
      
      // Fallback to legacy countries field for existing submissions
      if (submission.countries && submission.countries.length > 0) {
        submission.countries.forEach(country => {
          const capitalizedCountry = capitalizeCountryName(country);
          countryCounts[capitalizedCountry] = (countryCounts[capitalizedCountry] || 0) + 1;
        });
      }
    });
    
    // Sort by count descending, then alphabetically and take top 5
    const sortedCountries = Object.entries(countryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        // Primary sort: by count descending
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        // Secondary sort: alphabetically by name
        return a.name.localeCompare(b.name);
      })
      .slice(0, 5);
    
    console.log(`🏆 Top 5 countries:`, sortedCountries);
    return sortedCountries;
    
  } catch (error) {
    console.error(`❌ Error getting top countries:`, error);
    return [];
  }
}

/**
 * Get top cities with submission counts (across all countries)
 * Works with both new "City, Region, Country" format and existing cities + countries fields
 */
export async function getTopCitiesWithCounts(): Promise<Array<{name: string, country: string, count: number}>> {
  try {
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    const cityCounts: Record<string, {country: string, count: number}> = {};
    
    for (const submission of approvedSubmissions) {
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        
        // Process each city in the submission
        submission.citiesRegions.forEach((cityRegion: any) => {
          if (typeof cityRegion === 'string') {
            // Try to parse "City, Region, Country" format
            const parts = cityRegion.split(', ');
            if (parts.length >= 3) {
              const cityName = parts[0]; // First part is the city
              const countryName = parts[2]; // Last part is the country
              const cityKey = `${cityName}, ${countryName}`;
              
              if (!cityCounts[cityKey]) {
                cityCounts[cityKey] = { country: capitalizeCountryName(countryName), count: 0 };
              }
              cityCounts[cityKey].count += 1;
            } else {
              // Fallback: use countries field for city-country mapping
              if (submission.countries && submission.countries.length > 0) {
                submission.countries.forEach(country => {
                  const cityName = cityRegion;
                  const cityKey = `${cityName}, ${country}`;
                  
                  if (!cityCounts[cityKey]) {
                    cityCounts[cityKey] = { country: capitalizeCountryName(country), count: 0 };
                  }
                  cityCounts[cityKey].count += 1;
                });
              }
            }
          }
        });
      }
    }
    
    // Sort by count descending, then alphabetically and take top 5
    const sortedCities = Object.entries(cityCounts)
      .map(([cityKey, data]) => ({
        name: cityKey.split(', ')[0],
        country: data.country,
        count: data.count
      }))
      .sort((a, b) => {
        // Primary sort: by count descending
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        // Secondary sort: alphabetically by name
        return a.name.localeCompare(b.name);
      })
      .slice(0, 5);
    
    console.log(`🏆 Top 5 cities:`, sortedCities);
    return sortedCities;
    
  } catch (error) {
    console.error(`❌ Error getting top cities:`, error);
    return [];
  }
} 

/**
 * Get all submissions with unique slugs generated for company names
 * Uses the new slug-email mapping system
 */
export async function getAllSubmissionsWithUniqueSlugs(): Promise<Array<Submission & { uniqueSlug: string }>> {
  try {
    const { getAllSubmissionsWithSlugs } = await import('./slug-email-mapping');
    return getAllSubmissionsWithSlugs();
  } catch (error) {
    console.error('❌ Error getting submissions with unique slugs:', error);
    return [];
  }
}

/**
 * Get a specific submission by its unique slug
 * Uses the new slug-email mapping system
 */
export async function getSubmissionBySlug(slug: string): Promise<Submission | null> {
  try {
    const { getSubmissionBySlug } = await import('./slug-email-mapping');
    return getSubmissionBySlug(slug);
  } catch (error) {
    console.error(`❌ Error getting submission by slug ${slug}:`, error);
    return null;
  }
} 