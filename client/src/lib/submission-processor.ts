// Submission processing service
// Handles validation and creation of cities when submissions are approved

// Removed complex GeoNames processing - keeping simple for submission flow
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
 * ENHANCED: Uses new GeoNames fields for better matching
 */
export async function getSubmissionsForCity(
  cityName: string, 
  countryName: string
): Promise<Submission[]> {
  try {
    console.log(`🔍 Getting submissions for city: ${cityName} in country: ${countryName}`);
    
    const countrySubmissions = await getSubmissionsForCountry(countryName);
    
    const citySubmissions = countrySubmissions.filter(submission => {
      // Priority 1: Check "Cities" field
      if ((submission as any).cities && Array.isArray((submission as any).cities)) {
        const hasCity = (submission as any).cities.some((city: string) =>
          city.toLowerCase() === cityName.toLowerCase()
        );
        if (hasCity) {
          console.log(`✅ Found "${submission.brandName}" in ${cityName} via "Cities" field`);
          return true;
        }
      }
      
      // Priority 2: Check "Geonames Record" field
      if ((submission as any).geonamesRecord && Array.isArray((submission as any).geonamesRecord)) {
        const hasCity = (submission as any).geonamesRecord.some((record: string) => {
          if (typeof record === 'string' && record.includes(', ')) {
            const parts = record.split(', ');
            if (parts.length >= 3) {
              const recordCityName = parts[0].trim();
              const recordCountryName = parts[2].trim();
              return recordCityName.toLowerCase() === cityName.toLowerCase() &&
                     recordCountryName.toLowerCase() === countryName.toLowerCase();
            }
          }
          return false;
        });
        if (hasCity) {
          console.log(`✅ Found "${submission.brandName}" in ${cityName} via "Geonames Record" field`);
          return true;
        }
      }
      
      // Priority 3: Fallback to old "citiesRegions" field
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        const hasCity = submission.citiesRegions.some((cityRegion: any) => {
          if (typeof cityRegion === 'string') {
            if (cityRegion.includes(', ')) {
              // Extract city from "City, Region, Country" format
              const parts = cityRegion.split(', ');
              if (parts.length >= 1) {
                const recordCityName = parts[0].trim();
                return recordCityName.toLowerCase() === cityName.toLowerCase();
              }
            } else {
              // Direct city name comparison
              return cityRegion.toLowerCase() === cityName.toLowerCase();
            }
          }
          return false;
        });
        if (hasCity) {
          console.log(`✅ Found "${submission.brandName}" in ${cityName} via "citiesRegions" field`);
          return true;
        }
      }
      
      return false;
    });
    
    console.log(`✅ Found ${citySubmissions.length} submissions for city ${cityName} in ${countryName}`);
    return citySubmissions;
    
  } catch (error) {
    console.error(`❌ Error getting submissions for city ${cityName} in ${countryName}:`, error);
    return [];
  }
}

/**
 * NEW: Get submissions for a specific region/state in a country
 * Uses the new "Regions / States" field and GeoNames data
 */
