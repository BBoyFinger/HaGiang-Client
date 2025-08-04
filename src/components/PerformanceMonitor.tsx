import { useEffect } from 'react';

interface PerformanceMonitorProps {
  pageName: string;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ pageName }) => {
  useEffect(() => {
    // Track page load performance
    const trackPageLoad = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const metrics = {
          pageName,
          timestamp: new Date().toISOString(),
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
          userAgent: navigator.userAgent,
          url: window.location.href,
        };

        // Log performance metrics
        console.log('📊 Performance Metrics:', metrics);

        // Send to analytics in production
        if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          // TODO: Send to analytics service
          // analytics.track('page_performance', metrics);
        }
      }
    };

    // Track Core Web Vitals
    const trackCoreWebVitals = () => {
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('🎯 LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if ('processingStart' in entry) {
              console.log('⚡ FID:', (entry as PerformanceEventTiming).processingStart - entry.startTime);
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          console.log('📐 CLS:', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }
    };

    // Track errors
    const trackErrors = () => {
      window.addEventListener('error', (event) => {
        const errorData = {
          pageName,
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        };

        console.error('❌ JavaScript Error:', errorData);

        if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          // TODO: Send to error tracking service
          // errorTracking.captureException(errorData);
        }
      });

      window.addEventListener('unhandledrejection', (event) => {
        const errorData = {
          pageName,
          message: event.reason?.message || 'Unhandled Promise Rejection',
          stack: event.reason?.stack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        };

        console.error('❌ Unhandled Promise Rejection:', errorData);

        if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          // TODO: Send to error tracking service
          // errorTracking.captureException(errorData);
        }
      });
    };

    // Initialize tracking
    trackPageLoad();
    trackCoreWebVitals();
    trackErrors();

    // Track page view
    if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      // TODO: Track page view
      // analytics.page(pageName);
    }

    return () => {
      // Cleanup observers if needed
    };
  }, [pageName]);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor; 