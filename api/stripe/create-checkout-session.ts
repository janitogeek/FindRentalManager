import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Stripe price IDs - configured with real price IDs from Stripe Dashboard
const PRICE_IDS = {
  'Basic (€99.99/year)': 'price_1RqGFNAuRAOWZse80bVZnkJx',     // Basic Listing Plan - €99.99/year
  'Premium (€499.99/year)': 'price_1RqGIAAuRAOWZse8t2w1xXcE', // Premium Listing Plan - €499.99/year
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, formData } = req.body;
    
    // Auto-detect the current deployment URL for development
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = process.env.CLIENT_URL || `${protocol}://${host}`;
    
    console.log('Using base URL:', baseUrl);
    
    // Validate input
    if (!plan || !formData) {
      return res.status(400).json({ error: 'Plan and formData are required' });
    }
    
    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];
    if (!priceId) {
      return res.status(400).json({ 
        error: 'Invalid plan selected',
        availablePlans: Object.keys(PRICE_IDS)
      });
    }

    // Validate email format
    const email = formData["Submitted By (Email)"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/submit/success?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(plan)}`,
      cancel_url: `${baseUrl}/submit?canceled=true`,
      metadata: {
        plan: plan,
        email: email,
        brandName: formData["Brand Name"]
      },
      // Enable automatic tax calculation if needed
      automatic_tax: { enabled: false },
      // Allow promotion codes
      allow_promotion_codes: true,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('price')) {
        return res.status(400).json({ error: 'Invalid pricing configuration' });
      }
      if (error.message.includes('customer')) {
        return res.status(400).json({ error: 'Customer creation failed' });
      }
    }
    
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
