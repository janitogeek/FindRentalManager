/**
 * Data Preloader Service
 * 
 * Preloads and caches all heavy data processing in the background
 * to eliminate loading delays when users navigate to find-host page
 */

import { airtableService, Submission } from './airtable';
import { getActiveCountriesFromAirtable, getCitySubmissionCounts, getValidatedCitiesForCountry } from './submission-processor';
import { getAllSubmissionsWithSlugs } from './slug-email-mapping';

// Cache keys
const CACHE_KEYS = {
  SUBMISSIONS_WITH_SLUGS: 'bds_submissions_with_slugs',
  COUNTRIES_DATA: 'bds_countries_data',
  CITIES_DATA: 'bds_cities_data',
  CACHE_TIMESTAMP: 'bds_cache_timestamp',
  CACHE_VERSION: 'bds_cache_version'
};

// Cache version - increment this when data structure changes
const CACHE_VERSION = 'v3.0'; // Match the instant preload version

// Cache duration - 1 hour
const CACHE_DURATION = 60 * 60 * 1000;

interface CachedCountryData {
  name: string;
  slug: string;
  submissionCount: number;
  cities: Array<{
    name: string;
    slug: string;
    submissionCount: number;
  }>;
}

interface CachedData {
  submissions: Array<Submission & { uniqueSlug: string }>;
  countries: CachedCountryData[];
  lastUpdated: number;
  version: string;
}

class DataPreloader {
  private isLoading = false;
  private cachedData: CachedData | null = null;
  private loadingPromise: Promise<CachedData> | null = null;

  /**
   * Check if cached data is valid and fresh
   */
  private isCacheValid(): boolean {
    try {
      const timestamp = localStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
      const version = localStorage.getItem(CACHE_KEYS.CACHE_VERSION);
      
      if (!timestamp || !version || version !== CACHE_VERSION) {
        return false;
      }
      
      const age = Date.now() - parseInt(timestamp);
      return age < CACHE_DURATION;
    } catch (error) {
      console.warn('🚨 Cache validation error:', error);
      return false;
    }
  }

