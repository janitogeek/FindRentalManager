import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, plan, formData } = req.body;

    // Verify payment with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Prepare Airtable data with proper field mapping
    const airtableData = {
      "Brand Name": formData["Brand Name"],
      "One-line Description": formData["One-line Description"],
      "Why Book With You": formData["Why Book With You?"],
      "Why Rent With You": formData["Why Rent With You?"],
      "Commission On Revenue": parseFloat(formData["Commission on Revenue (%)"]),
      "PMS": formData["PMS/Channel Manager"],
      "Top Stats": formData["Top Stats"] || "",
      "Status": plan === "Premium (€499.99/year)" ? "Approved – Published" : "Pending Review",
      "Status Bis (PMC directory)": plan === "Premium (€499.99/year)" ? "Approved – Published" : "Pending Review",
      "Types of Stays": formData["Types of Stays"] || [],
      "Countries": formData["Countries"] || [],
      "Cities/Regions": formData["Cities/Regions"] || [],
      "Currency": formData["Currency"],
      "Perks/Amenities": formData["Properties Features"] || [],
      "Vibe & Aesthetic": [...(formData["Design Styles"] || []), ...(formData["Atmospheres"] || []), ...(formData["Settings/Locations"] || [])],
      "Property Type": formData["Types of Stays"] || [],
      "Ideal For": formData["Ideal For"] || [],
      "Email": formData["Submitted By (Email)"],
      "Website": formData["PMC General Website"] || "",
      "PMC General Website": formData["PMC General Website"] || "",
      "Number of Listings": formData["Number of Listings"],
      "Instagram": formData["Instagram"] || "",
      "TikTok": formData["TikTok"] || "",
      "Google Reviews Link": formData["Google Reviews Link"] || "",
      "Cancellation Policy": formData["Cancellation Policy"] || "",
      "Stripe Session ID": sessionId,
      "Payment Plan": plan,
      "Payment Status": "Paid",
      "Payment Date": new Date().toISOString(),
    };

    // Submit to Airtable using fetch (no need for Airtable package)
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE_NAME = 'Directory Submissions';

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    
    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: airtableData
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Submission saved to Airtable:', result.id);

    res.status(200).json({
      success: true,
      message: 'Submission processed successfully',
      airtableId: result.id,
      plan: plan,
      status: plan === "Premium (€499.99/year)" ? "Approved – Published" : "Pending Review"
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      error: 'Payment verification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
