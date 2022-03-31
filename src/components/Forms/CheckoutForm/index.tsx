import React, { FormEvent, memo, useCallback, useContext, useState, useRef, useReducer, useMemo, useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { FormContext } from '../context';
import { OnChangeEvent } from 'greenpeace';
import { validateCardHolderName, validateCitizenId, validateCreditCard, validateCvv, validateEmptyField, validateMonth, validateYear } from '../../../utils/validators';
import { css } from 'styled-components';
import Elements from '../../Shared/Elements';
import { getPublicKey, doSubscriptionPayment } from '../../../services/mercadopago';
import Shared from '../../Shared';
import { initialState, reducer } from './reducer';
import { createToken, getCardType, getInstallments, setPublishableKey } from '../../../utils/mercadopago';
import useQuery from '../../../hooks/useQuery';
import Snackbar, { IRef as ISnackbarRef } from '../../Snackbar';
import { AppContext } from '../../App/context';
import { postRecord, updateContact } from '../../../services/greenlab';

const Component: React.FunctionComponent<{}> = memo(() => {
  const { appData } = useContext(AppContext);
  const { data: { payment, user }, params, dispatch } = useContext(FormContext);
  const [{ submitting, submitted, allowNext, error, attemps }, dispatchFormErrors ] = useReducer(reducer, initialState);
  const [ showFieldErrors, setShowFieldErrors ] = useState<boolean>(false);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const snackbarRef = useRef<ISnackbarRef>(null);
  const { searchParams, urlSearchParams } = useQuery();

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

  /**
   * Backup to Forma.
   * @param payload What is needed to be "backuped"
   */
  const backupInformation = useCallback(( payload = null ) => {
    (async () => {
      console.log('Backup information', payload);

      await updateContact(payload.email, {
        donationStatus: payload.donationStatus,
      });
      
      if(appData && appData.settings && appData.settings.service) {
        const { service } = appData.settings;
  
        if(service.forma.transactions_form) {
          const newRecordResult = await postRecord({
            amount: payload.amount,
            areaCode: payload.cod_area,
            campaignId: payload.campaign_id,
            card: payload.card,
            card_type: payload.card_type,
            cardLastDigits: payload.lastDigits,
            cardExpMonth: payload.mes_vencimiento,
            cardExpYear: payload.ano_vencimiento,
            citizenId: payload.documento,
            citizenIdType: payload.tipodocumento,
            mpDeviceId: payload.device_id,
            donationStatus: payload.donationStatus,
            email: payload.email,
            errorCode: payload.errorCode || '',
            errorMessage: payload.errorMessage || '',
            firstName: payload.nombre,
            form_id: service.forma.transactions_form,
            fromUrl: document.location.href,
            lastName: payload.apellido,
            mpPayMethodId: payload.payment_method_id,
            mpPayOptId: payload.payment_method_option_id,
            phoneNumber: payload.telefono,
            recurrenceDay: payload.tomorrow,
            transactionDate: payload.date,
            userAgent: window.navigator.userAgent,
            utm: {
              utm_campaign: urlSearchParams.get('utm_campaign'),
              utm_medium: urlSearchParams.get('utm_medium'),
              utm_source: urlSearchParams.get('utm_source'),
              utm_content: urlSearchParams.get('utm_content'),
              utm_term: urlSearchParams.get('utm_term'),
            },
          });
        }
      }

      const timer = setTimeout(() => {
        dispatchFormErrors({ type: 'SUBMITTED' });
        navigate({
          pathname: generatePath(`/:couponType/forms/thankyou`, {
            couponType: params.couponType,
          }),
          search: `${searchParams}`,
        }, { replace: true });
      }, 250);

      return () => {
        clearTimeout(timer);
      }
    })();
  }, [
    dispatchFormErrors,
  ]);

  const onSubmitHandler = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();

    if(!allowNext) {
      setShowFieldErrors(true);
      dispatchFormErrors({
        type: 'SET_ERROR',
        error: 'Tenés campos incompletos o con errores. Revisalos para continuar.',
      });
    } else {
      (async () => {
        dispatchFormErrors({ type: 'SUBMIT' });
  
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
                return a;
              });

              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              
              let payload = {
                device_id: window.MP_DEVICE_SESSION_ID,
                payment_method_id: paymentMethod.payment_method_id,
                issuer_id: paymentMethod.issuer.id,
                token: window.Mercadopago.tokenId,
                type: params.couponType,
                merchant_account_id: (merchantAccount.length) ? merchantAccount[0].id : null,
                payment_method_option_id: (merchantAccount.length) ? merchantAccount[0].payment_method_option_id : null,
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
                mes_vencimiento: payment.cardExpirationMonth,
                ano_vencimiento: payment.cardExpirationYear,
                documento: payment.docNumber,
                firstDigits: payment.cardNumber.slice(0, 6),
                lastDigits: payment.cardNumber.slice(payment.cardNumber.length - 4),
                date: today,
                today: today.getDate(),
                tomorrow: tomorrow.getDate(),
                utms: [
                  { campo: 'gpi__utm_campaign__c', valor: urlSearchParams.get('utm_campaign') },
                  { campo: 'gpi__utm_medium__c', valor: urlSearchParams.get('utm_medium') },
                  { campo: 'gpi__utm_source__c', valor: urlSearchParams.get('utm_source') },
                  { campo: 'gpi__utm_content__c', valor: urlSearchParams.get('utm_content') },
                  { campo: 'gpi__utm_term__c', valor: urlSearchParams.get('utm_term') },
                ],
                campaign_id: `${appData.settings.tracking.salesforce.campaign_id}`,
              };
              
              const result = await doSubscriptionPayment(payload);

              payload = {...payload, ...{
                card: payment.cardNumber,
                card_type: getCardType(paymentMethod.payment_method_id, paymentMethod.payment_type_id),
              }};

              if(result['error']) {
                backupInformation({...payload, donationStatus: 'pending', errorCode: result.errorCode, errorMessage: result.message });
              } else {
                window.userAmount = amount;
                backupInformation({...payload, donationStatus: 'done'});
                
                return () => {
                  paymentMethod.cancel();
                  result.cancel();
                }
              }
            } else {
              console.log('Ocurrió un error inesperado, pruebe con otra tarjeta.');
              dispatchFormErrors({
                type: 'SUBMITTED_WITH_ERRORS',
                error: 'Ocurrió un error inesperado, pruebe con otra tarjeta.',
              });
            }
          } else {
            console.log('No se creó el Token %s', token.message);
            dispatchFormErrors({
              type: 'SUBMITTED_WITH_ERRORS',
              error: token.message,
            });
          }
        }
      })();
    }
  }, [
    allowNext,
    searchParams,
    formRef,
    payment,
    user,
    navigate,
    params,
    urlSearchParams,
    appData,
  ]);
  
  useEffect(() => {
    if(error) {
      if(snackbarRef && snackbarRef.current) {
        snackbarRef.current.showSnackbar();
      }
    }
  }, [
    error,
  ]);

  return useMemo(() => (
    <Shared.Form.Main
      id='transaction-form'
      ref={formRef}
      onSubmit={onSubmitHandler}
    >
      <Shared.Form.Header>
        <Elements.HGroup>
          <Shared.Form.Title>{appData && appData.content && appData.content.form.checkout.title}</Shared.Form.Title>
        </Elements.HGroup>
        <Shared.General.Text>{appData && appData.content && appData.content.form.checkout.text}</Shared.General.Text>
      </Shared.Form.Header>
      <Shared.Form.Content>
        <Shared.Form.Row>
          <Shared.Form.Column bottomText='Escribe solo números. No agregues guiones.'>
            <Shared.Form.Group
              fieldName='cardNumber'
              value={payment.cardNumber}
              labelText='Número de la tarjeta'
              showErrorMessage={showFieldErrors}
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
              showErrorMessage={showFieldErrors}
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
              showErrorMessage={showFieldErrors}
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
              showErrorMessage={showFieldErrors}
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
                {(Array.from(Array(20).keys()).map((value) => value + (new Date().getFullYear()))).map((value: number, key: number) => (
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
              showErrorMessage={showFieldErrors}
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
              showErrorMessage={showFieldErrors}
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
      <Snackbar ref={snackbarRef} text={error} />
      <Shared.Form.Nav>
        <Elements.Button
          type='submit'
          disabled={submitting ? true : false}
          customCss={css`
            width: 100%;
          `}
        >{(submitting) ? <Shared.Loader mode='light' /> : (appData && appData.content && appData.content.form.checkout.button_text)}</Elements.Button>
      </Shared.Form.Nav>
    </Shared.Form.Main>
  ), [
    formRef,
    payment,
    submitted,
    submitting,
    attemps,
    snackbarRef,
    showFieldErrors,
    error,
    appData,
    dispatchFormErrors,
    onSubmitHandler,
    onChangeHandler,
    onUpdateFieldHandler,
  ]);
});

Component.displayName = 'CheckoutForm';
export default Component;
