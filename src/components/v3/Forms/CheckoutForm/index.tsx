import React, { FormEvent, memo, useCallback, useContext, useState, useRef, useReducer, useMemo, useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../Forms/context';
import { OnChangeEvent, OnClickEvent } from 'greenpeace';
import { validateCardHolderName, validateCitizenId, validateCreditCard, validateCvv, validateEmptyField, validateMonth, validateNewAmount, validateYear } from '../../../../utils/validators';
import { css } from 'styled-components';
// import { getPublicKey, doSubscriptionPayment } from '../../../../services/mercadopago';
import { Loader } from '../../../Shared';
import Elements from '../../Shared/Elements';
import Form from '../../Shared/Form';
import { initialState, reducer } from '../../../Forms/CheckoutForm/reducer';
// import { createToken, getCardType, getInstallments, setPublishableKey } from '../../../../utils/mercadopago';
import useQuery from '../../../../hooks/useQuery';
import Snackbar, { IRef as ISnackbarRef } from '../../../Snackbar';
import { AppContext } from '../../../App/context';
import { postRecord, updateContact } from '../../../../services/greenlab';
import { pixelToRem } from 'meema.utils';
import { CardType, cardTypes, getCardType } from '../../../../utils/mercadopago';

const Component: React.FunctionComponent<{}> = memo(() => {
  const { appData } = useContext(AppContext);
  const { data: { payment, user }, params, dispatch } = useContext(FormContext);
  const [{ submitting, submitted, allowNext, error, attemps }, dispatchFormErrors ] = useReducer(reducer, initialState);
  const [ showFieldErrors, setShowFieldErrors ] = useState<boolean>(false);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const contentFormRef = useRef<HTMLDivElement>(null);
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
  
  const onClickHandler = useCallback((evt: OnClickEvent) => {
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
   * Post to Forma.
   */
  const postToForMa = useCallback(() => {
    (async () => {
      if(appData && appData.settings && appData.settings.service) {
        const { service } = appData.settings;
  
        if(service.forma.transactions_form) {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          const amount = payment.amount === 'otherAmount' ? payment.newAmount : payment.amount;
          window.userAmount = amount;
          
          await postRecord({
            // Forma
            form_id: appData!.settings!.service!.forma!.transactions_form,
            // User
            amount,
            areaCode: user.areaCode,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            docNumber: user.docNumber,
            docType: user.docType,
            // Referred User
            refFirstName: user.referredFirstName,
            refLastName: user.referredLastName,
            refPhoneNumber: user.referredPhoneNumber,
            refAreaCode: user.referredAreaCode,
            refDocType: user.referredDocType,
            refDocNumber: user.referredDocNumber,
            refEmail: user.referredEmail,
            // Payment
            card: payment.cardNumber,
            card_type: getCardType(payment.cardType),
            cardLastDigits: payment.cardNumber.slice(payment.cardNumber.length - 4),
            cardExpMonth: payment.cardExpirationMonth,
            cardExpYear: payment.cardExpirationYear,
            recurrenceDay: tomorrow,
            transactionDate: new Date(),
            donationStatus: 'requested',
            // Analytics
            utm: `utm_campaign=${ urlSearchParams.get('utm_campaign')}&utm_medium=${ urlSearchParams.get('utm_medium')}&utm_source=${ urlSearchParams.get('utm_source')}&utm_content=${ urlSearchParams.get('utm_content')}&utm_term=${ urlSearchParams.get('utm_term')}`,
            fromUrl: document.location.href,
            userAgent: window.navigator.userAgent.replace(/;/g, '').replace(/,/g, ''),
            // campaignId: `${appData.settings.tracking.salesforce.campaign_id}`,
          });
        }
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
    })();
  }, [
    dispatchFormErrors,
    payment,
    user,
  ]);

  const onSubmitHandler = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();

    dispatchFormErrors({ type: 'SUBMIT' });
    
    if(!allowNext) {
      setShowFieldErrors(true);
      
      dispatchFormErrors({
        type: 'SET_ERROR',
        error: 'Tenés campos incompletos o con errores, revisalos para continuar.',
      });
    } else {
      postToForMa();
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
    } else {
      if(snackbarRef && snackbarRef.current) {
        snackbarRef.current.hideSnackbar();
      }
    }
  }, [
    error,
  ]);

  useEffect(() => {
    if(appData && appData.content && appData.content.amounts) {
      dispatch({
        type: 'UPDATE_PAYMENT_DATA',
        payload: { amount: `${appData.content.amounts.default}` }
      });
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
                isRequired={true}
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
              isRequired={true}
              showErrorMessage={showFieldErrors}
              validateFn={validateCreditCard}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                type='text'
                id='cardNumber'
                name='cardNumber'
                placeholder='4509 9535 6623 2694'
                data-checkout='cardNumber'
                maxLength={16}
                value={payment.cardNumber}
                onChange={onChangeHandler}
              />
            </Form.Group>
          </Form.Column>
          <Form.Column>
            <Form.Group
              fieldName='cardType'
              value={payment.cardType}
              labelText='Tipo de tarjeta'
              isRequired={true}
              showErrorMessage={showFieldErrors}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Select
                id='cardType'
                name='cardType'
                data-checkout='cardType'
                value={payment.cardType}
                onChange={onChangeHandler}
              >
                <option value=""></option>
                {cardTypes.map((cardType: CardType) => cardType.enable && (
                  <option key={cardType.value} value={cardType.value}>{cardType.description}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
              fieldName='cardExpirationMonth'
              value={payment.cardExpirationMonth}
              labelText='Mes de expiración'
              isRequired={true}
              showErrorMessage={showFieldErrors}
              validateFn={validateMonth}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Select
                id='cardExpirationMonth'
                name='cardExpirationMonth'
                data-checkout='cardExpirationMonth'
                value={payment.cardExpirationMonth}
                onChange={onChangeHandler}
              >
                <option value=""></option>
                {['01','02','03','04','05','06','07','08','09','10','11','12'].map((value: string, key: number) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group
              fieldName='cardExpirationYear'
              value={payment.cardExpirationYear}
              labelText='Año de expiración'
              isRequired={true}
              showErrorMessage={showFieldErrors}
              validateFn={validateYear}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Select
                id='cardExpirationYear'
                name='cardExpirationYear'
                data-checkout='cardExpirationYear'
                value={payment.cardExpirationYear}
                onChange={onChangeHandler}
              >
                <option value=""></option>
                {(Array.from(Array(20).keys()).map((value) => value + (new Date().getFullYear()))).map((value: number, key: number) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form.Column>
          <Form.Column>
            <Form.Group
              fieldName='docType'
              value={payment.docType}
              labelText='Tipo de documento'
              isRequired={true}
              showErrorMessage={showFieldErrors}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Select
                id='docType'
                name='docType'
                data-checkout='docType'
                value={payment.docType}
                onChange={onChangeHandler}
              >
                <option value=""></option>
                {['DNI', 'Cédula de identidad', 'LC', 'LE', 'Otro'].map((value: string, key: number) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group
              fieldName='docNumber'
              value={payment.docNumber}
              labelText='Número'
              isRequired={true}
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
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
              value={payment.cardholderName}
              fieldName='cardholderName'
              labelText='Titular de la tarjeta'
              isRequired={true}
              validateFn={validateCardHolderName}
              onUpdateHandler={onUpdateFieldHandler}
              showErrorMessage={showFieldErrors}
            >
              <Form.Input
                type='text'
                id='cardholderName'
                name='cardholderName'
                data-checkout='cardholderName'
                placeholder='Daniela Lopez'
                value={payment.cardholderName}
                onChange={onChangeHandler}
              />
            </Form.Group>
          </Form.Column>
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
export default Component;
