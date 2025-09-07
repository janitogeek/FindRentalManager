import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { airtableService } from "@/lib/airtable";
import { dataPreloader } from "@/lib/data-preloader";
import { getFlagByCountryName, getManagerCountText } from "@/lib/utils";

export default function FindHost() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch countries data from preloader (instant if cached)
  const { data: countriesData = [], isLoading: isCountriesLoading } = useQuery({
    queryKey: ["/api/preloaded-countries"],
    queryFn: () => dataPreloader.getCountries(),
    staleTime: 30 * 60 * 1000, // 30 minutes (longer since we have smart caching)
  });

  // Transform active country names into country objects with metadata
  const countries = useMemo(() => {
    const existingSlugs: string[] = [];
    
    return countriesData.map((country, index) => ({
      id: index + 1,
      name: country.name,
      slug: country.slug,
      code: "XX", // Not needed anymore since we have flag emojis
      submissionCount: country.submissionCount,
      cities: country.cities
    }));
  }, [countriesData]);

  // Countries with counts are already precomputed - instant!
  const countriesWithCounts = useMemo(() => {
    return countries.map(country => ({
      ...country,
      listingCount: country.submissionCount,
      flag: getFlagByCountryName(country.name),
    })).sort((a, b) => b.listingCount - a.listingCount);
  }, [countries]);

  console.log('🌍 Find Host - Preloaded countries:', countriesData);
  console.log('📊 Find Host - Countries with counts (instant):', countriesWithCounts);

  const isLoading = isCountriesLoading;

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return countriesWithCounts;
    }
    
    return countriesWithCounts.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [countriesWithCounts, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getFlagEmoji = (countryName: string) => {
    // Use the comprehensive flag mapping from utils
    return getFlagByCountryName(countryName);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section with Background Image */}
      <section 
        className="text-white py-16 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: 'url(/find-manager-background.jpg)'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Choose Your Location(s)
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Search for a country or countries to discover verified vacation rental property management companies
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block">
              <p className="text-lg">
                <span className="font-semibold text-blue-200">Over 1000+</span> verified managers across{" "}
                <span className="font-semibold text-blue-200">50+ countries</span> worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Country Selection */}
      {/* Removed multi-country selection section */}

      {/* Countries Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Controls */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for a country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Country Selection Checkboxes */}
            {/* Removed country selection checkboxes */}

            {/* Countries Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded"></div>
                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredCountries.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2">No countries found</h3>
                    <p>Try searching for a different country name.</p>
                    {searchQuery && (
                      <Button 
                        variant="outline" 
                        onClick={clearSearch}
                        className="mt-4"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <Card key={country.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                    <CardContent className="p-6">
                      <Link href={`/country/${country.slug}`} className="block">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getFlagEmoji(country.name)}</span>
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              {country.name}
                            </h3>
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {getManagerCountText(country.listingCount)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Discover verified vacation rental property management companies in {country.name}
                        </p>
                        <Button 
                          asChild 
                          size="lg" 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Link href={`/country/${country.slug}`}>
                            View Managers in {country.name}
                          </Link>
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Can't Find Your Country?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We're constantly adding new destinations. Submit your management company to be featured.
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
  );
} 