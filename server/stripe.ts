import Stripe from 'stripe';
import { Request, Response } from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Stripe price IDs - configured with real price IDs from Stripe Dashboard
const PRICE_IDS = {
  'Basic (€99.99/year)': 'price_1RqGFNAuRAOWZse80bVZnkJx',     // Basic Listing Plan - €99.99/year
  'Premium (€499.99/year)': 'price_1RqGIAAuRAOWZse8t2w1xXcE', // Premium Listing Plan - €499.99/year
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { formData, plan, email, processedFiles } = req.body;
    
    if (!formData || !plan || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('💳 Creating Stripe checkout session for:', {
      brandName: formData["Brand Name"],
      plan: plan,
      email: email
    });

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];
    if (!priceId) {
      return res.status(400).json({ error: `Invalid plan: ${plan}` });
    }

    // Create checkout session with form data in metadata
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL || 'https://findrentalmanager.com'}/submit/success?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(plan)}`,
      cancel_url: `${process.env.CLIENT_URL || 'https://findrentalmanager.com'}/submit?canceled=true`,
      customer_email: email,
      metadata: {
        submissionData: JSON.stringify(formData),
        plan: plan,
        email: email
      }
    });

    console.log('✅ Stripe checkout session created:', session.id);
    res.json({ sessionId: session.id });
    
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

// Helper function to submit to Airtable
const submitToAirtable = async (formData: any, paymentInfo: any) => {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = 'Directory Submissions';

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable configuration missing in environment variables');
  }

  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
  
  // Prepare submission data for Airtable
  const submissionData = {
    "Email": formData["Submitted By (Email)"],
    "Brand Name": formData["Brand Name"],
    "PMC General Website": formData["PMC General Website"],
    "Direct Booking Engine URL": formData["Direct Booking Engine URL"],
    "Number of Listings": formData["Number of Listings"],

    "Cities / Regions": Array.isArray(formData["Cities / Regions"]) 
      ? formData["Cities / Regions"].map((city: any) => {
          const cityDisplayName = city.displayName || city;
          // Extract only the city name from "City, Region, Country" format
          if (typeof cityDisplayName === 'string' && cityDisplayName.includes(', ')) {
            return cityDisplayName.split(', ')[0].trim();
          }
          return cityDisplayName;
        }).join(", ")
      : formData["Cities / Regions"],
    "Countries": Array.isArray(formData["Cities / Regions"]) 
      ? Array.from(new Set(formData["Cities / Regions"].map((city: any) => city.countryName || "").filter(Boolean))).join(", ")
      : "",
    "One-line Description": formData["One-line Description"],
    "Why Book With You": formData["Why Book With You? (for guests)"],
    "Why Rent With You": formData["Why Rent With You? (for owners)"],
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
    "Plan": formData["Choose Your Listing Type"] === "Basic (€99.99/year)" 
      ? "Basic Listing - €99.99/year" 
      : formData["Choose Your Listing Type"] === "Premium (€499.99/year)" 
        ? "Premium Listing - €499.99/year" 
        : formData["Choose Your Listing Type"],
    "Submission Date": new Date().toISOString().split('T')[0],
    "Status": formData["Choose Your Listing Type"] === "Premium (€499.99/year)" 
      ? "Approved – Published" 
      : "Pending Review",
    "Status Bis (PMC directory)": formData["Choose Your Listing Type"] === "Premium (€499.99/year)" 
      ? "Approved – Published" 
      : "Pending Review",
    "Payment Status": "Completed",
    "Stripe Customer ID": paymentInfo.customerId,
    "Stripe Subscription ID": paymentInfo.subscriptionId,
    "Payment Date": new Date().toISOString()
  };

  console.log('Submitting to Airtable:', submissionData);

  const response = await fetch(airtableUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: submissionData
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Airtable submission failed:', errorData);
    throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
  }

  const result = await response.json();
  console.log('Successfully submitted to Airtable:', result.id);
  return result;
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send('Webhook signature verification failed');
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Process successful payment
      if (session.metadata?.submissionData) {
        const formData = JSON.parse(session.metadata.submissionData);
        
        try {
          console.log('💳 Payment successful for submission:', {
            customerEmail: formData["Submitted By (Email)"],
            brandName: formData["Brand Name"],
            plan: formData["Choose Your Listing Type"],
            customerId: session.customer,
            subscriptionId: session.subscription
          });
          
          // Submit to Airtable with payment confirmation
          await submitToAirtable(formData, {
            customerId: session.customer,
            subscriptionId: session.subscription,
            sessionId: session.id
          });
          
          console.log('✅ Successfully processed payment and created Airtable submission');
          
        } catch (error) {
          console.error('❌ Failed to process successful payment:', error);
          // Don't fail the webhook response - Stripe will retry
          // but log the error for investigation
        }
      }
      break;
      
    case 'customer.subscription.created':
      const subscription = event.data.object as Stripe.Subscription;
      console.log('New subscription created:', subscription.id);
      console.log('Plan:', subscription.items.data[0]?.price.nickname || subscription.items.data[0]?.price.id);
      // TODO: Update user subscription status in your database
      break;
      
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Subscription payment succeeded for:', invoice.customer);
      console.log('Amount paid:', invoice.amount_paid / 100, invoice.currency.toUpperCase());
      console.log('Invoice ID:', invoice.id);
      
      // TODO: Update subscription status, send receipt email
      break;
      
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      console.log('Subscription payment failed for:', failedInvoice.customer);
      console.log('Amount due:', failedInvoice.amount_due / 100, failedInvoice.currency.toUpperCase());
      console.log('Attempt count:', failedInvoice.attempt_count);
      
      // TODO: Handle failed payment - notify customer, update status
      break;
      
    case 'customer.subscription.updated':
      const updatedSub = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', updatedSub.id, 'Status:', updatedSub.status);
      // TODO: Handle subscription changes (plan upgrade/downgrade, status changes)
      break;
      
    case 'customer.subscription.deleted':
      const deletedSub = event.data.object as Stripe.Subscription;
      console.log('Subscription cancelled:', deletedSub.id);
      // TODO: Update user access, archive listings
      break;

    default:
      // Log all other events for comprehensive tracking
      console.log(`📝 Event logged: ${event.type}`, {
        id: event.id,
        created: new Date(event.created * 1000).toISOString(),
        livemode: event.livemode,
        type: event.type,
        // Log object type and ID if available
        object: event.data.object?.object || 'unknown',
        objectId: event.data.object?.id || 'no-id'
      });
  }

  res.json({ received: true });
};

// Create customer portal session for subscription management
export const createPortalSession = async (req: Request, res: Response) => {
  try {
    const { customerId, returnUrl } = req.body;
    
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
              return_url: returnUrl || `${process.env.CLIENT_URL || 'https://bookdirectstays.com'}/account`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
};

// Get subscription details
export const getSubscription = async (req: Request, res: Response) => {
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
      currency: subscription.items.data[0]?.price.currency,
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to retrieve subscription' });
  }
};

// Get customer subscriptions
export const getCustomerSubscriptions = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
    });
    
    const formattedSubs = subscriptions.data.map(sub => ({
      id: sub.id,
      status: sub.status,
      current_period_start: sub.current_period_start,
      current_period_end: sub.current_period_end,
      plan: sub.items.data[0]?.price.nickname || sub.items.data[0]?.price.id,
      amount: sub.items.data[0]?.price.unit_amount,
      currency: sub.items.data[0]?.price.currency,
    }));
    
    res.json({ subscriptions: formattedSubs });
  } catch (error) {
    console.error('Get customer subscriptions error:', error);
    res.status(500).json({ error: 'Failed to retrieve subscriptions' });
  }
};

// Get invoice details
export const getInvoice = async (req: Request, res: Response) => {
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
      invoice_pdf: invoice.invoice_pdf,
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Failed to retrieve invoice' });
  }
};

export { stripe };