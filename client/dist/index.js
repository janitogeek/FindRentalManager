var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// ../server/index.ts
import express2 from "express";

// ../server/routes.ts
import { createServer } from "http";

// ../server/storage.ts
var MemStorage = class {
  users;
  countries;
  listings;
  subscriptions;
  submissions;
  faqs;
  testimonials;
  userId;
  countryId;
  listingId;
  subscriptionId;
  submissionId;
  faqId;
  testimonialId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.countries = /* @__PURE__ */ new Map();
    this.listings = /* @__PURE__ */ new Map();
    this.subscriptions = /* @__PURE__ */ new Map();
    this.submissions = /* @__PURE__ */ new Map();
    this.faqs = /* @__PURE__ */ new Map();
    this.testimonials = /* @__PURE__ */ new Map();
    this.userId = 1;
    this.countryId = 1;
    this.listingId = 1;
    this.subscriptionId = 1;
    this.submissionId = 1;
    this.faqId = 1;
    this.testimonialId = 1;
    this.initSampleData();
  }
  // User methods (inherited from template)
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Country methods
  async getCountries() {
    return Array.from(this.countries.values());
  }
  async getCountryBySlug(slug) {
    return Array.from(this.countries.values()).find(
      (country) => country.slug === slug
    );
  }
  async createCountry(insertCountry) {
    const id = this.countryId++;
    const country = { ...insertCountry, id };
    this.countries.set(id, country);
    return country;
  }
  // Listing methods
  async getListings(countrySlugs, limit = 6, offset = 0) {
    let listings2 = Array.from(this.listings.values());
    if (countrySlugs) {
      const slugsArray = Array.isArray(countrySlugs) ? countrySlugs : [countrySlugs];
      if (slugsArray.length > 0) {
        const countryPromises = slugsArray.map((slug) => this.getCountryBySlug(slug));
        const countries2 = await Promise.all(countryPromises);
        const countryNames = countries2.filter((c) => c !== void 0).map((c) => c.name);
        if (countryNames.length > 0) {
          listings2 = listings2.filter(
            (listing) => listing.countries.some((country) => countryNames.includes(country))
          );
        }
      }
    }
    listings2.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
    return listings2.slice(offset, offset + limit);
  }
  async getListingsCount(countrySlugs) {
    let listings2 = Array.from(this.listings.values());
    if (countrySlugs) {
      const slugsArray = Array.isArray(countrySlugs) ? countrySlugs : [countrySlugs];
      if (slugsArray.length > 0) {
        const countryPromises = slugsArray.map((slug) => this.getCountryBySlug(slug));
        const countries2 = await Promise.all(countryPromises);
        const countryNames = countries2.filter((c) => c !== void 0).map((c) => c.name);
        if (countryNames.length > 0) {
          listings2 = listings2.filter(
            (listing) => listing.countries.some((country) => countryNames.includes(country))
          );
        }
      }
    }
    return listings2.length;
  }
  async createListing(insertListing) {
    const id = this.listingId++;
    const listing = { ...insertListing, id };
    this.listings.set(id, listing);
    return listing;
  }
  // Subscription methods
  async createSubscription(insertSubscription) {
    const id = this.subscriptionId++;
    const subscription = { ...insertSubscription, id };
    this.subscriptions.set(id, subscription);
    return subscription;
  }
  // Submission methods
  async createSubmission(insertSubmission) {
    const id = this.submissionId++;
    const submission = { ...insertSubmission, id };
    this.submissions.set(id, submission);
    return submission;
  }
  async getSubmissions() {
    return Array.from(this.submissions.values());
  }
  async updateSubmissionStatus(id, status) {
    const submission = this.submissions.get(id);
    if (submission) {
      const updatedSubmission = { ...submission, status };
      this.submissions.set(id, updatedSubmission);
      return updatedSubmission;
    }
    return void 0;
  }
  // FAQ methods
  async getFAQs() {
    const faqs2 = Array.from(this.faqs.values());
    return faqs2.sort((a, b) => a.order - b.order);
  }
  async createFAQ(insertFaq) {
    const id = this.faqId++;
    const faq = { ...insertFaq, id };
    this.faqs.set(id, faq);
    return faq;
  }
  // Testimonial methods
  async getTestimonials() {
    return Array.from(this.testimonials.values());
  }
  async createTestimonial(insertTestimonial) {
    const id = this.testimonialId++;
    const testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  // Initialize with sample data
  initSampleData() {
    const countryData = [
      { name: "Spain", slug: "spain", code: "ES", listingCount: 25 },
      { name: "Italy", slug: "italy", code: "IT", listingCount: 18 },
      { name: "France", slug: "france", code: "FR", listingCount: 32 },
      { name: "Portugal", slug: "portugal", code: "PT", listingCount: 15 },
      { name: "Greece", slug: "greece", code: "GR", listingCount: 22 },
      { name: "Croatia", slug: "croatia", code: "HR", listingCount: 12 },
      { name: "United States", slug: "united-states", code: "US", listingCount: 65 },
      { name: "Mexico", slug: "mexico", code: "MX", listingCount: 19 },
      { name: "Thailand", slug: "thailand", code: "TH", listingCount: 28 },
      { name: "Indonesia", slug: "indonesia", code: "ID", listingCount: 17 },
      { name: "Canada", slug: "canada", code: "CA", listingCount: 23 },
      { name: "Australia", slug: "australia", code: "AU", listingCount: 14 }
    ];
    countryData.forEach((country) => {
      this.createCountry(country);
    });
    const listingData = [
      {
        name: "Villa Escapes",
        description: "25 luxury villas in Spain & Portugal",
        website: "https://example.com/villa-escapes",
        logo: "https://images.unsplash.com/photo-1563906267088-b029e7101114?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        featured: true,
        countries: ["Spain", "Portugal"],
        whyBookWith: "Whether you're dreaming of a romantic weekend by the sea, a family escape to the countryside, or a remote work getaway with a view, Villa Escapes has the perfect place for you. Our handpicked collection of holiday homes across Spain and Portugal blends comfort, character, and convenience\u2014so you can relax, explore, and enjoy every moment of your stay.\n\nFrom pet-friendly cottages and luxury apartments to hidden gems and unique stays, every property is carefully maintained and fully equipped for a stress-free, self-catering break. Enjoy crisp linens, fast Wi-Fi, thoughtful touches, and exceptional customer support available 24/7.\n\nPlus, with our commitment to sustainability and local partnerships, booking with Villa Escapes means supporting greener travel and vibrant communities.\n\nYour next unforgettable stay starts here\u2014discover the Villa Escapes difference.",
        socials: {
          facebook: "https://facebook.com/villaescapes",
          instagram: "https://instagram.com/villaescapes",
          linkedin: "https://linkedin.com/company/villaescapes"
        }
      },
      {
        name: "Mediterranean Homes",
        description: "18 beachfront properties in Greece",
        website: "https://example.com/mediterranean-homes",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
        image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        featured: false,
        countries: ["Greece"],
        whyBookWith: "Experience the authentic beauty of Greece with Mediterranean Homes. Our stunning beachfront properties combine traditional Greek architecture with modern amenities to create the perfect vacation experience.\n\nAll our properties offer panoramic sea views, private pools, and are just steps from pristine beaches and charming villages. Our local staff provides personalized service, from arranging boat trips to recommending hidden tavernas only the locals know about.\n\nWith Mediterranean Homes, you'll enjoy more space, better value, and greater privacy than a hotel could ever offer. Our properties are perfect for families, groups of friends, or couples seeking a romantic getaway.\n\nBook directly with us and save on fees while enjoying tailored service that puts your needs first.",
        socials: {
          facebook: "https://facebook.com/medihomes",
          instagram: "https://instagram.com/medihomes"
        }
      },
      {
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
    listingData.forEach((listing) => {
      this.createListing(listing);
    });
    const faqData = [
      {
        question: "What is BookDirectStays.com?",
        answer: "BookDirectStays.com is a global directory that connects travelers directly with short-term rental property managers, allowing you to book directly and avoid online travel agency (OTA) fees.",
        category: "traveler",
        order: 1
      },
      {
        question: "How do I book a property?",
        answer: "Once you find a property you're interested in, click on the 'Visit Booking Site' button. This will take you directly to the property manager's own booking site where you can check availability and make your reservation.",
        category: "traveler",
        order: 2
      },
      {
        question: "Why should I book direct instead of through an OTA?",
        answer: "Booking directly with property managers typically saves you money (no service fees), gives you access to special offers not available on OTAs, and creates a direct relationship with your host for better service.",
        category: "traveler",
        order: 3
      },
      {
        question: "Are these properties verified?",
        answer: "Yes, we verify all property managers before listing them in our directory to ensure they are legitimate businesses. However, we recommend you still exercise normal caution and read reviews before booking.",
        category: "traveler",
        order: 4
      },
      {
        question: "How do I list my property on BookDirectStays.com?",
        answer: "If you're a property manager, you can add your direct booking site by clicking on 'Add Your Direct Booking Site' and filling out our submission form. We offer both free and featured (paid) listings.",
        category: "host",
        order: 5
      },
      {
        question: "What is the difference between a free and featured listing?",
        answer: "Free listings include your basic information in our directory. Featured listings receive priority placement in search results, enhanced visual presentation, and are marked as 'Featured' to attract more attention from travelers.",
        category: "host",
        order: 6
      },
      {
        question: "How long does it take to get my listing approved?",
        answer: "We typically review and approve listings within 2-3 business days. For featured listings, we may request additional information to ensure quality standards.",
        category: "host",
        order: 7
      },
      {
        question: "Can I update my listing information?",
        answer: "Yes, you can update your listing at any time by contacting our support team with your changes. Featured listings have access to a self-service dashboard for instant updates.",
        category: "host",
        order: 8
      }
    ];
    faqData.forEach((faq) => {
      this.createFAQ(faq);
    });
    const testimonialData = [
      {
        name: "Sarah Johnson",
        role: "guest",
        content: "I saved over $300 on my family vacation by booking directly with the villa owner through BookDirectStays. The process was simple and I got personal service that wouldn't have been possible through a big booking site.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "Michael Rodriguez",
        role: "host",
        content: "Since joining BookDirectStays, I've increased my direct bookings by 40%. I'm paying less in commissions and building better relationships with my guests. It's a win-win.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "Emma Davis",
        role: "guest",
        content: "I was hesitant about booking directly, but BookDirectStays made it so easy! I found an amazing apartment in Paris and the owner gave me local tips that made our trip special.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "James Wilson",
        role: "host",
        content: "The featured listing option has been great for my business. My properties are getting more visibility and I've noticed an increase in high-quality bookings from guests who appreciate direct communication.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "Lisa Thompson",
        role: "guest",
        content: "We booked a villa in Greece directly with the owner and got a 10% discount for a two-week stay. The booking process was straightforward and secure. Highly recommend!",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "Carlos Mendez",
        role: "host",
        content: "As a property manager with 15 properties, BookDirectStays has helped me reduce my dependency on OTAs. The platform is user-friendly and the support team is responsive to my needs.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
      }
    ];
    testimonialData.forEach((testimonial) => {
      this.createTestimonial(testimonial);
    });
  }
};
var storage = new MemStorage();

// ../shared/schema.ts
import { pgTable, text, serial, integer, boolean, varchar, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  code: varchar("code", { length: 2 }).notNull(),
  listingCount: integer("listing_count").notNull().default(0)
});
var insertCountrySchema = createInsertSchema(countries).omit({
  id: true
});
var cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  countryId: integer("country_id").notNull().references(() => countries.id),
  countryCode: varchar("country_code", { length: 2 }).notNull(),
  geonameId: integer("geoname_id"),
  // For validation with GeoNames API
  listingCount: integer("listing_count").notNull().default(0),
  createdAt: text("created_at").notNull()
});
var insertCitySchema = createInsertSchema(cities).omit({
  id: true
});
var listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  website: text("website").notNull(),
  logo: text("logo").notNull(),
  image: text("image").notNull(),
  featured: boolean("featured").notNull().default(false),
  countries: text("countries").array().notNull(),
  whyBookWith: text("why_book_with"),
  socials: jsonb("socials").$type().default({})
});
var insertListingSchema = createInsertSchema(listings).omit({
  id: true
});
var subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").notNull()
});
var insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  email: true
});
var submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  pmcGeneralWebsite: text("pmc_general_website"),
  website: text("website").notNull(),
  listingCount: integer("listing_count").notNull(),
  countries: text("countries").array().notNull(),
  citiesRegions: jsonb("cities_regions").$type(),
  // Original city data from form
  description: text("description").notNull(),
  logo: text("logo").notNull(),
  email: text("email").notNull(),
  facebook: text("facebook"),
  instagram: text("instagram"),
  linkedin: text("linkedin"),
  listingType: text("listing_type").notNull(),
  // "free" or "featured"
  status: text("status").notNull().default("pending"),
  // "pending", "approved", "rejected"
  createdAt: text("created_at").notNull(),
  // Verification fields
  verificationPurchased: text("verification_purchased").default("No"),
  // "Yes" or "No"
  verificationStatus: text("verification_status").default("N/A")
  // "N/A", "Yes", "No"
});
var insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  status: true,
  createdAt: true
});
var submissionCities = pgTable("submission_cities", {
  submissionId: integer("submission_id").notNull().references(() => submissions.id),
  cityId: integer("city_id").notNull().references(() => cities.id),
  createdAt: text("created_at").notNull()
}, (table) => ({
  pk: primaryKey(table.submissionId, table.cityId)
}));
var testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  // "host" or "guest"
  content: text("content").notNull(),
  avatar: text("avatar")
});
var insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true
});
var faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  // "traveler" or "host"
  order: integer("order").notNull()
});
var insertFaqSchema = createInsertSchema(faqs).omit({
  id: true
});

