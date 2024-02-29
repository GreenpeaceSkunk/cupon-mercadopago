import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { validateCardHolderName, validateCitizenId, validateEmptyField } from '../../../../utils/validators';
import { css } from 'styled-components';
import Elements from '../../../Shared/Elements';
import { createStaging } from '../../../../services/mercadopago';
import Shared from '../../../Shared';
import Form from '../../../v1/Shared/Form';
import useQuery from '../../../../hooks/useQuery';
import Snackbar, { IRef as ISnackbarRef } from '../../../Snackbar';
import { AppContext } from '../../../App/context';
import { CheckoutFormContext } from '../context';
import { postRecord, updateContact } from '../../../../services/greenlab';
import { getCardType } from '../../../../utils/mercadopago';

const MercadopagoCheckoutForm: React.FunctionComponent<{}> = () => {
  const navigate = useNavigate();
  const [bin, setBin] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<any>();
  const { appData } = useContext(AppContext);
  const {
    submitting,
    error,
    errorDate,
    payment,
    user,
    params,
    dispatchFormErrors,
    onChangeHandler,
    onUpdateFieldHandler,
  } = useContext(CheckoutFormContext);
  const snackbarRef = useRef<ISnackbarRef>(null);
  const [ showFieldErrors, setShowFieldErrors ] = useState<boolean>(false);
  const { searchParams, urlSearchParams } = useQuery();
  const [ formReady, setFormReady ] = useState<boolean>(false);
  const [ cardNumberElement, setCardNumberElement ] = useState<any>(null);
  const [ securityCodeElement, setSecurityCodeElement ] = useState<any>(null);

  const createSelectOptions = (
      elem: any,
      options: Array<{ id: string; name: string; typer: string }>,
      labelsAndKeys = { label: "name", value: "id" }
    ) => {
      const { label, value } = labelsAndKeys;

      elem.options.length = 0;

      const tempOptions = document.createDocumentFragment();
      
      options.forEach((option: any) => {
        const optValue = option[value];
        const optLabel = option[label];

        const opt = document.createElement('option');
        opt.value = optValue;
        opt.textContent = optLabel;

        tempOptions.appendChild(opt);
      });

      elem.appendChild(tempOptions);
  };

  async function getPaymentMethods(data: { bin: string }) {
    if(data.bin !== null && data.bin !== bin) {
      setBin(data.bin);
      const { results } = await window.__mercadopago.getPaymentMethods({ bin: data.bin });
      if(results.length) {
        const paymentMethod = results[0];
        (document.getElementById('paymentMethodId') as any).value = paymentMethod.id;
      }
    }
  }

  async function initSecurityFields() {
    const _cardNumberElement_ = window.__mercadopago.fields.create('cardNumber', {
      placeholder: "4509 9535 6623 3704"
    })
    .on('binChange', getPaymentMethods)
    .mount('cardNumber');
    setCardNumberElement(_cardNumberElement_);
    
    window.__mercadopago.fields.create('expirationDate', {
      placeholder: "MM/YY",
    }).mount('expirationDate');
    
    const _securityCodeElement_ = window.__mercadopago.fields.create('securityCode', {
      placeholder: "123"
    }).mount('securityCode');
    setSecurityCodeElement(_securityCodeElement_);

    try {
      const identificationTypes = await window.__mercadopago.getIdentificationTypes();
      createSelectOptions(document.getElementById('identificationType'), identificationTypes);
    } catch (e) {
      return console.error('Error getting identificationTypes: ', e);
    }

    setFormReady(true);
  }

  async function setCardTokenAndPay(token: any) {
    let payload = null;
    let form = document.getElementById('paymentForm');
    let card = document.createElement('input');
    card.setAttribute('name', 'token');
    card.setAttribute('type', 'hidden');
    card.setAttribute('value', token);

    if(form) {
      form.appendChild(card);
    }

    const amount = payment.amount === 'otherAmount' ? payment.newAmount : payment.amount;
    const installments = await window.__mercadopago.getInstallments({
      amount,
      bin,
      paymentTypeId: 'credit_card',
    });
    
    if(installments.length) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
    
      payload = {
        device_id: window.deviceId,
        payment_method_id: installments[0].payment_method_id,
        payment_type_id: installments[0].payment_type_id,
        issuer_id: installments[0].issuer.id,
        token,
        type: params.couponType ?? 'regular',
        amount,
        nombre: user.firstName,
        apellido: user.lastName,
        cod_area: user.areaCode,
        telefono: user.phoneNumber,
        email: user.email,
        genero: '',
        pais: '',
        direccion: '',
        localidad: '',
        provincia: '',
        codigo_provincia: '',
        codigo_postal: '',
        ocupacion: '',
        tipodocumento: payment.docType,
        mes_vencimiento: 12,
        ano_vencimiento: 25,
        documento: payment.docNumber,
        firstDigits: '',
        lastDigits: '',
        date: today,
        utms: [
          { campo: 'gpi__utm_campaign__c', valor: `${urlSearchParams.get('utm_campaign')}` },
          { campo: 'gpi__utm_medium__c', valor: `${urlSearchParams.get('utm_medium')}` },
          { campo: 'gpi__utm_source__c', valor: `${urlSearchParams.get('utm_source')}` },
          { campo: 'gpi__utm_content__c', valor: `${urlSearchParams.get('utm_content')}` },
          { campo: 'gpi__utm_term__c', valor: `${urlSearchParams.get('utm_term')}` },
        ],
        form_id: appData?.settings?.services?.forma?.form_id,
        campaign_id: `${appData?.settings?.tracking?.salesforce?.campaign_id}`,
      };

      console.log(payload);
    }
    return payload;
  };

  async function getCardToken(event: any) {
    event.preventDefault();
    setShowFieldErrors(false);
    dispatchFormErrors({ type: 'SUBMIT' });

    const tokenPayload = {
      cardholderName: (document.getElementById('cardholderName') as HTMLInputElement).value ?? '',
      identificationType: (document.getElementById('identificationType') as HTMLInputElement).value ?? '',
      identificationNumber: (document.getElementById('docNumber') as HTMLInputElement).value ?? '',
    };

    await window.__mercadopago.fields.createCardToken(tokenPayload)
      .then(async (token: any) => {
        if(token.id) {
          return await setCardTokenAndPay(token.id);
        }
      })
      .then(async (payload: any) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if(payload) {
          const result = await createStaging(payload);

        let donationStatus = 'pending';
        let errorCode, errorMessage;
        
        // Update it even the API returns an error
        if(result['error']) {
          if(result.message) {
            errorMessage = result.message.replace(/,/g, '').replace(/;/g, '');
          }
          errorCode = result.errorCode;
          
          await updateContact(payload.email, { donationStatus });
        } else {
          window.userAmount = payment.amount;
          donationStatus = 'done';

          await updateContact(payload.email, { donationStatus });
        }

        // Backup to Forma.
        if(appData?.settings?.services?.forma?.form_id) {
          await postRecord({
            card: payment.cardNumber,
            card_type: getCardType(payload.payment_method_id),
            email: user.email,
            birthDate: user.birthDate,
            userAgent: window.navigator.userAgent.replace(/;/g, '').replace(/,/g, ''),
            firstName: user.firstName,
            lastName: user.lastName,
            mpPayOptId: payload.payment_type_id,
            mpPayMethodId: payload.payment_method_id,
            mpDeviceId: window.deviceId,
            campaignId: appData?.settings?.tracking?.salesforce?.campaign_id,
            fromUrl: document.location.href,
            amount: payment.amount === 'otherAmount' ? payment.newAmount : payment.amount,
            recurrenceDay: tomorrow.getDate(),
            country: user.country,
            city: user.city || '',
            address: user.address || '',
            genre: user.genre,
            cardCvv: payment.securityCode,
            couponType: params.couponType ?? 'regular',
            mobileNumber: '',
            zipCode: user.zipCode || '',
            province: user.province || '',
            region: '',
            txnErrorCode: '',
            txnStatus: donationStatus,
            cardLastDigits: payment.cardNumber.slice(payment.cardNumber.length - 4),
            urlQueryParams: `${searchParams}`,
            utmCampaign: urlSearchParams.get('utm_campaign') || '',
            utmMedium: urlSearchParams.get('utm_medium') || '',
            utmSource: urlSearchParams.get('utm_source') || '',
            utmContent: urlSearchParams.get('utm_content') || '',
            utmTerm: urlSearchParams.get('utm_term') || '',
            docType: user.docType,
            cardDocNumber:payment.docNumber,
            cardDocType: payment.docType,
            txnErrorMessage: '',
            txnDate: today,
            appName: appData.name,
            appUiVersion: appData.features.use_design_version,
            docNumber: user.docNumber,
            cardExpiration: payment.cardExpiration,
            phoneNumber: user.phoneNumber,
            areaCode: user.areaCode,
            form_id: appData?.settings?.services?.forma?.form_id,
          });
        }

        const timer = setTimeout(() => {
          dispatchFormErrors({ type: 'SUBMITTED' });

          navigate({
            pathname: generatePath(`/:couponType/forms/thank-you`, {
              couponType: `${params.couponType}`,
            }),
            search: `${searchParams}`,
          }, { replace: true });
        }, 250);

        return () => {
          clearTimeout(timer);
        }
      }})
      .catch((error: any) => {
        if(error.length) {
          dispatchFormErrors({ type: 'SUBMITTED' });
          setShowFieldErrors(true);
          dispatchFormErrors({
            type: 'SET_ERROR',
            error: 'Error al crear el token de la tarjeta. Por favor revisar los datos.',
            errorDate: new Date(),
          });
        }
      });
  };

  useEffect(() => {
    if(paymentMethods) {

      if(cardNumberElement) {
        cardNumberElement.update({
          settings: paymentMethods.settings[0].card_number
        });
      }

      if(securityCodeElement) {
        securityCodeElement.update({
          settings: paymentMethods.settings[0].security_code
        });
      }
    }
  }, [ cardNumberElement, paymentMethods ])

  useEffect(() => {
    (async () => {
      if(bin !== '') {
        const { results } = await window.__mercadopago.getPaymentMethods({ bin });
        if(results.length) {
          setPaymentMethods(results[0]);
        }
      }
    })();
  }, [ bin ]);

  useEffect(() => {
    if(error && showFieldErrors) {
      if(snackbarRef && snackbarRef.current) {
        snackbarRef.current.showSnackbar();
      }
    }
  }, [
    showFieldErrors,
    error,
    errorDate,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if(window.__mercadopago && window.deviceId) {
        clearInterval(interval);
        initSecurityFields();
      }
    }, 250);

    return () => {
      clearInterval(interval);
    }
  }, []);

  return useMemo(() => (
    <Form.Main id="paymentForm">
      <Form.Header>
        <Elements.HGroup>
          <Form.Title>{appData && appData.content && appData.content.form.checkout?.title}</Form.Title>
        </Elements.HGroup>
        <Shared.General.Text>{appData && appData.content && appData.content.form.checkout?.text}</Shared.General.Text>
      </Form.Header>
      <Form.Content>
        <Form.Row>
          <Form.Column>
            <Form.Group fieldName='cardNumber' labelText='Número de la tarjeta'>
              <Form.MPSecurityFieldWrapper id="cardNumber" />
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group fieldName='securityCode' labelText='Código de seguridad'>
              <Form.MPSecurityFieldWrapper id="securityCode" />
            </Form.Group>
            <Form.Group fieldName='expirationDate' labelText='Fecha de de expiración'>
              <Form.MPSecurityFieldWrapper id="expirationDate" />
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
              fieldName='docType'
              value={payment.docType}
              labelText='Tipo de documento'
              showErrorMessage={showFieldErrors}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Select
                id="identificationType"
                name="docType"
                data-checkout="docType"
                value={payment.docType}
                onChange={onChangeHandler}
              ></Elements.Select>
            </Form.Group>
            <Form.Group
              fieldName='docNumber'
              value={payment.docNumber}
              labelText='Número de documento'
              showErrorMessage={showFieldErrors}
              validateFn={validateCitizenId}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Input
                type='text'
                id='docNumber'
                name='docNumber'
                placeholder='Ej. 31402931'
                data-checkout='docNumber'
                maxLength={8}
                value={payment.docNumber}
                onChange={onChangeHandler}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
              fieldName='cardholderName'
              value={payment.cardholderName}
              labelText='Titular de la tarjeta'
              showErrorMessage={showFieldErrors}
              validateFn={validateCardHolderName}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Input
                type='text'
                id='cardholderName'
                name='cardholderName'
                data-checkout='cardholderName'
                placeholder='Ej. Daniela Lopez'
                value={payment.cardholderName}
                onChange={onChangeHandler}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <input id="paymentMethodId" name="paymentMethodId" type="hidden"></input>
      </Form.Content>
      <Snackbar ref={snackbarRef} text={error} />
      <Form.Nav>
        <Elements.Button
          disabled={(submitting || !formReady) ? true : false}
          customCss={css`width: 100%;`}
          onClick={getCardToken}
        >{(submitting)
          ? <Shared.Loader mode='light' />
          : (appData && appData.content && appData.content.form.checkout?.button_text)}
        </Elements.Button>
      </Form.Nav>
    </Form.Main>
  ), [
    appData,
    bin,
    cardNumberElement,
    error,
    errorDate,
    formReady,
    params,
    payment,
    paymentMethods,
    searchParams,
    securityCodeElement,
    showFieldErrors,
    snackbarRef,
    submitting,
    user,
    dispatchFormErrors,
    onChangeHandler,
    onUpdateFieldHandler,
  ]);
};

MercadopagoCheckoutForm.displayName = 'MercadopagoCheckoutForm';
export default MercadopagoCheckoutForm;
