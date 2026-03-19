// Google Analytics 4 (GA4) configuration and tracking utilities

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  // Enhanced safety checks
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

  try {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } catch (error) {
    // Silently fail in development to prevent console errors
    console.warn('Google Analytics tracking failed:', error);
  }
};

// Track email subscription events
export const trackEmailSubscription = (action: 'attempt' | 'success' | 'error', email?: string) => {
  trackEvent('email_subscription', 'engagement', action, 1);

  // Track with email hash for better analytics (optional)
  if (email) {
    trackEvent('email_subscription_with_hash', 'engagement', action, 1);
  }
};

// Track countdown timer interactions
export const trackCountdownInteraction = (action: 'view' | 'click') => {
  trackEvent('countdown_timer', 'engagement', action, 1);
};

// Track social media clicks
export const trackSocialClick = (platform: string) => {
  trackEvent('social_click', 'engagement', platform, 1);
};

// Track scroll depth
export const trackScrollDepth = (depth: number) => {
  if (depth >= 25 && depth < 50) {
    trackEvent('scroll_depth', 'engagement', '25%', 25);
  } else if (depth >= 50 && depth < 75) {
    trackEvent('scroll_depth', 'engagement', '50%', 50);
  } else if (depth >= 75 && depth < 90) {
    trackEvent('scroll_depth', 'engagement', '75%', 75);
  } else if (depth >= 90) {
    trackEvent('scroll_depth', 'engagement', '90%', 90);
  }
}; 