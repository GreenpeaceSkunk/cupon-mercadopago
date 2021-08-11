import React, { FormEvent, memo, MouseEvent, useCallback, useContext, useEffect, useMemo, useState, } from 'react';
import { FormContext } from '../context';
import { FormFieldsType, OnChangeEvent } from 'greenpeace';
import { validateBirthDate, validateEmail } from '../../../utils/validators';
import { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import { HGroup, Wrapper, } from '@bit/meema.ui-components.elements';
import {
  getPublicKey,
  getPaymentMethods,
  getPaymentMethodsSearch,
  getPaymentMethodsInstallments,
  getIdentificationTypes,
  doSubscriptionPayment,
} from '../../../services/mercadopago';
import { 
  Group as FormGroup, 
  Label as FormLabel,
  Input as FormInput,
  // Select as FormSelect,
} from '@bit/meema.gpar-ui-components.form';
import Shared from '../../Shared';
import { addOrRemoveSlashToDate } from '../../../utils';
import { synchroInit } from '../../../utils/dataCrush';
import { useRef } from 'react';
import { createToken, getInstallments, setPublishableKey } from '../../../utils/mercadopago';
import { ControlsWrapper } from '@bit/meema.ui-components.carousel';

const Component: React.FunctionComponent<{}> = memo(() => {
  const { data: {
    payment,
  }, dispatch, goNext } = useContext(FormContext);
  const [ isValid, setIsValid ] = useState<boolean>(false);
  const [ showError, setShowError ] = useState<boolean>(false);
  const [ allowContiunue, setAllowContinue ] = useState<boolean>(false);
  const [ errors, setErrors ] = useState<FormFieldsType>({
    cardExpirationMonth: false,
    cardExpirationYear: false,
    cardholderName: false,
    cardNumber: false,
    issuerInput: false,
    paymentMethodId: false,
    securityCode: false,
    transactionAmount: false,
    docNumber: false,
    docType: false,
  });
  const [ fetching, setFetching ] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [ identificationTypes, setIdentificationTypes ] = useState<any[]>([]);

  const onChange = useCallback((evt: OnChangeEvent) => {
    evt.preventDefault();

    dispatch({
      type: 'UPDATE_PAYMENT_DATA',
      payload: { [ evt.currentTarget.name ]: evt.currentTarget.value }
    });
  }, [
    // cardExpirationMonth,
    // cardExpirationYear,
    // cardholderName,
    // cardNumber,
    // issuerInput,
    // paymentMethodId,
    // securityCode,
    // transactionAmount,
    // docNumber,
    // docType,
    dispatch,
  ]);

  const setCardTokenAndPay = useCallback(async (status: any, response: any) => {
    console.log('setCardTokenAndPay', response)
    if (status == 200 || status == 201) {
      console.log(status, response.id)
      if(formRef.current) {
        let card = document.createElement('input');
        card.setAttribute('name', 'token');
        // card.setAttribute('type', 'hidden');
        card.setAttribute('value', response.id);
        formRef.current.appendChild(card);

        // const paymentMethodsResult = await getPaymentMethodsInstallments({
        //   public_key: 'TEST-a2592651-c4b5-4672-bbdb-4c0507e25414',
        //   bin: '450995',
        // });
        // console.log(paymentMethodsResult);
        // if(paymentMethodsResult.length) {
        //   const paymentMethods = paymentMethodsResult.map((paymentMethod: any) => (
        //     paymentMethod.processing_mode === 'gateway' ? paymentMethod : null
        //   )).filter((paymentMethod: any) => paymentMethod !== null);

        //   console.log(paymentMethods);
        // }
        // const result = await doSubscriptionPayment({
        //   payment_method_id: '',
        //   issuer_id: '',
        //   merchant_account_id: '',
        //   payment_method_option_id: '',
        //   token: response.id,
        //   type: 'regular',
        // });
        // console.log(result);
      }
    } else {
      alert('Verify filled data!\n'+JSON.stringify(response, null, 4));
    }
 }, []);

  const onSubmit = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();

    (async () => {
      if(formRef.current) {
        console.log("Payment", payment);
        setPublishableKey(await getPublicKey());
        if(await createToken(formRef.current)) {
          const paymentMethod = await getInstallments({
            bin: payment.cardNumber.slice(0, 6),
            amount: 100,
          });

          if(paymentMethod) {
            const merchantAccounts = (paymentMethod.agreements.length) ? paymentMethod.agreements[0].merchant_accounts : [];
            let merchantAccount = merchantAccounts.filter((a: any) => {
              if(`${process.env.REACT_APP_COUPON_TYPE}` === 'regular' && a.branch_id === 'regular') {
                return a;
              }
              if(`${process.env.REACT_APP_COUPON_TYPE}` === 'oneoff' && a.branch_id === null) {
                return a;
              }
            });

            const payload = {
              payment_method_id: paymentMethod.payment_method_id,
              issuer_id: paymentMethod.issuer.id,
              token: window.Mercadopago.tokenId,
              type: `${process.env.REACT_APP_COUPON_TYPE}`,
              merchant_account_id: (merchantAccount.length) ? merchantAccount[0].id : null,
              payment_method_option_id: (merchantAccount.length) ? merchantAccount[0].payment_method_option_id : null,
              // 
            
              amount: 100,
              nombre: 'Dan', // En la doc dice Nombre del titular de la tarjeta de crédito
              apellido: 'Tovbein', // En la doc dice Apellido del titular de la tarjeta de crédito
              cod_area: '11',
              telefono: '44442222',
              email: 'doe.deer@email.com',
              genero: 'M', // No diferencia genero
              pais: 'Argentina',
              direccion: 'Avenida siempre viva 742',
              localidad: 'Capital Federal',
              provincia: 'Buenos Aires',
              codigo_provincia: '001',
              codigo_postal: '1258',
              ocupacion: 'Empleado',
              tipodocumento: 'DNI', // No hay enum
              mes_vencimiento: payment.cardExpirationMonth,
              ano_vencimiento: payment.cardExpirationYear,
              documento: payment.docNumber,
              // 4509953566233704
              firstDigits: payment.cardNumber.slice(0, 6),
              lastDigits: payment.cardNumber.slice(payment.cardNumber.length - 4),
              date: '2021-6-28',
              today: 1,
              tomorrow: 2,
              utms: [
              {
                campo: 'gpi__utm_campaign__c',
                valor: 'campaña'
              },
              {
                campo: 'gpi__utm_medium__c',
                valor: 'medium'
              },
              {
                campo: 'gpi__utm_source__c',
                valor: 'source'
              },
              {
                campo: 'gpi__utm_content__c',
                valor: 'content'
              },
              {
                campo: 'gpi__utm_term__c',
                  valor: 'term'
                }
              ]
            }

            console.log(payload);

            const result = await doSubscriptionPayment(payload);
          }
        } else {
          console.log('No se creó el Token');
        }
      }
    })();

    // if(!isValid) {
      // setShowError(true);
    // } else {
      // setFetching(true);
      // synchroInit({
      //   email,
      //   fecha_de_nacimiento: birthDate,
      // });
    // }
  }, [
    formRef,
    isValid,
    payment,
    // cardExpirationMonth,
    // cardExpirationYear,
    // cardholderName,
    // cardNumber,
    // issuerInput,
    // paymentMethodId,
    // securityCode,
    // transactionAmount,
    // docNumber,
    // docType,
  ]);

  useEffect(() => {
    (() => {
      if(fetching) {
        const timeOut = setTimeout(() => {
          setFetching(false);
          goNext();
        }, 1000);
        
        return () => {
          clearTimeout(timeOut);
        }
      }
    })();
  }, [
    fetching,
    goNext,
  ])

  useEffect(() => {
    setIsValid(!Object.values(errors).includes(true));
  }, [
    errors,
  ])

  useEffect(() => {
    setErrors({
      ...errors,
      // email: !validateEmail(email),
      // birthDate: !validateBirthDate(birthDate),
    });
    // setAllowContinue(!errors['email'] && errors['birthDate']);
    setAllowContinue(true);
  }, [
    // cardExpirationMonth,
    // cardExpirationYear,
    // cardholderName,
    // cardNumber,
    // issuerInput,
    // paymentMethodId,
    // securityCode,
    // transactionAmount,
    payment,
  ]);

  return useMemo(() => (
    <Shared.Form.Main
      id='checkout-form'
      ref={formRef}
    >
      <Shared.Form.Header>
        <HGroup>
          <Shared.General.Title>Checkout</Shared.General.Title>
        </HGroup>
        <Shared.General.Text>Te enviaremos información sobre nuestras acciones y la forma en que puedes ayudarnos a lograrlo.</Shared.General.Text>
      </Shared.Form.Header>
      
      <Shared.Form.Content>
      
        <Shared.Form.Row>
          <FormGroup>
            <FormLabel htmlFor='cardNumber'>Número de la tarjeta</FormLabel>
            <FormInput
              type='text'
              id='cardNumber'
              name='cardNumber'
              placeholder='Número telefónico'
              data-checkout='cardNumber'
              value={payment.cardNumber || ''}
              onChange={onChange}
              />
          </FormGroup>
        </Shared.Form.Row>
        
        <Shared.Form.Row>
          <FormGroup>
            <FormLabel htmlFor='cardNumber'>Código de seguridad</FormLabel>
            <FormInput
              type='password'
              id='securityCode'
              name='securityCode'
              placeholder='Código de seguridad'
              data-checkout='securityCode'
              value={payment.securityCode || ''}
              onChange={onChange}
              />
          </FormGroup>
        </Shared.Form.Row>
        
        <Shared.Form.Row>
          <FormGroup>
            <FormInput
              type='text'
              id='cardExpirationMonth'
              name='cardExpirationMonth'
              placeholder='Número telefónico'
              data-checkout='cardExpirationMonth'
              value={payment.cardExpirationMonth || ''}
              onChange={onChange}
              />
          </FormGroup>
          <FormGroup>
            <FormInput
              type='text'
              id='cardExpirationYear'
              name='cardExpirationYear'
              placeholder='Número telefónico'
              data-checkout='cardExpirationYear'
              value={payment.cardExpirationYear || ''}
              onChange={onChange}
              />
          </FormGroup>
        </Shared.Form.Row>

        <Shared.Form.Row>
        <FormLabel htmlFor='docNumber'>Número de documento</FormLabel>

          <FormGroup>
            <FormInput
              type='text'
              id='docType'
              name='docType'
              placeholder='Tipo de documento'
              data-checkout='docType'
              value={payment.docType || ''}
              onChange={onChange}
            />
          </FormGroup>
          
          <FormGroup>
            <FormInput
              type='text'
              id='docNumber'
              name='docNumber'
              placeholder='Número de documento'
              data-checkout='docNumber'
              value={payment.docNumber || ''}
              onChange={onChange}
            />
          </FormGroup>
        </Shared.Form.Row>

        <Shared.Form.Row>
          <FormGroup>
            <FormLabel htmlFor='cardholderName'>Titular de la tarjeta</FormLabel>
            <FormInput
              type='text'
              id='cardholderName'
              name='cardholderName'
              placeholder='Titular de la tarjeta'
              data-checkout='cardholderName'
              value={payment.cardholderName || 'APRO'}
              onChange={onChange}
            />
          </FormGroup>
        </Shared.Form.Row>
      </Shared.Form.Content>

      {payment.docNumber}<br/>
      {payment.cardNumber}<br/>

      <Shared.Form.Nav
        customCss={css`
          display: flex;
          align-items: flex-end;
          padding-top: ${pixelToRem(10)};
          height: 100%;
        `}
      >
        {(!fetching) ? (
          <Shared.General.Button
            onClick={onSubmit}
            type='button'
            disabled={!isValid}
            customCss={css`
              width: 100%;
            `}
          >Doná</Shared.General.Button>
        ) : (
          <Shared.Loader />
        )}
      </Shared.Form.Nav>
    </Shared.Form.Main>
  ), [
    formRef,
    allowContiunue,
    isValid,
    showError,
    payment,
    // cardExpirationMonth,
    // cardExpirationYear,
    // cardholderName,
    // cardNumber,
    // issuerInput,
    // paymentMethodId,
    // securityCode,
    // transactionAmount,
    // docNumber,
    // docType,
    errors,
    fetching,
    setShowError,
    onSubmit,
    onChange,
  ]);
});

Component.displayName = 'CheckoutForm';
export default Component;
