import React, { useMemo } from "react"; // Added missing import for React
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { ExternalLink, MapPin, Building2, Users, Star, Heart, Sparkles, Home, Wrench, Shield, Palette, Coffee, TreePine, Globe } from "lucide-react";
import { SiInstagram, SiFacebook, SiLinkedin, SiTiktok, SiYoutube } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { airtableService, Submission } from "@/lib/airtable";
import { dataPreloader } from "@/lib/data-preloader";
import { isAirtableId } from "@/lib/utils";
import { useClickTracking } from "@/lib/click-tracking";
import { getFlagByCountryName } from "@/lib/utils";


export default function SubmissionProperty() {
  const [, params] = useRoute('/property/:slug');
  const [, setLocation] = useLocation();
  const submissionSlug = params?.slug;
  
  // Check navigation context from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const fromCity = urlParams.get('city');
  const fromCountry = urlParams.get('country');
  const fromFeatured = urlParams.get('from') === 'featured';
  
  // Get all preloaded submissions and find the specific one (instant if cached)
  const { data: allSubmissions = [], isLoading: isAllSubmissionsLoading } = useQuery({
    queryKey: ["/api/preloaded-submissions-for-property"],
    queryFn: () => dataPreloader.getSubmissions(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Find the specific submission from preloaded data
  const submission = useMemo(() => {
    if (!submissionSlug || !allSubmissions.length) return null;
    
    // Find by unique slug
    return allSubmissions.find(s => (s as any).uniqueSlug === submissionSlug);
  }, [allSubmissions, submissionSlug]);

  const isLoading = isAllSubmissionsLoading || (!submission && allSubmissions.length > 0);
  const error = null; // No error handling needed for preloaded data

  // Initialize click tracking when submission data is available
  const clickTracking = submission ? useClickTracking(submission.id) : null;
  
  // Debug logging to see what data we're receiving
  console.log('🔍 Submission data received:', {
    brandName: submission?.brandName,
    whyBookWithYou: submission?.whyBookWithYou,
    whyRentWithYou: submission?.whyRentWithYou,
    commissionOnRevenue: submission?.commissionOnRevenue
  });
  
  // Get flag emoji for country name
  const getFlagEmoji = (countryName: string) => {
    // Use the comprehensive flag mapping from utils
    return getFlagByCountryName(countryName);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <SiInstagram className="w-5 h-5 text-pink-600" />;
      case 'facebook':
        return <SiFacebook className="w-5 h-5 text-blue-600" />;
      case 'linkedin':
        return <SiLinkedin className="w-5 h-5 text-blue-700" />;
      case 'tiktok':
        return <SiTiktok className="w-5 h-5 text-black" />;
      case 'youtube':
        return <SiYoutube className="w-5 h-5 text-red-600" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/">← Back to Home</a>
          </Button>
        </div>
      </div>
    );
  }

  // Parse social media links
  const socialLinks = [];
  if (submission.instagram) {
    socialLinks.push({ platform: 'Instagram', url: submission.instagram });
  }
  if (submission.facebook) {
    socialLinks.push({ platform: 'Facebook', url: submission.facebook });
  }
  if (submission.linkedin) {
    socialLinks.push({ platform: 'LinkedIn', url: submission.linkedin });
  }
  if (submission.tiktok) {
    socialLinks.push({ platform: 'TikTok', url: submission.tiktok });
  }
  if (submission.youtubeVideoTour) {
    socialLinks.push({ platform: 'YouTube', url: submission.youtubeVideoTour });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto">
                             <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm">
                     {fromFeatured ? (
                       <>
                         <Link 
                           href="/" 
                           className="hover:underline"
                           onClick={(e) => {
                             e.preventDefault();
                             // Navigate to home using wouter
                             setLocation('/');
                             // Wait for navigation and DOM update, then scroll to featured hosts
                             setTimeout(() => {
                               const element = document.getElementById('our-featured-hosts');
                               if (element) {
                                 element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                               }
                             }, 500); // Increased timeout to ensure page loads
                           }}
                         >
                           Our Featured Property Management Companies
                         </Link>
                         <span>›</span>
                         <span className="flex items-center gap-1">
                           {submission.brandName}
                         </span>
                       </>
                     ) : (
                       <>
                         <Link href="/find-manager" className="hover:underline">
                           Find a Manager
                         </Link>
                         {(fromCountry || (submission.countries && submission.countries.length > 0)) && (
                           <>
                             <span>›</span>
                             <Link
                               href={`/country/${(fromCountry || submission.countries[0]).toLowerCase().replace(/\s+/g, '-')}`}
                               className="hover:underline flex items-center gap-1"
                             >
                               <span className="text-lg">{getFlagByCountryName(fromCountry || submission.countries[0])}</span>
                               {fromCountry || submission.countries[0]}
                             </Link>
                             {fromCity && (
                               <>
                                 <span>›</span>
                                 <Link
                                   href={`/country/${(fromCountry || submission.countries[0]).toLowerCase().replace(/\s+/g, '-')}/${fromCity.toLowerCase().replace(/\s+/g, '-')}`}
                                   className="hover:underline"
                                 >
                                   {fromCity}
                                 </Link>
                               </>
                             )}
                           </>
                         )}
                         <span>›</span>
                         <span className="flex items-center gap-1">
                           {submission.brandName}
                         </span>
                       </>
                     )}
                   </div>
        </div>
      </nav>

      {/* Hero Section with Image and Logo Overlay */}
      {submission.highlightImage && (
        <div className="relative h-96">
          <img
            src={submission.highlightImage}
            alt={submission.brandName}
            className="w-full h-full object-cover"
          />
          
          {/* Logo Overlay */}
          {submission.logo && (
            <div className="absolute top-6 left-6 right-6 flex justify-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 max-w-[60%]">
                <img
                  src={submission.logo}
                  alt={`${submission.brandName} logo`}
                  className="max-w-full max-h-16 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Section with Light Grey Background */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Brand Header Section */}
            <div className="mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{submission.brandName}</h1>
                
                {/* One-line Description */}
                {submission.oneLineDescription && (
                  <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    {submission.oneLineDescription}
                  </p>
                )}

                {/* Property Count & Pricing - Standardized with property cards */}
                <div className="flex items-center justify-between mb-3 text-sm">
                  {submission.numberOfListings && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{submission.numberOfListings} properties</span>
                    </div>
                  )}
                  
                  {/* Commission Display - Above Pricing */}
                  {submission.commissionOnRevenue && (
                    <div className="flex items-center gap-1 font-medium text-green-600">
                      <span className="text-gray-500">💼</span>
                      <span>
                        {submission.commissionOnRevenue}% Commission
                      </span>
                    </div>
                  )}
                  
                  {(submission.minPrice || submission.maxPrice) && submission.currency && (
                    <div className="flex items-center gap-1 font-medium text-blue-600">
                      <span className="text-gray-500">💰</span>
                      <span>
                        {submission.minPrice && submission.maxPrice ? (
                          `from ${submission.minPrice} ${submission.currency.split(' – ')[1]} to ${submission.maxPrice} ${submission.currency.split(' – ')[1]}`
                        ) : submission.minPrice ? (
                          `from ${submission.minPrice} ${submission.currency.split(' – ')[1]}`
                        ) : (
                          `up to ${submission.maxPrice} ${submission.currency.split(' – ')[1]}`
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Property Types - Moved before Countries */}
                {submission.typesOfStays && submission.typesOfStays.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {submission.typesOfStays.map((type, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {type.trim()}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Countries - Moved after Property Types, Remove duplicates */}
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-900">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="flex items-center gap-1 flex-wrap">
                    {Array.from(new Set(submission.countries))
                      .sort((a, b) => a.localeCompare(b))
                      .map((country, index, sortedCountries) => (
                      <span key={country}>
                        {getFlagEmoji(country)} {country}
                        {index < sortedCountries.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                </div>

                {/* Cities - Show only city names, remove duplicates and filter out invalid names */}
                {submission.citiesRegions && submission.citiesRegions.length > 0 && (() => {
                  // Extract unique city names only
                  const uniqueCityNames = Array.from(new Set(
                    submission.citiesRegions.map((cityRegion: any) => {
                      if (typeof cityRegion === 'string') {
                        let cityName = '';
                        // If it's "City, Region, Country" format, extract just the city
                        if (cityRegion.includes(', ')) {
                          cityName = cityRegion.split(', ')[0].trim();
                        } else {
                          // Otherwise it's just a city name
                          cityName = cityRegion.trim();
                        }
                        
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
                      return cityRegion;
                    }).filter(Boolean)
                  ));

                  return uniqueCityNames.length > 0 && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-900">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="flex items-center gap-1 flex-wrap">
                        Cities: {uniqueCityNames.sort((a, b) => a.localeCompare(b)).join(", ")}
                      </span>
                    </div>
                  );
                })()}

                {/* Bottom Section: Social Links Left, Visit Website Right - Standardized Layout */}
                <div className="flex items-center justify-between mt-auto pt-4">
                  {/* Social Links - Left */}
                  <div className="flex items-center gap-3">
                    {submission.instagram && (
                      <a
                        href={submission.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:scale-110 transition-transform"
                        title="Instagram"
                        onClick={() => clickTracking?.trackInstagram()}
                      >
                        <SiInstagram className="w-6 h-6" />
                      </a>
                    )}
                    {submission.facebook && (
                      <a
                        href={submission.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:scale-110 transition-transform"
                        title="Facebook"
                        onClick={() => clickTracking?.trackFacebook()}
                      >
                        <SiFacebook className="w-6 h-6" />
                      </a>
                    )}
                    {submission.linkedin && (
                      <a
                        href={submission.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:scale-110 transition-transform"
                        title="LinkedIn"
                        onClick={() => clickTracking?.trackLinkedIn()}
                      >
                        <SiLinkedin className="w-6 h-6" />
                      </a>
                    )}
                    {submission.tiktok && (
                      <a
                        href={submission.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:scale-110 transition-transform"
                        title="TikTok"
                        onClick={() => clickTracking?.trackTikTok()}
                      >
                        <SiTiktok className="w-6 h-6" />
                      </a>
                    )}
                    {submission.youtubeVideoTour && (
                      <a
                        href={submission.youtubeVideoTour}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:scale-110 transition-transform"
                        title="YouTube"
                        onClick={() => clickTracking?.trackYouTube()}
                      >
                        <SiYoutube className="w-6 h-6" />
                      </a>
                    )}
                  </div>

                  {/* Visit Direct Booking Website - Right */}
                  {submission.directBookingEngineUrl && (
                    <Button 
                      asChild 
                      variant="default" 
                      size="sm"
                    >
                      <a 
                        href={submission.directBookingEngineUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                        onClick={() => clickTracking?.trackCompany()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Direct Booking Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Why Rent With - Full width at top */}
          <div className="mb-8">
            <Card className="h-full">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <CardTitle>Why Rent With {submission.brandName}?</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-gray max-w-none">
                  {submission.whyRentWithYou && submission.whyRentWithYou.trim() ? (
                    <p className="text-gray-700 whitespace-pre-line">
                      {submission.whyRentWithYou}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      No content available from "Why Rent With You" column in Airtable.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile: Single column with proper order, Desktop: Two independent columns */}
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-8 lg:items-start">
            
            {/* Left Column - Company Content (Desktop) */}
            <div className="flex flex-col gap-8 lg:flex-1">

              {/* Ideal For - Mobile: 2nd, Desktop: Left column 2nd */}
              {submission.idealFor && submission.idealFor.length > 0 && (
                <Card className="order-2 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Ideal For
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {submission.idealFor.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {item.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Properties Features - Mobile: 3rd, Desktop: Left column 3rd */}
              {submission.propertiesFeatures && submission.propertiesFeatures.length > 0 && (
                <Card className="order-3 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-blue-600" />
                      Properties Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {submission.propertiesFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          {feature.trim()}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Services & Convenience - Mobile: 4th, Desktop: Left column 4th */}
              {submission.servicesConvenience && submission.servicesConvenience.length > 0 && (
                <Card className="order-4 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-green-600" />
                      Services & Convenience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {submission.servicesConvenience.map((service, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          {service.trim()}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lifestyle & Values - Mobile: 5th, Desktop: Left column 5th */}
              {submission.lifestyleValues && submission.lifestyleValues.length > 0 && (
                <Card className="order-5 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      Lifestyle & Values
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {submission.lifestyleValues.map((value, index) => (
                        <Badge key={index} variant="secondary" className="text-sm bg-purple-50 text-purple-700">
                          {value.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Design Style - Mobile: 6th, Desktop: Left column 6th */}
              {submission.designStyle && submission.designStyle.length > 0 && (
                <Card className="order-6 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-indigo-600" />
                      Design Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {submission.designStyle.map((style, index) => (
                        <Badge key={index} variant="secondary" className="text-sm bg-indigo-50 text-indigo-700">
                          {style.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Atmospheres - Mobile: 7th, Desktop: Left column 7th */}
              {submission.atmospheres && submission.atmospheres.length > 0 && (
                <Card className="order-7 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coffee className="w-5 h-5 text-amber-600" />
                      Atmospheres
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {submission.atmospheres.map((atmosphere, index) => (
                        <Badge key={index} variant="secondary" className="text-sm bg-amber-50 text-amber-700">
                          {atmosphere.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Settings/Locations - Mobile: 8th, Desktop: Left column 8th */}
              {submission.settingsLocations && submission.settingsLocations.length > 0 && (
                <Card className="order-8 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TreePine className="w-5 h-5 text-emerald-600" />
                      Settings/Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {submission.settingsLocations.map((setting, index) => (
                        <Badge key={index} variant="secondary" className="text-sm bg-emerald-50 text-emerald-700">
                          {setting.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
            </div>

            {/* Right Column - Trust Signals & Contact (Desktop) */}
            <div className="flex flex-col gap-8 lg:flex-1">

              {/* Host's Stats - Mobile: 2nd, Desktop: Right column 1st */}
              {submission.topStats && (
                <Card className="order-2 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      📊 {submission.brandName} Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {submission.topStats}
                    </div>
                    <div className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100 italic">
                      This information was provided by the host and can be verified in{" "}
                      {submission.website ? (
                        <a 
                          href={submission.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          their own website
                        </a>
                      ) : (
                        "their own website"
                      )}.
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Guest Reviews & Ratings - Mobile: 3rd, Desktop: Right column 2nd */}
              {submission.ratingScreenshot && (
                <Card className="order-3 lg:order-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Guest Reviews & Ratings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg overflow-hidden bg-gray-50 p-4">
                      <img
                        src={submission.ratingScreenshot}
                        alt={`${submission.brandName} ratings and reviews`}
                        className="w-full h-auto object-contain mx-auto max-w-lg"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center italic">
                      Real guest ratings and reviews from booking platforms
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Get in Touch - Mobile: 9th (last), Desktop: Right column 3rd */}
              <Card className="order-9 lg:order-none">
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* PMC General Website Link */}
                  {submission.pmcGeneralWebsite && (
                    <Button asChild variant="outline" className="w-full">
                      <a 
                        href={submission.pmcGeneralWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                        onClick={() => clickTracking?.trackCompany()}
                      >
                        <Globe className="w-4 h-4" />
                        Visit Company Website
                      </a>
                    </Button>
                  )}
                  
                  {/* Direct Booking Website Link */}
                  {submission.pmcGeneralWebsite && (
                    <Button asChild className="w-full">
                      <a 
                        href={submission.pmcGeneralWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                        onClick={() => clickTracking?.trackCompany()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  
                  {socialLinks.length > 0 && (
                    <div className="flex justify-center gap-4 pt-4">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform"
                          title={social.platform}
                          onClick={() => {
                            switch (social.platform.toLowerCase()) {
                              case 'instagram':
                                clickTracking?.trackInstagram();
                                break;
                              case 'facebook':
                                clickTracking?.trackFacebook();
                                break;
                              case 'linkedin':
                                clickTracking?.trackLinkedIn();
                                break;
                              case 'tiktok':
                                clickTracking?.trackTikTok();
                                break;
                              case 'youtube':
                                clickTracking?.trackYouTube();
                                break;
                              default:
                                clickTracking?.track('website');
                            }
                          }}
                        >
                          {getSocialIcon(social.platform)}
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
} 