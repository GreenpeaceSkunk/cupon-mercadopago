import React, { FormEvent, memo, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../Forms/context';
import { OnChangeEvent, OnClickEvent } from 'greenpeace';
import {
  validateEmail,
  validatePhoneNumber,
  validateAreaCode,
  validateFirstName,
  validateMonth,
  validateYear,
  validateEmptyField,
  validateCitizenId,
  validateCardHolderName,
  validateCvv,
  validateCreditCard,
  validateNewAmount,
} from '../../../../utils/validators';
import { css } from 'styled-components';
import Shared from '../../../Shared';
import Form from '../../Shared/Form';
import Elements from '../../Shared/Elements';
// import RegistrationFormReducer from '../../../Forms/RegistrationForm/reducer';
// import FormReducer from '../../../Forms/reducer';
import { pushToDataLayer } from '../../../../utils/googleTagManager';
import { pixelToRem } from 'meema.utils';
import useQuery from '../../../../hooks/useQuery';
import Snackbar, { IRef as ISnackbarRef } from '../../../Snackbar';
import { createContact, postRecord, updateContact } from '../../../../services/greenlab';
import { AppContext } from '../../../App/context';
import { createToken, getCardType, getInstallments, setPublishableKey } from '../../../../utils/mercadopago';
import { doSubscriptionPayment, getPublicKey } from '../../../../services/mercadopago';
// import { Spacer } from '../../../v3/Shared/Widgets';

const Component: React.FunctionComponent<{}> = memo(() => {
  const { appData } = useContext(AppContext);
  const {
    data: {
      user,
      payment,
    },
    allowNext,
    error,
    params,
    submitting,
    submitted,
    dispatch,
  } = useContext(FormContext);
  // const [ formState, formDispatch ] = useReducer(FormReducer.reducer, FormReducer.initialState);
  const [ showFieldErrors, setShowFieldErrors ] = useState<boolean>(false);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const contentFormRef = useRef<HTMLDivElement>(null);
  const snackbarRef = useRef<ISnackbarRef>(null);
  const { searchParams, urlSearchParams } = useQuery();
  
  // const onChangeHandler = useCallback((evt: OnChangeEvent) => {
    // evt.preventDefault();
    // formDispatch({
    //   type: 'UPDATE_FIELD',
    //   payload: { [ evt.currentTarget.name ]: evt.currentTarget.value }
    // });
  // }, [
    // formDispatch,
  // ]);

  /**
   * Backup to Forma.
   * @param payload What is needed to be "backuped"
   */
   const backupInformation = useCallback(( payload = null ) => {
    (async () => {
      console.log('Post to ForMa');

      await updateContact(payload.email, {
        donationStatus: payload.donationStatus,
      });
      
      if(appData && appData.settings && appData.settings.service) {
        const { service } = appData.settings;
  
        if(service.forma.transactions_form) {
          await postRecord({
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
            userAgent: window.navigator.userAgent.replace(/;/g, '').replace(/,/g, ''),
            utm: `utm_campaign=${ urlSearchParams.get('utm_campaign')}&utm_medium=${ urlSearchParams.get('utm_medium')}&utm_source=${ urlSearchParams.get('utm_source')}&utm_content=${ urlSearchParams.get('utm_content')}&utm_term=${ urlSearchParams.get('utm_term')}`,
          });
        }
      }

      const timer = setTimeout(() => {
        dispatch({ type: 'SUBMITTED' });
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
    })();
  }, [
    dispatch,
  ]);

  const onUpdateFieldHandler = useCallback((fieldName: string, isValid: boolean, value: any) => {
    dispatch({
      type: 'UPDATE_FIELD_ERRORS',
      payload: {
        fieldName,
        isValid,
      }
    });
  }, [
    dispatch,
  ]);

  // const onClickHandler = useCallback((evt: OnClickEvent) => {
    // console.log(evt)
    // evt.preventDefault();
    // formDispatch({
    //   type: 'UPDATE_PAYMENT_DATA',
    //   payload: { [ evt.currentTarget.name ]: evt.currentTarget.value }
    // });
  // }, [
    // formDispatch,
  // ]);

  const onUpdateUserData = useCallback((evt: OnChangeEvent | OnClickEvent) => {
    evt.preventDefault();
    dispatch({
      type: 'UPDATE_USER_DATA',
      payload: { [ evt.currentTarget.name ]: evt.currentTarget.value }
    });
  }, [
    dispatch,
  ]);

  const onUpdatePaymentData = useCallback((evt: OnChangeEvent | OnClickEvent) => {
    evt.preventDefault();
    dispatch({
      type: 'UPDATE_PAYMENT_DATA',
      payload: { [ evt.currentTarget.name ]: evt.currentTarget.value }
    });
  }, [
    dispatch,
  ]);
  
  // const onClickPaymentData = useCallback((evt: OnClickEvent) => {
  //   evt.preventDefault();
  //   dispatch({
  //     type: 'UPDATE_PAYMENT_DATA',
  //     payload: { [ evt.currentTarget.name ]: evt.currentTarget.value }
  //   });
  // }, [
  //   dispatch,
  // ]);

  const onSubmitHandler = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();

    dispatch({ type: 'SUBMIT' });
    
    if(!allowNext) {
      setShowFieldErrors(true);
      
      dispatch({
        type: 'SET_ERROR',
        error: 'Tenés campos incompletos o con errores, revisalos para continuar.',
      });

      if(snackbarRef && snackbarRef.current) {
        snackbarRef.current.showSnackbar();
      }
    } else {
      (async () => {

        console.log('Post to Hubspot');
        const contact = await createContact({
          email: user.email,
          firstname: user.firstName,
          lastname: user.lastName,
          phone: `${user.areaCode}${user.phoneNumber}`,
          donationStatus: 'requested',
        });
  
        if(contact) {
          pushToDataLayer({ 'event' : 'petitionSignup' });
          
          
          console.log('Post to Mercadopago');
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
                  card_type: getCardType(paymentMethod.payment_method_id),
                  payment_method_id: paymentMethod.issuer.name,
                }};
                
                if(result['error']) {
                  backupInformation({...payload, donationStatus: 'pending', errorCode: result.errorCode, errorMessage: result.message.replace(/,/g, '').replace(/;/g, '') });
                } else {
                  window.userAmount = amount;
                  backupInformation({...payload, donationStatus: 'done'});
                  
                  return () => {
                    paymentMethod.cancel();
                    result.cancel();
                  }
                }
              } else {
                dispatch({
                  type: 'SET_ERROR',
                  error: 'Ocurrió un error inesperado, pruebe con otra tarjeta.',
                });
              }
            } else {
              dispatch({
                type: 'SET_ERROR',
                error: `No se creó el token de la tarjeta`,
              });
            }
          }
        }
      })();
    }
  }, [
    user,
    payment,
    params,
    searchParams,
    allowNext,
    error,
    navigate,
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
  }, []);

  return useMemo(() => (
    <Form.Main id='registration-form' ref={formRef} onSubmit={onSubmitHandler}>
      <Form.Header>
        <Elements.HGroup>
          <Form.Title>{appData && appData.content && appData.content.form.registration.title}</Form.Title>
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
          dangerouslySetInnerHTML={{__html: appData && appData.content && appData.content.form.registration.text }}
        />
      </Form.Header>
      <Form.Content id='content-form' ref={contentFormRef}>
        <Elements.Wrapper>
          {appData!.content.form!.registration!.content_title && (
            <Form.ContentText>{appData.content.form.registration.content_title}</Form.ContentText>
          )}
          
          {appData!.content.form!.registration!.content_text && (
            <Form.ContentTitle>{appData.content.form.registration.content_text}</Form.ContentTitle>
          )}
        </Elements.Wrapper>
        <Form.Row>
          <Form.Column>
            <Form.Group
              fieldName='firstName'
              value={user.firstName}
              labelText='Nombre'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validateFirstName}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                name='firstName'
                type='text'
                placeholder='Lucas'
                value={user.firstName}
                onChange={onUpdateUserData}
              />
            </Form.Group>
          </Form.Column>
          <Form.Column>
            <Form.Group
              fieldName='lastName'
              value={user.lastName}
              labelText='Apellido'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validateFirstName}
              onUpdateHandler={onUpdateFieldHandler}
              >
              <Form.Input
                name='lastName'
                type='text'
                placeholder='Rodriguez'
                value={user.lastName}
                onChange={onUpdateUserData}
                />
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
              value={user.email}
              fieldName='email'
              labelText='Correo electrónico'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validateEmail}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                name='email'
                type='email'
                placeholder='daniela.lopez@email.com'
                value={user.email}
                onChange={onUpdateUserData}
              />
            </Form.Group>
          </Form.Column>
          <Form.Column>
            <Form.Group
              fieldName='areaCode'
              value={user.areaCode}
              labelText='Cód. área'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validateAreaCode}
              onUpdateHandler={onUpdateFieldHandler}
              customCss={css`
                width: 40%;
              `}
            >
              <Form.Input
                name='areaCode'
                type='number'
                placeholder='11'
                value={user.areaCode}
                maxLength={4}
                onChange={onUpdateUserData}
              />
            </Form.Group>
            <Form.Group
              fieldName='phoneNumber'
              value={user.phoneNumber}
              labelText='Número telefónico'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validatePhoneNumber}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                name='phoneNumber'
                type='number'
                placeholder='41239876'
                value={user.phoneNumber}
                onChange={onUpdateUserData}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
      </Form.Content>
      {/* <Spacer small={40} medium={20} large={25} /> */}
      <Form.Content id='content-form'>
        <Elements.Wrapper>
          {appData!.content.form!.registration!.content_title_2 && (
            <Form.ContentText>{appData.content.form.registration.content_title_2}</Form.ContentText>
          )}

          {appData!.content.form!.registration!.content_text_2 && (
            <Form.ContentTitle>{appData.content.form.registration.content_text_2}</Form.ContentTitle>
          )}
        </Elements.Wrapper>
        <Form.Row>
          <Form.Column>
            <Form.Group
              value={payment.amount}
              fieldName='amount'
              labelText={`
                ${params.couponType === 'oneoff'
                  ? appData.content.form.general.coupon_oneoff_label_text
                  : appData.content.form.general.coupon_regular_label_text}`}
              showErrorMessage={showFieldErrors}

              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Wrapper>
                {appData.content.amounts.values.map((value: number) => (
                  <Form.SelectableButton
                    key={`${value}`}
                    text={`$${value}`}
                    name='amount'
                    value={`${value}`}
                    checkedValue={payment.amount}
                    onClickHandler={onUpdatePaymentData}
                  />
                ))}
                <Form.SelectableButton
                  name='amount'
                  text='Otro'
                  value='otherAmount'
                  checkedValue={payment.amount}
                  onClickHandler={onUpdatePaymentData}
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
                  onChange={onUpdatePaymentData}
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
              isRequired={true}
            >
              <Form.Input
                type='text'
                id='cardNumber'
                name='cardNumber'
                placeholder='4509 9535 6623 2694'
                data-checkout='cardNumber'
                maxLength={16}
                value={payment.cardNumber}
                onChange={onUpdatePaymentData}
              />
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
              isRequired={true}
            >
              <Form.Input
                type='password'
                id='securityCode'
                name='securityCode'
                placeholder='123'
                data-checkout='securityCode'
                maxLength={4}
                value={payment.securityCode}
                onChange={onUpdatePaymentData}
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
              isRequired={true}
            >
              <Form.Select
                id='cardExpirationMonth'
                name='cardExpirationMonth'
                data-checkout='cardExpirationMonth'
                value={payment.cardExpirationMonth}
                onChange={onUpdatePaymentData}
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
              showErrorMessage={showFieldErrors}
              validateFn={validateYear}
              onUpdateHandler={onUpdateFieldHandler}
              isRequired={true}
            >
              <Form.Select
                id='cardExpirationYear'
                name='cardExpirationYear'
                data-checkout='cardExpirationYear'
                value={payment.cardExpirationYear}
                onChange={onUpdatePaymentData}
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
              showErrorMessage={showFieldErrors}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
              isRequired={true}
            >
              <Form.Select
                id='docType'
                name='docType'
                data-checkout='docType'
                value={payment.docType}
                onChange={onUpdatePaymentData}
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
              showErrorMessage={showFieldErrors}
              validateFn={validateCitizenId}
              onUpdateHandler={onUpdateFieldHandler}
              isRequired={true}
            >
              <Form.Input
                type='text'
                id='docNumber'
                name='docNumber'
                placeholder='31402931'
                data-checkout='docNumber'
                maxLength={8}
                value={payment.docNumber}
                onChange={onUpdatePaymentData}
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
              isRequired={true}
            >
              <Form.Input
                type='text'
                id='cardholderName'
                name='cardholderName'
                data-checkout='cardholderName'
                placeholder='Daniela Lopez'
                value={payment.cardholderName}
                onChange={onUpdatePaymentData}
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
        <Elements.Button type='submit' disabled={submitting && true}>
          {(submitting)
            ? <Shared.Loader mode='light' />
            : (appData && appData.content && appData.content.form.registration.button_text)}
        </Elements.Button>
      </Form.Nav>
    </Form.Main>
  ), [
    user,
    payment,
    params,
    snackbarRef,
    showFieldErrors,
    // formState.allowNext,
    // formState.error,
    // formState.submitting,
    appData,
    formRef,
    contentFormRef,
    allowNext,
    error,
    submitted,
    submitting,
    searchParams,
    urlSearchParams,
    onSubmitHandler,
    // onChangeHandler,
    onUpdateFieldHandler,
    onUpdatePaymentData,
    // dispatch,
    // formDispatch,
  ]);
});

Component.displayName = 'RegistrationForm';
export default Component;
