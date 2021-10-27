import React, { FormEvent, memo, useCallback, useContext, useState, useRef, useReducer, useMemo } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { FormContext, IFormComponent } from '../context';
import { OnChangeEvent } from 'greenpeace';
import { validateCardHolderName, validateCitizenId, validateCreditCard, validateCvv, validateEmptyField, validateMonth, validateYear } from '../../../utils/validators';
import { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import Elements from '../../Shared/Elements';
import { getPublicKey, doSubscriptionPayment } from '../../../services/mercadopago';
import Shared from '../../Shared';
import { trackEvent as trackDataCrushEvent } from '../../../utils/dataCrush';
import { initialState, reducer } from './reducer';
import { createToken, getInstallments, setPublishableKey } from '../../../utils/mercadopago';
import { data as jsonData } from '../../../data/data.json';

const Component: React.FunctionComponent<IFormComponent> = memo(({
  formIndex,
}) => {
  const { data: {
    payment,
    user,
  }, params, dispatch } = useContext(FormContext);
  const history = useHistory();
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
  }, []);

  const onSubmitHandler = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();
    
    (async () => {
      dispatchFormErrors({
        type: 'SUBMIT',
      });

      if(process.env.NODE_ENV === 'production') {
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
                if(`${process.env.REACT_APP_COUPON_TYPE}` === 'regular' && paymentMethod.payment_method_id === 'amex') {
                  return a;
                }
                if (params.couponType === 'regular' && a.branch_id === 'regular') {
                  return a;
                }
                if(params.couponType === 'oneoff' && a.branch_id === null) {
                  return a;
                }
              });
  
              const payload = {
                device_id: window.MP_DEVICE_SESSION_ID,
                payment_method_id: paymentMethod.payment_method_id,
                issuer_id: paymentMethod.issuer.id,
                token: window.Mercadopago.tokenId,
                type: params.couponType,
                merchant_account_id: (merchantAccount.length) ? merchantAccount[0].id : null,
                payment_method_option_id: (merchantAccount.length) ? merchantAccount[0].payment_method_option_id : null,
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
              
              const result = await doSubscriptionPayment(payload);
  
              if(result['error']) {
                setShowError(true);
                setErrorMessage('');
              } else {
                setShowError(false);
                setErrorMessage('');
                trackDataCrushEvent(`${process.env.REACT_APP_DATA_CRUSH_EVENT_SK_DONACION_PASO_2}`, user.email);
                
                window.userAmount = amount;
                
                history.push(generatePath(`/:couponType/forms/thank-you`, {
                  couponType: params.couponType,
                }));
              }
              
              dispatchFormErrors({
                type: 'SUBMITTED',
              });
  
              return () => {
                result.cancel();
              }
            } else {
              setShowError(true);
              setErrorMessage('Ocurrió un error inesperado, pruebe con otra tarjeta.');
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
      } else {
        const timer = setTimeout(() => {
          history.push(generatePath(`/:couponType/forms/thank-you`, {
            couponType: params.couponType,
          }));
        }, 1000);
  
        return () => {
          clearTimeout(timer);
        }
      }
    })();
  }, [
    formRef,
    payment,
    user,
    showError,
    errorMessage,
    history,
    params.couponType,
  ]);

  return useMemo(() => (
    <Shared.Form.Main
      id='transaction-form'
      ref={formRef}
      onSubmit={onSubmitHandler}
    >
      <Shared.Form.Header>
        <Elements.HGroup>
          <Shared.Form.Title>{jsonData.campaign.regular.texts.forms.checkout.title}</Shared.Form.Title>
        </Elements.HGroup>
        <Shared.General.Text>{jsonData.campaign.regular.texts.forms.checkout.text}</Shared.General.Text>
      </Shared.Form.Header>
      <Shared.Form.Content>
        <Shared.Form.Row>
          <Shared.Form.Column bottomText='Escribe solo números. No agregues guiones.'>
            <Shared.Form.Group
              fieldName='cardNumber'
              value={payment.cardNumber}
              labelText='Número de la tarjeta'
              showErrorMessage={true}
              validateFn={validateCreditCard}
              onUpdateHandler={onUpdateFieldHandler}
              >
              <Elements.Input
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
              <Elements.Input
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
              <Elements.Select
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
              </Elements.Select>
            </Shared.Form.Group>
            <Shared.Form.Group
              fieldName='cardExpirationYear'
              value={payment.cardExpirationYear}
              labelText='Año de expiración'
              showErrorMessage={true}
              validateFn={validateYear}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Select
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
              </Elements.Select>
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
              <Elements.Select
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
              </Elements.Select>
            </Shared.Form.Group>
            <Shared.Form.Group
              fieldName='docNumber'
              value={payment.docNumber}
              labelText='Número de documento'
              showErrorMessage={true}
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
              <Elements.Input
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

      <Shared.Form.Nav>
        <Elements.Button
          type='submit'
          variant='contained'
          disabled={(submitting) ? true : false}
          customCss={css`
            width: 100%;

            ${(submitting) && css`
              padding-top: ${pixelToRem(10)};
              padding-bottom: ${pixelToRem(10)};
            `}
          `}
        >{(submitting) ? <Shared.Loader mode='light' /> : jsonData.campaign.regular.texts.forms.checkout.button_text}</Elements.Button>
      </Shared.Form.Nav>
    </Shared.Form.Main>
  ), [
    formRef,
    showError,
    payment,
    user,
    submitting,
    submitted,
    errors,
    errorMessage,
    formIndex,
    setShowError,
    onSubmitHandler,
    onChangeHandler,
    onUpdateFieldHandler,
  ]);
});

Component.displayName = 'CheckoutForm';
export default Component;
