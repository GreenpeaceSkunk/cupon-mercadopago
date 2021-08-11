import { tokenToString } from "typescript";

export const initialize = () => {
  (async () => {
    await initializeSdk();
  })();
}

export const initializeSdk = async () => {
  return await (async () => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    // script.src = `//secure.mlstatic.com/sdk/javascript/v1/mercadopago.js`;
    script.src = `//secure.mlstatic.com/sdk/javascript/v2/mercadopago.js`;
    document.body.appendChild(script);
  })();
}

export const setPublishableKey = (publicKey: string) => {
  window.Mercadopago.setPublishableKey(publicKey);
}

export const createToken = async (form: HTMLFormElement):Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const result = async (status: any, response: any) => {
      // console.log(status);
      if (status == 200 || status == 201) {
        if(form) {
          let card = document.createElement('input');
          card.setAttribute('name', 'token');
          // card.setAttribute('type', 'hidden');
          card.setAttribute('value', response.id);
          form.appendChild(card);
          resolve(true);
        }
      } else {
        alert("Verify filled data!\n"+JSON.stringify(response, null, 4));
        resolve(false);
      }
    }
    window.Mercadopago.createToken(form, result);
  });
}

export const getInstallments = async (params: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    console.log("getInstallments", params);
    window.Mercadopago.getInstallments(params, (status: number, installments: any[]) => {
      if(installments.length) {
        const paymentMethods = installments.map((paymentMethod: any) => (
          paymentMethod.processing_mode === 'gateway' ? paymentMethod : null
        )).filter((paymentMethod: any) => paymentMethod !== null);
        resolve(paymentMethods.length ? paymentMethods[0] : null);
      } else {
        resolve(null);
      }
    });
  });
}