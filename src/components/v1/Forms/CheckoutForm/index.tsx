import React, { FormEvent, memo, useCallback, useContext, useState, useRef, useReducer, useMemo, useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../Forms/context';
import { OnChangeEvent } from 'greenpeace';
import { validateCardHolderName, validateCitizenId, validateCreditCard, validateCvv, validateEmptyField, validateMonth, validateYear } from '../../../../utils/validators';
import { css } from 'styled-components';
import Elements from '../../../Shared/Elements';
import { doSubscriptionPayment } from '../../../../services/mercadopago';
import Shared from '../../../Shared';
import Form from '../../Shared/Form';
import { initialState, reducer } from '../../../Forms/CheckoutForm/reducer';
import useQuery from '../../../../hooks/useQuery';
import Snackbar, { IRef as ISnackbarRef } from '../../../Snackbar';
import { AppContext } from '../../../App/context';
import { IData } from '../../../../types';

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
        if(formRef.current) {
          dispatchFormErrors({ type: 'SUBMIT' });

          const response = await doSubscriptionPayment(
            formRef.current,
            { user, payment } as IData, 
            params.couponType ?? 'regular',
            urlSearchParams,
            appData?.settings?.tracking?.salesforce?.campaign_id,
            appData?.settings?.service?.forma?.transactions_form,
          );

          if(response.error) {
            dispatchFormErrors({
              type: 'SUBMITTED_WITH_ERRORS',
              error: response.message ?? '',
            });
          } else {
            const timer = setTimeout(() => {
              dispatchFormErrors({ type: 'SUBMITTED' });
              
              navigate({
                pathname: generatePath(`/:couponType/forms/thank-you`, {
                  couponType: params.couponType,
                }),
                search: `${searchParams}`,
              }, { replace: true });
            }, 250);
      
            return () => {
              clearTimeout(timer);
            }
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
    dispatchFormErrors,
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
    <Form.Main
      id='transaction-form'
      ref={formRef}
      onSubmit={onSubmitHandler}
    >
      <Form.Header>
        <Elements.HGroup>
          <Form.Title>{appData && appData.content && appData.content.form.checkout.title}</Form.Title>
        </Elements.HGroup>
        <Shared.General.Text>{appData && appData.content && appData.content.form.checkout.text}</Shared.General.Text>
      </Form.Header>
      <Form.Content>
        <Form.Row>
          <Form.Column bottomText='Escribe solo números. No agregues guiones.'>
            <Form.Group
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
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
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
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
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
            </Form.Group>
            <Form.Group
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
            </Form.Group>
          </Form.Column>
        </Form.Row>
      </Form.Content>
      <Snackbar ref={snackbarRef} text={error} />
      <Form.Nav>
        <Elements.Button
          type='submit'
          disabled={submitting ? true : false}
          customCss={css`
            width: 100%;
          `}
        >{(submitting) ? <Shared.Loader mode='light' /> : (appData && appData.content && appData.content.form.checkout.button_text)}</Elements.Button>
      </Form.Nav>
    </Form.Main>
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
