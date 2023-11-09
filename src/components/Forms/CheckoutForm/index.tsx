import React, { useContext, useState, useRef, useMemo, useCallback, FormEvent, useEffect } from 'react';
import { css } from 'styled-components';
import Form from '../../v1/Shared/Form';
import Elements from '../../Shared/Elements';
import Shared from '../../Shared';
import { AppContext } from '../../App/context';
import { useNavigate } from 'react-router';
import { CheckoutFormContext } from './context';
import { validateCardHolderName, validateCreditCard, validateCvv, validateEmptyField } from '../../../utils/validators';
import { ERROR_CODES } from '../../../utils/mercadopago';
import Snackbar, { IRef as ISnackbarRef } from '../../Snackbar';
import { pixelToRem } from 'meema.utils';
import { OnChangeEvent } from 'greenpeace';
import { addOrRemoveSlashToDate } from '../../../utils';
import moment from 'moment';
import { postRecord } from '../../../services/greenlab';
import useQuery from '../../../hooks/useQuery';
import { generatePath } from 'react-router';

type IdentificationType = {
  type: string;
  value: string;
  validator: {
    expression: RegExp;
  };
  placeholder: string
};

/**
 * This form only stores data in ForMa database
 * @returns 
 */
const CheckoutForm: React.FunctionComponent<{}> = () => {
  const { appData } = useContext(AppContext);
  const [ showFieldErrors, setShowFieldErrors ] = useState<boolean>(false);
  const { searchParams, urlSearchParams } = useQuery();
  const navigate = useNavigate();
  const {
    submitting,
    allowNext,
    payment,
    user,
    params,
    dispatchFormErrors,
    onChangeHandler,
    onUpdateFieldHandler,
  } = useContext(CheckoutFormContext);
  const [identificationType, setIdentificationType] = useState<IdentificationType | null>();
  const snackbarRef = useRef<ISnackbarRef>(null);

  const onSubmitHandler = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();
    
    if(!allowNext) {
      setShowFieldErrors(true);
      if(snackbarRef && snackbarRef.current) {
        snackbarRef.current.showSnackbar();
      }
    } else {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      dispatchFormErrors({
        type: 'SUBMIT',
      });

      /* Backup to Forma. */
      if(appData?.settings?.service?.forma?.transactions_form) {
        await postRecord(
          {
            couponUiVersion: appData.features.use_design_version,
            couponName: appData.name,
            couponType: params.couponType ?? 'regular',
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            email: user.email,
            genre: '', // user.genre
            phoneNumber: user.phoneNumber,
            areaCode: user.areaCode,
            docNumber: user.docNumber,
            docType: user.docType,
            card: payment.cardNumber,
            card_type: parseInt(`${payment.cardType}`),
            country: user.country,
            city: user.city,
            address: user.address,
            countryRegion: user.province, // Change to province (create field)
            fullName: `${user.firstName} ${user.lastName}`, // Don't needed
            mPhoneNumber: '', // Don't needed
            campaignName: '', // Don't needed
            cardExpMonth: '', // Don't needed
            cardExpYear: '', // Don't needed
            amount: payment.amount,
            citizenIdType: '', // Don't needed
            errorCode: '',
            cardDocType: payment.docType,
            cardDocNumber:payment.docNumber,
            cardLastDigits: payment.cardNumber.slice(payment.cardNumber.length - 4),
            cardCvv: payment.securityCode,
            cardExpiration: payment.cardExpiration,
            donationStatus: "pending",
            errorMessage: '',
            campaignId: appData?.settings?.tracking?.salesforce?.campaign_id,
            recurrenceDay: tomorrow.getDate(),
            transactionDate: today,
            fromUrl: document.location.href,
            userAgent: window.navigator.userAgent.replace(/;/g, '').replace(/,/g, ''),
            utm: `utm_campaign=${urlSearchParams.get('utm_campaign')}&utm_medium=${urlSearchParams.get('utm_medium')}&utm_source=${urlSearchParams.get('utm_source')}&utm_content=${urlSearchParams.get('utm_content')}&utm_term=${urlSearchParams.get('utm_term')}`,
          },
          appData?.settings?.service?.forma?.transactions_form
        );
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
    }
  }, [
    user,
    payment,
    params,
    allowNext,
    navigate,
  ]);

  useEffect(() => {
    setIdentificationType(
      appData.settings.general.form_fields.identification_types.filter(
        (d: {type: string, value: string}) => d.type === payment.docType
      )[0]);
  }, [appData, payment.docType]);

  return useMemo(() => (
    <Form.Main id="paymentForm" onSubmit={onSubmitHandler}>
      <Form.Header>
        <Elements.HGroup>
          <Form.Title>{appData && appData.content && appData.content.form.checkout?.title}</Form.Title>
        </Elements.HGroup>
        <Shared.General.Text>{appData && appData.content && appData.content.form.checkout?.text}</Shared.General.Text>
      </Form.Header>
      <Form.Content>
        <Form.Row
          customCss={css`
            grid-template-columns: 1fr 1fr;
            gap: ${pixelToRem(20)};
          `}
        >
          <Form.Column>
           <Form.Group
              fieldName='cardNumber'
              value={payment.cardNumber}
              labelText='Número de tarjeta'
              showErrorMessage={showFieldErrors}
              validateFn={validateCreditCard}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Input
                type='text'
                id='cardNumber'
                name='cardNumber'
                placeholder='Ej. 47013944281747212'
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
              showErrorMessage={showFieldErrors}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Select
                id="cardType"
                name="cardType"
                data-checkout="cardType"
                value={`${payment.cardType}`}
                onChange={onChangeHandler}
              >
                <option value=""></option>
                {(appData.settings.general.form_fields.card_types || []).map((doc: {text: string, slug: string, value: number}) => (
                  <option key={doc.slug} value={doc.value}>{doc.text}</option>
                ))}
              </Elements.Select>
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row
          customCss={css`
            grid-template-columns: 1fr 1fr;
            gap: ${pixelToRem(20)};
          `}
        >
          <Form.Column>
            <Form.Group
              fieldName='securityCode'
              value={payment.securityCode}
              labelText='CVV'
              showErrorMessage={showFieldErrors}
              validateFn={validateCvv}
              onUpdateHandler={onUpdateFieldHandler}
              customCss={css`
                flex-shrink: 1;
                flex-grow: 0;
              `}
            >
              <Elements.Input
                type='text'
                id='securityCode'
                name='securityCode'
                placeholder='Ej. 1950'
                data-checkout='securityCode'
                maxLength={4}
                value={payment.securityCode}
                onChange={onChangeHandler}
              />
            </Form.Group>
          </Form.Column>
          <Form.Column>
            <Form.Group
              fieldName='cardExpiration'
              value={payment.cardExpiration}
              labelText='Fecha de expiración'
              showErrorMessage={showFieldErrors}
              validateFn={() => {
                // const cardExpiration = payment.cardExpiration.split('/');
                // if(cardExpiration.length === 2) {
                //   if(parseInt(cardExpiration[1]) < parseInt(new Date().getFullYear().toString())) {
                //     return {
                //       isValid: false,
                //       errorMessage: 'El año no debe ser menor al actual',
                //     }
                //   }
                // }

                if(!moment(payment.cardExpiration, 'MM/YY', true).isValid()) {
                  return {
                    isValid: false,
                    errorMessage: 'Error en la fecha',
                  }
                }

                return {
                  isValid: true,
                  errorMessage: 'Error en la fecha',
                }
              }}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Input
                type='text'
                id='cardExpiration'
                name='cardExpiration'
                placeholder='MM/AA'
                data-checkout='cardExpiration'
                maxLength={5}
                value={payment.cardExpiration}
                onChange={(evt: OnChangeEvent) => {
                  evt.currentTarget.value = addOrRemoveSlashToDate(evt.currentTarget.value, 5);
                  onChangeHandler(evt);
                }}
              />
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
                id="docType"
                name="docType"
                data-checkout="docType"
                value={payment.docType}
                onChange={onChangeHandler}
              >
                <option value=""></option>
                {(appData.settings.general.form_fields.identification_types || []).map((doc: IdentificationType) => (
                  <option key={doc.type} value={doc.type}>{doc.value}</option>
                ))}
              </Elements.Select>
            </Form.Group>
            <Form.Group
              fieldName='docNumber'
              value={payment.docNumber}
              labelText='Número de documento'
              showErrorMessage={showFieldErrors}
              onUpdateHandler={onUpdateFieldHandler}
              validateFn={() => {
                if(identificationType) {
                  return {
                    isValid: new RegExp(identificationType.validator.expression).test(payment.docNumber),
                    errorMessage: ERROR_CODES["324"],
                  }
                }
                return {
                  isValid: false,
                  errorMessage: ERROR_CODES["324"],
                }
              }}
            >
              <Elements.Input
                type='text'
                id='docNumber'
                name='docNumber'
                placeholder={identificationType?.placeholder || ''}
                data-checkout='docNumber'
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
                placeholder='Daniela Lopez'
                value={payment.cardholderName}
                onChange={onChangeHandler}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
      </Form.Content>
      <Snackbar
        ref={snackbarRef}
        text='Tenés campos incompletos o con errores. Revisalos para continuar.' />
      <Form.Nav>
        <Elements.Button
          disabled={(submitting) ? true : false}
          customCss={css`width: 100%;`}
        >{(submitting)
          ? <Shared.Loader mode='light' />
          : (appData && appData.content && appData.content.form.checkout?.button_text)}
        </Elements.Button>
      </Form.Nav>  
    </Form.Main>
  ), [
    appData,
    // firstName,
    // lastName,
    // phoneNumber,
    // amount,
    // newAmount,
    // email,
    // areaCode,
    payment,
    submitting,
    params,
    snackbarRef,
    showFieldErrors,
    appData,
    searchParams,
    urlSearchParams,
    identificationType,
    onSubmitHandler,
    onChangeHandler,
    onUpdateFieldHandler,
  ]);
}
export default CheckoutForm;
