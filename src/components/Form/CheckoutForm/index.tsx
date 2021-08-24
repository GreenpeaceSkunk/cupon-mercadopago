import React, { FormEvent, memo, useCallback, useContext, useEffect, useMemo, useState, useRef, useReducer } from 'react';
import { FormContext, IFormComponent } from '../context';
import { OnChangeEvent } from 'greenpeace';
import { validateCardHolderName, validateCitizenId, validateCreditCard, validateCvv, validateEmptyField, validateMonth, validateYear } from '../../../utils/validators';
import { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import { HGroup } from '@bit/meema.ui-components.elements';
import {
  getPublicKey,
  doSubscriptionPayment,
} from '../../../services/mercadopago';
import { 
  Input,
} from '@bit/meema.gpar-ui-components.form';
import Shared from '../../Shared';
import { trackEvent as trackDataCrushEvent } from '../../../utils/dataCrush';
import { initialState, reducer } from './reducer';
import { createToken, getInstallments, setPublishableKey } from '../../../utils/mercadopago';
import { pushToDataLayer } from '../../../utils/googleTagManager';

const Component: React.FunctionComponent<IFormComponent> = memo(({
  formIndex,
}) => {
  const { data: {
    payment,
    user,
  }, step, dispatch, goNext } = useContext(FormContext);
  const [ showError, setShowError ] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const [{ errors, submitting, submitted }, dispatchFormErrors ] = useReducer(reducer, initialState);

  const onChangeHandler = useCallback((evt: OnChangeEvent) => {
    evt.preventDefault();
    dispatch({
      type: 'UPDATE_PAYMENT_DATA',
      payload: { [ evt.currentTarget.name ]: evt.currentTarget.value }
    });
  }, [
    payment,
    dispatch,
  ]);

  const onUpdateFieldHandler = useCallback((fieldName: string, isValid: boolean, value: any) => {
    dispatchFormErrors({
      type: 'UPDATE_FIELD_ERRORS',
      payload: {
        fieldName,
        isValid,
      }
    });
  }, [
    dispatch,
  ]);

  const onSubmitHandler = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();
    (async () => {
      dispatchFormErrors({
        type: 'SUBMIT',
      });

      if(formRef.current) {
        setPublishableKey(await getPublicKey());
        const token = await createToken(formRef.current);
        const amount = payment.amount === 'otherAmount' ? payment.newAmount : payment.amount;
        if(token.isValid) {
          const paymentMethod = await getInstallments({
            bin: payment.cardNumber.slice(0, 6),
            amount,
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
              amount,
              nombre: payment.cardholderName, // En la doc dice Nombre del titular de la tarjeta de crédito
              apellido: payment.cardholderName, // En la doc dice Apellido del titular de la tarjeta de crédito
              cod_area: user.areaCode,
              telefono: user.phoneNumber,
              email: user.email,
              genero: '', // No diferencia genero
              pais: '', // Argentina
              direccion: '', // Avenida siempre viva 742
              localidad: '', // Capital Federal
              provincia: '', // Buenos Aires
              codigo_provincia: '', // 001
              codigo_postal: '', // 1258
              ocupacion: '', // Empleado
              tipodocumento: payment.docType, // No hay enum
              mes_vencimiento: payment.cardExpirationMonth,
              ano_vencimiento: payment.cardExpirationYear,
              documento: payment.docNumber,
              firstDigits: payment.cardNumber.slice(0, 6),
              lastDigits: payment.cardNumber.slice(payment.cardNumber.length - 4),
              date: new Date(),// '2021-6-28',
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
            
            console.log('Payload', payload);
            const result = await doSubscriptionPayment(payload);

            if(result['error']) {
              setShowError(true);
              setErrorMessage('');
            } else {
              setShowError(false);
              setErrorMessage('');
              trackDataCrushEvent(`${process.env.REACT_APP_DATA_CRUSH_EVENT_SK_DONACION_PASO_2}`, user.email);

              window.userAmount = amount;

              goNext();
            }
            
            dispatchFormErrors({
              type: 'SUBMITTED',
            });
          } else {
            setShowError(true);
            setErrorMessage('Ocurrió un error inesperado. Revisa el monto.');
            dispatchFormErrors({
              type: 'SUBMITTED',
            });
          }
        } else {
          console.log('No se creó el Token', token.message);
          setShowError(true);
          setErrorMessage(token.message);
          dispatchFormErrors({
            type: 'SUBMITTED',
          });
        }
      }
    })();
  }, [
    formRef,
    // formId,
    payment,
    user,
    showError,
    errorMessage,
    goNext,
  ]);

  // useEffect(() => {
  //   (() => {
  //     if(fetching) {
  //       const timeOut = setTimeout(() => {
  //         setFetching(false);
  //         goNext();
  //       }, 1000);
        
  //       return () => {
  //         clearTimeout(timeOut);
  //       }
  //     }
  //   })();
  // }, [
  //   fetching,
  //   goNext,
  // ]);

  useEffect(() => {
    // setFormId(`checkout-form-id-${new Date().getTime()}`);
  }, [])

  return useMemo(() => (
    <Shared.Form.Main
      // id={formId}
      id='transaction-form'
      ref={formRef}
      onSubmit={onSubmitHandler}
    >
      <Shared.Form.Header>
        <HGroup>
          <Shared.General.Title>DONÁ AHORA</Shared.General.Title>
        </HGroup>
        <Shared.General.Text>Te enviaremos información sobre nuestras acciones y la forma en que puedes ayudarnos a lograrlo.</Shared.General.Text>
      </Shared.Form.Header>
      <Shared.Form.Content>
        <Shared.Form.Row>
          <Shared.Form.Column
            bottomText='Escribe solo números. No agregues guiones.'
          >
            <Shared.Form.Group
              fieldName='cardNumber'
              value={payment.cardNumber}
              labelText='Número de la tarjeta'
              showErrorMessage={true}
              validateFn={validateCreditCard}
              onUpdateHandler={onUpdateFieldHandler}
              >
              <Input
                type='text'
                id='cardNumber'
                name='cardNumber'
                placeholder='Ej. 4509953566233704'
                data-checkout='cardNumber'
                maxLength={16}
                value={payment.cardNumber}
                onChange={onChangeHandler}
                />
            </Shared.Form.Group>
          </Shared.Form.Column>
        </Shared.Form.Row>

        <Shared.Form.Row>
          <Shared.Form.Column>
            <Shared.Form.Group
              fieldName='securityCode'
              value={payment.securityCode}
              labelText='Código de seguridad'
              showErrorMessage={true}
              validateFn={validateCvv}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Input
                type='password'
                id='securityCode'
                name='securityCode'
                placeholder='Ej. 123'
                data-checkout='securityCode'
                maxLength={4}
                value={payment.securityCode}
                onChange={onChangeHandler}
              />
            </Shared.Form.Group>
          </Shared.Form.Column>
        </Shared.Form.Row>
        
        <Shared.Form.Row>
          <Shared.Form.Column>
            <Shared.Form.Group
              fieldName='cardExpirationMonth'
              value={payment.cardExpirationMonth}
              labelText='Mes de expiración'
              showErrorMessage={true}
              validateFn={validateMonth}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Shared.Form.Select
                id='cardExpirationMonth'
                name='cardExpirationMonth'
                data-checkout='cardExpirationMonth'
                value={payment.cardExpirationMonth}
                onChange={onChangeHandler}
              >
                <option></option>
                {(['01','02','03','04','05','06','07','08','09','10','11','12']).map((value: string, key: number) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </Shared.Form.Select>
              {/* <Input
                type='text'
                id='cardExpirationMonth'
                name='cardExpirationMonth'
                placeholder='Ej. 11'
                data-checkout='cardExpirationMonth'
                maxLength={2}
                value={payment.cardExpirationMonth}
                onChange={onChangeHandler}
              /> */}
            </Shared.Form.Group>
            <Shared.Form.Group
              fieldName='cardExpirationYear'
              value={payment.cardExpirationYear}
              labelText='Año de expiración'
              showErrorMessage={true}
              validateFn={validateYear}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Shared.Form.Select
                id='cardExpirationYear'
                name='cardExpirationYear'
                data-checkout='cardExpirationYear'
                value={payment.cardExpirationYear}
                onChange={onChangeHandler}
              >
                <option></option>
                {(Array.from(Array(20).keys()).map((value) => value + 2021)).map((value: number, key: number) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </Shared.Form.Select>
              {/* <Input
                type='text'
                id='cardExpirationYear'
                name='cardExpirationYear'
                placeholder='Ej. 2025'
                data-checkout='cardExpirationYear'
                maxLength={4}
                value={payment.cardExpirationYear}
                onChange={onChangeHandler}
              /> */}
            </Shared.Form.Group>
          </Shared.Form.Column>
        </Shared.Form.Row>
        
        <Shared.Form.Row>
          <Shared.Form.Column>
            <Shared.Form.Group
              fieldName='docType'
              value={payment.docType}
              labelText='Tipo de documento'
              showErrorMessage={true}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Shared.Form.Select
                id='docType'
                name='docType'
                data-checkout='docType'
                value={payment.docType}
                onChange={onChangeHandler}
              >
                <option></option>
                {(['DNI', 'Cédula de identidad', 'LC', 'LE', 'Otro']).map((value: string, key: number) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </Shared.Form.Select>
            </Shared.Form.Group>
            <Shared.Form.Group
              fieldName='docNumber'
              value={payment.docNumber}
              labelText='Número de documento'
              showErrorMessage={true}
              validateFn={validateCitizenId}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Input
                type='text'
                id='docNumber'
                name='docNumber'
                placeholder='Ej. 31402931'
                data-checkout='docNumber'
                maxLength={8}
                value={payment.docNumber}
                onChange={onChangeHandler}
              />
            </Shared.Form.Group>
          </Shared.Form.Column>
        </Shared.Form.Row>

        <Shared.Form.Row>
          <Shared.Form.Column>
            <Shared.Form.Group
              value={payment.cardholderName}
              fieldName='cardholderName'
              labelText='Titular de la tarjeta'
              validateFn={validateCardHolderName}
              onUpdateHandler={onUpdateFieldHandler}
              showErrorMessage={true}
            >
              <Input
                type='text'
                id='cardholderName'
                name='cardholderName'
                data-checkout='cardholderName'
                placeholder='Ej. Daniela Lopez'
                value={payment.cardholderName}
                onChange={onChangeHandler}
              />
            </Shared.Form.Group>
          </Shared.Form.Column>
        </Shared.Form.Row>
      </Shared.Form.Content>

      {(showError) ? (
        <Shared.Form.ErrorMessage>
          {(errorMessage !== '') ? errorMessage : 'Tenés campos incompletos o con errores. Revisalos para continuar.'}
        </Shared.Form.ErrorMessage>
      ) : null}

      <Shared.Form.Nav
        formIndex={formIndex}
        customCss={css`
          ${((step - 1) !== formIndex) && css`
            display: none;
          `}
        `}
      >
        <Shared.General.Button
          type='submit'
          disabled={(submitting) ? true : false}
          customCss={css`
            width: 100%;

            ${(submitting) && css`
              padding-top: ${pixelToRem(10)};
              padding-bottom: ${pixelToRem(10)};
            `}
          `}
        >{(submitting) ? <Shared.Loader mode='light' /> : `Doná`}</Shared.General.Button>
        <Shared.General.Link href={`${process.env.REACT_APP_PRIVACY_POLICY_URL}`}>
          Politicas de privacidad
        </Shared.General.Link>
      </Shared.Form.Nav>
    </Shared.Form.Main>
  ), [
    formRef,
    // formId,
    showError,
    payment,
    user,
    submitting,
    submitted,
    errors,
    // fetching,
    errorMessage,
    step,
    formIndex,
    setShowError,
    onSubmitHandler,
    onChangeHandler,
    onUpdateFieldHandler,
    goNext,
  ]);
});

Component.displayName = 'CheckoutForm';
export default Component;
