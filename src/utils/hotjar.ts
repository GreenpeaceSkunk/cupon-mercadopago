export const initialize = async (hjid: number, hjsv: number) => {
  return await (async () => {
    const HOTJAR_URL = '//static.hotjar.com/c/hotjar-';
    const HOTJAR_EXTENSION = '.js?sv=';
    window.hj = {
      q: [ window, document, HOTJAR_URL, HOTJAR_EXTENSION],
    }
    window._hjSettings = {
      hjid,
      hjsv,
    };
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `${HOTJAR_URL}${hjid}${HOTJAR_EXTENSION}${hjsv}`;
    document.body.appendChild(script);
  })();
}
