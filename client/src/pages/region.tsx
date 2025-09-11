/**
 * Region/State page for displaying property management companies in a specific region
 * URL: /country/{countrySlug}/region/{regionSlug}
 */
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import SubmissionPropertyCard from "@/components/submission-property-card";
import HostFilters, { FilterState } from "@/components/host-filters";
import AlphabeticalDirectory from "@/components/alphabetical-directory";
import AnimatedPage from "@/components/animated-page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from "@/contexts/currency-context";
import { getCurrencyForCountry } from "@/lib/currency-utils";
import { getFlagByCountryName, getManagerCountText } from "@/lib/utils";
import { getSubmissionsForRegion } from "@/lib/submission-processor";
import { dataPreloader } from "@/lib/data-preloader";

export default function Region() {
  const { selectedCurrency, setSelectedCurrency, currencyOptions, isLoading: isLoadingCurrencies } = useCurrency();
  const [, params] = useRoute('/country/:country/region/:region');
  const countrySlug = params?.country;
  const regionSlug = params?.region;
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
  
  // Featured filter and price sorting state
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [priceSorting, setPriceSorting] = useState<'none' | 'least-expensive' | 'most-expensive'>('none');

  // Enhanced sort function with price sorting support
  const sortSubmissions = (submissionsToSort: any[]) => {
    return submissionsToSort.sort((a, b) => {
      // Featured first
      const aIsPremium = a.plan?.includes('Premium') || a.plan?.includes('€499.99');
      const bIsPremium = b.plan?.includes('Premium') || b.plan?.includes('€499.99');
      if (aIsPremium && !bIsPremium) return -1;
      if (!aIsPremium && bIsPremium) return 1;

      // Then price sorting if enabled
      if (priceSorting !== 'none') {
        if (priceSorting === 'least-expensive' && a.minPrice && b.minPrice) {
          const aMinPrice = a.minPrice; // Currency conversion could be added here
          const bMinPrice = b.minPrice;
          return aMinPrice - bMinPrice;
        } else if (priceSorting === 'most-expensive' && a.maxPrice && b.maxPrice) {
          const aMaxPrice = a.maxPrice;
          const bMaxPrice = b.maxPrice;
          return bMaxPrice - aMaxPrice;
        }
      }

      // Finally alphabetical
      return a.brandName.localeCompare(b.brandName);
    });
  };
  
  // Convert slug back to readable region name
  const getRegionNameFromSlug = (slug: string) => {
    // Map of common region slugs to their proper names
    const regionNameMap: { [key: string]: string } = {
      'new-york': 'New York',
      'los-angeles': 'Los Angeles',
      'san-francisco': 'San Francisco',
      'ile-de-france': 'Île-de-France',
      'provence-alpes-cote-dazur': 'Provence-Alpes-Côte d\'Azur',
      'nueva-york': 'Nueva York',
      'castilla-y-leon': 'Castilla y León',
      'castilla-la-mancha': 'Castilla-La Mancha',
      'pais-vasco': 'País Vasco',
      'comunitat-valenciana': 'Comunitat Valenciana',
      'baden-wurttemberg': 'Baden-Württemberg',
      'rheinland-pfalz': 'Rheinland-Pfalz',
      'schleswig-holstein': 'Schleswig-Holstein',
      'mecklenburg-vorpommern': 'Mecklenburg-Vorpommern',
      'sachsen-anhalt': 'Sachsen-Anhalt',
      'nordrhein-westfalen': 'Nordrhein-Westfalen',
      'south-australia': 'South Australia',
      'new-south-wales': 'New South Wales',
      'western-australia': 'Western Australia',
      'british-columbia': 'British Columbia',
      'newfoundland-and-labrador': 'Newfoundland and Labrador',
      'prince-edward-island': 'Prince Edward Island'
    };
    
    // Return mapped name if exists, otherwise capitalize normally
    return regionNameMap[slug] || slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const regionName = getRegionNameFromSlug(regionSlug || '');
  
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

  // Auto-set currency based on country
  useEffect(() => {
    if (countryName) {
      const countryCurrency = getCurrencyForCountry(countryName);
      setSelectedCurrency(countryCurrency);
    }
  }, [countryName, setSelectedCurrency]);

  // Fetch submissions for this specific region using our enhanced GeoNames system
  const { data: regionSubmissions = [], isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ["/api/region-submissions", regionName, countryName],
    queryFn: () => getSubmissionsForRegion(regionName, countryName),
    enabled: !!regionName && !!countryName,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Fetch cities in this region for the "Find by City" section
  const { data: citiesInRegion = [], isLoading: isCitiesLoading } = useQuery({
    queryKey: ["/api/cities-in-region", regionName, countryName],
    queryFn: async () => {
      // Get all submissions for the country and filter by region
      const allSubmissions = await dataPreloader.getSubmissionsForCountry(countryName);
      const cityMap = new Map<string, number>();
      
      allSubmissions.forEach(submission => {
        // Check if submission operates in this region
        const operatesInRegion = 
          submission.regionsStates?.some(r => 
            r.toLowerCase() === regionName.toLowerCase()
          ) ||
          submission.geonamesRecord?.some(record => 
            record.includes(regionName)
          );
        
        if (operatesInRegion) {
          // Extract cities from this submission
          submission.cities?.forEach(city => {
            cityMap.set(city, (cityMap.get(city) || 0) + 1);
          });
          
          // Also check geonamesRecord for cities
          submission.geonamesRecord?.forEach(record => {
            if (record.includes(regionName)) {
              const parts = record.split(',').map(s => s.trim());
              if (parts.length >= 1) {
                const cityName = parts[0];
                cityMap.set(cityName, (cityMap.get(cityName) || 0) + 1);
              }
            }
          });
        }
      });
      
      return Array.from(cityMap.entries()).map(([name, count]) => ({
        name,
        count
      })).filter(city => city.count > 0);
    },
    enabled: !!regionName && !!countryName,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Filter and sort submissions by all active filters
  const filteredSubmissions = useMemo(() => {
    if (!regionSubmissions.length) return [];
    
    let filtered = regionSubmissions;
    
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
      return sortSubmissions(regionSubmissions);
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

      // Check commission range filters
      if (filters.minCommission !== null || filters.maxCommission !== null) {
        // Only apply commission filters if submission has commission data
        if (submission.commissionOnRevenue) {
          const companyCommission = typeof submission.commissionOnRevenue === 'number' 
            ? submission.commissionOnRevenue 
            : parseFloat(submission.commissionOnRevenue);
          
          // If user sets only min commission, show companies where commission >= user min
          if (filters.minCommission !== null && filters.maxCommission === null) {
            if (companyCommission < filters.minCommission) return false;
          }
          
          // If user sets only max commission, show companies where commission <= user max
          if (filters.maxCommission !== null && filters.minCommission === null) {
            if (companyCommission > filters.maxCommission) return false;
          }
          
          // If user sets both min and max, check if commission is within range
          if (filters.minCommission !== null && filters.maxCommission !== null) {
            if (companyCommission < filters.minCommission || companyCommission > filters.maxCommission) {
              return false;
            }
          }
        } else {
          // If submission doesn't have commission data, exclude it when commission filters are active
          return false;
        }
      }

        return true;
      });
    }
    
    // Sort submissions: Featured first, then price, then alphabetical
    return sortSubmissions(filtered);
  }, [regionSubmissions, filters, featuredOnly, priceSorting, selectedCurrency]);

  const totalHosts = filteredSubmissions.length;

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "FindRentalManager.com",
        "item": "https://findrentalmanager.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Find a Manager",
        "item": "https://findrentalmanager.com/find-manager"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${countryName}`,
        "item": `https://findrentalmanager.com/country/${countrySlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": `${regionName} Property Management Companies`,
        "item": `https://findrentalmanager.com/country/${countrySlug}/region/${regionSlug}`
      }
    ]
  };

  return (
    <AnimatedPage key={`region-${countrySlug}-${regionSlug}`}>
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
              {/* Breadcrumb Navigation */}
              <nav className="mb-8">
                <ol className="flex items-center space-x-2 text-blue-200">
                  <li>
                    <Link href="/find-manager" className="hover:text-white transition-colors">
                      Find a Manager
                    </Link>
                  </li>
                  <li className="text-blue-300">›</li>
                  <li>
                    <Link href={`/country/${countrySlug}`} className="hover:text-white transition-colors flex items-center gap-2">
                      <span className="text-lg">{getFlagByCountryName(countryName)}</span>
                      {countryName}
                    </Link>
                  </li>
                  <li className="text-blue-300">›</li>
                  <li className="text-white font-semibold flex items-center gap-2">
                    <span>🏛️</span>
                    {regionName}
                  </li>
                </ol>
              </nav>

              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                {getFlagByCountryName(countryName)} {regionName} Property Management Companies
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Professional rental management companies in {regionName}, {getFlagByCountryName(countryName)} {countryName}
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-blue-500 text-white">
                    {totalHosts} {totalHosts === 1 ? 'manager' : 'managers'}
                  </Badge>
                  <span className="text-blue-100">•</span>
                  <span className="text-blue-100">Professional Services</span>
                  <span className="text-blue-100">•</span>
                  <span className="text-blue-100">Maximize Revenue</span>
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
              {regionSubmissions.length > 0 && (
                <HostFilters 
                  onFiltersChange={setFilters}
                  selectedCurrency={selectedCurrency}
                  onCurrencyChange={setSelectedCurrency}
                  currencyOptions={currencyOptions}
                  isLoadingCurrencies={isLoadingCurrencies}
                />
              )}

              {/* Controls */}
              {regionSubmissions.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-4">
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

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                    <Select value={priceSorting} onValueChange={(value) => setPriceSorting(value as typeof priceSorting)}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Default" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Default</SelectItem>
                        <SelectItem value="least-expensive">Least Expensive</SelectItem>
                        <SelectItem value="most-expensive">Most Expensive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Property Manager Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isSubmissionsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))
                ) : filteredSubmissions.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                      No management companies found in {regionName}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      We currently don't have any companies listed for this region.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button asChild variant="outline" className="border-blue-600 text-blue-600">
                        <Link href={`/country/${countrySlug}`}>
                          View all {getFlagByCountryName(countryName)} {countryName} managers
                        </Link>
                      </Button>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href="/submit">
                          List Your Management Company
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <SubmissionPropertyCard 
                      key={submission.id} 
                      submission={submission} 
                      fromRegion={regionName}
                      fromCountry={countryName}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* City Navigation Section */}
        {citiesInRegion.length > 0 && (
          <section id="city-navigation" className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                {isCitiesLoading ? (
                  <div className="text-center py-12">
                    <div className="h-8 bg-gray-300 w-96 mx-auto rounded animate-pulse mb-4"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className="h-20 bg-gray-300 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <AlphabeticalDirectory
                    title={`Find Managers by City in 🏛️ ${regionName}`}
                    description={`Browse management companies in specific cities within ${regionName}`}
                    items={citiesInRegion.map(city => ({
                      name: city.name,
                      slug: city.name.toLowerCase().replace(/\s+/g, '-'),
                      count: city.count,
                      href: `/country/${countrySlug}/${city.name.toLowerCase().replace(/\s+/g, '-')}`
                    }))}
                    searchPlaceholder="Search cities..."
                    emptyStateTitle="No cities found"
                    emptyStateDescription="This region doesn't have city data yet."
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Have a property management company in 🏛️ {regionName}, {getFlagByCountryName(countryName)} {countryName}?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join our directory and connect with property owners looking for professional management services.
              </p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/submit">
                  List Your Management Company
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </AnimatedPage>
  );
}