// ../server/routes.ts
import { z } from "zod";

// ../server/airtable.ts
import Airtable from "airtable";

// ../server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// ../vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// ../server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// ../server/airtable.ts
var airtableBase = null;
function initAirtable(apiKey, baseId) {
  try {
    Airtable.configure({ apiKey });
    airtableBase = Airtable.base(baseId);
    log("Airtable initialized successfully", "airtable");
    return true;
  } catch (error) {
    log(`Failed to initialize Airtable: ${error}`, "airtable");
    return false;
  }
}
function isAirtableInitialized() {
  return !!airtableBase;
}
async function submitPropertyToAirtable(submission) {
  if (!airtableBase) {
    throw new Error("Airtable is not initialized");
  }
  try {
    const tableName = process.env.AIRTABLE_TABLE_NAME || "Submissions";
    const result = await airtableBase(tableName).create({
      "Brand Name": submission.name,
      "PMC General Website": submission.pmcGeneralWebsite || "",
      "Direct Booking Engine URL": submission.website,
      "Number of Listings": submission.listingCount,
      "Countries": submission.countries,
      "One-line Description": submission.description,
      "Why Book With You": submission.whyBookWithYou || "",
      "Why Rent With You": submission.whyRentWithYou || "",
      "Commission On Revenue": submission.commissionOnRevenue || 0,
      "Logo": submission.logo,
      "Email": submission.email,
      "Facebook": submission.facebook || "",
      "Instagram": submission.instagram || "",
      "LinkedIn": submission.linkedin || "",
      "Plan": submission.listingType,
      "Status": submission.status,
      "Submission Date": submission.createdAt
    });
    log(`Created new property submission in Airtable with ID: ${result.id}`, "airtable");
    return result;
  } catch (error) {
    log(`Failed to submit property to Airtable: ${error}`, "airtable");
    throw error;
  }
}
async function submitSubscriptionToAirtable(subscription) {
  if (!airtableBase) {
    throw new Error("Airtable is not initialized");
  }
  try {
    const result = await airtableBase("Email Subscriptions").create({
      Email: subscription.email,
      "Created At": subscription.createdAt
    });
    log(`Created new email subscription in Airtable with ID: ${result.id}`, "airtable");
    return result;
  } catch (error) {
    log(`Failed to submit subscription to Airtable: ${error}`, "airtable");
    throw error;
  }
}
async function fetchListingsFromAirtable() {
  if (!airtableBase) throw new Error("Airtable is not initialized");
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Property Submissions";
  const records = await airtableBase(tableName).select().all();
  return records.map((record) => ({
    id: record.id,
    ...record.fields
  }));
}

