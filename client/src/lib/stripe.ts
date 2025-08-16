import { loadStripe } from '@stripe/stripe-js';
import { toast } from '@/hooks/use-toast';

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(
  (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

// Stripe price IDs - configured with TEST MODE price IDs from Stripe Dashboard
const PRICE_IDS = {
  'Basic (€99.99/year)': 'price_1RqeHhAMrMcYfFXQ0KFK29FR',     // Basic Listing Plan (Test) - €99.99/year
  'Premium (€499.99/year)': 'price_1RqeH2AMrMcYfFXQZos4UTzR', // Premium Listing Plan (Test) - €499.99/year
};

export const createCheckoutSession = async (formData: any, plan: string, email: string) => {
  try {
    console.log("💳💳💳 STRIPE CHECKOUT SESSION STARTING 💳💳💳");
    console.log("📋 Form data received in Stripe:", formData);
    console.log("💰 PRICING IN STRIPE FUNCTION:", {
      Currency: formData["Currency"],
      "Min Price": formData["Min Price"],
      "Max Price": formData["Max Price"]
    });
    console.log("📧 Email:", email);
    console.log("📦 Plan:", plan);
    
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];
    if (!priceId) {
      throw new Error(`Invalid plan: ${plan}`);
    }

    // Process files before going to Stripe (since blob URLs expire after redirect)
    console.log('Processing files before Stripe redirect...');
    
    // Helper functions
    const getFileFromBlobUrl = async (blobUrl: string, fileName: string): Promise<File> => {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    };

    const processImageFile = async (file: File): Promise<{ base64: string; contentType: string; filename: string }> => {
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/xxx;base64, prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      return {
        base64: base64Data,
        contentType: file.type,
        filename: file.name
      };
    };

    // Process each file if it exists
    let processedFiles: any = {};

    // Process logo
    if (formData["Logo Upload"]?.url && formData["Logo Upload"]?.url.startsWith('blob:')) {
      try {
        console.log('Processing logo file...');
        const logoFile = await getFileFromBlobUrl(formData["Logo Upload"].url, formData["Logo Upload"].name);
        processedFiles.logo = await processImageFile(logoFile);
        console.log('Logo processed successfully');
      } catch (error) {
        console.error('Error processing logo:', error);
      }
    }

    // Process highlight image
    if (formData["Highlight Image"]?.url && formData["Highlight Image"]?.url.startsWith('blob:')) {
      try {
        console.log('Processing highlight image...');
        const imageFile = await getFileFromBlobUrl(formData["Highlight Image"].url, formData["Highlight Image"].name);
        processedFiles.highlightImage = await processImageFile(imageFile);
        console.log('Highlight image processed successfully');
      } catch (error) {
        console.error('Error processing highlight image:', error);
      }
    }

    // Process rating screenshot
    if (formData["Rating (X/5) & Reviews (#) Screenshot"]?.url && formData["Rating (X/5) & Reviews (#) Screenshot"]?.url.startsWith('blob:')) {
      try {
        console.log('Processing rating screenshot...');
        const screenshotFile = await getFileFromBlobUrl(formData["Rating (X/5) & Reviews (#) Screenshot"].url, formData["Rating (X/5) & Reviews (#) Screenshot"].name);
        processedFiles.ratingScreenshot = await processImageFile(screenshotFile);
        console.log('Rating screenshot processed successfully');
      } catch (error) {
        console.error('Error processing rating screenshot:', error);
      }
    }

    // Clear any old localStorage data to free up space
    try {
      // Remove old pending submissions (older than 1 hour)
      const currentTime = Date.now();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pendingSubmission')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            if (data.timestamp && currentTime - data.timestamp > 3600000) { // 1 hour
              localStorage.removeItem(key);
              console.log('Cleaned up old pending submission:', key);
            }
          } catch (e) {
            console.error('Error cleaning up localStorage:', e);
          }
        }
      }
    } catch (e) {
      console.error('Error during localStorage cleanup:', e);
    }

    // Store form data with processed files in localStorage for processing after payment
    const submissionData = {
      formData,
      processedFiles,
      timestamp: Date.now(),
      plan,
      email,
    };

    try {
      const dataString = JSON.stringify(submissionData);
      console.log('📦 Attempting to store data of size:', (dataString.length / 1024 / 1024).toFixed(2), 'MB');
      console.log('💰 PRICING DATA BEING STORED:', {
        Currency: submissionData.formData["Currency"],
        "Min Price": submissionData.formData["Min Price"],
        "Max Price": submissionData.formData["Max Price"]
      });
      
      // Try to store with unique key in case multiple submissions happen
      const storageKey = `pendingSubmission_${Date.now()}`;
      localStorage.setItem(storageKey, dataString);
      
      // Also store the latest key reference
      localStorage.setItem('latestPendingSubmission', storageKey);
      
      console.log('✅ Data stored successfully with key:', storageKey);
      
    } catch (quotaError) {
      console.error('localStorage quota exceeded, trying to free space...');
      
      // Emergency cleanup - remove ALL localStorage data except essential
      try {
        const keysToKeep = ['latestPendingSubmission'];
        const toRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && !keysToKeep.includes(key)) {
            toRemove.push(key);
          }
        }
        
        toRemove.forEach(key => localStorage.removeItem(key));
        console.log('Removed', toRemove.length, 'localStorage items');
        
        // Try storing again with unique key
        const storageKey = `pendingSubmission_${Date.now()}`;
        localStorage.setItem(storageKey, JSON.stringify(submissionData));
        localStorage.setItem('latestPendingSubmission', storageKey);
        
      } catch (finalError) {
        console.error('Failed to store even after cleanup:', finalError);
        throw new Error('Unable to process submission due to storage limitations. Please try refreshing the page and submitting again.');
      }
    }

    // Auto-detect the current site URL for success/cancel redirects
    const baseUrl = window.location.origin;
    
    console.log('Creating Stripe checkout with:', { priceId, email, baseUrl });

    // Create checkout session on the server to include metadata
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        plan,
        email,
        processedFiles
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    // Redirect to Stripe checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId
    });

    if (error) {
      throw new Error(error.message || 'Stripe checkout failed');
    }
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    toast({
      title: "Payment Error",
      description: "Failed to redirect to payment. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

// Create customer portal session for subscription management
export const createPortalSession = async (customerId: string, returnUrl?: string) => {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: returnUrl || window.location.origin + '/account',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    
    // Redirect to Stripe Customer Portal
    window.location.href = url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Get subscription details
export const getSubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch(`/api/stripe/subscription/${subscriptionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};

// Get customer subscriptions
export const getCustomerSubscriptions = async (customerId: string) => {
  try {
    const response = await fetch(`/api/stripe/customer/${customerId}/subscriptions`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch customer subscriptions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching customer subscriptions:', error);
    throw error;
  }
};

// Get invoice details
export const getInvoice = async (invoiceId: string) => {
  try {
    const response = await fetch(`/api/stripe/invoice/${invoiceId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
};