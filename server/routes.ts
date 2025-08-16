import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertListingSchema, insertCountrySchema, insertSubscriptionSchema, insertSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { isAirtableInitialized, submitPropertyToAirtable, submitSubscriptionToAirtable, fetchListingsFromAirtable } from "./airtable";
import { log } from "./vite";
import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { listings, submissions } from "./schema";
import { 
  createCheckoutSession, 
  handleWebhook, 
  createPortalSession, 
  getSubscription, 
  getCustomerSubscriptions, 
  getInvoice 
} from "./stripe";

const router = Router();

export async function registerRoutes(app: Express): Promise<Server> {
  // Consolidated API routes
  app.get("/api/main", async (req, res) => {
    const { endpoint } = req.query;
    
    try {
      switch (endpoint) {
        case 'listings':
          let listings;
          if (isAirtableInitialized()) {
            listings = await fetchListingsFromAirtable();
          } else {
            listings = await storage.getListings();
          }
          return res.json({ 
            listings,
            total: listings.length,
            hasMore: false 
          });
          
        case 'countries':
          const countries = await storage.getCountries();
          return res.json(countries);
          
        case 'faqs':
          const faqs = await storage.getFAQs();
          return res.json(faqs);
          
        case 'testimonials':
          const testimonials = await storage.getTestimonials();
          return res.json(testimonials);
          
        default:
          res.status(404).json({ error: 'Endpoint not found' });
      }
    } catch (error) {
      console.error('API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Countries routes

  
  app.get("/api/main/countries/:slug", async (req, res) => {
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

  // Consolidated POST endpoints
  app.post("/api/main", async (req, res) => {
    const { endpoint } = req.query;
    
    try {
      switch (endpoint) {
        case 'subscribe':
          const parsedData = insertSubscriptionSchema.parse(req.body);
          const createdAt = new Date().toISOString();
          const subscriptionData = {
            ...parsedData,
            createdAt,
          };
          
          // Store in local memory storage
          const result = await storage.createSubscription(subscriptionData);
          
          // If Airtable is initialized, also store there
          if (isAirtableInitialized()) {
            try {
              await submitSubscriptionToAirtable(subscriptionData);
              log("Subscription also stored in Airtable");
            } catch (airtableError) {
              log(`Airtable storage failed but local storage succeeded: ${airtableError}`);
            }
          }
          
          return res.status(201).json(result);
          
        case 'submissions':
          const parsedSubmissionData = insertSubmissionSchema.parse(req.body);
          const submissionCreatedAt = new Date().toISOString();
          const submissionData = {
            ...parsedSubmissionData,
            status: "pending",
            createdAt: submissionCreatedAt,
          };
          
          // Store in local memory storage
          const submissionResult = await storage.createSubmission(submissionData);
          
          // If Airtable is initialized, also store there
          if (isAirtableInitialized()) {
            try {
              await submitPropertyToAirtable(submissionData);
              log("Property submission also stored in Airtable");
            } catch (airtableError) {
              log(`Airtable storage failed but local storage succeeded: ${airtableError}`);
            }
          }
          
          return res.status(201).json(submissionResult);
          
        default:
          res.status(404).json({ error: 'Endpoint not found' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process request" });
    }
  });



  // Stripe routes - consolidated into single endpoint
  app.post("/api/stripe", async (req, res) => {
    const { action, subscriptionId, invoiceId, customerId } = req.query;
    
    try {
      switch (action) {
        case 'create-checkout-session':
          return await createCheckoutSession(req, res);
        case 'create-portal-session':
          return await createPortalSession(req, res);
        case 'webhook':
          return await handleWebhook(req, res);
        default:
          if (subscriptionId) {
            return await getSubscription(req, res);
          } else if (invoiceId) {
            return await getInvoice(req, res);
          } else if (customerId && req.query.action === 'subscriptions') {
            return await getCustomerSubscriptions(req, res);
          }
          res.status(404).json({ error: 'Stripe endpoint not found' });
      }
    } catch (error) {
      console.error('Stripe API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