export async function getSubmissionsForRegion(
  regionName: string, 
  countryName: string
): Promise<Submission[]> {
  try {
    console.log(`🔍 Getting submissions for region: ${regionName} in country: ${countryName}`);
    
    const countrySubmissions = await getSubmissionsForCountry(countryName);
    
    const regionSubmissions = countrySubmissions.filter(submission => {
      // Priority 1: Check "Regions / States" field
      if ((submission as any).regionsStates && Array.isArray((submission as any).regionsStates)) {
        const hasRegion = (submission as any).regionsStates.some((region: string) =>
          region.toLowerCase() === regionName.toLowerCase()
        );
        if (hasRegion) {
          console.log(`✅ Found "${submission.brandName}" in ${regionName} via "Regions / States" field`);
          return true;
        }
      }
      
      // Priority 2: Extract from "Geonames Record" field
      if ((submission as any).geonamesRecord && Array.isArray((submission as any).geonamesRecord)) {
        const hasRegion = (submission as any).geonamesRecord.some((record: string) => {
          if (typeof record === 'string' && record.includes(', ')) {
            const parts = record.split(', ');
            if (parts.length >= 3) {
              const recordRegionName = parts[1].trim();
              const recordCountryName = parts[2].trim();
              return recordRegionName.toLowerCase() === regionName.toLowerCase() &&
                     recordCountryName.toLowerCase() === countryName.toLowerCase();
            }
          }
          return false;
        });
        if (hasRegion) {
          console.log(`✅ Found "${submission.brandName}" in ${regionName} via "Geonames Record" field`);
          return true;
        }
      }
      
      // Priority 3: Fallback to old "citiesRegions" field
      if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        const hasRegion = submission.citiesRegions.some((cityRegion: any) => {
          if (typeof cityRegion === 'string' && cityRegion.includes(', ')) {
            const parts = cityRegion.split(', ');
            if (parts.length >= 2) {
              const recordRegionName = parts[1].trim();
              return recordRegionName.toLowerCase() === regionName.toLowerCase();
            }
          }
          return false;
        });
        if (hasRegion) {
          console.log(`✅ Found "${submission.brandName}" in ${regionName} via "citiesRegions" field`);
          return true;
        }
      }
      
      return false;
    });
    
    console.log(`✅ Found ${regionSubmissions.length} submissions for region ${regionName} in ${countryName}`);
    return regionSubmissions;
    
  } catch (error) {
    console.error(`❌ Error getting submissions for region ${regionName} in ${countryName}:`, error);
    return [];
  }
}

/**
 * NEW: Get region submission counts for a specific country
 * Uses the new "Regions / States" field and GeoNames data
 */
export async function getRegionSubmissionCounts(countryName: string): Promise<Record<string, number>> {
  try {
    console.log(`🔍 Getting region submission counts for country: ${countryName}`);
    
    // Get all approved submissions
    const allSubmissions = await airtableService.getApprovedSubmissions();
    console.log(`📊 Found ${allSubmissions.length} total submissions in Airtable`);
    
    const regionCounts: Record<string, number> = {};
    
    for (const submission of allSubmissions) {
      // Enhanced country matching - use multiple sources
      const operatesInCountry = checkIfOperatesInCountry(submission as any, countryName);
      
      if (operatesInCountry) {
        console.log(`🎯 Processing submission "${submission.brandName}" for regions in ${countryName}`);
        
        let regionNames: string[] = [];
        
        // Priority 1: NEW "Regions / States" field
        if ((submission as any).regionsStates && Array.isArray((submission as any).regionsStates)) {
          regionNames = (submission as any).regionsStates.filter((region: any) => 
            typeof region === 'string' && region.trim().length > 0
          );
          console.log(`📋 Found regions from NEW "Regions / States" field:`, regionNames);
        }
        
        // Priority 2: Extract from "Geonames Record" field if no Regions field
        else if ((submission as any).geonamesRecord && Array.isArray((submission as any).geonamesRecord)) {
          regionNames = (submission as any).geonamesRecord
            .map((record: string) => {
              if (typeof record === 'string' && record.includes(', ')) {
                // Extract region from "City, Region, Country" format
                const parts = record.split(', ');
                if (parts.length >= 3 && parts[2].trim().toLowerCase() === countryName.toLowerCase()) {
                  return parts[1].trim(); // Second part is the region
                }
              }
              return null;
            })
            .filter(Boolean);
          console.log(`📋 Found regions from "Geonames Record" field:`, regionNames);
        }
        
        // Priority 3: OLD FORMAT - Fallback to old "citiesRegions" field
        else if (submission.citiesRegions && submission.citiesRegions.length > 0) {
          regionNames = submission.citiesRegions.map((cityRegion: any) => {
            if (typeof cityRegion === 'string' && cityRegion.includes(', ')) {
              const parts = cityRegion.split(', ');
              if (parts.length >= 2) {
                return parts[1].trim(); // Second part is the region
              }
            }
            return null;
          }).filter((region): region is string => region !== null);
          console.log(`📋 Found regions from OLD "citiesRegions" format:`, regionNames);
        }
        
        // Count regions for this submission
        regionNames.forEach(regionName => {
          if (isValidRegionName(regionName)) {
            regionCounts[regionName] = (regionCounts[regionName] || 0) + 1;
            console.log(`✅ COUNTED: ${regionName} in ${countryName} (count: ${regionCounts[regionName]})`);
          }
        });
      }
    }
    
    console.log(`🏛️ Region counts for ${countryName}:`, regionCounts);
    return regionCounts;
    
  } catch (error) {
    console.error(`❌ Error getting region submission counts for country ${countryName}:`, error);
    return {};
  }
}

