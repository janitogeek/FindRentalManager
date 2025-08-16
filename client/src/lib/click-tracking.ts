import React from 'react';

/**
 * Click tracking utility for BookDirectStays
 * Tracks user interactions with host links in a fire-and-forget manner
 */

type ClickType = 'website' | 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok' | 'company';

interface ClickTrackingOptions {
  hostId: string;
  type: ClickType;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

/**
 * Track a click event - fire and forget
 * This runs in the background and doesn't delay the user's navigation
 */
export async function trackClick({ hostId, type, onSuccess, onError }: ClickTrackingOptions): Promise<void> {
  try {
    // Use fetch with no-cors to avoid blocking user navigation
    // This runs asynchronously in the background
    fetch('/api/main?endpoint=log-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hostId,
        type,
      }),
      // Don't wait for response - fire and forget
      keepalive: true,
    })
    .then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Click tracked: ${type} for ${hostId}`);
        onSuccess?.(data);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    })
    .catch((error) => {
      console.warn(`⚠️ Click tracking failed for ${type}:`, error);
      onError?.(error);
    });
  } catch (error) {
    console.warn(`⚠️ Click tracking error:`, error);
    onError?.(error);
  }
}

/**
 * Higher-order function to wrap link handlers with click tracking
 * Usage: onClick={withClickTracking(hostId, 'website', () => window.open(url))}
 */
export function withClickTracking(
  hostId: string, 
  type: ClickType, 
  originalHandler?: () => void
) {
  return (event?: React.MouseEvent) => {
    // Track the click immediately (fire-and-forget)
    trackClick({ hostId, type });
    
    // Execute the original handler (navigation, etc.)
    originalHandler?.();
  };
}

/**
 * Hook for easy click tracking in React components
 */
export function useClickTracking(hostId: string) {
  const track = (type: ClickType) => {
    trackClick({ hostId, type });
  };

  return {
    trackWebsite: () => track('website'),
    trackInstagram: () => track('instagram'),
    trackFacebook: () => track('facebook'),
    trackLinkedIn: () => track('linkedin'),
    trackYouTube: () => track('youtube'),
    trackTikTok: () => track('tiktok'),
    trackCompany: () => track('company'),
    track, // Generic tracker
  };
}

/**
 * Utility to automatically detect click type from URL
 */
export function detectClickTypeFromUrl(url: string): ClickType | null {
  const lowercaseUrl = url.toLowerCase();
  
  if (lowercaseUrl.includes('instagram.com')) return 'instagram';
  if (lowercaseUrl.includes('facebook.com')) return 'facebook';
  if (lowercaseUrl.includes('linkedin.com')) return 'linkedin';
  if (lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be')) return 'youtube';
  if (lowercaseUrl.includes('tiktok.com')) return 'tiktok';
  
  // Default to website for any other URL
  return 'website';
} 