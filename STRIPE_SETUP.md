# 🚀 Stripe Payment Setup Guide

## Overview
This guide helps you integrate Stripe payments for yearly listing subscriptions in BookDirectStays.

## 📋 Prerequisites

1. **Stripe Account**: Create an account at [stripe.com](https://stripe.com)
2. **Node.js & npm**: Already installed in your project

## 🔧 Environment Variables Setup

### Frontend (.env in client/ directory)
```bash
# Copy from client/env.example
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_CLIENT_URL=http://localhost:5173
VITE_AIRTABLE_API_KEY=your_airtable_api_key_here
VITE_AIRTABLE_BASE_ID=your_airtable_base_id_here
```

### Backend (.env in root directory)
```bash
# Create new .env file in root directory
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## 🏪 Stripe Dashboard Setup

### 1. Create Products & Prices

In your Stripe Dashboard:

1. Go to **Products** → **Add Product**

2. Create **Basic Plan**:
   - Name: `Basic Listing Plan`
   - Price: `€99.99`
   - Billing: `Yearly`
   - Copy the **Price ID** (starts with `price_`)

3. Create **Premium Plan**:
   - Name: `Premium Listing Plan` 
   - Price: `€499.99`
   - Billing: `Yearly`
   - Copy the **Price ID** (starts with `price_`)

### 2. Update Price IDs in Code

In `server/stripe.ts`, replace the placeholder price IDs:

```typescript
const PRICE_IDS = {
  'Basic (€99.99/year)': 'price_1234567890',     // Your Basic Price ID
  'Premium (€499.99/year)': 'price_1234567891', // Your Premium Price ID
};
```

### 3. Set Up Webhooks

1. Go to **Developers** → **Webhooks** → **Add endpoint**

2. **Endpoint URL**: `https://yourdomain.com/api/stripe/webhook`
   - For local testing: `http://localhost:5000/api/stripe/webhook`

3. **Events to send**:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`  
   - `invoice.payment_failed`

4. Copy the **Webhook Secret** (starts with `whsec_`)

## 🚀 Testing the Integration

### 1. Start the Application

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### 2. Test the Flow

1. Go to `/submit` page
2. Fill out the form
3. Select a plan (Basic or Premium)
4. Click Submit → Should redirect to Stripe Checkout
5. Use Stripe test card: `4242 4242 4242 4242`
6. Complete payment → Should redirect to `/submit/success`

### 3. Stripe Test Cards

- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Authentication Required**: `4000 0025 0000 3155`

## 🔄 Payment Flow

1. **User submits form** → Form data sent to Stripe Checkout
2. **User pays** → Stripe processes payment
3. **Webhook triggered** → `checkout.session.completed` event
4. **Backend processes** → Form data saved to Airtable
5. **User redirected** → Success page with confirmation

## 🛠️ Files Modified/Created

### New Files:
- `server/stripe.ts` - Stripe backend service
- `client/src/lib/stripe.ts` - Stripe frontend utilities  
- `client/src/pages/submit-success.tsx` - Success page
- `STRIPE_SETUP.md` - This setup guide

### Modified Files:
- `server/routes.ts` - Added Stripe routes
- `client/src/pages/submit.tsx` - Updated form submission
- `client/src/App.tsx` - Added success page route
- `client/env.example` - Added Stripe environment variables

## 🔒 Security Notes

- **Never commit** your secret keys to git
- Use **test keys** for development
- Use **live keys** only in production
- Validate webhooks with **signature verification**

## 📊 Monitoring & Analytics

### Stripe Dashboard:
- Monitor payments, subscriptions, and failed charges
- View customer details and payment history
- Set up email notifications for events

### Webhook Monitoring:
- Check webhook delivery status in Stripe Dashboard
- Monitor server logs for webhook processing
- Set up error alerting for failed webhooks

## 🆘 Troubleshooting

### Common Issues:

1. **"Invalid API Key"**
   - Check your environment variables
   - Ensure using correct test/live keys

2. **Webhook Signature Verification Failed**
   - Verify webhook secret in environment
   - Check endpoint URL in Stripe Dashboard

3. **Payment Not Processing**
   - Check server logs for errors
   - Verify price IDs in `server/stripe.ts`
   - Ensure webhook endpoint is accessible

### Debug Mode:
Add console logs in `server/stripe.ts` to debug webhook events:

```typescript
console.log('Webhook event:', event.type);
console.log('Session data:', session);
```

## 🚀 Going Live

1. **Switch to Live Keys**: Replace test keys with live keys
2. **Update Webhook URL**: Use production domain
3. **Test with Real Card**: Verify end-to-end flow
4. **Monitor**: Set up alerting and monitoring

## 📞 Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: Available in Dashboard
- **BookDirectStays Support**: findmyrentalmanager@gmail.com

---

✅ **Setup Complete!** Your Stripe integration is ready for yearly subscription payments.