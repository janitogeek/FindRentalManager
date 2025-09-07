import { slugify, getFlagEmoji } from "@/lib/utils";

/**
 * This file contains fallback static data that is used when API calls fail or for development purposes.
 * In production, this data should be fetched from the API.
 */

export interface Country {
  id: number;
  name: string;
  slug: string;
  code: string;
  listingCount: number;
}

export interface Listing {
  id: number;
  name: string;
  description: string;
  website: string;
  logo: string;
  image: string;
  featured: boolean;
  countries: string[];
  whyBookWith?: string;
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface Testimonial {
  id: number;
  name: string;
  role: "host" | "guest";
  content: string;
  avatar?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "owner" | "manager";
}

export const countries: Country[] = [
  { id: 1, name: "Spain", slug: "spain", code: "ES", listingCount: 25 },
  { id: 2, name: "Italy", slug: "italy", code: "IT", listingCount: 18 },
  { id: 3, name: "France", slug: "france", code: "FR", listingCount: 32 },
  { id: 4, name: "Portugal", slug: "portugal", code: "PT", listingCount: 15 },
  { id: 5, name: "Greece", slug: "greece", code: "GR", listingCount: 22 },
  { id: 6, name: "Croatia", slug: "croatia", code: "HR", listingCount: 12 },
  { id: 7, name: "United States", slug: "united-states", code: "US", listingCount: 65 },
  { id: 8, name: "Mexico", slug: "mexico", code: "MX", listingCount: 19 },
  { id: 9, name: "Thailand", slug: "thailand", code: "TH", listingCount: 28 },
  { id: 10, name: "Indonesia", slug: "indonesia", code: "ID", listingCount: 17 },
  { id: 11, name: "Canada", slug: "canada", code: "CA", listingCount: 23 },
  { id: 12, name: "Australia", slug: "australia", code: "AU", listingCount: 14 }
];

export const listings: Listing[] = [
  {
    id: 1,
    name: "Villa Escapes",
    description: "25 luxury villas in Spain & Portugal",
    website: "https://example.com/villa-escapes",
    logo: "https://images.unsplash.com/photo-1563906267088-b029e7101114?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: true,
    countries: ["Spain", "Portugal"],
    socials: {
      facebook: "https://facebook.com/villaescapes",
      instagram: "https://instagram.com/villaescapes",
      linkedin: "https://linkedin.com/company/villaescapes"
    }
  },
  {
    id: 2,
    name: "Mediterranean Homes",
    description: "18 beachfront properties in Greece",
    website: "https://example.com/mediterranean-homes",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["Greece"],
    socials: {
      facebook: "https://facebook.com/medihomes",
      instagram: "https://instagram.com/medihomes"
    }
  },
  {
    id: 3,
    name: "Mountain Retreats",
    description: "35 cabins in the US and Canada",
    website: "https://example.com/mountain-retreats",
    logo: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["United States", "Canada"],
    socials: {
      facebook: "https://facebook.com/mountainretreats",
      instagram: "https://instagram.com/mountainretreats",
      linkedin: "https://linkedin.com/company/mountainretreats"
    }
  },
  {
    id: 4,
    name: "Tropical Hideaways",
    description: "20 villas in Bali and Thailand",
    website: "https://example.com/tropical-hideaways",
    logo: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: true,
    countries: ["Indonesia", "Thailand"],
    socials: {
      instagram: "https://instagram.com/tropicalhideaways"
    }
  },
  {
    id: 5,
    name: "City Apartments",
    description: "42 apartments in Paris and Rome",
    website: "https://example.com/city-apartments",
    logo: "https://images.unsplash.com/photo-1549517045-bc93de075e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1549517045-bc93de075e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["France", "Italy"],
    socials: {
      facebook: "https://facebook.com/cityapartments",
      linkedin: "https://linkedin.com/company/cityapartments"
    }
  },
  {
    id: 6,
    name: "Adriatic Homes",
    description: "15 coastal properties in Croatia",
    website: "https://example.com/adriatic-homes",
    logo: "https://images.unsplash.com/photo-1495756111155-45cb19b8aeee?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["Croatia"],
    socials: {
      facebook: "https://facebook.com/adriatichomes",
      instagram: "https://instagram.com/adriatichomes"
    }
  },
  {
    id: 7,
    name: "Mexican Villas",
    description: "28 beachfront villas in Mexico",
    website: "https://example.com/mexican-villas",
    logo: "https://images.unsplash.com/photo-1565373677928-80b93d5dc3a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1597365657409-3e0c5ad94910?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["Mexico"],
    socials: {
      facebook: "https://facebook.com/mexicanvillas",
      instagram: "https://instagram.com/mexicanvillas"
    }
  },
  {
    id: 8,
    name: "Tuscan Dreams",
    description: "15 countryside estates in Italy",
    website: "https://example.com/tuscan-dreams",
    logo: "https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: true,
    countries: ["Italy"],
    socials: {
      facebook: "https://facebook.com/tuscandreams",
      instagram: "https://instagram.com/tuscandreams",
      linkedin: "https://linkedin.com/company/tuscandreams"
    }
  },
  {
    id: 9,
    name: "Australian Beach Houses",
    description: "22 oceanfront properties in Australia",
    website: "https://example.com/australian-beach-houses",
    logo: "https://images.unsplash.com/photo-1516419591857-14c5e4c3de3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["Australia"],
    socials: {
      instagram: "https://instagram.com/ausbeachhouses",
      facebook: "https://facebook.com/ausbeachhouses"
    }
  },
  {
    id: 10,
    name: "Alpine Chalets",
    description: "30 ski-in ski-out chalets in France",
    website: "https://example.com/alpine-chalets",
    logo: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1452784444945-3f422708fe5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["France"],
    socials: {
      facebook: "https://facebook.com/alpinechalets",
      instagram: "https://instagram.com/alpinechalets",
      linkedin: "https://linkedin.com/company/alpinechalets"
    }
  },
  {
    id: 11,
    name: "Thai Island Retreats",
    description: "18 island properties in Thailand",
    website: "https://example.com/thai-island-retreats",
    logo: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["Thailand"],
    socials: {
      instagram: "https://instagram.com/thaiislandretreats"
    }
  },
  {
    id: 12,
    name: "Costa Brava Villas",
    description: "15 beachfront villas in Spain",
    website: "https://example.com/costa-brava-villas",
    logo: "https://images.unsplash.com/photo-1601144531169-d65b87c10c24?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    featured: false,
    countries: ["Spain"],
    socials: {
      facebook: "https://facebook.com/costabrava",
      instagram: "https://instagram.com/costabrava"
    }
  }
];

// FAQ dataset for FindRentalManager.com
// Optimized for SEO + LLM/geo discovery
// Categories: owner (property owners) / manager (property managers)

export const faqs: FAQ[] = [
  // ======================
  // PROPERTY OWNERS
  // ======================
  {
    id: "o-what-is-frm",
    category: "owner",
    question: "What is FindRentalManager.com and how does it work?",
    answer:
      "FindRentalManager.com is a free directory that helps property owners connect directly with verified short-term rental property management companies. Simply choose your location, browse trusted managers, and contact them directly to compare services and pricing.",
  },
  {
    id: "o-why-use",
    category: "owner",
    question: "Why should I use a property manager instead of managing my rental myself?",
    answer:
      "Professional property managers save you time, increase bookings, and optimize your revenue. They handle marketing, guest communication, cleaning, maintenance, and compliance with local regulations. Many owners find the net income is higher and the experience stress-free compared to self-managing.",
  },
  {
    id: "o-geo-coverage",
    category: "owner",
    question: "In which cities and countries can I find property managers?",
    answer:
      "Our directory covers major short-term rental markets worldwide, including the USA, Canada, France, Spain, Italy, Portugal, Greece, the UK, Mexico, and more. Within each country, you can browse popular destinations such as New York, Miami, Los Angeles, Barcelona, Paris, Rome, and Lisbon.",
  },
  {
    id: "o-compare",
    category: "owner",
    question: "How do I compare different property managers in my area?",
    answer:
      "Each manager profile shows their portfolio size, services offered, coverage areas, and website. You can compare commission rates, experience, guest ratings, and service perks like 24/7 support or revenue optimization. Always contact at least 2–3 companies before making a decision.",
  },
  {
    id: "o-fees",
    category: "owner",
    question: "How much do property management companies usually charge?",
    answer:
      "Fees vary by location and service level. Most managers charge 15–30% commission on bookings. Some offer fixed-fee packages or tiered services. It's best to ask each company about their pricing model and what's included (marketing, guest communication, cleaning, etc.).",
  },
  {
    id: "o-services",
    category: "owner",
    question: "What services do property managers typically provide?",
    answer:
      "Common services include listing creation, dynamic pricing, channel management (Airbnb, Booking.com, Vrbo), direct booking website support, guest communication, cleaning and maintenance coordination, check-ins/outs, and handling of local regulations and taxes.",
  },
  {
    id: "o-direct-bookings",
    category: "owner",
    question: "Can property managers help me get more direct bookings?",
    answer:
      "Yes. Many managers create and promote direct booking websites in addition to OTA distribution. This helps reduce reliance on Airbnb or Booking.com, saves on commissions, and builds repeat guest relationships.",
  },
  {
    id: "o-legal",
    category: "owner",
    question: "Do I need special permits or licenses to rent my property?",
    answer:
      "Rules vary by city and country. In many places you need a rental license, business registration, and compliance with safety or tax regulations. Property managers can guide you through local requirements and ensure compliance.",
  },
  {
    id: "o-trust",
    category: "owner",
    question: "How do I know if a property manager is trustworthy?",
    answer:
      "Check their profile on FindRentalManager.com, review their website, ask for references, and look at guest reviews on platforms like Airbnb, Booking.com, or Google. You can also request performance data or case studies before signing a contract.",
  },
  {
    id: "o-contact",
    category: "owner",
    question: "What if I have more questions about choosing a property manager?",
    answer:
      "You can reach us at findmyrentalmanager@gmail.com and we'll guide you on how to evaluate managers in your area. We recommend shortlisting a few, asking for proposals, and comparing side by side.",
  },

  // ======================
  // PROPERTY MANAGERS
  // ======================
  {
    id: "m-how-to-list",
    category: "manager",
    question: "How do I list my property management company on FindRentalManager.com?",
    answer:
      "Click 'Submit' on the website and fill in your company details, coverage areas, website, and brand assets. After review, your company profile will go live so property owners can discover and contact you.",
  },
  {
    id: "m-requirements",
    category: "manager",
    question: "What are the requirements to be listed?",
    answer:
      "You must operate a professional rental management company with a public website, clear contact details, and verifiable presence. We prioritize companies with proven experience, transparent policies, and good reputations.",
  },
  {
    id: "m-pricing",
    category: "manager",
    question: "How much does it cost to be listed?",
    answer:
      "Basic listings are free. Premium plans (from €100/year) provide enhanced visibility, featured placement, and marketing opportunities. Pricing is per company, not per property.",
  },
  {
    id: "m-benefits",
    category: "manager",
    question: "What are the benefits of being listed on FindRentalManager.com?",
    answer:
      "You gain qualified leads from property owners actively seeking management, improved visibility in your GEO markets, and SEO benefits from a trusted directory citation. Premium plans also include editorial features and lead generation boosts.",
  },
  {
    id: "m-geo",
    category: "manager",
    question: "How should I present my GEO coverage?",
    answer:
      "List countries → regions → cities clearly (e.g., Spain: Barcelona, Madrid; USA: Miami, Los Angeles). Include niche markets (e.g., Algarve, Amalfi Coast, Lake Tahoe) to match how owners search. Accurate coverage helps owners find you faster.",
  },
  {
    id: "m-featured",
    category: "manager",
    question: "What extra visibility comes with a Featured listing?",
    answer:
      "Featured listings appear at the top of search results, receive a 'Verified Manager' badge, and are eligible for editorial showcases like 'Top Property Managers in Spain'. They also benefit from social media mentions and inclusion in newsletters.",
  },
  {
    id: "m-updates",
    category: "manager",
    question: "How do I update my listing once it's live?",
    answer:
      "Contact findmyrentalmanager@gmail.com with your company name and the changes (logo, images, services, coverage areas, or website link). Updates are typically made within a few days.",
  },
  {
    id: "m-seo",
    category: "manager",
    question: "Do I get SEO benefits from a listing?",
    answer:
      "Yes. Directory citations improve search engine visibility and help large language models recognize your company as a trusted rental manager entity. This supports both organic SEO and AI search discovery.",
  },
  {
    id: "m-support",
    category: "manager",
    question: "Who do I contact for partnership or support questions?",
    answer:
      "Email findmyrentalmanager@gmail.com with your company name and query. For collaborations or media features, add 'Partnership' in the subject line.",
  },
  {
    id: "m-trust",
    category: "manager",
    question: "How can I build trust with property owners?",
    answer:
      "Provide clear contracts, transparent fees, verified business info, and references. Showcase reviews, case studies, and success metrics. Owners prefer managers who are responsive, reliable, and transparent.",
  },
] as const;

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "guest",
    content: "I saved over $300 on my family vacation by booking directly with the villa owner through BookDirectStays. The process was simple and I got personal service that wouldn't have been possible through a big booking site.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "host",
    content: "Since joining BookDirectStays, I've increased my direct bookings by 40%. I'm paying less in commissions and building better relationships with my guests. It's a win-win.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "guest",
    content: "I was hesitant about booking directly, but BookDirectStays made it so easy! I found an amazing apartment in Paris and the owner gave me local tips that made our trip special.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 4,
    name: "James Wilson",
    role: "host",
    content: "The featured listing option has been great for my business. My properties are getting more visibility and I've noticed an increase in high-quality bookings from guests who appreciate direct communication.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "guest",
    content: "We booked a villa in Greece directly with the owner and got a 10% discount for a two-week stay. The booking process was straightforward and secure. Highly recommend!",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 6,
    name: "Carlos Mendez",
    role: "host",
    content: "As a property manager with 15 properties, BookDirectStays has helped me reduce my dependency on OTAs. The platform is user-friendly and the support team is responsive to my needs.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 7,
    name: "Leslie Voué",
    role: "guest",
    content: "I have been using Zenica Conciergerie services for several months to manage my seasonal rentals, and I am delighted. Professionalism, responsiveness and attention to detail are always there. The accommodations are impeccable, travelers are well welcomed, and I can delegate with complete confidence. Thank you to the whole team for your seriousness and your kindness.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    company: "Zenica Conciergerie",
    date: "2025-05-27",
    rating: 5
  }
];

