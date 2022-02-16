import Analytics, { AnalyticsInstance } from 'analytics';
import googleAnalytics from '@analytics/google-analytics';

let analytics: AnalyticsInstance;

export const initialize = (app: string, trackingId: string) => {
  analytics = Analytics({
    app,
    plugins: [
      googleAnalytics({
        trackingId,
      })
    ]
  })
}

export const trackPage = (url = '', pathname = '', search = '') => {
  if(analytics) {
    analytics.page({
      url: (url !== '') ? url : window.location.href,
      path: (pathname !== '') ? pathname : window.location.pathname,
      search: (search !== '') ? search : window.location.search,
    });
  }
}