  /**
   * Load cached data from localStorage
   */
  private loadFromCache(): CachedData | null {
    try {
      if (!this.isCacheValid()) {
        this.clearCache();
        return null;
      }

      const submissions = localStorage.getItem(CACHE_KEYS.SUBMISSIONS_WITH_SLUGS);
      const countries = localStorage.getItem(CACHE_KEYS.COUNTRIES_DATA);
      
      if (!submissions || !countries) {
        return null;
      }

      const data: CachedData = {
        submissions: JSON.parse(submissions),
        countries: JSON.parse(countries),
        lastUpdated: parseInt(localStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP) || '0'),
        version: CACHE_VERSION
      };

      console.log('📦 Loaded data from cache:', {
        submissions: data.submissions.length,
        countries: data.countries.length,
        age: Math.round((Date.now() - data.lastUpdated) / 1000 / 60) + ' minutes'
      });

      return data;
    } catch (error) {
      console.warn('🚨 Failed to load from cache:', error);
      this.clearCache();
      return null;
    }
  }

  /**
   * Save data to localStorage cache
   */
  private saveToCache(data: CachedData): void {
    try {
      const timestamp = Date.now().toString();
      
      localStorage.setItem(CACHE_KEYS.SUBMISSIONS_WITH_SLUGS, JSON.stringify(data.submissions));
      localStorage.setItem(CACHE_KEYS.COUNTRIES_DATA, JSON.stringify(data.countries));
      localStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, timestamp);
      localStorage.setItem(CACHE_KEYS.CACHE_VERSION, CACHE_VERSION);

      console.log('💾 Saved data to cache:', {
        submissions: data.submissions.length,
        countries: data.countries.length,
        timestamp: new Date(parseInt(timestamp)).toLocaleTimeString()
      });
    } catch (error) {
      console.warn('🚨 Failed to save to cache:', error);
    }
  }

  /**
   * Clear all cached data
   */
  public clearCache(): void {
    try {
      Object.values(CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      this.cachedData = null;
      this.loadingPromise = null;
      console.log('🗑️ Cache cleared');
    } catch (error) {
      console.warn('🚨 Failed to clear cache:', error);
    }
  }

  /**
   * Generate slug from country name - SYSTEMATIC approach for ALL countries
   */
  private generateCountrySlug(countryName: string): string {
    if (!countryName || typeof countryName !== 'string') {
      console.warn('⚠️ Invalid country name for slug generation:', countryName);
      return 'unknown';
    }
    
    return countryName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^\w-]/g, '')         // Remove special characters
      .replace(/-+/g, '-')            // Replace multiple hyphens with single
      .replace(/^-|-$/g, '')          // Remove leading/trailing hyphens
      .replace(/^the-/, '')           // Remove "the" prefix for consistency
      .replace(/^united-/, 'united-') // Keep "united" prefix for clarity
      .replace(/^new-/, 'new-')       // Keep "new" prefix for clarity
      .replace(/^south-/, 'south-')   // Keep directional prefixes
      .replace(/^north-/, 'north-')   // Keep directional prefixes
      .replace(/^east-/, 'east-')     // Keep directional prefixes
      .replace(/^west-/, 'west-');    // Keep directional prefixes
  }

  /**
   * Generate slug from city name - SYSTEMATIC approach for ALL cities
   */
  private generateCitySlug(cityName: string): string {
    if (!cityName || typeof cityName !== 'string') {
      console.warn('⚠️ Invalid city name for slug generation:', cityName);
      return 'unknown';
    }
    
    return cityName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^\w-]/g, '')         // Remove special characters
      .replace(/-+/g, '-')            // Replace multiple hyphens with single
      .replace(/^-|-$/g, '')          // Remove leading/trailing hyphens
      .replace(/^new-/, 'new-')       // Keep "new" prefix for clarity
      .replace(/^south-/, 'south-')   // Keep directional prefixes
      .replace(/^north-/, 'north-')   // Keep directional prefixes
      .replace(/^east-/, 'east-')     // Keep directional prefixes
      .replace(/^west-/, 'west-');    // Keep directional prefixes
  }

  /**
   * Process submissions data (for instant cache)
   */
  private async processSubmissionsData(rawSubmissions: any[]): Promise<CachedData> {
    console.log('🚀 Processing instant cache data...');
    const startTime = Date.now();

    try {
      // Step 1: Process submissions with unique slugs
      console.log('📊 Step 1/3: Processing submissions with unique slugs...');
      const submissions = await this.processRawSubmissions(rawSubmissions);
      console.log(`✅ Processed ${submissions.length} submissions with unique slugs`);

      // Step 2: Get countries data
      console.log('🌍 Step 2/3: Processing countries data...');
      const countryNames = await getActiveCountriesFromAirtable();
      console.log(`✅ Found ${countryNames.length} active countries`);

      // Step 3: Process each country and its cities
      console.log('🏙️ Step 3/3: Processing cities for each country...');
      const countriesData: CachedCountryData[] = [];

      for (const countryName of countryNames) {
        const countrySubmissions = submissions.filter(submission => 
          submission.countries && submission.countries.some(country => 
            country.toLowerCase() === countryName.toLowerCase()
          )
        );

        // Get cities for this country
        const cityData = await getCitySubmissionCounts(countryName);
        const cities = Object.entries(cityData).map(([cityName, count]) => ({
          name: cityName,
          slug: this.generateCitySlug(cityName),
          submissionCount: count
        })).sort((a, b) => a.name.localeCompare(b.name));

        countriesData.push({
          name: countryName,
          slug: this.generateCountrySlug(countryName),
          submissionCount: countrySubmissions.length,
          cities
        });

        console.log(`✅ Processed ${countryName}: ${countrySubmissions.length} submissions, ${cities.length} cities`);
      }

      // Sort countries alphabetically
      countriesData.sort((a, b) => a.name.localeCompare(b.name));

      const data: CachedData = {
        submissions,
        countries: countriesData,
        lastUpdated: Date.now(),
        version: CACHE_VERSION
      };

      const processingTime = Date.now() - startTime;
      console.log(`🎉 Instant cache processing completed in ${processingTime}ms`, {
        submissions: submissions.length,
        countries: countriesData.length,
        totalCities: countriesData.reduce((sum, country) => sum + country.cities.length, 0)
      });

      return data;
    } catch (error) {
      console.error('❌ Instant cache processing failed:', error);
      throw error;
    }
  }

  /**
   * Process raw submissions data into format with unique slugs
   */
  private async processRawSubmissions(rawSubmissions: any[]): Promise<Array<Submission & { uniqueSlug: string }>> {
    // Import and use the slug processing functions
    const { buildSlugEmailMappings, getAllSubmissionsWithSlugs } = await import('./slug-email-mapping');
    
    // Build slug mappings first (this processes the raw data)
    await buildSlugEmailMappings();
    
    // Then get all submissions with unique slugs
    return getAllSubmissionsWithSlugs();
  }

  /**
   * Process all data in the background
   */
  private async processAllData(): Promise<CachedData> {
    console.log('🚀 Starting background data processing...');
    const startTime = Date.now();

    try {
      // Step 1: Get all submissions with unique slugs
      console.log('📊 Step 1/3: Loading submissions with unique slugs...');
      const submissions = await getAllSubmissionsWithSlugs();
      console.log(`✅ Loaded ${submissions.length} submissions with unique slugs`);

      // Step 2: Get countries data
      console.log('🌍 Step 2/3: Processing countries data...');
      const countryNames = await getActiveCountriesFromAirtable();
      console.log(`✅ Found ${countryNames.length} active countries`);

      // Step 3: Process each country and its cities
      console.log('🏙️ Step 3/3: Processing cities for each country...');
      const countriesData: CachedCountryData[] = [];

      for (const countryName of countryNames) {
        const countrySubmissions = submissions.filter(submission => 
          submission.countries && submission.countries.some(country => 
            country.toLowerCase() === countryName.toLowerCase()
          )
        );

        // Get cities for this country
        const cityData = await getCitySubmissionCounts(countryName);
        const cities = Object.entries(cityData).map(([cityName, count]) => ({
          name: cityName,
          slug: this.generateCitySlug(cityName),
          submissionCount: count
        })).sort((a, b) => a.name.localeCompare(b.name));

        countriesData.push({
          name: countryName,
          slug: this.generateCountrySlug(countryName),
          submissionCount: countrySubmissions.length,
          cities
        });

        console.log(`✅ Processed ${countryName}: ${countrySubmissions.length} submissions, ${cities.length} cities`);
      }

      // Sort countries alphabetically
      countriesData.sort((a, b) => a.name.localeCompare(b.name));

      const data: CachedData = {
        submissions,
        countries: countriesData,
        lastUpdated: Date.now(),
        version: CACHE_VERSION
      };

      const processingTime = Date.now() - startTime;
      console.log(`🎉 Background processing completed in ${processingTime}ms`, {
        submissions: submissions.length,
        countries: countriesData.length,
        totalCities: countriesData.reduce((sum, country) => sum + country.cities.length, 0)
      });

      return data;
    } catch (error) {
      console.error('❌ Background processing failed:', error);
      throw error;
    }
  }

  /**
   * Preload all data in the background
   */
  async preloadData(): Promise<CachedData | null> {
    // If already loading, wait for current process
    if (this.loadingPromise) {
      console.log('⏳ Already loading data, waiting...');
      const result = await this.loadingPromise;
      return result;
    }

    // Check if we have instant cache data
    const instantCacheData = localStorage.getItem(CACHE_KEYS.SUBMISSIONS_WITH_SLUGS);
    if (instantCacheData) {
      console.log('⚡ Found instant cache data, processing...');
      
      try {
        const submissions = JSON.parse(instantCacheData);
        this.loadingPromise = this.processSubmissionsData(submissions);
        this.cachedData = await this.loadingPromise;
        this.saveToCache(this.cachedData);
        console.log('✅ Instant cache data processed and ready!');
      } catch (error) {
        console.error('❌ Failed to process instant cache:', error);
      } finally {
        this.isLoading = false;
        this.loadingPromise = null;
      }
      return this.cachedData;
    }

    // Try to load from cache first
    this.cachedData = this.loadFromCache();
    if (this.cachedData) {
      console.log('⚡ Using cached data - instant load!');
      return this.cachedData;
    }

    // If no valid cache, start background processing
    console.log('🔄 No valid cache found, starting background processing...');
    this.isLoading = true;
    
    this.loadingPromise = this.processAllData();
    
    try {
      this.cachedData = await this.loadingPromise;
      this.saveToCache(this.cachedData);
    } catch (error) {
      console.error('❌ Failed to preload data:', error);
    } finally {
      this.isLoading = false;
      this.loadingPromise = null;
    }
    
    return this.cachedData;
  }

  /**
   * Get approved submissions for display
   */
  async getApprovedSubmissions(): Promise<Submission[]> {
    try {
      console.log('📊 Getting approved submissions for display...');
      
      // Get all submissions from Airtable
      const submissions = await airtableService.getApprovedSubmissions();
      
      // Only return submissions with "Approved – Published" status
      const approvedSubmissions = submissions.filter(submission => 
        submission.status === "Approved – Published" ||
        submission.statusBis === "Approved – Published"
      );
      
      console.log(`✅ Found ${approvedSubmissions.length} approved submissions out of ${submissions.length} total`);
      return approvedSubmissions;
      
    } catch (error) {
      console.error('❌ Error getting approved submissions:', error);
      return [];
    }
  }

  /**
   * Get cached submissions (instant)
   */
  async getSubmissions(): Promise<Array<Submission & { uniqueSlug: string }>> {
    if (this.cachedData) {
      return this.cachedData.submissions;
    }

    // If not cached yet, wait for preload to complete
    if (this.loadingPromise) {
      await this.loadingPromise;
      return this.cachedData?.submissions || [];
    }

    // If no data and not loading, trigger preload
    await this.preloadData();
    return this.cachedData?.submissions || [];
  }

  /**
   * Get cached countries data (instant)
   */
  async getCountries(): Promise<CachedCountryData[]> {
    if (this.cachedData) {
      return this.cachedData.countries;
    }

    // If not cached yet, wait for preload to complete
    if (this.loadingPromise) {
      await this.loadingPromise;
      return this.cachedData?.countries || [];
    }

    // If no data and not loading, trigger preload
    await this.preloadData();
    return this.cachedData?.countries || [];
  }

  /**
   * Get submissions for a specific country (instant)
   */
  async getSubmissionsForCountry(countryName: string): Promise<Array<Submission & { uniqueSlug: string }>> {
    const submissions = await this.getSubmissions();
    return submissions.filter(submission => 
      submission.countries && submission.countries.some(country => 
        country.toLowerCase() === countryName.toLowerCase()
      )
    );
  }

  /**
   * Get cities for a specific country (instant)
   */
  async getCitiesForCountry(countryName: string): Promise<Array<{name: string; slug: string; submissionCount: number}>> {
    const countries = await this.getCountries();
    const country = countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
    return country?.cities || [];
  }

  /**
   * Check if data is currently loading
   */
  isLoadingData(): boolean {
    return this.isLoading;
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { cached: boolean; loading: boolean; age?: number } {
    return {
      cached: !!this.cachedData,
      loading: this.isLoading,
      age: this.cachedData ? Date.now() - this.cachedData.lastUpdated : undefined
    };
  }

  /**
   * Force refresh data by clearing cache and reloading
   */
  public async forceRefresh(): Promise<CachedData | null> {
    console.log('🔄 Force refreshing data...');
    this.clearCache();
    this.cachedData = null;
    return await this.preloadData();
  }
}

// Export singleton instance
export const dataPreloader = new DataPreloader();
