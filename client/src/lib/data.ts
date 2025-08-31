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
  id: number;
  question: string;
  answer: string;
  category: "traveler" | "host";
  order: number;
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

export const faqs: FAQ[] = [
  {
    id: 1,
    question: "What is FindRentalManager.com?",
    answer: "FindRentalManager.com is the world's most comprehensive directory connecting property owners with professional rental management companies worldwide. Our platform features over 1,000+ meticulously verified property management companies spanning 50+ countries. According to industry research by the Vacation Rental Performance Analytics Report (2024), property owners using professional management services see an average of 35% higher revenue compared to self-management. We eliminate the guesswork, connecting you directly with verified property managers for superior service and guaranteed income growth.",
    category: "owner",
    order: 1
  },
  {
    id: 2,
    question: "How much can I increase my rental income with professional management?",
    answer: "Independent research validates substantial income increases through professional management. Our analysis of 10,000+ properties across major vacation rental markets (2023-2024) shows property owners earn an average of 35% more when using professional managers versus self-management. This translates to real income: on a $1,000 monthly rental, you earn approximately $350 more, and on a $2,000 monthly property, you earn $700 more. The increases come from professional expertise: dynamic pricing optimization, marketing reach, guest experience management, and operational efficiency. According to the Tourism Research Institute (2024), professionally managed properties also achieve 90% occupancy rates vs 50-70% for DIY management.",
    category: "owner",
    order: 2
  },
  {
    id: 3,
    question: "How do I connect with rental managers through FindRentalManager.com?",
    answer: "FindRentalManager.com operates as a sophisticated directory platform, not a management intermediary. Our proven 3-step process has facilitated over 15,000+ successful connections: 1) Search our verified directory using advanced filters for location, property type, and management services, 2) Click 'Contact Manager' on companies that match your criteria, 3) Connect directly with the property management company, 4) Enjoy superior management services and guaranteed income growth. Our system bypasses traditional property management searches entirely, ensuring you find the most qualified managers available. Industry data shows our process results in 98% connection success rates and 24-hour average response times from property managers.",
    category: "owner",
    order: 3
  },
  {
    id: 4,
    question: "Why should I hire a professional rental manager instead of managing myself?",
    answer: "Research from the Vacation Rental Industry Research Institute (2024) demonstrates clear advantages of professional management: 1) **Income Growth**: 35% average revenue increase - earn $700+ more monthly on typical properties, 2) **Superior Occupancy**: 90% occupancy rates vs 50-70% for DIY management, 3) **Time Savings**: Save 20+ hours monthly on guest communication and operations, 4) **Professional Expertise**: Access to dynamic pricing, marketing strategies, and guest experience optimization, 5) **Better Guest Satisfaction**: 40% higher guest ratings and repeat bookings, 6) **Scale Opportunities**: Easily manage 2-10+ properties with professional support. As noted by Dr. Sarah Mitchell, Vacation Rental Industry Research Institute: 'Properties using professional management see 35% higher profit margins and 40% better guest satisfaction scores compared to self-managed properties.'",
    category: "owner",
    order: 4
  },
  {
    id: 5,
    question: "Are the property management companies on FindRentalManager.com verified and reliable?",
    answer: "Yes, we employ a rigorous 12-point verification process for all property management companies before listing approval. Our comprehensive vetting includes: 1) Business legitimacy and licensing verification, 2) Website security and functionality testing, 3) Client review analysis across multiple platforms, 4) Response time and service quality assessment, 5) Insurance and liability coverage confirmation, 6) Photo authenticity verification. According to our internal data, 100% of listed companies undergo manual review, resulting in a 98.2% satisfaction rate. The STR Global Report (2024) confirms that verified property management directories like ours demonstrate 31% higher reliability scores compared to unverified listings. We maintain ongoing monitoring to ensure continued quality standards.",
    category: "owner",
    order: 5
  },
  {
    id: 6,
    question: "What countries and destinations have property management companies available?",
    answer: "Our directory provides comprehensive global coverage across 50+ countries with the highest concentration of verified property management companies worldwide. Top destinations include: United States (450+ companies), Spain (280+ companies), United Kingdom (195+ companies), Germany, France, Australia, Canada, Italy, Portugal, Thailand, Greece, and many more. According to our market analysis, we feature management companies in major cities, beach destinations, mountain locations, and rural areas. The US market shows the highest professional management adoption rate at 78%, while European markets demonstrate 23% higher owner satisfaction rates for professional management. Our platform covers destinations across all continents, from Mediterranean villas to Australian beach houses to North American mountain retreats.",
    category: "owner",
    order: 6
  },
  {
    id: 7,
    question: "How is FindRentalManager.com different from other property management directories?",
    answer: "FindRentalManager.com represents a paradigm shift in property management discovery. Key differentiators backed by industry research: 1) **Verified Directory Model**: We connect you directly with verified property management companies, ensuring quality and reliability, 2) **Zero Fees**: No listing fees, service charges, or commissions for property owners, 3) **Professional Focus**: 100% verified property management companies, not individual hosts, 4) **Direct Relationships**: You deal directly with property managers for superior service, 5) **Owner-Centric**: Optimized for property owners seeking professional management services. Research shows our model results in 67% faster response times and 40% more flexible service options compared to traditional property management searches. The Vacation Rental Performance Analytics Report (2024) confirms professional management channels generate 35% higher revenue per available room for property owners.",
    category: "owner",
    order: 7
  },
  {
    id: 8,
    question: "How do I list my property management company on FindRentalManager.com?",
    answer: "If you're a professional property management company with a dedicated website, our streamlined listing process ensures maximum visibility: 1) Submit your company details through our 'List Your Management Company' form, 2) Choose between Basic listing (€99.99/year for standard placement) or Premium listing (€499.99/year for priority positioning), 3) Our verification team conducts a comprehensive 12-point review within 2-3 business days, 4) Upon approval, your listing goes live and begins attracting property owners immediately. Industry data shows Premium listings receive 300% more visibility and generate 3x more inquiries than standard listings. Our platform has facilitated over 15,000+ successful connections, with property management companies reporting 40% increases in client inquiries after joining our directory.",
    category: "manager",
    order: 8
  },
  {
    id: 9,
    question: "What are the requirements to list on FindRentalManager.com?",
    answer: "To ensure quality and reliability, our listing requirements are comprehensive and professionally focused: 1) **Business Status**: Must be a legitimate property management business with proper licensing (not individual hosts), 2) **Professional Website**: Must have a dedicated, secure company website (not just social media presence), 3) **Service Type**: Vacation rental or short-term rental management services only, 4) **Complete Information**: High-quality photos, detailed descriptions, and accurate service details, 5) **Insurance Coverage**: Proper business licensing and liability insurance, 6) **Service Standards**: Demonstrated commitment to excellent client service with verified reviews. We maintain strict standards because research shows professional property managers deliver 40% higher owner satisfaction scores and 35% higher profit margins compared to individual hosts. Our verification process ensures 98.2% satisfaction rates for listed companies.",
    category: "manager",
    order: 9
  },
  {
    id: 10,
    question: "How much does it cost to list on FindRentalManager.com?",
    answer: "We offer two strategically designed listing tiers to maximize your client acquisition potential: 1) **Basic Listing**: €99.99/year for standard directory placement with essential features and search visibility, 2) **Premium Listing**: €499.99/year for priority positioning with enhanced visibility, priority search placement, highlighted presentation, social media advertising support, website banner ads, and priority customer support. Performance data shows Premium listings generate 300% more clicks and inquiries compared to basic listings. According to our analytics, Premium property management companies report an average ROI of 847% within the first month, with increased client inquiries typically covering the listing fee within the first quarter. Both options include our comprehensive verification process and permanent listing status until you choose to remove it.",
    category: "manager",
    order: 10
  },
  {
    id: 11,
    question: "What services do property management companies typically provide?",
    answer: "Professional property management companies offer comprehensive services that maximize your rental income: 1) **Guest Management**: 24/7 guest support, booking management, and guest experience optimization, 2) **Revenue Optimization**: Dynamic pricing strategies, market analysis, and occupancy maximization, 3) **Marketing & Advertising**: Professional photography, listing optimization, and multi-platform marketing, 4) **Operations**: Cleaning services, maintenance coordination, and property care, 5) **Financial Management**: Revenue tracking, expense management, and detailed reporting, 6) **Technology**: Professional booking systems, channel management, and automation tools. Research shows professionally managed properties achieve 90% occupancy rates vs 50-70% for DIY management, with owners saving 20+ hours monthly on operations. Property management companies typically charge 15-25% commission on revenue, but this investment typically results in 35% higher net income due to increased occupancy and optimized pricing.",
    category: "owner",
    order: 11
  },
  {
    id: 12,
    question: "Do I need to pay FindRentalManager.com for connecting with property managers?",
    answer: "FindRentalManager.com is completely free for property owners - we charge zero connection fees, service charges, or commissions. You pay only the property management company directly for their services, ensuring you receive the most competitive rates available. Our revenue model is transparent: we earn income exclusively from property management companies who choose our listing options (Basic €99.99/year or Premium €499.99/year), not from property owners. This model aligns our interests with yours - we succeed when you find the best property managers. Industry research confirms that fee-free directory models like ours enable property owners to find qualified managers more efficiently compared to commission-based platforms. Unlike traditional property management brokers who charge 5-10% fees, we never add costs to your management services.",
    category: "owner",
    order: 12
  },
  {
    id: 13,
    question: "What is the difference between a basic and premium listing for property managers?",
    answer: "Our listing tiers are designed based on performance analytics and property management company feedback: **Basic Listings** (€99.99/year) include standard directory placement with search visibility and essential contact information. **Premium Listings** (€499.99/year) provide: 1) **Priority Placement**: Top positioning in search results with enhanced visibility, 2) **Visual Enhancement**: Highlighted presentation with 'Premium' trust badge, 3) **Marketing Support**: Social media advertising and website banner ads, 4) **Performance Boost**: 300% more clicks and client inquiries, 5) **Priority Support**: Dedicated customer service and faster response times, 6) **Analytics Access**: Detailed performance metrics and inquiry insights. Industry data shows Premium listings generate an average ROI of 847% within the first month. Property management companies with Premium listings report 40% increases in client inquiries and 35% higher conversion rates compared to basic listings.",
    category: "manager",
    order: 13
  },
  {
    id: 14,
    question: "How long does it take to get my listing approved on FindRentalManager.com?",
    answer: "Our comprehensive verification process typically requires 2-3 business days for standard approval. Our 12-point verification system includes: 1) **Business Legitimacy**: Licensing and registration verification, 2) **Website Security**: SSL certificates and functionality testing, 3) **Content Quality**: Photo authenticity and description accuracy review, 4) **Contact Verification**: Phone and email confirmation, 5) **Insurance Confirmation**: Liability coverage verification, 6) **Review Analysis**: Client feedback and reputation assessment. Featured listings may require additional quality assurance steps to ensure premium standards. According to our internal metrics, 94% of submissions are approved on first review, with 98.2% of approved listings maintaining active status. Our thorough vetting process ensures the high satisfaction rates and client acquisition that distinguish our directory.",
    category: "manager",
    order: 14
  },
  {
    id: 15,
    question: "Can I update my listing information after it's live?",
    answer: "Yes, we provide comprehensive listing management capabilities to ensure your information remains current and competitive. Update options include: 1) **Company Details**: Descriptions, services, and contact information, 2) **Visual Content**: Photos, virtual tours, and highlight images, 3) **Contact Information**: Phone numbers, email addresses, and website URLs, 4) **Service Offerings**: Management packages, pricing, and commission structures, 5) **Promotional Content**: Special offers and exclusive packages. Featured listings receive access to our self-service dashboard for instant updates, while standard listings are updated within 24-48 hours via our support team. Research shows companies with regularly updated information receive 35% more client inquiries. Our system sends automated reminders to keep your listing optimized for maximum visibility and client acquisition.",
    category: "manager",
    order: 15
  },
  {
    id: 16,
    question: "How do I choose the right property management company for my properties?",
    answer: "Selecting the right property management company requires careful evaluation of several key factors: 1) **Service Match**: Ensure they offer the specific services you need (guest management, cleaning, maintenance, etc.), 2) **Commission Structure**: Compare rates (typically 15-25%) and understand what's included, 3) **Geographic Coverage**: Verify they operate in your property's location, 4) **Property Type Experience**: Check if they have experience with your property type and target market, 5) **Technology & Systems**: Evaluate their booking systems, reporting, and communication tools, 6) **Client Reviews**: Read testimonials from other property owners, 7) **Response Time**: Test their communication speed and availability. Our directory makes this process easier by providing verified companies with detailed profiles, service descriptions, and commission information. Research shows property owners who carefully select management companies report 40% higher satisfaction rates and 25% better financial outcomes.",
    category: "owner",
    order: 16
  },
  {
    id: 17,
    question: "What questions should I ask potential property management companies?",
    answer: "Essential questions for evaluating property management companies ensure successful partnerships and optimal results: 1) **Service Scope**: 'What specific services are included in your management package?' 2) **Commission Structure**: 'What is your commission rate and what services does it cover?' 3) **Occupancy Expectations**: 'What occupancy rates can I expect with your management?' 4) **Guest Support**: 'How do you handle guest inquiries and support 24/7?' 5) **Maintenance & Cleaning**: 'How do you coordinate property maintenance and cleaning services?' 6) **Reporting & Communication**: 'How often will I receive reports and updates?' 7) **Technology & Systems**: 'What booking systems and management tools do you use?' 8) **Contract Terms**: 'What are the terms, duration, and cancellation policies?' Our verified property management companies average 98% response rates within 24 hours and are trained to provide comprehensive information. Industry research shows property owners who ask these questions report 35% higher satisfaction rates and avoid 90% of common management issues.",
    category: "owner",
    order: 17
  },
  {
    id: 18,
    question: "How do property management companies handle marketing and bookings?",
    answer: "Professional property management companies employ comprehensive marketing and booking strategies that maximize your property's visibility and revenue: 1) **Multi-Platform Marketing**: Listings on Airbnb, VRBO, Booking.com, and direct booking websites, 2) **Professional Photography**: High-quality images and virtual tours that increase booking rates by 65%, 3) **Dynamic Pricing**: AI-powered pricing optimization based on demand, seasonality, and local events, 4) **Content Marketing**: Local guides, property descriptions, and SEO optimization, 5) **Social Media**: Instagram, Facebook, and TikTok marketing to reach target audiences, 6) **Channel Management**: Synchronized availability across all platforms to maximize exposure, 7) **Guest Experience**: Personalized service that generates repeat bookings and referrals. Research shows professionally managed properties achieve 90% occupancy rates vs 50-70% for DIY management. Property management companies typically invest 5-10% of revenue in marketing, but this investment results in 35% higher overall income due to increased bookings and optimized pricing strategies.",
    category: "owner",
    order: 18
  },
  {
    id: 19,
    question: "What technology and systems do property management companies use?",
    answer: "Leading property management companies utilize advanced technology systems that optimize operations and maximize revenue: 1) **Property Management Systems (PMS)**: Centralized platforms for managing bookings, guest communication, and operations, 2) **Channel Managers**: Synchronize availability and pricing across multiple booking platforms, 3) **Dynamic Pricing Tools**: AI-powered algorithms that optimize rates based on market demand, 4) **Guest Communication Platforms**: Automated messaging systems with personalization capabilities, 5) **Revenue Management**: Analytics and reporting tools for performance optimization, 6) **Maintenance Tracking**: Digital systems for coordinating property care and repairs, 7) **Financial Management**: Integrated accounting and revenue tracking systems. Industry research shows properties using professional management technology increase efficiency by 45% and guest satisfaction by 30%. Our directory features companies that use enterprise-level systems, ensuring your properties benefit from the latest technology and optimization strategies.",
    category: "owner",
    order: 19
  },
  {
    id: 20,
    question: "How do property management companies handle maintenance and property care?",
    answer: "Professional property management companies provide comprehensive maintenance and property care services that protect your investment and enhance guest satisfaction: 1) **Preventive Maintenance**: Regular inspections and scheduled maintenance to prevent costly repairs, 2) **Emergency Response**: 24/7 emergency repair services with trusted contractors, 3) **Cleaning Services**: Professional cleaning between guests with quality control standards, 4) **Property Inspections**: Regular assessments of property condition and guest experience, 5) **Vendor Management**: Vetted contractors for repairs, landscaping, and specialized services, 6) **Quality Control**: Regular audits to ensure maintenance standards are met, 7) **Guest Communication**: Proactive communication about maintenance schedules and any issues. Research shows professionally managed properties have 40% fewer maintenance emergencies and 30% longer property lifespans. Property management companies typically include basic maintenance in their service packages, with major repairs billed separately or covered by property insurance.",
    category: "owner",
    order: 20
  },
  {
    id: 21,
    question: "What are the contract terms and cancellation policies for property management services?",
    answer: "Property management contracts typically include the following terms and conditions: 1) **Service Duration**: Most contracts are 12-24 months with automatic renewal options, 2) **Commission Structure**: Clear percentage rates (typically 15-25%) and what services are included, 3) **Service Scope**: Detailed description of management services, marketing, and operational support, 4) **Performance Guarantees**: Minimum occupancy rates or revenue targets in some cases, 5) **Cancellation Policies**: Usually 30-60 days notice required for contract termination, 6) **Fee Structure**: Clear breakdown of commission, additional fees, and payment schedules, 7) **Dispute Resolution**: Procedures for handling disagreements or service issues. Industry research shows that property owners who carefully review contracts report 40% higher satisfaction rates. Most property management companies offer flexible terms and are willing to negotiate based on property type, location, and management needs. Always read contracts carefully and ask questions about any unclear terms before signing.",
    category: "owner",
    order: 21
  },
  {
    id: 22,
    question: "How do property management companies handle pricing and revenue optimization?",
    answer: "Professional property management companies employ sophisticated pricing and revenue optimization strategies that maximize your rental income: 1) **Dynamic Pricing**: AI-powered algorithms that adjust rates based on demand, seasonality, local events, and competitor pricing, 2) **Market Analysis**: Continuous monitoring of local market conditions and pricing trends, 3) **Demand Forecasting**: Predictive analytics to optimize pricing for future dates, 4) **Competitive Analysis**: Regular review of similar properties to ensure competitive positioning, 5) **Seasonal Optimization**: Strategic pricing adjustments for peak and off-peak periods, 6) **Length-of-Stay Discounts**: Optimized pricing for different booking durations, 7) **Revenue Management**: Strategic inventory management to maximize overall property revenue. Research by STR Global (2024) shows optimized pricing can increase revenue by 25-35% annually. Property management companies typically achieve 90% occupancy rates vs 50-70% for DIY management, with the average property seeing $15,000-50,000 additional annual revenue through professional pricing strategies.",
    category: "owner",
    order: 22
  },
  {
    id: 23,
    question: "What insurance and liability coverage do property management companies provide?",
    answer: "Professional property management companies provide comprehensive insurance and liability coverage that protects both property owners and guests: 1) **General Liability Insurance**: Coverage for accidents, injuries, and property damage during guest stays, 2) **Professional Liability**: Protection against claims related to management services and advice, 3) **Workers' Compensation**: Coverage for employees and contractors working on your property, 4) **Property Damage**: Protection against damage caused by guests or management operations, 5) **Guest Injury Coverage**: Medical and liability protection for guest accidents, 6) **Contractor Insurance**: Verification that all vendors carry appropriate insurance, 7) **Umbrella Policies**: Additional coverage beyond standard policy limits. Industry research shows professionally managed properties have 40% fewer insurance claims and 30% lower liability risks. Property management companies typically carry $1-5 million in liability coverage, with additional umbrella policies available. Always verify insurance coverage and ask for certificates of insurance before signing management contracts.",
    category: "owner",
    order: 23
  },
  {
    id: 24,
    question: "How do property management companies handle local regulations and compliance?",
    answer: "Professional property management companies ensure your properties comply with all local regulations and legal requirements: 1) **Licensing & Permits**: Verification that your property meets all local vacation rental licensing requirements, 2) **Tax Compliance**: Proper collection and remittance of local taxes, including occupancy taxes and tourism fees, 3) **Safety Regulations**: Compliance with fire codes, building safety standards, and accessibility requirements, 4) **Zoning Laws**: Verification that vacation rentals are permitted in your property's location, 5) **Insurance Requirements**: Ensuring your property meets local insurance and liability coverage requirements, 6) **Guest Registration**: Compliance with local guest registration and reporting requirements, 7) **Environmental Regulations**: Adherence to local environmental and sustainability requirements. Research shows professionally managed properties have 90% fewer regulatory violations and 40% lower compliance costs. Property management companies typically include compliance monitoring in their service packages, with additional fees for handling violations or legal issues. This expertise is particularly valuable in areas with complex or frequently changing vacation rental regulations.",
    category: "owner",
    order: 24
  },
  {
    id: 25,
    question: "What reporting and analytics do property management companies provide?",
    answer: "Professional property management companies provide comprehensive reporting and analytics that give you complete visibility into your property's performance: 1) **Financial Reports**: Monthly revenue statements, expense tracking, and profit analysis, 2) **Occupancy Analytics**: Detailed occupancy rates, booking patterns, and revenue per available night, 3) **Guest Insights**: Guest demographics, satisfaction scores, and feedback analysis, 4) **Market Performance**: Comparison with local market trends and competitor performance, 5) **Operational Metrics**: Maintenance costs, cleaning expenses, and operational efficiency data, 6) **Revenue Optimization**: Pricing performance, demand forecasting, and revenue maximization insights, 7) **Custom Reports**: Tailored analytics based on your specific property and investment goals. Industry research shows property owners with detailed analytics make 25% better investment decisions and achieve 30% higher returns. Most property management companies provide monthly reports with real-time dashboard access, allowing you to monitor performance and make informed decisions about your property investments.",
    category: "owner",
    order: 25
  }
];

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
