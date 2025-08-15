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
import SubmissionPropertyCard from "@/components/submission-property-card";

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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Our Featured Property Management Companies
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <div className="text-red-600 mb-4">Error loading featured companies</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Filter for featured/premium submissions
  const featuredSubmissions = submissions?.filter((submission: Submission) => {
    return submission.plan?.includes('Premium') || submission.plan?.includes('€499.99');
  }) || [];

  if (featuredSubmissions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <div className="text-gray-600 mb-4">No featured companies available yet</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Our Featured Property Management Companies
        </h2>
      </div>

      <div className="relative">
        <Swiper
          ref={swiperRef}
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }}
          loop={featuredSubmissions.length > 3}
          className="featured-hosts-swiper"
        >
          {featuredSubmissions.map((host: Submission) => {
          return (
          <SwiperSlide key={host.id}>
                <SubmissionPropertyCard 
                  submission={host}
                  fromCountry="Featured"
                />
          </SwiperSlide>
          );
        })}
      </Swiper>
      </div>
    </div>
  );
} 