// ../server/routes.ts
import { Router } from "express";

// ../server/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil"
});
var PRICE_IDS = {
  "Basic (\u20AC99.99/year)": "price_1RqGFNAuRAOWZse80bVZnkJx",
  // Basic Listing Plan - €99.99/year
  "Premium (\u20AC499.99/year)": "price_1RqGIAAuRAOWZse8t2w1xXcE"
  // Premium Listing Plan - €499.99/year
};
var createCheckoutSession = async (req, res) => {
  try {
    const { plan, email, metadata } = req.body;
    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const baseUrl = process.env.CLIENT_URL || `${protocol}://${host}`;
    console.log("Using base URL:", baseUrl);
    if (!plan || !email) {
      return res.status(400).json({ error: "Plan and email are required" });
    }
    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return res.status(400).json({
        error: "Invalid plan selected",
        availablePlans: Object.keys(PRICE_IDS)
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${baseUrl}/submit/success?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(plan)}`,
      cancel_url: `${baseUrl}/submit?canceled=true`,
      metadata: {
        submissionData: JSON.stringify(metadata),
        // Store form data
        plan,
        email
      },
      // Enable automatic tax calculation if needed
      automatic_tax: { enabled: false },
      // Allow promotion codes
      allow_promotion_codes: true
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    if (error instanceof Error) {
      if (error.message.includes("price")) {
        return res.status(400).json({ error: "Invalid pricing configuration" });
      }
      if (error.message.includes("customer")) {
        return res.status(400).json({ error: "Customer creation failed" });
      }
    }
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
var submitToAirtable = async (formData, paymentInfo) => {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = "Directory Submissions";
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error("Airtable configuration missing in environment variables");
  }
  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
  const submissionData = {
    "Email": formData["Submitted By (Email)"],
    "Brand Name": formData["Brand Name"],
    "PMC General Website": formData["PMC General Website"],
    "Direct Booking Engine URL": formData["Direct Booking Engine URL"],
    "Number of Listings": formData["Number of Listings"],
    "Cities / Regions": Array.isArray(formData["Cities / Regions"]) ? formData["Cities / Regions"].map((city) => {
      const cityDisplayName = city.displayName || city;
      if (typeof cityDisplayName === "string" && cityDisplayName.includes(", ")) {
        return cityDisplayName.split(", ")[0].trim();
      }
      return cityDisplayName;
    }).join(", ") : formData["Cities / Regions"],
    "Countries": Array.isArray(formData["Cities / Regions"]) ? Array.from(new Set(formData["Cities / Regions"].map((city) => city.countryName || "").filter(Boolean))).join(", ") : "",
    "One-line Description": formData["One-line Description"],
    "Why Book With You": formData["Why Book With You?"],
    "Why Rent With You": formData["Why Rent With You?"],
    "Commission On Revenue": formData["Commission on Revenue (%)"] || 0,
    "Top Stats": formData["Top Stats"] || "",
    "Types of Stays": Array.isArray(formData["Types of Stays"]) ? formData["Types of Stays"] : [],
    "Ideal For": Array.isArray(formData["Ideal For"]) ? formData["Ideal For"] : [],
    "Properties Features": Array.isArray(formData["Properties Features"]) ? formData["Properties Features"] : [],
    "Services & Convenience": Array.isArray(formData["Services & Convenience"]) ? formData["Services & Convenience"] : [],
    "Lifestyle & Values": Array.isArray(formData["Lifestyle & Values"]) ? formData["Lifestyle & Values"] : [],
    "Design Styles": Array.isArray(formData["Design Styles"]) ? formData["Design Styles"] : [],
    "Atmospheres": Array.isArray(formData["Atmospheres"]) ? formData["Atmospheres"] : [],
    "Settings/Locations": Array.isArray(formData["Settings/Locations"]) ? formData["Settings/Locations"] : [],
    "Instagram": formData["Instagram"] || "",
    "Facebook": formData["Facebook"] || "",
    "LinkedIn": formData["LinkedIn"] || "",
    "TikTok": formData["TikTok"] || "",
    "YouTube / Video Tour": formData["YouTube / Video Tour"] || "",
    "Plan": formData["Choose Your Listing Type"] === "Basic (\u20AC99.99/year)" ? "Basic Listing - \u20AC99.99/year" : formData["Choose Your Listing Type"] === "Premium (\u20AC499.99/year)" ? "Premium Listing - \u20AC499.99/year" : formData["Choose Your Listing Type"],
    "Submission Date": (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    "Status": formData["Choose Your Listing Type"] === "Premium (\u20AC499.99/year)" ? "Approved \u2013 Published" : "Pending Review",
    "Status Bis (PMC directory)": formData["Choose Your Listing Type"] === "Premium (\u20AC499.99/year)" ? "Approved \u2013 Published" : "Pending Review",
    "Payment Status": "Completed",
    "Stripe Customer ID": paymentInfo.customerId,
    "Stripe Subscription ID": paymentInfo.subscriptionId,
    "Payment Date": (/* @__PURE__ */ new Date()).toISOString()
  };
  console.log("Submitting to Airtable:", submissionData);
  const response = await fetch(airtableUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: submissionData
    })
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Airtable submission failed:", errorData);
    throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
  }
  const result = await response.json();
  console.log("Successfully submitted to Airtable:", result.id);
  return result;
};
var handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send("Webhook signature verification failed");
  }
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      if (session.metadata?.submissionData) {
        const formData = JSON.parse(session.metadata.submissionData);
        try {
          console.log("\u{1F4B3} Payment successful for submission:", {
            customerEmail: formData["Submitted By (Email)"],
            brandName: formData["Brand Name"],
            plan: formData["Choose Your Listing Type"],
            customerId: session.customer,
            subscriptionId: session.subscription
          });
          await submitToAirtable(formData, {
            customerId: session.customer,
            subscriptionId: session.subscription,
            sessionId: session.id
          });
          console.log("\u2705 Successfully processed payment and created Airtable submission");
        } catch (error) {
          console.error("\u274C Failed to process successful payment:", error);
        }
      }
      break;
    case "customer.subscription.created":
      const subscription = event.data.object;
      console.log("New subscription created:", subscription.id);
      console.log("Plan:", subscription.items.data[0]?.price.nickname || subscription.items.data[0]?.price.id);
      break;
    case "invoice.payment_succeeded":
      const invoice = event.data.object;
      console.log("Subscription payment succeeded for:", invoice.customer);
      console.log("Amount paid:", invoice.amount_paid / 100, invoice.currency.toUpperCase());
      console.log("Invoice ID:", invoice.id);
      break;
    case "invoice.payment_failed":
      const failedInvoice = event.data.object;
      console.log("Subscription payment failed for:", failedInvoice.customer);
      console.log("Amount due:", failedInvoice.amount_due / 100, failedInvoice.currency.toUpperCase());
      console.log("Attempt count:", failedInvoice.attempt_count);
      break;
    case "customer.subscription.updated":
      const updatedSub = event.data.object;
      console.log("Subscription updated:", updatedSub.id, "Status:", updatedSub.status);
      break;
    case "customer.subscription.deleted":
      const deletedSub = event.data.object;
      console.log("Subscription cancelled:", deletedSub.id);
      break;
    default:
      console.log(`\u{1F4DD} Event logged: ${event.type}`, {
        id: event.id,
        created: new Date(event.created * 1e3).toISOString(),
        livemode: event.livemode,
        type: event.type,
        // Log object type and ID if available
        object: event.data.object?.object || "unknown",
        objectId: event.data.object?.id || "no-id"
      });
  }
  res.json({ received: true });
};
var createPortalSession = async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body;
    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.CLIENT_URL || "https://bookdirectstays.com"}/account`
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error("Portal session error:", error);
    res.status(500).json({ error: "Failed to create portal session" });
  }
};
var getSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    res.json({
      id: subscription.id,
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      plan: subscription.items.data[0]?.price.nickname || subscription.items.data[0]?.price.id,
      amount: subscription.items.data[0]?.price.unit_amount,
      currency: subscription.items.data[0]?.price.currency
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({ error: "Failed to retrieve subscription" });
  }
};
var getCustomerSubscriptions = async (req, res) => {
  try {
    const { customerId } = req.params;
    const subscriptions2 = await stripe.subscriptions.list({
      customer: customerId,
      status: "all"
    });
    const formattedSubs = subscriptions2.data.map((sub) => ({
      id: sub.id,
      status: sub.status,
      current_period_start: sub.current_period_start,
      current_period_end: sub.current_period_end,
      plan: sub.items.data[0]?.price.nickname || sub.items.data[0]?.price.id,
      amount: sub.items.data[0]?.price.unit_amount,
      currency: sub.items.data[0]?.price.currency
    }));
    res.json({ subscriptions: formattedSubs });
  } catch (error) {
    console.error("Get customer subscriptions error:", error);
    res.status(500).json({ error: "Failed to retrieve subscriptions" });
  }
};
var getInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await stripe.invoices.retrieve(invoiceId);
    res.json({
      id: invoice.id,
      status: invoice.status,
      amount_paid: invoice.amount_paid,
      amount_due: invoice.amount_due,
      currency: invoice.currency,
      created: invoice.created,
      hosted_invoice_url: invoice.hosted_invoice_url,
      invoice_pdf: invoice.invoice_pdf
    });
  } catch (error) {
    console.error("Get invoice error:", error);
    res.status(500).json({ error: "Failed to retrieve invoice" });
  }
};

