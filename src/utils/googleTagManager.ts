import TagManager from 'react-gtm-module'
import { GoogleTagManagerEventType as EventType } from 'greenpeace';

export const initialize = (gtmId: any) => {
  const tagManagerArgs = { gtmId };
  TagManager.initialize(tagManagerArgs);
}

export const pushToDataLayer = (event: EventType) => {
  if(window.dataLayer) {
    window.dataLayer.push({...event});
  }
}
