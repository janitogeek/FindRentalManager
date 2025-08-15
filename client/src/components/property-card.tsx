import { ExternalLink, MapPin, Building2 } from "lucide-react";
import { SiInstagram, SiFacebook, SiLinkedin, SiTiktok, SiYoutube } from "react-icons/si";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Listing } from "@/lib/data";
import { generateSlug, extractCityName } from "@/lib/utils";
import { getFlagByCountryName } from "@/lib/utils";

interface PropertyCardProps {
  property: Listing;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Use unique slug if available, otherwise generate one
  const slug = (property as any).uniqueSlug || generateSlug(property.name);
  
  // Extract just city names for display (keeping full data in backend)
  const displayCities = (property as any).citiesRegions?.map((city: any) => {
    if (typeof city === 'string') {
      return extractCityName(city);
    }
    return city;
  }) || [];

  const getFlagEmoji = (countryCode: string) => {
    // Use the comprehensive flag mapping from utils
    return getFlagByCountryName(countryCode);
  };

  // Generate structured data for each property
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": property.name,
    "description": property.description,
    "url": property.website,
    "image": property.image,
    "logo": property.logo,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": property.countries
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31",
      "description": "Direct booking available - no OTA fees"
    },
    "provider": {
      "@type": "Organization",
      "name": property.name,
      "url": property.website,
      "sameAs": [
        property.socials.facebook,
        property.socials.instagram,
        property.socials.linkedin
      ].filter(Boolean)
    },
    "potentialAction": {
      "@type": "ReserveAction",
      "target": property.website,
      "result": {
        "@type": "Reservation",
        "name": `Book ${property.name} directly`
      }
    }
  };

  return (
    <>
      {/* Structured Data for AI/LLM Understanding */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <Card className="group hover:shadow-lg transition-shadow duration-200 border border-gray-200 bg-white relative h-full">
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-yellow-500 text-yellow-900 font-semibold">
              Featured
            </Badge>
          </div>
        )}

        <CardContent className="p-6 flex flex-col h-full">
          {/* Header Image with Logo Overlay */}
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <img 
              src={property.image} 
              alt={`${property.name} - Direct booking vacation rental`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            
            {/* Logo Overlay */}
            {property.logo && (
              <div className="absolute top-3 left-3 right-3 flex justify-center">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-[80%]">
                  <img
                    src={property.logo}
                    alt={`${property.name} logo`}
                    className="max-w-full max-h-12 object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Brand Header */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">
              {property.name}
            </h3>
            
            {/* Description */}
            <div className="min-h-[3rem]">
              <p className="text-sm italic text-gray-600 leading-relaxed line-clamp-2">
                {property.description}
              </p>
            </div>
          </div>

          {/* Property Count & Pricing - Placeholder since data structure doesn't have these */}
          <div className="flex items-center justify-between mb-3 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Building2 className="w-4 h-4" />
              <span>Properties available</span>
            </div>
            
            <div className="flex items-center gap-1 font-medium text-blue-600">
              <span className="text-gray-500">💰</span>
              <span>Contact for pricing</span>
            </div>
          </div>

          {/* Types of Stays - Placeholder since data structure doesn't have these */}
          <div className="mb-4 min-h-[2.5rem]">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Vacation Rental
              </Badge>
            </div>
          </div>

          {/* Countries */}
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-900 min-h-[1.5rem]">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="flex items-center gap-1 flex-wrap">
              {property.countries.map((country, index) => (
                <span key={country}>
                  {getFlagEmoji(country.substring(0, 2))} {country}
                  {index < property.countries.length - 1 && ", "}
                </span>
              ))}
            </span>
          </div>

          {/* Cities removed from cards - keeping only countries like featured hosts */}

          {/* Top Stats - Placeholder since data structure doesn't have these */}
          <div className="mb-4 min-h-[3rem]">
            <div className="text-sm text-gray-500 italic">
              Stats available on company page
            </div>
          </div>

          {/* Why Rent With CTA */}
          <div className="mb-6">
            <Button 
              asChild 
              variant="outline" 
              size="sm"
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700 hover:text-gray-800"
            >
              <Link to={`/property/${slug}`}>
                Why rent with {property.name}?
              </Link>
            </Button>
          </div>

          {/* Bottom Section: Social Links Left, Visit Website Right */}
          <div className="flex items-center justify-between mt-auto pt-4">
            {/* Social Links - Left */}
            <div className="flex items-center gap-3">
              {property.socials.instagram && (
                <a
                  href={property.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:scale-110 transition-transform"
                  title="Instagram"
                >
                  <SiInstagram className="w-5 h-5" />
                </a>
              )}
              {property.socials.facebook && (
                <a
                  href={property.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:scale-110 transition-transform"
                  title="Facebook"
                >
                  <SiFacebook className="w-5 h-5" />
                </a>
              )}
              {property.socials.linkedin && (
                <a
                  href={property.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:scale-110 transition-transform"
                  title="LinkedIn"
                >
                  <SiLinkedin className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Visit Website - Right */}
            {property.website && (
              <Button 
                asChild 
                variant="default" 
                size="sm"
              >
                <a 
                  href={property.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Website
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
