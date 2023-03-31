import React, { FormEvent, memo, useCallback, useContext, useState, useRef, useMemo, useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { validateCardHolderName, validateCitizenId, validateCreditCard, validateCvv, validateEmptyField, validateMonth } from '../../../../utils/validators';
import { css } from 'styled-components';
import Elements from '../../../Shared/Elements';
import { doSubscriptionPayment } from '../../../../services/mercadopago';
import Shared, { Loader } from '../../../Shared';
import Form from '../../Shared/Form';
import useQuery from '../../../../hooks/useQuery';
import Snackbar, { IRef as ISnackbarRef } from '../../../Snackbar';
import { AppContext } from '../../../App/context';
import { IData } from '../../../../types';
import { CheckoutFormContext, CheckoutFormProvider } from '../../../Forms/CheckoutForm/context';

const Component: React.FunctionComponent<{}> = memo(() => {
  const [ showFieldErrors, setShowFieldErrors ] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const snackbarRef = useRef<ISnackbarRef>(null);
  const { appData } = useContext(AppContext);
  const {
    submitted,
    submitting,
    allowNext,
    error,
    errorDate,
    attemps,
    payment,
    user,
    params,
    mercadoPago,
    dispatchFormErrors,
    onChangeHandler,
    onUpdateFieldHandler,
    onChangeMPSecureFields,
  } = useContext(CheckoutFormContext);
  const navigate = useNavigate();
  const { searchParams, urlSearchParams } = useQuery();

  const onSubmitHandler = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();

    if(!allowNext) {
      setShowFieldErrors(true);
      dispatchFormErrors({
        type: 'SET_ERROR',
        error: `Tenés campos incompletos o con errores. Revisalos para continuar.`,
        errorDate: new Date(),
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
            mercadoPago,
          );

          if(response.error) {
            dispatchFormErrors({
              type: 'SET_ERROR',
              error: `${response.message}`,
            });
          } else {
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
    mercadoPago,
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
    errorDate,
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
          {!mercadoPago
            ? <Loader />
            : <>
                <Form.Row>
                  <Form.Column>
                    <Form.Group
                      fieldName='cardNumber'
                      value={payment.cardNumber}
                      labelText='Número de la tarjeta'
                      showErrorMessage={showFieldErrors}
                      validateFn={validateCreditCard}
                      onUpdateHandler={onUpdateFieldHandler}
                      >
                        <Elements.MPSecurityField id="form-checkout__cardNumber"></Elements.MPSecurityField>
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
                      <Elements.MPSecurityField id="form-checkout__securityCode"></Elements.MPSecurityField>
                    </Form.Group>
                    <Form.Group
                      fieldName='cardExpirationMonth'
                      value={payment.cardExpirationMonth}
                      labelText='Fecha de de expiración'
                      showErrorMessage={showFieldErrors}
                      validateFn={validateMonth}
                      onUpdateHandler={onUpdateFieldHandler}
                    >
                      <Elements.MPSecurityField id="form-checkout__expirationDate"></Elements.MPSecurityField>
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
                        id="form-checkout__identificationType"
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
              </>}
        </Form.Content>
        <Snackbar ref={snackbarRef} text={error} />
        <Form.Nav>
          <Elements.Button
            type='submit'
            disabled={(submitting || !mercadoPago) ? true : false}
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
    errorDate,
    appData,
    mercadoPago,
    dispatchFormErrors,
    onSubmitHandler,
    onChangeHandler,
    onUpdateFieldHandler,
    onChangeMPSecureFields,
  ]);
});

Component.displayName = 'CheckoutForm';

export default () => (
  <CheckoutFormProvider>
    <Component />
  </CheckoutFormProvider>
);
