import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil' as any,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  const { action, subscriptionId, invoiceId, customerId } = query;

  try {
    switch (method) {
      case 'POST':
        if (action === 'create-checkout-session') {
          return await handleCreateCheckoutSession(req, res);
        } else if (action === 'create-portal-session') {
          return await handleCreatePortalSession(req, res);
        } else if (action === 'webhook') {
          return await handleWebhook(req, res);
        }
        break;

      case 'GET':
        if (subscriptionId) {
          return await handleGetSubscription(req, res);
        } else if (invoiceId) {
          return await handleGetInvoice(req, res);
        } else if (customerId && action === 'subscriptions') {
          return await handleGetCustomerSubscriptions(req, res);
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Stripe API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCreateCheckoutSession(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { priceId, customerId, successUrl, cancelUrl } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/submit-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/submit`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: customerId ? undefined : 'always',
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

async function handleCreatePortalSession(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { customerId, returnUrl } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/submit`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
}

async function handleWebhook(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription event:', event.type, subscription.id);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment succeeded:', invoice.id);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('Payment failed:', failedInvoice.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleGetSubscription(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { subscriptionId } = req.query;
    
    if (!subscriptionId || typeof subscriptionId !== 'string') {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    if (subscription.object !== 'subscription') {
      return res.status(400).json({ error: 'Invalid subscription' });
    }

    res.status(200).json({
      id: subscription.id,
      status: subscription.status,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      priceId: subscription.items.data[0]?.price.id,
    });
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    res.status(500).json({ error: 'Failed to retrieve subscription' });
  }
}

async function handleGetInvoice(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { invoiceId } = req.query;
    
    if (!invoiceId || typeof invoiceId !== 'string') {
      return res.status(400).json({ error: 'Invoice ID is required' });
    }

    const invoice = await stripe.invoices.retrieve(invoiceId);
    
    if (invoice.object !== 'invoice') {
      return res.status(400).json({ error: 'Invalid invoice' });
    }

    res.status(200).json({
      id: invoice.id,
      status: invoice.status,
      amount_paid: invoice.amount_paid,
      currency: invoice.currency,
      customer: invoice.customer,
      subscription: invoice.subscription,
    });
  } catch (error) {
    console.error('Error retrieving invoice:', error);
    res.status(500).json({ error: 'Failed to retrieve invoice' });
  }
}

async function handleGetCustomerSubscriptions(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { customerId } = req.query;
    
    if (!customerId || typeof customerId !== 'string') {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    res.status(200).json({
      subscriptions: subscriptions.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        current_period_end: sub.current_period_end,
        cancel_at_period_end: sub.cancel_at_period_end,
        priceId: sub.items.data[0]?.price.id,
      })),
    });
  } catch (error) {
    console.error('Error retrieving customer subscriptions:', error);
    res.status(500).json({ error: 'Failed to retrieve customer subscriptions' });
  }
}
