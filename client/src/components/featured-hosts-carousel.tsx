import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Link } from "wouter";
import { ExternalLink, MapPin, Building2 } from "lucide-react";
import { SiInstagram, SiFacebook, SiLinkedin, SiTiktok, SiYoutube } from "react-icons/si";
import { airtableService, Submission } from "@/lib/airtable";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { generateSlug } from "@/lib/utils";
import TopStats from "@/components/top-stats";
import { useClickTracking } from "@/lib/click-tracking";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function FeaturedHostsCarousel() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const swiperRef = useRef<any>(null);

  // Expose navigation methods for parent component
  const goToNext = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goToPrevious = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  // Expose methods globally for parent component access
  useEffect(() => {
    (window as any).featuredHostsCarousel = {
      goToNext,
      goToPrevious
    };
    
    return () => {
      delete (window as any).featuredHostsCarousel;
    };
  }, []);

  // Fetch all approved submissions with unique slugs and filter for featured ones
  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ["/api/featured-submissions"],
    queryFn: async () => {
      const { getAllSubmissionsWithSlugs } = await import('@/lib/slug-email-mapping');
      return getAllSubmissionsWithSlugs();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle popover open/close for carousel pause/resume
  const handlePopoverChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (swiperRef.current?.swiper) {
      if (open) {
        swiperRef.current.swiper.autoplay.stop();
      } else {
        swiperRef.current.swiper.autoplay.start();
      }
    }
  };

  // Get flag emoji for country name
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
      'United Kingdom': '🇬🇧',
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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Our Featured Property Management Companies
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <CardContent className="text-center">
                <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !submissions) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Our Featured Property Management Companies
        </h2>
        <p className="text-gray-600">Unable to load featured hosts at this time.</p>
      </div>
    );
  }

    // Filter for featured hosts (Premium plans that are approved/published)
  // Shows ALL featured companies with consistent card heights, sorted by newest first
  const featuredHosts = submissions?.filter(submission => {
    const isPremium = submission.plan?.includes('Premium') || 
                     submission.plan?.includes('€499.99') || 
                     submission.plan?.includes('499.99');
    const isApproved = submission.status === 'Approved – Published';
    
    return isPremium && isApproved;
  }).sort((a, b) => {
    // Sort by submission date, newest first
    const dateA = new Date(a.submissionDate || '1970-01-01');
    const dateB = new Date(b.submissionDate || '1970-01-01');
    return dateB.getTime() - dateA.getTime();
  }) || [];

  if (featuredHosts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Our Featured Property Management Companies
        </h2>
        <p className="text-gray-600">No featured hosts available at this time.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Our Featured Property Management Companies
        </h2>
        <p className="text-xl text-gray-600">
          Trusted rental management brands chosen by thousands of property owners
        </p>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8">
        <Swiper
          ref={swiperRef}
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={false}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="featured-hosts-swiper h-[600px] [&_.swiper-pagination]:relative [&_.swiper-pagination]:mt-8 [&_.swiper-pagination-bullet]:bg-gray-300 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:bg-blue-600"
        >
        {featuredHosts.map((host) => {
          const clickTracking = useClickTracking(host.id);
          
          return (
          <SwiperSlide key={host.id}>
            <Card className="group hover:shadow-lg transition-shadow duration-200 border border-gray-200 bg-white relative h-full">
              {/* Featured Badge */}
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-yellow-500 text-yellow-900 font-semibold">
                  Featured
                </Badge>
              </div>

              <CardContent className="p-6 flex flex-col h-full">
                {/* Header Image with Logo Overlay */}
                {host.highlightImage && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={host.highlightImage}
                      alt={host.brandName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    
                    {/* Logo Overlay */}
                    {host.logo && (
                      <div className="absolute top-3 left-3 right-3 flex justify-center">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-[80%]">
                          <img
                            src={host.logo}
                            alt={`${host.brandName} logo`}
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
                    {host.brandName}
                  </h3>
                  
                  {/* One-line Description */}
                  <div className="min-h-[3rem]">
                    {host.oneLineDescription && (
                      <p className="text-sm italic text-gray-600 leading-relaxed line-clamp-2">
                        {host.oneLineDescription}
                      </p>
                    )}
                  </div>
                </div>

                {/* Property Count & Pricing */}
                <div className="flex items-center justify-between mb-3 text-sm">
                  {host.numberOfListings && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{host.numberOfListings} properties</span>
                    </div>
                  )}
                  
                  {(host.minPrice || host.maxPrice) && host.currency && (
                    <div className="flex items-center gap-1 font-medium text-blue-600">
                      <span className="text-gray-500">💰</span>
                      <span>
                        {host.minPrice && host.maxPrice ? (
                          `from ${host.minPrice} ${host.currency.split(' – ')[1]} to ${host.maxPrice} ${host.currency.split(' – ')[1]}`
                        ) : host.minPrice ? (
                          `from ${host.minPrice} ${host.currency.split(' – ')[1]}`
                        ) : (
                          `up to ${host.maxPrice} ${host.currency.split(' – ')[1]}`
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Types of Stays - Horizontal carousel when many, wrap when few */}
                {host.typesOfStays && host.typesOfStays.length > 0 && (
                  <div className="mb-4 min-h-[2.5rem]">
                    {host.typesOfStays.length > 4 ? (
                      // Carousel for many types (>4)
                      <div className="relative">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                          {[...host.typesOfStays].sort().map((type, index) => (
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
                        {[...host.typesOfStays].sort().map((type, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {type.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Spacer for cards without Types of Stays to maintain alignment */}
                {(!host.typesOfStays || host.typesOfStays.length === 0) && (
                  <div className="mb-4 min-h-[2.5rem]"></div>
                )}

                {/* Countries - Moved after Types of Stays */}
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-900 min-h-[1.5rem]">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="flex items-center gap-1 flex-wrap">
                    {host.countries
                      .sort((a, b) => a.localeCompare(b))
                      .map((country, index, sortedCountries) => (
                      <span key={country}>
                        {getFlagEmoji(country)} {country}
                        {index < sortedCountries.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                </div>

                {/* Top Stats Component */}
                {host.topStats && (
                  <div className="mb-4 min-h-[3rem]">
                    <TopStats 
                      topStats={host.topStats} 
                      brandName={host.brandName}
                      hostWebsite={host.website}
                      onOpenChange={handlePopoverChange}
                    />
                  </div>
                )}

                {/* Spacer for cards without Top Stats to maintain alignment */}
                {!host.topStats && (
                  <div className="mb-4 min-h-[3rem]"></div>
                )}

                {/* Why Book With CTA */}
                <div className="mb-6">
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700 hover:text-gray-800"
                  >
                    <Link 
                      to={`/property/${host.uniqueSlug || generateSlug(host.brandName)}?from=featured`}
                      onClick={clickTracking.trackCompany}
                    >
                      Why book with {host.brandName}?
                    </Link>
                  </Button>
                </div>

                {/* Bottom Section: Social Links Left, Book Direct Right */}
                <div className="flex items-center justify-between mt-auto pt-4">
                  {/* Social Links - Left */}
                  <div className="flex items-center gap-3">
                    {host.instagram && (
                      <a
                        href={host.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:scale-110 transition-transform"
                        title="Instagram"
                        onClick={clickTracking.trackInstagram}
                      >
                        <SiInstagram className="w-5 h-5" />
                      </a>
                    )}
                    {host.facebook && (
                      <a
                        href={host.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:scale-110 transition-transform"
                        title="Facebook"
                        onClick={clickTracking.trackFacebook}
                      >
                        <SiFacebook className="w-5 h-5" />
                      </a>
                    )}
                    {host.linkedin && (
                      <a
                        href={host.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:scale-110 transition-transform"
                        title="LinkedIn"
                        onClick={clickTracking.trackLinkedIn}
                      >
                        <SiLinkedin className="w-5 h-5" />
                      </a>
                    )}
                    {host.tiktok && (
                      <a
                        href={host.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:scale-110 transition-transform"
                        title="TikTok"
                        onClick={clickTracking.trackTikTok}
                      >
                        <SiTiktok className="w-5 h-5" />
                      </a>
                    )}
                    {host.youtubeVideoTour && (
                      <a
                        href={host.youtubeVideoTour}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:scale-110 transition-transform"
                        title="YouTube"
                        onClick={clickTracking.trackYouTube}
                      >
                        <SiYoutube className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  {/* Book Direct - Right */}
                  {host.website && (
                    <Button 
                      asChild 
                      variant="default" 
                      size="sm"
                    >
                      <a 
                        href={host.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                        onClick={clickTracking.trackWebsite}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Book Direct
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
          );
        })}
      </Swiper>
      </div>
    </div>
  );
} 