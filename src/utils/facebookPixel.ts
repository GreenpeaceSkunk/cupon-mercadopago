import ReactPixel from 'react-facebook-pixel';

export const initialize = (pixelId: number) => {
  ReactPixel.init(`${pixelId}`);
}

export const trackEvent = (event: 'PageView' | 'Donate' ) => {
  switch(event) {
    case 'PageView':
      ReactPixel.pageView();
      break;
    default:
      ReactPixel.track(event);
  }
} 
