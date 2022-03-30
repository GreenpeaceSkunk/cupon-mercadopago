export const initialize = async (id: number) => {
  return await (async () => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//js.hs-scripts.com/${id}.js`;
    script.id = 'hs-script-loader';
    document.body.appendChild(script);
  })();
}

