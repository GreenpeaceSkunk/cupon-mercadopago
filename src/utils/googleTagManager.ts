import TagManager from 'react-gtm-module'
import { GoogleTagManagerEventType as EventType } from 'greenpeace';

export const initialize = () => {
  const tagManagerArgs = { gtmId: `${process.env.REACT_APP_GOOGLE_TAG_MANAGER}` };
  TagManager.initialize(tagManagerArgs);
}

export const pushToDataLayer = (event: EventType) => {
  if(window.dataLayer) {
    window.dataLayer.push({event});
  }
}
