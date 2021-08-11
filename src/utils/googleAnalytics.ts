import Analytics, { AnalyticsInstance } from 'analytics';
import googleAnalytics from '@analytics/google-analytics';

let analytics: AnalyticsInstance;

export const initialize = () => {
  analytics = Analytics({
    app: `${process.env.REACT_APP_NAME}`,
    plugins: [
      googleAnalytics({
        trackingId: `${process.env.REACT_APP_GOOGLE_ANALYTICS_ID}`,
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