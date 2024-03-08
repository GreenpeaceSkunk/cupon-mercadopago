import React, { useContext, useState, useRef, useMemo, useCallback, FormEvent } from 'react';
import { css } from 'styled-components';
import Form from '../../v1/Shared/Form';
import Elements from '../../Shared/Elements';
import Shared from '../../Shared';
import { AppContext } from '../../App/context';
import { useNavigate } from 'react-router';
import { CheckoutFormContext, IdentificationType } from './context';
import { validateCardHolderName, validateEmptyField } from '../../../utils/validators';
import { ERROR_CODES } from '../../../utils/mercadopago';
import Snackbar, { IRef as ISnackbarRef } from '../../Snackbar';
import { pixelToRem } from 'meema.utils';
import { OnChangeEvent } from 'greenpeace';
import { addOrRemoveSlashToDate } from '../../../utils';
import moment from 'moment';
import { postRecord, saveLocal } from '../../../services/greenlab';
import useQuery from '../../../hooks/useQuery';
import { generatePath } from 'react-router';

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
    identificationType,
    cardType,
    dispatchFormErrors,
    onChangeHandler,
    onUpdateFieldHandler,
  } = useContext(CheckoutFormContext);
  const snackbarRef = useRef<ISnackbarRef>(null);

  const onSubmitHandler = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();
    
    if(!allowNext) {
      setShowFieldErrors(true);
      if(snackbarRef && snackbarRef.current) {
        snackbarRef.current.showSnackbar();
      }
    } else {
      dispatchFormErrors({ type: 'SUBMIT' });
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const payload = {
        address: user.address || '',
        amount: payment.amount === 'otherAmount' ? payment.newAmount : payment.amount,
        appUiVersion: appData.features.use_design_version,
        appName: appData.name,
        areaCode: user.areaCode,
        birthDate: user.birthDate,
        campaignId: appData?.settings?.tracking?.salesforce?.campaign_id,
        card: payment.cardNumber,
        card_type: parseInt(`${payment.cardType}`),
        cardCvv: payment.securityCode,
        cardDocNumber:payment.docNumber,
        cardDocType: payment.docType,
        cardExpiration: payment.cardExpiration,
        cardLastDigits: payment.cardNumber.slice(payment.cardNumber.length - 4),
        city: user.city || '',
        country: user.country,
        couponType: params.couponType ?? 'regular',
        docNumber: user.docNumber,
        docType: user.docType,
        email: user.email,
        firstName: user.firstName,
        fromUrl: document.location.href,
        genre: user.genre,
        lastName: user.lastName,
        mobileNumber: '',
        phoneNumber: user.phoneNumber,
        province: user.province || '',
        region: '',
        recurrenceDay: tomorrow.getDate(),
        txnDate: today,
        txnErrorCode: '',
        txnErrorMessage: '',
        txnStatus: "pending",
        urlQueryParams: `${searchParams}`, 
        userAgent: window.navigator.userAgent.replace(/;/g, '').replace(/,/g, ''),
        utmCampaign: urlSearchParams.get('utm_campaign') || '',
        utmMedium: urlSearchParams.get('utm_medium') || '',
        utmSource: urlSearchParams.get('utm_source') || '',
        utmContent: urlSearchParams.get('utm_content') || '',
        utmTerm: urlSearchParams.get('utm_term') || '',
        zipCode: user.zipCode || '',
      };

      if(appData?.features.sync_local === true) {
        /* Backup to Local. */
        saveLocal(
          appData?.settings?.services?.forma?.form_id,
          appData.name,
          appData.country,
          payload,
        );
      } else {

        /* Backup to Forma. */
        if(appData?.settings?.services?.forma?.form_id) {
          await postRecord(
            payload,
            appData?.settings?.services?.forma?.form_id,
          );
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
    }
  }, [
    user,
    payment,
    params,
    allowNext,
    navigate,
  ]);

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
              onUpdateHandler={onUpdateFieldHandler}
              validateFn={() => {
                if(cardType) {
                  return {
                    isValid: new RegExp(cardType.validator.card_number.expression).test(payment.cardNumber),
                    errorMessage: ERROR_CODES["E301"],
                  }
                }
                return {
                  isValid: false,
                  errorMessage: ERROR_CODES["E301"],
                }
              }}
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
                {(appData.settings.general.form_fields.checkout.card_types.values || []).map((doc: {text: string, slug: string, value: number}) => (
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
              onUpdateHandler={onUpdateFieldHandler}
              validateFn={() => {
                if(cardType) {
                  return {
                    isValid: new RegExp(cardType.validator.card_security_code.expression).test(payment.securityCode),
                    errorMessage: ERROR_CODES["E302"],
                  }
                }
                return {
                  isValid: false,
                  errorMessage: ERROR_CODES["E302"],
                }
              }}
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
                if(!moment(payment.cardExpiration, 'MM/YY', true).isValid()) {
                  return {
                    isValid: false,
                    errorMessage: 'Error en la fecha',
                  }
                }

                return {
                  isValid: true,
                  errorMessage: '',
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
                {(appData.settings.general.form_fields.registration.identification_types.values || []).map((doc: IdentificationType) => (
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
    cardType,
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
