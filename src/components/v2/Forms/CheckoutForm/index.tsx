import React, { FormEvent, memo, useCallback, useContext, useState, useRef, useReducer, useMemo, useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../Forms/context';
import { IData, OnChangeEvent, OnClickEvent } from 'greenpeace';
import { validateCardHolderName, validateCitizenId, validateCreditCard, validateCvv, validateEmptyField, validateMonth, validateNewAmount, validateYear } from '../../../../utils/validators';
import { css } from 'styled-components';
import { getPublicKey, doSubscriptionPayment } from '../../../../services/mercadopago';
import { Loader } from '../../../Shared';
import Elements from '../../Shared/Elements';
import MPElements from '../../../Shared/Elements';
import Form from '../../Shared/Form';
import { initialState, reducer } from '../../../Forms/CheckoutForm/reducer';
import { createToken, getCardType, getInstallments, setPublishableKey } from '../../../../utils/mercadopago';
import useQuery from '../../../../hooks/useQuery';
import Snackbar, { IRef as ISnackbarRef } from '../../../Snackbar';
import { AppContext } from '../../../App/context';
import { postRecord, updateContact } from '../../../../services/greenlab';
import { pixelToRem } from 'meema.utils';
import { CheckoutFormContext, CheckoutFormProvider } from '../../../Forms/CheckoutForm/context';

const Component: React.FunctionComponent<{}> = memo(() => {
  const { appData } = useContext(AppContext);
  // const { data: { payment, user }, params, dispatch } = useContext(FormContext);
  // const [{ submitting, submitted, allowNext, error, attemps }, dispatchFormErrors ] = useReducer(reducer, initialState);
  const [ showFieldErrors, setShowFieldErrors ] = useState<boolean>(false);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const contentFormRef = useRef<HTMLDivElement>(null);
  const snackbarRef = useRef<ISnackbarRef>(null);
  const { searchParams, urlSearchParams } = useQuery();
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
    dispatch,
    dispatchFormErrors,
    onChangeHandler,
    onUpdateFieldHandler,
  } = useContext(CheckoutFormContext);
  
  const onClickHandler = useCallback((evt: OnClickEvent) => {
    evt.preventDefault();
    dispatch({
      type: 'UPDATE_PAYMENT_DATA',
      payload: { [ evt.currentTarget.name ]: evt.currentTarget.value }
    });
  }, [
    dispatch,
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
        if(formRef.current) {
          dispatchFormErrors({ type: 'SUBMIT' });

          const response = await doSubscriptionPayment(
            formRef.current,
            { user, payment } as IData, 
            params.couponType ?? 'regular',
            urlSearchParams,
            appData?.settings?.tracking?.salesforce?.campaign_id,
            appData?.settings?.service?.forma?.transactions_form,
            // mercadoPago,
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
    dispatchFormErrors,
  ]);
  
  useEffect(() => {
    if(error) {
      if(snackbarRef && snackbarRef.current) {
        snackbarRef.current.showSnackbar();
      }
    } else {
      if(snackbarRef && snackbarRef.current) {
        snackbarRef.current.hideSnackbar();
      }
    }
  }, [
    error,
    errorDate,
  ]);

  useEffect(() => {
    if(urlSearchParams.get('donate')) {
      const amounts = appData.content.amounts.values || [];
      dispatch({
        type: 'UPDATE_PAYMENT_DATA',
        payload: {
          ...(amounts.filter((a:number) => `${a}` === urlSearchParams.get('donate')).length) ? {
            amount: `${urlSearchParams.get('donate')}`,
          } : {
            amount: 'otherAmount',
            newAmount: `${urlSearchParams.get('donate')}`,
          },
        }
      })
    } else {
      if(appData && appData.content) {
        if(appData.content.amounts.values.filter((v: number) => v === appData.content.amounts.default).length) {
          dispatch({
            type: 'UPDATE_PAYMENT_DATA',
            payload: { 'amount': `${appData.content.amounts.default}` }
          });
        } else {
          dispatch({
            type: 'UPDATE_PAYMENT_DATA',
            payload: { 
              'amount': 'otherAmount',
              'newAmount': `${appData.content.amounts.default}`,
            }
          });
        }
      }
    }
    
    if(contentFormRef && contentFormRef.current) {
      contentFormRef.current.scrollIntoView({behavior: "smooth"})
    }
  }, []);

  return useMemo(() => (
    <Form.Main id='transaction-form' ref={formRef} onSubmit={onSubmitHandler}>
      <Form.Header>
        <Elements.HGroup>
          <Form.Title>{appData && appData.content && appData.content.form.checkout.title}</Form.Title>
        </Elements.HGroup>
        <Elements.WrapperHtml
          customCss={css`
            font-size: ${pixelToRem(16)};
            font-weight: 400;
            line-height: 140%;
            font-family: ${({theme}) => theme.font.family.primary.regular};

            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              font-size: ${pixelToRem(24)};
            }
          `}
          dangerouslySetInnerHTML={{__html: appData && appData.content && appData.content.form.checkout.text }}
        />
      </Form.Header>
      <Form.Content
         id='content-form'
         ref={contentFormRef}
      >
        <Elements.Span
          customCss={css`
            font-family: ${({theme}) => theme.font.family.primary.bold};
            font-size: ${pixelToRem(18)};
            margin-bottom: ${pixelToRem(18)};
          `}
        >Completá tus datos y empezá a  contribuir con el planeta</Elements.Span>
        <Elements.Span
          customCss={css`
            color: ${({theme}) => theme.text.color.secondary.normal};
            font-size: ${pixelToRem(18)};
            margin-bottom: ${pixelToRem(10)};
          `}
        >Datos de contribución</Elements.Span>
        <Form.Row>
          <Form.Column>
            <Form.Group
              value={payment.amount}
              fieldName='amount'
              labelText={`${params.couponType === 'oneoff' ? 'Autorizo el pago por única vez de:' : 'Autorizo el débito automático mensual de:'}`}
              showErrorMessage={showFieldErrors}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Wrapper>
                {appData && appData.content && appData.content.amounts.values.map((value: number) => (
                  <Form.SelectableButton
                    key={`${value}`}
                    text={`$${value}`}
                    name='amount'
                    value={`${value}`}
                    checkedValue={payment.amount}
                    onClickHandler={onClickHandler}
                  />
                ))}
                <Form.SelectableButton
                  name='amount'
                  text='Otro'
                  value='otherAmount'
                  checkedValue={payment.amount}
                  onClickHandler={onClickHandler}
                />
              </Elements.Wrapper>
            </Form.Group>
          </Form.Column>
          <Form.Column>
            {(payment.amount === 'otherAmount') ? (
              <Form.Group
                fieldName='newAmount'
                value={payment.newAmount}
                labelText='Ingrese el monto'
                showErrorMessage={showFieldErrors}
                validateFn={validateNewAmount}
                onUpdateHandler={onUpdateFieldHandler}
                customCss={css`
                  width: ${pixelToRem(180)};
                `}
              >
                <Form.Input
                  name='newAmount'
                  type='number'
                  disabled={!(payment.amount === 'otherAmount')} 
                  value={payment.newAmount}
                  placeholder='$350'
                  maxLength={8}
                  onChange={onChangeHandler}
                />
              </Form.Group>
            ) : null}
          </Form.Column>
        </Form.Row>
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
              <MPElements.MPSecurityField id="form-checkout__cardNumber"></MPElements.MPSecurityField>
            </Form.Group>
          </Form.Column>
          <Form.Column>
            <Form.Group
              fieldName='securityCode'
              value={payment.securityCode}
              labelText='Código de seguridad'
              showErrorMessage={showFieldErrors}
              validateFn={validateCvv}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <MPElements.MPSecurityField id="form-checkout__securityCode"></MPElements.MPSecurityField>
            </Form.Group>
            <Form.Group
              fieldName='cardExpirationMonth'
              value={payment.cardExpirationMonth}
              labelText='Fecha de de expiración'
              showErrorMessage={showFieldErrors}
              validateFn={validateMonth}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <MPElements.MPSecurityField id="form-checkout__expirationDate"></MPElements.MPSecurityField>
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
              <Form.Select
                id="form-checkout__identificationType"
                name="docType"
                data-checkout="docType"
                value={payment.docType}
                onChange={onChangeHandler}
              ></Form.Select>
            </Form.Group>
            <Form.Group
              fieldName='docNumber'
              value={payment.docNumber}
              labelText='Número'
              showErrorMessage={showFieldErrors}
              validateFn={validateCitizenId}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                type='text'
                id='docNumber'
                name='docNumber'
                placeholder='31402931'
                data-checkout='docNumber'
                maxLength={8}
                value={payment.docNumber}
                onChange={onChangeHandler}
              />
            </Form.Group>
          </Form.Column>
          <Form.Column>
            <Form.Group
              value={payment.cardHolderName}
              fieldName='cardHolderName'
              labelText='Titular de la tarjeta'
              validateFn={validateCardHolderName}
              onUpdateHandler={onUpdateFieldHandler}
              showErrorMessage={showFieldErrors}
            >
              <Form.Input
                type='text'
                id='cardHolderName'
                name='cardHolderName'
                data-checkout='cardHolderName'
                placeholder='Daniela Lopez'
                value={payment.cardHolderName}
                onChange={onChangeHandler}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
        </Form.Row>
      </Form.Content>
      <Snackbar ref={snackbarRef} text={error} />
      <Form.Nav
        customCss={css`
          align-items: flex-end;
        `}
      >
        <Elements.Button
          type='submit'
          disabled={submitting && true}
        >
          {(submitting) ? <Loader mode='light' /> : (appData && appData.content && appData.content.form.checkout.button_text)}
        </Elements.Button>
      </Form.Nav>
    </Form.Main>
  ), [
    formRef,
    contentFormRef,
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
    onClickHandler,
    onUpdateFieldHandler,
  ]);
});

Component.displayName = 'CheckoutForm';
export default () => (
  <CheckoutFormProvider>
    <Component />
  </CheckoutFormProvider>
);
