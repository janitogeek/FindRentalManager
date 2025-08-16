import { ExternalLink, MapPin, Building2 } from "lucide-react";
import { SiInstagram, SiFacebook, SiLinkedin, SiTiktok, SiYoutube } from "react-icons/si";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Submission } from "@/lib/airtable";
import { generateSlug, extractCityName } from "@/lib/utils";
import { useClickTracking } from "@/lib/click-tracking";
import { cardHoverVariants, buttonVariants, itemVariants } from "@/lib/animations";
import TopStats from "@/components/top-stats";

interface SubmissionPropertyCardProps {
  submission: Submission;
  fromCity?: string;
  fromCountry?: string;
}

export default function SubmissionPropertyCard({ submission, fromCity, fromCountry }: SubmissionPropertyCardProps) {
  // Use unique slug if available, otherwise generate one
  const slug = (submission as any).uniqueSlug || generateSlug(submission.brandName);
  
  // Build URL with unique slug to ensure each company has its own page
  const buildPropertyUrl = () => {
    // Always use the unique slug to ensure unique routing
    let url = `/property/${slug}`;
    if (fromCity && fromCountry) {
      // Use the actual city and country names (not slugs) in URL parameters
      url += `?city=${encodeURIComponent(fromCity)}&country=${encodeURIComponent(fromCountry)}`;
    }
    return url;
  };
  
  // Extract just city names for display (keeping full data in backend)
  const displayCities = submission.citiesRegions?.map((city: any) => {
    if (typeof city === 'string') {
      return extractCityName(city);
    }
    return city;
  }) || [];

  // Initialize click tracking for this submission
  const {
    trackWebsite,
    trackInstagram,
    trackFacebook,
    trackLinkedIn,
    trackYouTube,
    trackTikTok,
    trackCompany,
    track
  } = useClickTracking(submission.id);

  const getFlagEmoji = (countryName: string) => {
    const countryMap: { [key: string]: string } = {
      // Major countries with common variations
      'United States': '🇺🇸',
      'USA': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'UK': '🇬🇧',
      
      // Africa
      'Angola': '🇦🇴',
      'Burkina Faso': '🇧🇫',
      'Burundi': '🇧🇮',
      'Benin': '🇧🇯',
      'Botswana': '🇧🇼',
      'Central African Republic': '🇨🇫',
      'Congo': '🇨🇬',
      'Ivory Coast': '🇨🇮',
      'Cameroon': '🇨🇲',
      'Cape Verde': '🇨🇻',
      'Djibouti': '🇩🇯',
      'Algeria': '🇩🇿',
      'Egypt': '🇪🇬',
      'Western Sahara': '🇪🇭',
      'Eritrea': '🇪🇷',
      'Ethiopia': '🇪🇹',
      'Gabon': '🇬🇦',
      'Ghana': '🇬🇭',
      'Gambia': '🇬🇲',
      'Guinea': '🇬🇳',
      'Equatorial Guinea': '🇬🇶',
      'Guinea-Bissau': '🇬🇼',
      'Kenya': '🇰🇪',
      'Comoros': '🇰🇲',
      'Liberia': '🇱🇷',
      'Lesotho': '🇱🇸',
      'Libya': '🇱🇾',
      'Morocco': '🇲🇦',
      'Madagascar': '🇲🇬',
      'Mali': '🇲🇱',
      'Mauritania': '🇲🇷',
      'Mauritius': '🇲🇺',
      'Malawi': '🇲🇼',
      'Mozambique': '🇲🇿',
      'Namibia': '🇳🇦',
      'Niger': '🇳🇪',
      'Nigeria': '🇳🇬',
      'Rwanda': '🇷🇼',
      'Seychelles': '🇸🇨',
      'Sudan': '🇸🇩',
      'Sierra Leone': '🇸🇱',
      'Senegal': '🇸🇳',
      'Somalia': '🇸🇴',
      'South Sudan': '🇸🇸',
      'Eswatini': '🇸🇿',
      'Chad': '🇹🇩',
      'Togo': '🇹🇬',
      'Tunisia': '🇹🇳',
      'Tanzania': '🇹🇿',
      'Uganda': '🇺🇬',
      'South Africa': '🇿🇦',
      'Zambia': '🇿🇲',
      'Zimbabwe': '🇿🇼',
      
      // Americas
      'Antigua and Barbuda': '🇦🇬',
      'Anguilla': '🇦🇮',
      'Argentina': '🇦🇷',
      'Aruba': '🇦🇼',
      'Barbados': '🇧🇧',
      'Saint Barthelemy': '🇧🇱',
      'Bermuda': '🇧🇲',
      'Bolivia': '🇧🇴',
      'Brazil': '🇧🇷',
      'Bahamas': '🇧🇸',
      'Belize': '🇧🇿',
      'Canada': '🇨🇦',
      'Chile': '🇨🇱',
      'Colombia': '🇨🇴',
      'Costa Rica': '🇨🇷',
      'Cuba': '🇨🇺',
      'Curacao': '🇨🇼',
      'Dominica': '🇩🇲',
      'Dominican Republic': '🇩🇴',
      'Ecuador': '🇪🇨',
      'Falkland Islands': '🇫🇰',
      'Grenada': '🇬🇩',
      'French Guiana': '🇬🇫',
      'Guadeloupe': '🇬🇵',
      'Guatemala': '🇬🇹',
      'Guyana': '🇬🇾',
      'Honduras': '🇭🇳',
      'Haiti': '🇭🇹',
      'Jamaica': '🇯🇲',
      'Saint Kitts and Nevis': '🇰🇳',
      'Cayman Islands': '🇰🇾',
      'Saint Lucia': '🇱🇨',
      'Saint Martin': '🇲🇫',
      'Martinique': '🇲🇶',
      'Montserrat': '🇲🇸',
      'Mexico': '🇲🇽',
      'Nicaragua': '🇳🇮',
      'Panama': '🇵🇦',
      'Peru': '🇵🇪',
      'Saint Pierre and Miquelon': '🇵🇲',
      'Puerto Rico': '🇵🇷',
      'Paraguay': '🇵🇾',
      'Suriname': '🇸🇷',
      'El Salvador': '🇸🇻',
      'Sint Maarten': '🇸🇽',
      'Turks and Caicos Islands': '🇹🇨',
      'Trinidad and Tobago': '🇹🇹',
      'Uruguay': '🇺🇾',
      'Venezuela': '🇻🇪',
      'British Virgin Islands': '🇻🇬',
      'US Virgin Islands': '🇻🇮',
      
      // Asia
      'United Arab Emirates': '🇦🇪',
      'Afghanistan': '🇦🇫',
      'Azerbaijan': '🇦🇿',
      'Bangladesh': '🇧🇩',
      'Bahrain': '🇧🇭',
      'Brunei': '🇧🇳',
      'Bhutan': '🇧🇹',
      'China': '🇨🇳',
      'Hong Kong': '🇭🇰',
      'Indonesia': '🇮🇩',
      'Israel': '🇮🇱',
      'India': '🇮🇳',
      'Iraq': '🇮🇶',
      'Iran': '🇮🇷',
      'Jordan': '🇯🇴',
      'Japan': '🇯🇵',
      'Kyrgyzstan': '🇰🇬',
      'Cambodia': '🇰🇭',
      'North Korea': '🇰🇵',
      'South Korea': '🇰🇷',
      'Kuwait': '🇰🇼',
      'Kazakhstan': '🇰🇿',
      'Laos': '🇱🇦',
      'Lebanon': '🇱🇧',
      'Sri Lanka': '🇱🇰',
      'Myanmar': '🇲🇲',
      'Mongolia': '🇲🇳',
      'Macau': '🇲🇴',
      'Maldives': '🇲🇻',
      'Malaysia': '🇲🇾',
      'Nepal': '🇳🇵',
      'Oman': '🇴🇲',
      'Philippines': '🇵🇭',
      'Pakistan': '🇵🇰',
      'Palestine': '🇵🇸',
      'Qatar': '🇶🇦',
      'Russia': '🇷🇺',
      'Saudi Arabia': '🇸🇦',
      'Singapore': '🇸🇬',
      'Syria': '🇸🇾',
      'Thailand': '🇹🇭',
      'Tajikistan': '🇹🇯',
      'Timor-Leste': '🇹🇱',
      'Turkmenistan': '🇹🇲',
      'Turkey': '🇹🇷',
      'Taiwan': '🇹🇼',
      'Uzbekistan': '🇺🇿',
      'Vietnam': '🇻🇳',
      'Yemen': '🇾🇪',
      
      // Europe
      'Andorra': '🇦🇩',
      'Albania': '🇦🇱',
      'Armenia': '🇦🇲',
      'Austria': '🇦🇹',
      'Bosnia and Herzegovina': '🇧🇦',
      'Belgium': '🇧🇪',
      'Bulgaria': '🇧🇬',
      'Belarus': '🇧🇾',
      'Switzerland': '🇨🇭',
      'Czech Republic': '🇨🇿',
      'Cyprus': '🇨🇾',
      'Germany': '🇩🇪',
      'Denmark': '🇩🇰',
      'Spain': '🇪🇸',
      'Estonia': '🇪🇪',
      'Finland': '🇫🇮',
      'France': '🇫🇷',
      'Georgia': '🇬🇪',
      'Guernsey': '🇬🇬',
      'Gibraltar': '🇬🇮',
      'Greece': '🇬🇷',
      'Croatia': '🇭🇷',
      'Hungary': '🇭🇺',
      'Ireland': '🇮🇪',
      'Isle of Man': '🇮🇲',
      'Iceland': '🇮🇸',
      'Italy': '🇮🇹',
      'Jersey': '🇯🇪',
      'Liechtenstein': '🇱🇮',
      'Lithuania': '🇱🇹',
      'Luxembourg': '🇱🇺',
      'Latvia': '🇱🇻',
      'Monaco': '🇲🇨',
      'Moldova': '🇲🇩',
      'Montenegro': '🇲🇪',
      'North Macedonia': '🇲🇰',
      'Malta': '🇲🇹',
      'Netherlands': '🇳🇱',
      'Norway': '🇳🇴',
      'Poland': '🇵🇱',
      'Portugal': '🇵🇹',
      'Romania': '🇷🇴',
      'Serbia': '🇷🇸',
      'Sweden': '🇸🇪',
      'Ukraine': '🇺🇦',
      'Vatican City': '🇻🇦',
      'Kosovo': '🇽🇰',
      'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
      
      // Oceania and Territories
      'Ascension Island': '🇦🇨',
      'Antarctica': '🇦🇶',
      'American Samoa': '🇦🇸',
      'Australia': '🇦🇺',
      'Christmas Island': '🇦🇽',
      'Bouvet Island': '🇧🇻',
      'Cocos Islands': '🇨🇨',
      'Cook Islands': '🇨🇰',
      'Clipperton Island': '🇨🇵',
      'Easter Island': '🇨🇽',
      'Fiji': '🇫🇯',
      'Micronesia': '🇫🇲',
      'Greenland': '🇬🇱',
      'South Georgia': '🇬🇸',
      'Guam': '🇬🇺',
      'Heard and McDonald Islands': '🇭🇲',
      'Canary Islands': '🇮🇨',
      'British Indian Ocean Territory': '🇮🇴',
      'Kiribati': '🇰🇮',
      'Marshall Islands': '🇲🇭',
      'Northern Mariana Islands': '🇲🇵',
      'New Caledonia': '🇳🇨',
      'Norfolk Island': '🇳🇫',
      'Nauru': '🇳🇷',
      'Niue': '🇳🇺',
      'New Zealand': '🇳🇿',
      'French Polynesia': '🇵🇫',
      'Papua New Guinea': '🇵🇬',
      'Pitcairn Islands': '🇵🇳',
      'Palau': '🇵🇼',
      'Reunion': '🇷🇪',
      'Solomon Islands': '🇸🇧',
      'Saint Helena': '🇸🇭',
      'Svalbard': '🇸🇯',
      'Sao Tome and Principe': '🇸🇹',
      'French Southern Territories': '🇹🇫',
      'Tokelau': '🇹🇰',
      'Tonga': '🇹🇴',
      'Tuvalu': '🇹🇻',
      'United States Minor Outlying Islands': '🇺🇲',
      'Vanuatu': '🇻🇨',
      'Wallis and Futuna': '🇼🇫',
      'Samoa': '🇼🇸',
      'Mayotte': '🇾🇹'
    };
    return countryMap[countryName] || '🌍';
  };

  // Check if it's a premium listing
  const isPremium = submission.plan?.includes('Premium Listing') || submission.plan?.includes('€499.99');

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        className="h-full"
      >
        <Card className="group border border-gray-200 bg-white relative h-full overflow-hidden">
      {/* Featured Badge */}
      {isPremium && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-yellow-500 text-yellow-900 font-semibold">
            Featured
          </Badge>
        </div>
      )}

      <CardContent className="p-6 flex flex-col h-full">
        {/* Header Image with Logo Overlay */}
        {submission.highlightImage && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <img
              src={submission.highlightImage}
              alt={submission.brandName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            
            {/* Logo Overlay */}
            {submission.logo && (
              <div className="absolute top-3 left-3 right-3 flex justify-center">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-[80%]">
                  <img
                    src={submission.logo}
                    alt={`${submission.brandName} logo`}
                    className="max-w-full max-h-12 object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Brand Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">
            {submission.brandName}
          </h3>
          
          {/* One-line Description */}
          <div className="min-h-[3rem]">
            {submission.oneLineDescription && (
              <p className="text-sm italic text-gray-600 leading-relaxed line-clamp-2">
                {submission.oneLineDescription}
              </p>
            )}
          </div>
        </div>

        {/* Property Count & Commission Display */}
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
        </div>

        {/* Pricing Display */}
        {(submission.minPrice || submission.maxPrice) && submission.currency && (
          <div className="flex items-center justify-end mb-3 text-sm">
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
          </div>
        )}

        {/* Types of Stays - Horizontal carousel when many, wrap when few */}
        {submission.typesOfStays && submission.typesOfStays.length > 0 && (
          <div className="mb-4 min-h-[2.5rem]">
            {submission.typesOfStays.length > 4 ? (
              // Carousel for many types (>4)
              <div className="relative">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {[...submission.typesOfStays].sort().map((type, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs whitespace-nowrap flex-shrink-0"
                    >
                      {type.trim()}
                    </Badge>
                  ))}
                </div>
                {/* Fade effect on right edge to indicate scrollability */}
                <div className="absolute top-0 right-0 w-6 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>
            ) : (
              // Regular flex wrap for few types (≤4)
              <div className="flex flex-wrap gap-2">
                {[...submission.typesOfStays].sort().map((type, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {type.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Spacer for cards without Types of Stays to maintain alignment */}
        {(!submission.typesOfStays || submission.typesOfStays.length === 0) && (
          <div className="mb-4 min-h-[2.5rem]"></div>
        )}

        {/* Countries - Moved after Types of Stays, Remove duplicates */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-900 min-h-[1.5rem]">
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

        {/* Cities removed from cards - keeping only countries like featured hosts */}

        {/* Top Stats Component */}
        {submission.topStats && (
          <div className="mb-4 min-h-[3rem]">
            <TopStats 
              topStats={submission.topStats} 
              brandName={submission.brandName}
              pmcGeneralWebsite={submission.pmcGeneralWebsite}
            />
          </div>
        )}

        {/* Spacer for cards without Top Stats to maintain alignment */}
        {!submission.topStats && (
          <div className="mb-4 min-h-[3rem]"></div>
        )}

        {/* Why Rent With CTA */}
        <div className="mb-6">
          <Button 
            asChild 
            variant="outline" 
            size="sm"
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700 hover:text-gray-800"
          >
            <Link 
              href={buildPropertyUrl()}
              onClick={trackCompany}
            >
              Why rent with {submission.brandName}?
            </Link>
          </Button>
        </div>

        {/* Bottom Section: Social Links Left, Visit Website Right */}
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
                onClick={trackInstagram}
              >
                <SiInstagram className="w-5 h-5" />
              </a>
            )}
            {submission.facebook && (
              <a
                href={submission.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:scale-110 transition-transform"
                title="Facebook"
                onClick={trackFacebook}
              >
                <SiFacebook className="w-5 h-5" />
              </a>
            )}
            {submission.linkedin && (
              <a
                href={submission.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:scale-110 transition-transform"
                title="LinkedIn"
                onClick={trackLinkedIn}
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
            )}
            {submission.tiktok && (
              <a
                href={submission.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:scale-110 transition-transform"
                title="TikTok"
                onClick={trackTikTok}
              >
                <SiTiktok className="w-5 h-5" />
              </a>
            )}
            {submission.youtubeVideoTour && (
              <a
                href={submission.youtubeVideoTour}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:scale-110 transition-transform"
                title="YouTube"
                onClick={trackYouTube}
              >
                <SiYoutube className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Visit Website - Right */}
          {submission.pmcGeneralWebsite && (
            <Button 
              asChild 
              variant="default" 
              size="sm"
            >
              <a 
                href={submission.pmcGeneralWebsite} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
                onClick={trackWebsite}
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </a>
            </Button>
          )}
        </div>
      </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 