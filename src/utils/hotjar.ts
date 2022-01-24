export const initialize = async () => {
  return await (async () => {
    console.log('Initialize Hotjar');
    const HOTJAR_URL = '//static.hotjar.com/c/hotjar-';
    const HOTJAR_EXTENSION = '.js?sv=';
    window.hj = {
      q: [ window, document, HOTJAR_URL, HOTJAR_EXTENSION],
    }
    window._hjSettings = {
      hjid: parseInt(`${process.env.REACT_APP_HOTJAR_ID}`),
      hjsv: parseInt(`${process.env.REACT_APP_HOTJAR_SV}`),
    };
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `${HOTJAR_URL}${process.env.REACT_APP_HOTJAR_ID}${HOTJAR_EXTENSION}${process.env.REACT_APP_HOTJAR_SV}`;
    document.body.appendChild(script);
  })();
}
