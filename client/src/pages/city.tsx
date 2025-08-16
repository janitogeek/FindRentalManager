import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import PropertyCard from "@/components/property-card";
import SubmissionPropertyCard from "@/components/submission-property-card";
import HostFilters, { FilterState } from "@/components/host-filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { airtableService } from "@/lib/airtable";
import { dataPreloader } from "@/lib/data-preloader";
import { getFlagByCountryName, getManagerCountText } from "@/lib/utils";

export default function City() {
  const [, params] = useRoute('/country/:country/:city');
  const countrySlug = params?.country;
  const citySlug = params?.city;
  const [visibleCount, setVisibleCount] = useState(6);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    propertyTypes: [],
    idealFor: [],
    propertiesFeatures: [],
    servicesConvenience: [],
    lifestyleValues: [],
    designStyle: [],
    atmospheres: [],
    settingsLocations: [],
    minPrice: null,
    maxPrice: null,
    minCommission: null,
    maxCommission: null
  });
  
  // Featured filter state
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Sort function: Featured first, then alphabetical by brand name
  const sortSubmissions = (submissionsToSort: any[]) => {
    return submissionsToSort.sort((a, b) => {
      // Check if either is featured/premium
      const aIsPremium = a.plan?.includes('Premium') || a.plan?.includes('€499.99');
      const bIsPremium = b.plan?.includes('Premium') || b.plan?.includes('€499.99');
      
      // Featured first
      if (aIsPremium && !bIsPremium) return -1;
      if (!aIsPremium && bIsPremium) return 1;
      
      // Then alphabetical by brand name
      return a.brandName.localeCompare(b.brandName);
    });
  };
  
  // Convert slug back to readable city name with proper accents
  const getCityNameFromSlug = (slug: string) => {
    // Map of common city slugs to their proper names with accents
    const cityNameMap: { [key: string]: string } = {
      'new-york': 'New York',
      'los-angeles': 'Los Angeles',
      'san-francisco': 'San Francisco',
      'las-vegas': 'Las Vegas',
      'new-orleans': 'New Orleans',
      'san-diego': 'San Diego',
      'san-antonio': 'San Antonio',
      'salt-lake-city': 'Salt Lake City',
      'durres': 'Durrës',
      'nice': 'Nice',
      'malaga': 'Málaga',
      'cordoba': 'Córdoba',
      'leon': 'León',
      'caceres': 'Cáceres',
      'alicante': 'Alicante',
      'santander': 'Santander',
      'san-sebastian': 'San Sebastián',
      'a-coruna': 'A Coruña',
      'monte-carlo': 'Monte-Carlo',
      'zurich': 'Zürich',
      'dusseldorf': 'Düsseldorf',
      'cologne': 'Köln',
      'munich': 'München',
      'montreal': 'Montréal',
      'quebec': 'Québec',
      'sao-paulo': 'São Paulo',
      'brasilia': 'Brasília',
      'rio-de-janeiro': 'Rio de Janeiro'
    };
    
    // Return mapped name if exists, otherwise capitalize normally
    return cityNameMap[slug] || slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const cityName = getCityNameFromSlug(citySlug || '');
  
  // Get country name from slug
  const getCountryName = (slug: string) => {
    const countryMap: { [key: string]: string } = {
      'united-states': 'United States',
      'usa': 'United States',
      'spain': 'Spain',
      'uk': 'United Kingdom',
      'united-kingdom': 'United Kingdom',
      'germany': 'Germany',
      'france': 'France',
      'australia': 'Australia',
      'canada': 'Canada',
      'italy': 'Italy',
      'portugal': 'Portugal',
      'thailand': 'Thailand',
      'greece': 'Greece',
      'albania': 'Albania',
      'indonesia': 'Indonesia',
      'new-zealand': 'New Zealand',
      'south-africa': 'South Africa',
      'costa-rica': 'Costa Rica',
      'czech-republic': 'Czech Republic',
      'dominican-republic': 'Dominican Republic',
      'saudi-arabia': 'Saudi Arabia',
      'sri-lanka': 'Sri Lanka',
      'united-arab-emirates': 'United Arab Emirates'
    };
    return countryMap[slug] || slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const countryName = getCountryName(countrySlug || '');

  // Fetch submissions for this country (instant if cached)
  const { data: allSubmissions = [], isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ["/api/preloaded-submissions-city", countryName],
    queryFn: () => dataPreloader.getSubmissionsForCountry(countryName),
    enabled: !!countryName,
    staleTime: 30 * 60 * 1000, // 30 minutes (longer since we have smart caching)
  });

  // Filter submissions by city (handle accented characters)
  const normalizeForComparison = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics/accents
  };

  const citySubmissions = allSubmissions.filter(submission => 
    submission.citiesRegions.some(city => {
      const normalizedCity = normalizeForComparison(city);
      const normalizedCityName = normalizeForComparison(cityName || '');
      return normalizedCity.includes(normalizedCityName) ||
             normalizedCityName.includes(normalizedCity);
    })
  );

  // Filter and sort submissions by all active filters
  const filteredSubmissions = useMemo(() => {
    if (!citySubmissions.length) return [];
    
    let filtered = citySubmissions;
    
    // Apply featured filter first
    if (featuredOnly) {
      filtered = filtered.filter(submission => {
        // Check if it's a premium listing (Featured)
        return submission.plan?.includes('Premium') || submission.plan?.includes('€499.99');
      });
    }
    
    const hasActiveFilters = Object.values(filters).some(filterArray => Array.isArray(filterArray) ? filterArray.length > 0 : Boolean(filterArray));
    if (!hasActiveFilters && !featuredOnly) {
      // No filters, just sort
      return sortSubmissions(citySubmissions);
    }
    
    if (hasActiveFilters) {
      filtered = filtered.filter(submission => {
        // Check keyword search first
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
        const searchableContent = [
          submission.brandName,
          submission.oneLineDescription,
          submission.whyBookWithYou,
          submission.topStats,
          ...(submission.typesOfStays || []),
          ...(submission.idealFor || []),
          ...(submission.propertiesFeatures || []),
          ...(submission.servicesConvenience || []),
          ...(submission.lifestyleValues || []),
          ...(submission.designStyles || []),
          ...(submission.atmospheres || []),
          ...(submission.settingsLocations || [])
        ].join(' ').toLowerCase();
        
        if (!searchableContent.includes(searchTerm)) return false;
      }

      // Check property types (Types of Stays)
      if (filters.propertyTypes.length > 0) {
        const hasMatchingPropertyType = submission.typesOfStays?.some(type =>
          filters.propertyTypes.includes(type)
        );
        if (!hasMatchingPropertyType) return false;
      }

      // Check ideal for
      if (filters.idealFor.length > 0) {
        const hasMatchingIdealFor = submission.idealFor?.some(ideal =>
          filters.idealFor.includes(ideal)
        );
        if (!hasMatchingIdealFor) return false;
      }

      // Check properties features
      if (filters.propertiesFeatures.length > 0) {
        const hasMatchingFeatures = submission.propertiesFeatures?.some(feature =>
          filters.propertiesFeatures.includes(feature)
        );
        if (!hasMatchingFeatures) return false;
      }

      // Check services & convenience
      if (filters.servicesConvenience.length > 0) {
        const hasMatchingServices = submission.servicesConvenience?.some(service =>
          filters.servicesConvenience.includes(service)
        );
        if (!hasMatchingServices) return false;
      }

      // Check lifestyle & values
      if (filters.lifestyleValues.length > 0) {
        const hasMatchingValues = submission.lifestyleValues?.some(value =>
          filters.lifestyleValues.includes(value)
        );
        if (!hasMatchingValues) return false;
      }

      // Check design style
      if (filters.designStyle.length > 0) {
        const hasMatchingStyle = submission.designStyles?.some(style =>
          filters.designStyle.includes(style)
        );
        if (!hasMatchingStyle) return false;
      }

      // Check atmospheres
      if (filters.atmospheres.length > 0) {
        const hasMatchingAtmosphere = submission.atmospheres?.some(atmosphere =>
          filters.atmospheres.includes(atmosphere)
        );
        if (!hasMatchingAtmosphere) return false;
      }

      // Check settings/locations
      if (filters.settingsLocations.length > 0) {
        const hasMatchingLocation = submission.settingsLocations?.some(location =>
          filters.settingsLocations.includes(location)
        );
        if (!hasMatchingLocation) return false;
      }

      // Check price range filters
      if (filters.minPrice !== null || filters.maxPrice !== null) {
        // Only apply price filters if submission has pricing data
        if (submission.minPrice && submission.maxPrice && submission.currency) {
          const companyMin = submission.minPrice;
          const companyMax = submission.maxPrice;
          
          // If user sets only min price, show companies where max price >= user min
          if (filters.minPrice !== null && filters.maxPrice === null) {
            if (companyMax < filters.minPrice) return false;
          }
          
          // If user sets only max price, show companies where min price <= user max
          if (filters.maxPrice !== null && filters.minPrice === null) {
            if (companyMin > filters.maxPrice) return false;
          }
          
          // If user sets both min and max, check for range overlap
          if (filters.minPrice !== null && filters.maxPrice !== null) {
            // No overlap if company max < user min OR company min > user max
            if (companyMax < filters.minPrice || companyMin > filters.maxPrice) {
              return false;
            }
          }
        } else {
          // If submission doesn't have pricing data, exclude it when price filters are active
          return false;
        }
      }

        return true;
      });
    }
    
    // Sort submissions: Featured first, then alphabetical
    return sortSubmissions(filtered);
  }, [citySubmissions, filters, featuredOnly]);

  console.log('🏙️ City page - cityName:', cityName);
  console.log('🏙️ City page - countryName:', countryName);
  console.log('🏙️ City page - allSubmissions (cached):', allSubmissions);
  console.log('🏙️ City page - citySubmissions:', citySubmissions);
  console.log('🏙️ City page - citySubmissions length:', citySubmissions.length);
  console.log('📊 City page - Cache status:', dataPreloader.getCacheStatus());
  console.log('⚡ City page - Loading state:', isSubmissionsLoading);
  
  // Fetch listings for this city (placeholder - would be real API call)
  const { data: listingsData, isLoading: isListingsLoading } = useQuery({
    queryKey: [`/api/listings?country=${countrySlug}&city=${citySlug}`, visibleCount],
    queryFn: async () => {
      // Placeholder - return empty for now
      return { listings: [], total: 0, hasMore: false };
    },
    enabled: !!countrySlug && !!citySlug
  });

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  const hasMore = listingsData?.hasMore || false;

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "BookDirectStays.com",
        "item": "https://bookdirectstays.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Find a Manager",
        "item": "https://bookdirectstays.com/find-manager"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${countryName}`,
        "item": `https://bookdirectstays.com/country/${countrySlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": `${cityName} Rental Managers`,
        "item": `https://bookdirectstays.com/country/${countrySlug}/${citySlug}`
      }
    ]
  };

  return (
    <main>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-blue-200">
                <li>
                  <Link href="/find-manager" className="hover:text-white transition-colors">
                    Find a Manager
                  </Link>
                </li>
                <li className="text-blue-300">›</li>
                <li>
                  <Link href={`/country/${countrySlug}`} className="hover:text-white transition-colors inline-flex items-center gap-1">
                    {getFlagByCountryName(countryName)} {countryName}
                  </Link>
                </li>
                <li className="text-blue-300">›</li>
                <li className="text-white font-semibold">{cityName}</li>
              </ol>
            </nav>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 flex items-center gap-4">
              <span className="text-5xl">{getFlagByCountryName(countryName)}</span>
              <span>{cityName} Rental Managers</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Professional rental managers in {cityName}, <span className="inline-flex items-center gap-1">{getFlagByCountryName(countryName)} {countryName}</span>
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block">
              <div className="flex items-center space-x-4">
                <Badge className="bg-blue-500 text-white">
                  {getManagerCountText((listingsData?.total || 0) + filteredSubmissions.length)}
                </Badge>
                <span className="text-blue-100">•</span>
                <span className="text-blue-100">Skip OTA fees</span>
                <span className="text-blue-100">•</span>
                <span className="text-blue-100">Visit Website</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Host Filters */}
            {citySubmissions.length > 0 && (
              <HostFilters onFiltersChange={setFilters} />
            )}

            {/* Featured Only Toggle */}
            {citySubmissions.length > 0 && (
              <div className="mb-6">
                <Button
                  variant={featuredOnly ? "default" : "outline"}
                  onClick={() => setFeaturedOnly(!featuredOnly)}
                  className={`${
                    featuredOnly 
                      ? "bg-yellow-500 hover:bg-yellow-600 text-yellow-900 border-yellow-500" 
                      : "border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                  }`}
                >
                  {featuredOnly ? "✓ Featured Only" : "Featured Only"}
                </Button>
              </div>
            )}
            
            {/* Property Manager Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(isListingsLoading || isSubmissionsLoading) ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                        <div className="h-6 bg-gray-300 w-2/3 rounded"></div>
                      </div>
                      <div className="h-4 bg-gray-300 w-1/2 mb-3 rounded"></div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="h-6 bg-gray-300 w-16 rounded"></div>
                        <div className="h-6 bg-gray-300 w-20 rounded"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="h-10 bg-gray-300 w-32 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (listingsData?.listings.length === 0 && filteredSubmissions.length === 0) ? (
                <div className="col-span-3 text-center py-16">
                  <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 inline-block mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {filters.search ? `No managers found matching "${filters.search}"` : `No managers found in ${cityName}`}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {filters.search ? "Try adjusting your search terms or filters." : "We couldn't find any property managers in this city yet."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        asChild
                        variant="outline" 
                        className="border-blue-600 text-blue-600"
                      >
                        <Link href={`/country/${countrySlug}`} className="inline-flex items-center gap-1">
                          View all {getFlagByCountryName(countryName)} {countryName} managers
                        </Link>
                      </Button>
                      <Button 
                        asChild
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Link href="/submit">
                          Add Your Host Site
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Display approved submissions first */}
                  {filteredSubmissions.map((submission) => (
                    <SubmissionPropertyCard 
                      key={`submission-${submission.id}`} 
                      submission={submission} 
                      fromCity={cityName}
                      fromCountry={countryName}
                    />
                  ))}
                  
                  {/* Display existing listings */}
                  {listingsData?.listings.map((listing: any) => (
                    <PropertyCard key={`listing-${listing.id}`} property={listing} />
                  ))}
                </>
              )}
            </div>
            
            {/* Show More Button */}
            {hasMore && (
              <div className="mt-10 text-center">
                <Button 
                  variant="outline"
                  className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition"
                  onClick={handleShowMore}
                >
                  Show More
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-3">
              <span>Have a vacation rental in</span> 
              <span className="inline-flex items-center gap-2">
                <span className="text-4xl">{getFlagByCountryName(countryName)}</span>
                {cityName}?
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our directory and connect directly with travelers. No commission fees, just direct bookings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/submit">
                  Add Your Direct Booking Site
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Link href="/find-manager">
                  Explore Other Destinations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 