import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { dataPreloader } from "./lib/data-preloader";

// Register Service Worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Performance monitoring
const reportWebVitals = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const metrics = {
        // Time to First Byte
        ttfb: navigation.responseStart - navigation.requestStart,
        // First Contentful Paint
        fcp: 0,
        // Largest Contentful Paint
        lcp: 0,
        // First Input Delay
        fid: 0,
      };

      // Report metrics to console (can be sent to analytics)
      console.log('Performance Metrics:', metrics);
    }
  }
};

// Dynamic title and meta description based on route
const updatePageMeta = () => {
  const path = window.location.pathname;
  let title = "FindRentalManager.com - Global Directory of Rental Management Companies | Find Professional Property Managers";
  let description = "Find professional rental management companies for your properties worldwide. Connect with verified property managers across 50+ countries. Increase occupancy rates and maximize rental income with expert management.";

  if (path.startsWith('/country/')) {
    const countrySlug = path.split('/')[2];
    const countryName = countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1);
    title = `${countryName} Rental Management Companies | FindRentalManager.com`;
    description = `Find professional rental managers in ${countryName}. Connect with verified property management companies. Increase your property's occupancy rates and rental income.`;
  } else if (path === '/submit') {
    title = "List Your Management Company | FindRentalManager.com";
    description = "Add your rental management company to our global directory. Connect with property owners and grow your business. Free and featured listing options available.";
  } else if (path === '/faq') {
    title = "Frequently Asked Questions | FindRentalManager.com";
    description = "Common questions about finding rental managers, property management services, and listing your management company on FindRentalManager.com.";
  } else if (path === '/testimonials') {
    title = "Property Owner Testimonials | FindRentalManager.com";
    description = "Read reviews from property owners and rental managers who use FindRentalManager.com for professional property management services.";
  }

  document.title = title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
  
  // Update Open Graph meta tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', title);
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', description);
  }
  
  // Update canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', `https://bookdirectstays.com${path}`);
  }
};

// Update meta tags on initial load
updatePageMeta();

// Update meta tags on navigation
window.addEventListener('popstate', updatePageMeta);

// Also update on pushState/replaceState (for client-side routing)
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function(...args) {
  originalPushState.apply(history, args);
  setTimeout(updatePageMeta, 0);
};

history.replaceState = function(...args) {
  originalReplaceState.apply(history, args);
  setTimeout(updatePageMeta, 0);
};

// Start preloading data immediately when app starts
console.log('🚀 Starting background data preload...');
dataPreloader.preloadData().then(() => {
  console.log('✅ Background data preload completed!');
}).catch((error) => {
  console.error('❌ Background data preload failed:', error);
});

// Report performance metrics after page load
window.addEventListener('load', () => {
  setTimeout(reportWebVitals, 1000);
});

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>
);