// Helper functions to work with the static data

export function getListings(countrySlug?: string, limit: number = 6, offset: number = 0): { listings: Listing[], total: number, hasMore: boolean } {
  let filteredListings = [...listings];

  // Filter by country if provided
  if (countrySlug) {
    const countryName = countries.find(c => c.slug === countrySlug)?.name;
    if (countryName) {
      filteredListings = filteredListings.filter(listing => 
        listing.countries.includes(countryName)
      );
    }
  }

  // Sort by featured first
  filteredListings.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const total = filteredListings.length;
  const paginatedListings = filteredListings.slice(offset, offset + limit);
  const hasMore = offset + paginatedListings.length < total;

  return { 
    listings: paginatedListings,
    total,
    hasMore
  };
}

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find(country => country.slug === slug);
}

export function getTotalListingsCount(): number {
  return listings.length;
}

export function getFAQsByCategory(category?: "traveler" | "host"): FAQ[] {
  if (!category) return faqs.sort((a, b) => a.order - b.order);
  return faqs
    .filter(faq => faq.category === category)
    .sort((a, b) => a.order - b.order);
}

export function getTestimonialsByRole(role?: "host" | "guest"): Testimonial[] {
  if (!role) return testimonials;
  return testimonials.filter(testimonial => testimonial.role === role);
}
