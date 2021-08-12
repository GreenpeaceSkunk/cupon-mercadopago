export const initialize = () => {
  (async () => {
    await initializeSynchro();
    await initializeTrackEvent();
  })();
}

export const initializeSynchro = async () => {
  return await (async () => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//tr.datacrush.la/synchro/synchro.js?${(Math.ceil(new Date().getTime() / 3000)*3000)}`;
    document.body.appendChild(script);
  })();
}

export const initializeTrackEvent = async () => {
  return await (async () => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//tr.datacrush.la/portal/${process.env.REACT_APP_DATA_CRUSH_PORTAL_ID}.js`;
    document.body.appendChild(script);
  })();
}

export const synchroInit = async (data:any = {}, eventId = '') => {
  console.log('Synchro init', data);
  if(window.dcS.synchro) {
    window.dcS.synchro.init({
      portalID: `${process.env.REACT_APP_DATA_CRUSH_PORTAL_ID}`,
      synchroKey: `${process.env.REACT_APP_DATA_CRUSH_SYNCHRO_KEY}`,
    }, data, () => {
      console.log('Synchronized');
      if(eventId !== '') {
        trackEvent(eventId, data.email || '');
      }
    });
  } else {
    console.log('Data Crush Synchro is unvailable');
  }
}


export const trackEvent = (eventId: string, userEmail = '') => {
  console.log('eventId', eventId)
  try {
    window.dc.track.event(`${process.env.REACT_APP_DATA_CRUSH_PORTAL_ID}`, eventId, userEmail);
    console.log('Tracked Event %s', eventId);
  } catch(error: any) {
    console.log('Error when trying to track Event %s', eventId);
  }
};