import ReactPixel from 'react-facebook-pixel';

export const initialize = () => {
  ReactPixel.init(`${process.env.REACT_APP_FACEBOOK_PIXEL_ID}`);
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