/**
 * Validate if a string is a valid region name
 */
function isValidRegionName(regionName: string): boolean {
  if (!regionName || typeof regionName !== 'string') return false;
  
  const trimmed = regionName.trim();
  return trimmed.length > 1 && 
         trimmed.length < 100; // Regions can have longer names than cities
}

/**
 * Get city submission counts for a specific country
 * ENHANCED GEONAMES: Use new comprehensive GeoNames fields with improved matching
 */
export async function getCitySubmissionCounts(countryName: string): Promise<Record<string, number>> {
  try {
    console.log(`🔍 ENHANCED GEONAMES: Getting city submission counts for country: ${countryName}`);
    
    // Get all approved submissions
    const allSubmissions = await airtableService.getApprovedSubmissions();
    console.log(`📊 Found ${allSubmissions.length} total submissions in Airtable`);
    
    const cityCounts: Record<string, number> = {};
    
    for (const submission of allSubmissions) {
      // Enhanced country matching - use multiple sources
      const operatesInCountry = checkIfOperatesInCountry(submission as any, countryName);
      
      if (operatesInCountry) {
        console.log(`🎯 Processing submission "${submission.brandName}" for ${countryName}`);
        
        let cityNames: string[] = [];
        
        // Priority 1: NEW "Cities" field (extracted from GeoNames)
        if ((submission as any).cities && Array.isArray((submission as any).cities)) {
          cityNames = (submission as any).cities.filter((city: any) => 
            typeof city === 'string' && city.trim().length > 0
          );
          console.log(`📋 Found cities from NEW "Cities" field:`, cityNames);
        }
        
        // Priority 2: Extract from "Geonames Record" field if no Cities field
        else if ((submission as any).geonamesRecord && Array.isArray((submission as any).geonamesRecord)) {
          cityNames = (submission as any).geonamesRecord
            .map((record: string) => {
              if (typeof record === 'string' && record.includes(', ')) {
                // Extract city from "City, Region, Country" format
                const parts = record.split(', ');
                if (parts.length >= 3 && parts[2].trim().toLowerCase() === countryName.toLowerCase()) {
                  return parts[0].trim(); // First part is the city
                }
              }
              return null;
            })
            .filter(Boolean);
          console.log(`📋 Found cities from "Geonames Record" field:`, cityNames);
        }
        
        // Priority 3: OLD FORMAT - Fallback to old "citiesRegions" field
        else if (submission.citiesRegions && submission.citiesRegions.length > 0) {
          cityNames = submission.citiesRegions.map((cityRegion: any) => {
            if (typeof cityRegion === 'string') {
              // If it's "City, Region, Country" format, extract just the city
              if (cityRegion.includes(', ')) {
                const cityName = extractCityName(cityRegion);
                console.log(`🏙️ Extracted city from old format: "${cityName}" from "${cityRegion}"`);
                return cityName;
              }
              // Otherwise it's just a city name
              return cityRegion.trim();
            }
            return cityRegion;
          }).filter(Boolean);
          console.log(`📋 Found cities from OLD "citiesRegions" format:`, cityNames);
        }
        
        // Count cities for this submission
        cityNames.forEach(cityName => {
          if (isValidCityName(cityName)) {
            cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
            console.log(`✅ COUNTED: ${cityName} in ${countryName} (count: ${cityCounts[cityName]})`);
          }
        });
      }
    }
    
    console.log(`🏙️ ENHANCED GEONAMES city counts for ${countryName}:`, cityCounts);
    return cityCounts;
    
  } catch (error) {
    console.error(`❌ Error getting city submission counts for country ${countryName}:`, error);
    return {};
  }
}

/**
 * Enhanced function to check if a submission operates in a specific country
 * Uses multiple data sources for comprehensive matching
 */
