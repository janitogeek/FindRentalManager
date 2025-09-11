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
import { ArrowDown } from "lucide-react";
import { dataPreloader } from "@/lib/data-preloader";
import { useCurrency } from "@/contexts/currency-context";
import { getCurrencyForCountry } from "@/lib/currency-utils";
import { getFlagByCountryName } from "@/lib/utils";
import { getRegionSubmissionCounts } from "@/lib/submission-processor";

export default function Country() {
  const { selectedCurrency, setSelectedCurrency, currencyOptions, isLoading: isLoadingCurrencies } = useCurrency();
  const [, params] = useRoute('/country/:country');
  const countrySlug = params?.country;
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
  
  // Map country slugs to full country names for Airtable matching
  const getCountryNameFromSlug = (slug: string) => {
    const countryMap: { [key: string]: string } = {
      'united-states': 'United States',
      usa: 'United States',
      spain: 'Spain',
      uk: 'United Kingdom',
      germany: 'Germany',
      france: 'France',
      australia: 'Australia',
      canada: 'Canada',
      italy: 'Italy',
      portugal: 'Portugal',
      thailand: 'Thailand',
      greece: 'Greece',
      netherlands: 'Netherlands',
      switzerland: 'Switzerland',
      austria: 'Austria',
      belgium: 'Belgium',
      croatia: 'Croatia',
      'czech-republic': 'Czech Republic',
      denmark: 'Denmark',
      finland: 'Finland',
      hungary: 'Hungary',
      ireland: 'Ireland',
      norway: 'Norway',
      poland: 'Poland',
      sweden: 'Sweden',
      turkey: 'Turkey',
      albania: 'Albania',
      andorra: 'Andorra',
      indonesia: 'Indonesia'
    };
    return countryMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  const countryName = getCountryNameFromSlug(countrySlug || '');
  
  // Auto-set currency based on country
  useEffect(() => {
    if (countryName) {
      const countryCurrency = getCurrencyForCountry(countryName);
      setSelectedCurrency(countryCurrency);
    }
  }, [countryName, setSelectedCurrency]);
  
  // Fetch validated cities for this country from submissions
  // Fetch cities for this country (instant if cached)  
  const { data: citiesWithCounts = [], isLoading: isCitiesLoading } = useQuery({
    queryKey: ["/api/preloaded-cities", countryName],
    queryFn: () => dataPreloader.getCitiesForCountry(countryName),
    enabled: !!countryName,
    staleTime: 30 * 60 * 1000, // 30 minutes (longer since we have smart caching)
  });

  // Transform cities data to match existing format
  const cities = citiesWithCounts.map(city => city.name);
  const citySubmissionCounts = citiesWithCounts.reduce((acc, city) => {
    acc[city.name] = city.submissionCount;
    return acc;
  }, {} as Record<string, number>);

  // Fetch regions for this country using our enhanced GeoNames system
  const { data: regionCounts = {}, isLoading: isRegionsLoading } = useQuery({
    queryKey: ["/api/region-counts", countryName],
    queryFn: () => getRegionSubmissionCounts(countryName),
    enabled: !!countryName,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const regions = Object.keys(regionCounts).filter(region => regionCounts[region] > 0);

  
  // Get country data from preloaded cache (instant)
  const { data: allCountries = [] } = useQuery({
    queryKey: ["/api/preloaded-countries-for-country-page"],
    queryFn: () => dataPreloader.getCountries(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
  
  // Find the specific country from preloaded data
  const country = useMemo(() => {
    return allCountries.find(c => c.slug === countrySlug || c.name.toLowerCase() === countryName.toLowerCase());
  }, [allCountries, countrySlug, countryName]);

  // Query submissions for this country
  const { data: submissions = [], isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ["/api/preloaded-submissions", countryName],
    queryFn: () => dataPreloader.getSubmissionsForCountry(countryName),
    enabled: !!countryName,
    staleTime: 30 * 60 * 1000, // 30 minutes (longer since we have smart caching)
    refetchInterval: 60 * 1000, // Refetch every minute
  });






  // Fetch all countries for the tags
  // const { data: countries, isLoading: isCountriesLoading } = useQuery({
  //   queryKey: ["/api/countries"],
  //   queryFn: async () => {
  //     const res = await apiRequest("GET", "/api/countries", undefined);
  //     return res.json();
  //   }
  // });

  // Filter and sort submissions based on active filters
  const filteredSubmissions = useMemo(() => {
    if (!submissions.length) return [];
    
    let filtered = submissions;
    
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
      return sortSubmissions(submissions);
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

      // Filter by design style
      if (filters.designStyle.length > 0 && !filters.designStyle.some(style => 
        submission.designStyles?.includes(style)
      )) {
        return false;
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
  }, [submissions, filters, featuredOnly, priceSorting, selectedCurrency]);


  const totalHosts = filteredSubmissions.length;

  // Breadcrumb structured data for AI understanding
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
        "name": "Countries",
        "item": "https://bookdirectstays.com/#countries"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${country?.name || countryName} Rental Management Companies`,
        "item": `https://bookdirectstays.com/country/${countrySlug}`
      }
    ]
  };

  // Country-specific structured data
  const countryStructuredData = country ? {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": `${country.name} Vacation Rentals`,
    "description": `Find ${totalHosts} verified property management companies in ${country.name}. Connect with professional rental managers to maximize your property's rental income.`,
    "url": `https://bookdirectstays.com/country/${countrySlug}`,
    "containsPlace": {
      "@type": "Country",
      "name": country.name,
      "identifier": country.slug
    },
    "touristType": "Vacation Rental Seekers",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${country.name} Direct Booking Vacation Rentals`,
      "numberOfItems": totalHosts
    }
  } : null;

  return (
    <AnimatedPage key={`country-${countrySlug}`}>
      <main>
        {/* Structured Data for AI Understanding */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData)
          }}
        />
        
        {countryStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(countryStructuredData)
            }}
          />
        )}

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
                  <li className="text-white font-semibold flex items-center gap-2">
                    <span className="text-xl">{getFlagByCountryName(country?.name || countryName)}</span>
                    {country?.name || countryName}
                  </li>
                </ol>
              </nav>

              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                {getFlagByCountryName(country?.name || countryName)} {country?.name || countryName} Property Management Companies
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Find professional rental management companies in {country?.name || countryName}
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
              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                {regions.length > 0 && (
                  <Button 
                    onClick={() => {
                      const element = document.getElementById('region-navigation');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold flex items-center gap-2"
                  >
                    Find Managers by Region/State
                    <ArrowDown className="w-5 h-5" />
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    const element = document.getElementById('city-navigation');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold flex items-center gap-2"
                >
                  Find Managers by City
                  <ArrowDown className="w-5 h-5" />
                </Button>
              </div>

              {/* Host Filters */}
              <HostFilters 
                onFiltersChange={setFilters}
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
                currencyOptions={currencyOptions}
                isLoadingCurrencies={isLoadingCurrencies}
              />

              {/* Controls */}
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <Button
                  variant={featuredOnly ? "default" : "outline"}
                  onClick={() => setFeaturedOnly(!featuredOnly)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
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

              {/* Property Manager Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {isSubmissionsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))
                ) : filteredSubmissions.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No management companies found for this country.</p>
                  </div>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <SubmissionPropertyCard 
                      key={submission.id} 
                      submission={submission} 
                      fromCountry={countryName}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Regions Section */}
        {regions.length > 0 && (
          <section id="region-navigation" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                {isRegionsLoading ? (
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
                    title={`Find Managers by Region/State in ${getFlagByCountryName(country?.name || countryName)} ${country?.name || countryName}`}
                    description="Browse management companies by region or state to find local expertise"
                    items={regions.map(region => ({
                      name: region,
                      slug: region.toLowerCase().replace(/\s+/g, '-'),
                      count: regionCounts[region] || 0,
                      href: `/country/${countrySlug}/region/${region.toLowerCase().replace(/\s+/g, '-')}`
                    }))}
                    searchPlaceholder="Search for a region or state..."
                    emptyStateTitle="No regions found"
                    emptyStateDescription={`We currently don't have regional data for ${country?.name || countryName}.`}
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Cities Section */}
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
                  title={`Find Managers by City in ${getFlagByCountryName(country?.name || countryName)} ${country?.name || countryName}`}
                  description="Browse management companies by city to find your perfect local partner"
                  items={cities.map(city => ({
                    name: city,
                    slug: city.toLowerCase().replace(/\s+/g, '-'),
                    count: citySubmissionCounts[city] || 0,
                    href: `/country/${countrySlug}/${city.toLowerCase().replace(/\s+/g, '-')}`
                  }))}
                  searchPlaceholder="Search for a city..."
                  emptyStateTitle="No cities found"
                  emptyStateDescription={`We currently don't have city data for ${country?.name || countryName}.`}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </AnimatedPage>
  );
}