// ../server/routes.ts
var router = Router();
async function registerRoutes(app2) {
  app2.get("/api/listings", async (req, res) => {
    try {
      let listings2;
      if (isAirtableInitialized()) {
        listings2 = await fetchListingsFromAirtable();
      } else {
        listings2 = await storage.getListings();
      }
      res.json({
        listings: listings2,
        total: listings2.length,
        hasMore: false
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });
  app2.get("/api/countries", async (req, res) => {
    try {
      const countries2 = await storage.getCountries();
      res.json(countries2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });
  app2.get("/api/countries/:slug", async (req, res) => {
    try {
      const country = await storage.getCountryBySlug(req.params.slug);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch country" });
    }
  });
  app2.post("/api/subscribe", async (req, res) => {
    try {
      const parsedData = insertSubscriptionSchema.parse(req.body);
      const createdAt = (/* @__PURE__ */ new Date()).toISOString();
      const subscriptionData = {
        ...parsedData,
        createdAt
      };
      const result = await storage.createSubscription(subscriptionData);
      if (isAirtableInitialized()) {
        try {
          await submitSubscriptionToAirtable(subscriptionData);
          log("Subscription also stored in Airtable");
        } catch (airtableError) {
          log(`Airtable storage failed but local storage succeeded: ${airtableError}`);
        }
      }
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });
  app2.post("/api/submissions", async (req, res) => {
    try {
      const parsedData = insertSubmissionSchema.parse(req.body);
      const createdAt = (/* @__PURE__ */ new Date()).toISOString();
      const submissionData = {
        ...parsedData,
        status: "pending",
        createdAt
      };
      const result = await storage.createSubmission(submissionData);
      if (isAirtableInitialized()) {
        try {
          await submitPropertyToAirtable(submissionData);
          log("Property submission also stored in Airtable");
        } catch (airtableError) {
          log(`Airtable storage failed but local storage succeeded: ${airtableError}`);
        }
      }
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid submission data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create submission" });
    }
  });
  app2.get("/api/faqs", async (req, res) => {
    try {
      const faqs2 = await storage.getFAQs();
      res.json(faqs2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });
  app2.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials2 = await storage.getTestimonials();
      res.json(testimonials2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });
  app2.post("/api/stripe/create-checkout-session", createCheckoutSession);
  app2.post("/api/stripe/create-portal-session", createPortalSession);
  app2.get("/api/stripe/subscription/:subscriptionId", getSubscription);
  app2.get("/api/stripe/customer/:customerId/subscriptions", getCustomerSubscriptions);
  app2.get("/api/stripe/invoice/:invoiceId", getInvoice);
  app2.post(
    "/api/stripe/webhook",
    __require("express").raw({ type: "application/json" }),
    handleWebhook
  );
  const httpServer = createServer(app2);
  return httpServer;
}

// ../server/index.ts
import cors from "cors";
var app = express2();
app.use(cors({
  origin: true,
  // Allow all origins
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  if (airtableApiKey && airtableBaseId) {
    const initialized = initAirtable(airtableApiKey, airtableBaseId);
    if (initialized) {
      log("Airtable integration enabled successfully");
    } else {
      log("Failed to initialize Airtable, will use in-memory storage instead");
    }
  } else {
    log("Airtable API key or Base ID not found. Using in-memory storage only.");
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