function checkIfOperatesInCountry(submission: any, countryName: string): boolean {
  // Priority 1: Check "Countries" field (most reliable)
  if (submission.countries && Array.isArray(submission.countries)) {
    if (submission.countries.some((country: string) => 
      country.toLowerCase() === countryName.toLowerCase()
    )) {
      return true;
    }
  }
  
  // Priority 2: Extract from "Geonames Record" field
  if (submission.geonamesRecord && Array.isArray(submission.geonamesRecord)) {
    if (submission.geonamesRecord.some((record: string) => {
      if (typeof record === 'string' && record.includes(', ')) {
        const parts = record.split(', ');
        if (parts.length >= 3) {
          return parts[2].trim().toLowerCase() === countryName.toLowerCase();
        }
      }
      return false;
    })) {
      return true;
    }
  }
  
  // Priority 3: Extract from old "citiesRegions" field 
  if (submission.citiesRegions && Array.isArray(submission.citiesRegions)) {
    if (submission.citiesRegions.some((cityRegion: any) => {
      if (typeof cityRegion === 'string' && cityRegion.includes(', ')) {
        const parts = cityRegion.split(', ');
        if (parts.length >= 3) {
          return parts[2].trim().toLowerCase() === countryName.toLowerCase();
        }
      }
      return false;
    })) {
      return true;
    }
  }
  
  return false;
}

/**
 * Validate if a string is a valid city name
 */
function isValidCityName(cityName: string): boolean {
  if (!cityName || typeof cityName !== 'string') return false;
  
  const trimmed = cityName.trim();
  return trimmed.length > 2 && 
         trimmed.length < 50 &&
         !trimmed.toLowerCase().includes('komplex') && 
         !trimmed.toLowerCase().includes('pemilihan') &&
         !trimmed.toLowerCase().includes('panitia');
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
 * ENHANCED: Uses comprehensive GeoNames fields for better country detection
 */
export async function getActiveCountriesFromAirtable(): Promise<string[]> {
  try {
    console.log('🌍 ENHANCED: Getting ALL active countries from Airtable...');
    
    // ALWAYS get fresh data from Airtable
    const approvedSubmissions = await airtableService.getApprovedSubmissions();
    console.log(`📊 Found ${approvedSubmissions.length} approved submissions in Airtable`);
    
    const uniqueCountries = new Set<string>();
    
    approvedSubmissions.forEach(submission => {
      // Priority 1: Check "Countries" field (most reliable)
      if (submission.countries && Array.isArray(submission.countries)) {
        submission.countries.forEach(country => {
          const capitalizedCountry = capitalizeCountryName(country);
          uniqueCountries.add(capitalizedCountry);
          console.log(`🌍 Found country from "Countries" field: ${capitalizedCountry} from submission: ${submission.brandName}`);
        });
      }
      
      // Priority 2: Extract from "Geonames Record" field
      if ((submission as any).geonamesRecord && Array.isArray((submission as any).geonamesRecord)) {
        (submission as any).geonamesRecord.forEach((record: string) => {
          if (typeof record === 'string' && record.includes(', ')) {
            const parts = record.split(', ');
            if (parts.length >= 3) {
              const countryName = parts[2].trim(); // Last part is the country
              const capitalizedCountry = capitalizeCountryName(countryName);
              uniqueCountries.add(capitalizedCountry);
              console.log(`🌍 Found country from "Geonames Record": ${capitalizedCountry} from submission: ${submission.brandName}`);
            }
          }
        });
      }
      
      // Priority 3: Fallback to old "citiesRegions" field for existing submissions
      else if (submission.citiesRegions && submission.citiesRegions.length > 0) {
        submission.citiesRegions.forEach((cityRegion: any) => {
          if (typeof cityRegion === 'string') {
            // Parse "City, Region, Country" format to extract country
            const parts = cityRegion.split(', ');
            if (parts.length >= 3) {
              const countryName = parts[2].trim(); // Last part is the country
              const capitalizedCountry = capitalizeCountryName(countryName);
              uniqueCountries.add(capitalizedCountry);
              console.log(`🌍 Found country from old "citiesRegions": ${capitalizedCountry} from submission: ${submission.brandName}`);
            }
          }
        });
      }
    });
    
    const countryList = Array.from(uniqueCountries).sort();
    console.log(`🌍 ENHANCED: All active countries from Airtable:`, countryList);
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