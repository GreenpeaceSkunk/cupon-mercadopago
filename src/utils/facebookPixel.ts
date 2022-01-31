import ReactPixel from 'react-facebook-pixel';

export const initialize = (pixelId: number) => {
  // ReactPixel.init(`${process.env.REACT_APP_FACEBOOK_PIXEL_ID}`);
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
