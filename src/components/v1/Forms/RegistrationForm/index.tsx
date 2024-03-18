import React, { FormEvent, memo, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../Forms/context';
import { IdentificationType, OnChangeEvent } from 'greenpeace';
import {
  validateEmail,
  validateNewAmount,
  validatePhoneNumber,
  validateAreaCode,
  validateEmptyField,
  validateFirstName,
} from '../../../../utils/validators';
import { css } from 'styled-components';
import Shared from '../../../Shared';
import Elements from '../../Shared/Elements';
import Form from '../../Shared/Form';
import { addOrRemoveSlashToDate } from '../../../../utils';
import { initialState, reducer } from '../../../Forms/RegistrationForm/reducer';
import { pushToDataLayer } from '../../../../utils/googleTagManager';
import useQuery from '../../../../hooks/useQuery';
import Snackbar, { IRef as ISnackbarRef } from '../../../Snackbar';
import { createContact } from '../../../../services/greenlab';
import { AppContext } from '../../../App/context';
import { pixelToRem } from 'meema.utils';
import { ProvinceType } from '../../../Forms/reducer';
import moment from 'moment';
import { ERROR_CODES } from '../../../../utils/mercadopago';

const Component: React.FunctionComponent<{}> = memo(() => {
  const { appData } = useContext(AppContext);
  const {
    data: {
      user,
      payment,
    },
    shared: {
      countries,
      provinces,
      cities,
    },
    params,
    dispatch,
  } = useContext(FormContext);
  const [{ submitting, allowNext }, dispatchFormErrors ] = useReducer(reducer, initialState);
  const [ showFieldErrors, setShowFieldErrors ] = useState<boolean>(false);
  const [identificationType, setIdentificationType] = useState<IdentificationType | null>();
  const navigate = useNavigate();
  const { searchParams, urlSearchParams } = useQuery();
  const snackbarRef = useRef<ISnackbarRef>(null);
  
  const onChangeHandler = useCallback((evt: OnChangeEvent) => {
    const name = evt.currentTarget.name;
    const value = evt.currentTarget.value;
    const schema: 'payment' | 'user' = evt.currentTarget.dataset.schema;

    switch (schema) {
      case 'payment':
        dispatch({
          type: 'UPDATE_PAYMENT_DATA',
          payload: { [name]: value }
        });
        break;
      case 'user':
        dispatch({
          type: 'UPDATE_USER_DATA',
          payload: { [name]: value }
        });
        break;
      default:
        console.log(`The "schema" is not defined to "${name}"`);
    }
  }, [
    dispatch,
  ]);

  const onUpdateFieldHandler = useCallback((fieldName: string, isValid: boolean, value: any) => {
    if(fieldName === 'amount' || fieldName === 'newAmount') {
      dispatchFormErrors({
        type: 'UPDATE_FIELD_ERRORS',
        payload: {
          fieldName: 'newAmount',
          isValid: 
          (fieldName === 'amount' && value === 'otherAmount')
          ? false
          : (fieldName === 'newAmount' && payment.amount === 'otherAmount')
          ? validateNewAmount(value, appData.settings.general.amounts.min_other_amount).isValid
          : true,
        }
      });
    } else {
      dispatchFormErrors({
        type: 'UPDATE_FIELD_ERRORS',
        payload: {
          fieldName,
          isValid,
        }
      });
    }
  }, [
    payment.amount,
    appData,
    dispatchFormErrors,
  ]);

  const onSubmitHandler = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();

    if(!allowNext) {
      setShowFieldErrors(true);
      if(snackbarRef && snackbarRef.current) {
        snackbarRef.current.showSnackbar();
      }
      return;
    }

    dispatchFormErrors({
      type: 'SUBMIT',
    });

    const contact = await createContact({
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
      phone: `${user.areaCode}${user.phoneNumber}`,
      donationStatus: 'requested',
    });

    if(contact) {
      pushToDataLayer({ 'event' : 'petitionSignup' });

      if(params) {
        const {payment_gateway} = appData.features;

        navigate({
          pathname: generatePath('/:couponType/forms/:formType/:paymentGateway', {
            couponType: `${params.couponType}`,
            formType: 'checkout',
            paymentGateway: payment_gateway.enabled && payment_gateway.third_party
              ? `${payment_gateway.third_party}`.toLowerCase() : '',
          }),
          search: searchParams,
        }, { replace: true });
      }
    }
  }, [
    user,
    params,
    allowNext,
    navigate,
    searchParams,
  ]);

  useEffect(() => {
    setIdentificationType(
      appData.settings.general.form_fields.shared.identification_types.values.find(
        (d: {type: string, value: string}) => d.type === user.docType
      ));
  }, [appData, user.docType]);

  useEffect(() => {
    (async () => {
      dispatch({
        type: 'UPDATE_FIELD',
        payload: { ['country']: appData.country }
      });

      const amounts = appData.settings.general.amounts.values || [];
      let defaultAmount;

      if(urlSearchParams.get('donate')) {
        defaultAmount = `${urlSearchParams.get('donate')}`;
        
        dispatch({
          type: 'UPDATE_PAYMENT_DATA',
          payload: {
            ...(amounts.filter((a:number) => `${a}` === urlSearchParams.get('donate')).length) ? {
              amount: defaultAmount,
            } : {
              amount: 'otherAmount',
              newAmount: defaultAmount,
            },
          }
        })
      } else {
        if(typeof payment.amount === 'undefined' && amounts) {
          if(appData.settings.general.amounts.values.filter((v: number) => v === appData.settings.general.amounts.default).length) {
            dispatch({
              type: 'UPDATE_PAYMENT_DATA',
              payload: {'amount': `${appData.settings.general.amounts.default || ''}`}
            });
          } else {
            dispatch({
              type: 'UPDATE_PAYMENT_DATA',
              payload: {
                'amount': 'otherAmount',
                'newAmount': `${appData.settings.general.amounts.default}`,
              }
            });
          }
        }
      }
    })();
  }, [
    appData,
    dispatch,
  ]);

  return useMemo(() => (
    <Form.Main id='sign-form' onSubmit={onSubmitHandler}>
      <Form.Header>
        <Elements.HGroup>
          <Form.Title>{appData && appData.content && appData.content.form.registration.title}</Form.Title>
        </Elements.HGroup>
        <Shared.General.Text>{appData.content.form.registration.text}</Shared.General.Text>
      </Form.Header>
      <Form.Content>
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
              displayAs='grid'
              gridColumns={3}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
              customCss={css`
                > label {
                  font-weight: bold;
                }
              `}
            >
              {appData && appData.content && appData.settings.general.amounts.values.map((value: number) => (
                <Form.RadioButton
                  key={`${value}`}
                  text={`${appData.settings.general.amounts.currency}${value}`}
                  name='amount'
                  value={`${value}`}
                  checkedValue={payment.amount}
                  onChangeHandler={onChangeHandler}
                  dataSchema='payment'
                />
              ))}
              <Form.RadioButton
                key='otherAmount'
                text='Otras donaciones'
                name='amount'
                value='otherAmount'
                checkedValue={payment.amount}
                onChangeHandler={onChangeHandler}
                customCss={css``}
                dataSchema='payment'
              />
            </Form.Group>
          </Form.Column>
            {(payment.amount === 'otherAmount') ? (
              <Form.Column>
                <Form.Group
                  fieldName='newAmount'
                  value={payment.newAmount}
                  labelText='Ingrese el monto'
                  showErrorMessage={showFieldErrors}
                  validateFn={() => validateNewAmount(payment.newAmount, appData.settings.general.amounts.min_other_amount)}
                  onUpdateHandler={onUpdateFieldHandler}
                >
                  <Elements.Input
                    name='newAmount'
                    type='text'
                    value={payment.newAmount}
                    placeholder={`Ej. ${appData.settings.general.amounts.currency}${appData.settings.general.amounts.min_other_amount}`}
                    maxLength={8}
                    onChange={onChangeHandler}
                    data-schema='payment'
                  />
                </Form.Group>
              </Form.Column>
            ) : null}
            {(params.couponType === 'regular') && (
               <Form.Column>
                  <Elements.P
                    dangerouslySetInnerHTML={{__html: appData.content.form.general.coupon_regular_label_text_2}}
                    customCss={css`
                      display: block;
                      background: white;
                      font-size: ${pixelToRem(14)};
                      padding: ${pixelToRem(16)};
                      border-radius: ${pixelToRem(6)};
                    `}
                  />
               </Form.Column>
            )}
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
              fieldName='firstName'
              value={user.firstName}
              labelText='Nombre'
              showErrorMessage={showFieldErrors}
              validateFn={validateFirstName}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Input
                name='firstName'
                type='text'
                placeholder=''
                value={user.firstName}
                onChange={onChangeHandler}
                data-schema='user'
              />
            </Form.Group>
            <Form.Group
              fieldName='lastName'
              value={user.lastName}
              labelText='Apellido'
              showErrorMessage={showFieldErrors}
              validateFn={validateFirstName}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Input
                name='lastName'
                type='text'
                placeholder=''
                value={user.lastName}
                onChange={onChangeHandler}
                data-schema='user'
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
              fieldName='docType'
              value={user.docType}
              labelText='Tipo de documento'
              showErrorMessage={showFieldErrors}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Select
                id="docType"
                name="docType"
                data-checkout="docType"
                value={user.docType}
                onChange={onChangeHandler}
                data-schema='user'
              >
                <option value=""></option>
                {(appData.settings.general.form_fields.shared.identification_types.values || []).map((doc: IdentificationType) => (
                  <option key={doc.type} value={doc.type}>{doc.value}</option>
                ))}
              </Elements.Select>
            </Form.Group>
            <Form.Group
              fieldName='docNumber'
              value={user.docNumber}
              labelText='Número de documento'
              showErrorMessage={showFieldErrors}
              onUpdateHandler={onUpdateFieldHandler}
              validateFn={() => {
                if(identificationType) {
                  return {
                    isValid: new RegExp(identificationType.validator.expression).test(user.docNumber),
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
                value={user.docNumber}
                onChange={onChangeHandler}
                data-schema='user'
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
              validateFn={validateEmail}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Input
                name='email'
                type='email'
                placeholder=''
                value={user.email}
                onChange={onChangeHandler}
                data-schema='user'
              />
            </Form.Group>
            {(appData.settings.general.form_fields.registration.birthDate?.show) && (
              <Form.Group
                fieldName='birthDate'
                value={user.birthDate}
                labelText='Fecha de nacimiento'
                showErrorMessage={showFieldErrors}
                validateFn={() => {
                  if(!moment(user.birthDate, 'DD/MM/YYYY', true).isValid()) {
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
                  id='birthDate'
                  name='birthDate'
                  placeholder='DD/MM/AAAA'
                  data-checkout='birthDate'
                  maxLength={10}
                  value={user.birthDate}
                  onChange={(evt: OnChangeEvent) => {
                    evt.currentTarget.value = addOrRemoveSlashToDate(evt.currentTarget.value, 10);
                    onChangeHandler(evt);
                  }}
                  data-schema='user'
                />
              </Form.Group>
            )}
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column bottomText='Escribe solo números y no agregues guiones.'>
            <Form.Group
              fieldName='areaCode'
              value={user.areaCode}
              labelText='Cód. área'
              showErrorMessage={showFieldErrors}
              validateFn={validateAreaCode}
              onUpdateHandler={onUpdateFieldHandler}
              customCss={css`
                width: 40%;
              `}
            >
              <Elements.Input
                name='areaCode'
                type='text'
                placeholder=''
                value={user.areaCode}
                maxLength={4}
                onChange={onChangeHandler}
                data-schema='user'
              />
            </Form.Group>
            <Form.Group
              fieldName='phoneNumber'
              value={user.phoneNumber}
              labelText='Número telefónico'
              showErrorMessage={showFieldErrors}
              validateFn={validatePhoneNumber}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Input
                name='phoneNumber'
                type='text'
                placeholder={appData.settings.general.form_fields.registration.phone_mobile_number?.placeholder || ''}
                value={user.phoneNumber}
                onChange={onChangeHandler}
                data-schema='user'
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>

          <Form.Row>
            <Form.Column>
              {(appData.settings.general.form_fields.registration.genre?.show) && (
                <Form.Group
                  fieldName='genre'
                  value={user.genre}
                  labelText='Género'
                  showErrorMessage={showFieldErrors}
                  validateFn={validateEmptyField}
                  onUpdateHandler={onUpdateFieldHandler}
                >
                  <Elements.Select
                    id="genre"
                    name="genre"
                    data-checkout="genre"
                    value={user.genre}
                    onChange={onChangeHandler}
                  >
                    <option value=""></option>
                    {['Femenino', 'Masculino', 'No binario'].map((value: string, key: number) => (
                      <option key={key} value={value}>{value}</option>
                    ))}
                  </Elements.Select>
                </Form.Group>
              )}
              {(appData.settings.general.form_fields.registration.location.country?.show) && (
                <Form.Group
                  fieldName='country'
                  value={user.country}
                  labelText='País'
                  showErrorMessage={showFieldErrors}
                  validateFn={validateEmptyField}
                  onUpdateHandler={onUpdateFieldHandler}
                >
                  <Elements.Select
                    id="country"
                    name="country"
                    data-checkout="country"
                    value={user.country}
                    onChange={onChangeHandler}
                    // disabled={appData.settings.general.form_fields.registration.location.country.disabled}
                    data-schema='user'
                  >
                    <option value=""></option>
                    {(countries || []).map((value: any, key: number) => (
                      <option key={key} value={value.label}>{value.label}</option>
                    ))}
                  </Elements.Select>
                </Form.Group>
              )}
            </Form.Column>
          </Form.Row>

        {(appData.settings.general.form_fields.registration.location.province?.show) && (
          <Form.Row>
            <Form.Column>
              <Form.Group
                fieldName='province'
                value={user.province}
                labelText={appData.settings.general.form_fields.registration.location.province.label || 'Provincia'}
                showErrorMessage={showFieldErrors}
                validateFn={validateEmptyField}
                onUpdateHandler={onUpdateFieldHandler}
                isRequired={false}
              >
                <Elements.Select
                  id="province"
                  name="province"
                  data-checkout="province"
                  value={user.province}
                  onChange={onChangeHandler}
                  data-schema='user'
                >
                  <option value=""></option>
                  {(provinces || []).map((value: ProvinceType) => (
                    <option key={value.slug} value={value.name}>{value.name}</option>
                  ))}
                </Elements.Select>
              </Form.Group>
            {(appData.settings.general.form_fields.registration.location.province?.show && appData.settings.general.form_fields.registration.location.city?.show) && (
              <Form.Group
                fieldName='city'
                value={user.city}
                labelText={appData.settings.general.form_fields.registration.location.city.label || 'Ciudad'}
                showErrorMessage={showFieldErrors}
                validateFn={validateEmptyField}
                onUpdateHandler={onUpdateFieldHandler}
                isRequired={false}
              >
                <Elements.Select
                  id="city"
                  name="city"
                  data-checkout="city"
                  value={user.city}
                  onChange={onChangeHandler}
                  disabled={(!user.province ? true : false)}
                  data-schema='user'
                >
                  <option value=""></option>
                  {(cities || []).map((value: string, key: number) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </Elements.Select>
              </Form.Group>
            )}
            </Form.Column>
          </Form.Row>
        )}

        {(appData.settings.general.form_fields.registration.location.address?.show) && (
          <Form.Row>
            <Form.Column>
              <Form.Group
                value={user.address}
                fieldName='address'
                labelText='Dirección'
                showErrorMessage={showFieldErrors}
                validateFn={validateEmptyField}
                onUpdateHandler={onUpdateFieldHandler}
                isRequired={appData.settings.general.form_fields.registration.location.address.required || false}
              >
                <Elements.Input
                  name='address'
                  type='text'
                  placeholder=''
                  value={user.address}
                  onChange={onChangeHandler}
                  data-schema='user'
                />
              </Form.Group>
              {(appData.settings.general.form_fields.registration.location.addressNumber?.show) && (
                <Form.Group
                  fieldName='addressNumber'
                  value={user.addressNumber}
                  labelText='Número'
                  showErrorMessage={showFieldErrors}
                  validateFn={validateEmptyField}
                  onUpdateHandler={onUpdateFieldHandler}
                  isRequired={appData.settings.general.form_fields.registration.location.addressNumber.required || false}
                  customCss={css`
                    width: 40%;
                  `}
                >
                  <Elements.Input
                    name='addressNumber'
                    type='number'
                    placeholder=''
                    value={user.addressNumber}
                    onChange={onChangeHandler}
                    data-schema='user'
                  />
                </Form.Group>
              )}
              {(appData.settings.general.form_fields.registration.location.address.show && appData.settings.general.form_fields.registration.location.zipCode?.show) && (
                <Form.Group
                  fieldName='zipCode'
                  value={user.zipCode}
                  labelText='Cód. postal'
                  showErrorMessage={showFieldErrors}
                  validateFn={validateEmptyField}
                  onUpdateHandler={onUpdateFieldHandler}
                  isRequired={appData.settings.general.form_fields.registration.location.addressNumber.required || false}
                  customCss={css`
                    width: 40%;
                  `}
                >
                  <Elements.Input
                    name='addressNumber'
                    type='number'
                    placeholder=''
                    value={user.addressNumber}
                    onChange={onChangeHandler}
                  />
                </Form.Group>
              )}
              {(appData.settings.general.form_fields.registration.location.address.show && appData.settings.general.form_fields.registration.location.zipCode?.show) && (
                <Form.Group
                  fieldName='zipCode'
                  value={user.zipCode}
                  labelText='Cód. postal'
                  showErrorMessage={showFieldErrors}
                  validateFn={validateEmptyField}
                  onUpdateHandler={onUpdateFieldHandler}
                  isRequired={appData.settings.general.form_fields.registration.location.zipCode.required || false}
                  customCss={css`
                    width: 40%;
                  `}
                >
                  <Elements.Input
                    name='zipCode'
                    type='text'
                    placeholder=''
                    value={user.zipCode}
                    maxLength={10}
                    onChange={onChangeHandler}
                    data-schema='user'
                  />
                </Form.Group>
              )}
            </Form.Column>
          </Form.Row>
        )}
      </Form.Content>
      <Snackbar
        ref={snackbarRef}
        text='Tenés campos incompletos o con errores. Revisalos para continuar.'
      />
      <Form.Nav
        customCss={css`
          background-color: ${({theme}) => theme.color.secondary.light};
        `}
      >
        <Elements.Button
          type='submit'
          disabled={(submitting) ? true : false}
          customCss={css`
            width: 100%;
          `}
        >{(submitting) ? <Shared.Loader mode='light' /> : (appData && appData.content && appData.content.form.registration.button_text)}</Elements.Button>
      </Form.Nav>
    </Form.Main>
  ), [
    user,
    payment,
    submitting,
    countries,
    provinces,
    cities,
    params,
    snackbarRef,
    showFieldErrors,
    appData,
    onSubmitHandler,
    onChangeHandler,
    onUpdateFieldHandler,
  ]);
});

Component.displayName = 'RegistrationForm';
export default Component;
