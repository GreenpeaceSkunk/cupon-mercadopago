import { OnChangeEvent, IdentificationType, CouponType } from 'greenpeace';
import React, { useContext, useState, useRef, useMemo, useCallback, FormEvent, useEffect } from 'react';
import { css } from 'styled-components';
import {Link} from "react-router-dom";
import Form from '../../../v1/Shared/Form';
import Elements from '../../../Shared/Elements';
import Shared from '../../../Shared';
import { AppContext } from '../../../App/context';
import { useNavigate } from 'react-router';
import { CheckoutFormContext } from '../context';
import { validateCardHolderName, validateEmptyField } from '../../../../utils/validators';
import { ERROR_CODES } from '../../../../utils/mercadopago';
import Snackbar, { IRef as ISnackbarRef } from '../../../Snackbar';
import { pixelToRem } from 'meema.utils';
import { addOrRemoveSlashToDate } from '../../../../utils';
import moment from 'moment';
import useQuery from '../../../../hooks/useQuery';
import { generatePath } from 'react-router';
import { suscribe } from '../../../../services/payu';
import { FormContext } from '../../context';
import { postRecord } from '../../../../services/greenlab';

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
    error,
    dispatchFormErrors,
    onChangeHandler,
    onUpdateFieldHandler,
  } = useContext(CheckoutFormContext);
  const {shared} = useContext(FormContext);
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

      const response = await suscribe(
        {
          nombre: user.firstName,
          apellido: user.lastName,
          email: user.email,
          fecha_nacimiento: moment(user.birthDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          prefijo: user.areaCode,
          telefono: user.phoneNumber,
          pais: user.country,
          numero: user.addressNumber,
          monto: parseInt(payment.amount),
          direccion: user.address || '',
          tipo_donacion: params.couponType === 'oneoff' ? 'ONE_OFF' : 'Mensual',
          utm_campaign: urlSearchParams.get('utm_campaign') || '',
          utm_medium: urlSearchParams.get('utm_medium') || '',
          utm_source: urlSearchParams.get('utm_source') || '',
          utm_content: urlSearchParams.get('utm_content') || '',
          utm_term: urlSearchParams.get('utm_term') || '',
          ciudad: user.city,
          departamento: shared.provinces?.find((province: any) => province.name === user.province)?.code,
          tipo_documento_cliente: user.docType,
          numero_documento_cliente: user.docNumber,
          ...(payment.paymentType === 'bank_account') ? {
            banco: payment.bankName,
            numero_cuenta: payment.bankAccountNumber,
            tipo_cuenta: payment.bankAccountType,
          } : (payment.paymentType === 'credit_card') ? {
            tipo_documento_tarjetahabiente: payment.docType,
            numero_documento_tarjetahabiente: payment.docNumber,
            nombre_apellido_tarjetahabiente: payment.paymentHolderName,
            numero_tarjeta: parseInt(payment.cardNumber),
            cvv: parseInt(payment.securityCode),
            metodo_pago: appData.settings.general.form_fields.checkout.card_types.values.find((ct: any) => ct.value == payment.cardType).slug.toUpperCase(),
            fecha_vencimiento_tarjeta: moment(payment.cardExpiration, 'MM/YYYY').format('YYYY/MM')
          } : null,
        }
      );

      // if(response.status === 400) {
      //   dispatchFormErrors({
      //     type: 'SET_ERROR',
      //     error: `Hay errores en los siguientes campos: ${Object.values(response.data).map((e: any) => `"<strong>${e[0]}</strong>"`)}`,
      //   });

      //   dispatchFormErrors({ type: 'SUBMITTED' });
      //   return;
      // }

      /* Backup to Forma. */
      if(appData?.settings?.services?.forma?.form_id) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        await postRecord(
          {
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
            txnErrorMessage: response.status === 400 ? `Errores: ${Object.keys(response.data).map((e: any) => e)}` : '',
            txnStatus: response.status === 400 ? 'pending' : 'done',
            urlQueryParams: `${searchParams}`,
            userAgent: window.navigator.userAgent.replace(/;/g, '').replace(/,/g, ''),
            utmCampaign: urlSearchParams.get('utm_campaign') || '',
            utmMedium: urlSearchParams.get('utm_medium') || '',
            utmSource: urlSearchParams.get('utm_source') || '',
            utmContent: urlSearchParams.get('utm_content') || '',
            utmTerm: urlSearchParams.get('utm_term') || '',
            zipCode: user.zipCode || '',
          },
          appData.settings.services.forma.form_id,
        );
      }

      const timer = setTimeout(() => {
        dispatchFormErrors({ type: 'SUBMITTED' });

        navigate({
          pathname: generatePath(`/:couponType/forms/thank-you`, {
            couponType: params.couponType as CouponType,
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
    dispatchFormErrors({type: 'RESET_FIELD_ERRORS'});
  }, [payment.paymentType]);

  return useMemo(() => (
    <Form.Main id="paymentForm" onSubmit={onSubmitHandler}>
      <Form.Header>
        <Elements.HGroup>
          <Form.Title>{appData && appData.content && appData.content.form.checkout?.title}</Form.Title>
        </Elements.HGroup>
        <Shared.General.Text>{appData && appData.content && appData.content.form.checkout?.text}</Shared.General.Text>
      </Form.Header>
      <Form.Content>
        <Form.Row>
          <Form.Column>
            <Form.Group
              value={payment.paymentType}
              fieldName='paymentType'
              labelText=''
              showErrorMessage={showFieldErrors}
              displayAs='grid'
              gridColumns={2}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
            >
              {([
                {text: 'Tarjeta de crédito', value: 'credit_card'},
                // {text: 'PSE', value: 'bank_account'},
              ]).map((paymentType: {text: string, value: string}) => (
                <Form.RadioButton
                  key={paymentType.value}
                  text={paymentType.text}
                  name='paymentType'
                  value={paymentType.value}
                  checkedValue={`${payment.paymentType}`}
                  onChangeHandler={onChangeHandler}
                />
              ))}
            </Form.Group>
          </Form.Column>
        </Form.Row>
        
        {payment.paymentType === 'bank_account' ? (
          <>
            <Form.Row>
              <Form.Column>
                <Form.Group
                  fieldName='bankName'
                  value={payment.bankName}
                  labelText='Nombre del banco'
                  showErrorMessage={showFieldErrors}
                  validateFn={validateEmptyField}
                  onUpdateHandler={onUpdateFieldHandler}
                >
                  <Elements.Select
                    id="bankName"
                    name="bankName"
                    value={`${payment.bankName}`}
                    onChange={onChangeHandler}
                  >
                    <option value=""></option>
                    {(appData.settings.general.form_fields.checkout.banks.values || []).map((bank: {text: string, slug: string, value: number}) => (
                      <option key={bank.slug} value={bank.value}>{bank.text}</option>
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
                  fieldName='bankAccountType'
                  value={payment.bankAccountType}
                  labelText='Tipo de cuenta'
                  showErrorMessage={showFieldErrors}
                  validateFn={validateEmptyField}
                  onUpdateHandler={onUpdateFieldHandler}
                >
                  <Elements.Select
                    id="bankAccountType"
                    name="bankAccountType"
                    value={`${payment.bankAccountType}`}
                    onChange={onChangeHandler}
                  >
                    <option value=""></option>
                    {(appData.settings.general.form_fields.checkout.bank_account_types.values || []).map((bank: {text: string, slug: string, value: number}) => (
                      <option key={bank.slug} value={bank.value}>{bank.text}</option>
                    ))}
                  </Elements.Select>
                </Form.Group>
              </Form.Column>
              <Form.Column>
              <Form.Group
                  fieldName='bankAccountNumber'
                  value={payment.bankAccountNumber}
                  labelText='Número de cuenta'
                  showErrorMessage={showFieldErrors}
                  onUpdateHandler={onUpdateFieldHandler}
                  validateFn={validateEmptyField}
                >
                  <Elements.Input
                    type='number'
                    id='bankAccountNumber'
                    name='bankAccountNumber'
                    placeholder=''
                    value={payment.bankAccountNumber}
                    onChange={onChangeHandler}
                  />
                </Form.Group>
              </Form.Column>
            </Form.Row>
          </>
        ) : (
          <>
            <Form.Row
              customCss={css`
                grid-template-columns: 1fr 1fr;
                gap: ${pixelToRem(20)};
              `}
            >
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
                    type='password'
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
                  onUpdateHandler={onUpdateFieldHandler}
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
          </>
        )}
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
                {(appData.settings.general.form_fields.shared.identification_types.values || []).map((doc: IdentificationType) => (
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
              value={payment.paymentHolderName}
              fieldName='paymentHolderName'
              labelText='Nombre completo del titular'
              validateFn={validateCardHolderName}
              onUpdateHandler={onUpdateFieldHandler}
              showErrorMessage={showFieldErrors}
            >
              <Elements.Input
                type='text'
                id='paymentHolderName'
                name='paymentHolderName'
                data-checkout='paymentHolderName'
                placeholder='Daniela Lopez'
                value={payment.paymentHolderName}
                onChange={onChangeHandler}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
      </Form.Content>
      {error && <Elements.Span
        dangerouslySetInnerHTML={{__html: `${error}`}}
        customCss={css`
          padding: ${pixelToRem(10)};
          background-color: ${({theme}) => theme.color.error.light};
          color: ${({theme}) => theme.color.error.normal};
        `}
      />}
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
        <Link to={generatePath(`/:couponType/forms/registration`, {
          couponType: params.couponType as CouponType,
        }) + searchParams}>Volver</Link>
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
    error,
    onSubmitHandler,
    onChangeHandler,
    onUpdateFieldHandler,
  ]);
}

CheckoutForm.displayName = 'PayUCheckoutForm';
export default CheckoutForm;
