import React, { FormEvent, memo, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../Forms/context';
import { OnChangeEvent } from 'greenpeace';
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

const Component: React.FunctionComponent<{}> = memo(() => {
  const { appData } = useContext(AppContext);
  const {
    data: {
      user: {
        firstName,
        lastName,
        email,
        areaCode,
        phoneNumber,
        country,
        province,
        city,
        address,
        zipCode,
        genre,
      },
      payment: {
        amount,
        newAmount,
      },
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
  const navigate = useNavigate();
  const { searchParams, urlSearchParams } = useQuery();
  const snackbarRef = useRef<ISnackbarRef>(null);
  
  const onChangeHandler = useCallback((evt: OnChangeEvent) => {
    evt.preventDefault();

    const name = evt.currentTarget.name;
    let value = evt.currentTarget.value;
    
    if(name === 'amount' || name === 'newAmount') {
      dispatch({
        type: 'UPDATE_PAYMENT_DATA',
        payload: { [name]: value }
      });
    } else {
      dispatch({
        type: 'UPDATE_FIELD',
        payload: { [name]: value }
      });
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
          : (fieldName === 'newAmount' && amount === 'otherAmount')
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
    amount,
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
      email,
      firstname: firstName,
      lastname: lastName,
      phone: `${areaCode}${phoneNumber}`,
      donationStatus: 'requested',
    });

    if(contact) {
      pushToDataLayer({ 'event' : 'petitionSignup' });

      if(params) {
        navigate({
          pathname: generatePath('/:couponType/forms/:formType/:paymentGateway', {
            couponType: `${params.couponType}`,
            formType: 'checkout',
            paymentGateway: appData.features.payment_gateway.show && appData.features.payment_gateway.third_party
              ? `${appData.features.payment_gateway.third_party}`.toLowerCase() : '',
          }),
          search: searchParams,
        }, { replace: true });
      }
    }
  }, [
    firstName,
    lastName,
    email,
    areaCode,
    phoneNumber,
    params,
    allowNext,
    navigate,
    searchParams,
  ]);

  useEffect(() => {
    (async () => {
      dispatch({
        type: 'UPDATE_FIELD',
        payload: { ['country']: appData.country }
      });

      if(urlSearchParams.get('donate')) {
        const amounts = appData.settings.general.amounts.values || [];
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
              value={amount}
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
                  checkedValue={amount}
                  onChangeHandler={onChangeHandler}
                />
              ))}
              <Form.RadioButton
                key='otherAmount'
                text='Otras donaciones'
                name='amount'
                value='otherAmount'
                checkedValue={amount}
                onChangeHandler={onChangeHandler}
                customCss={css``}
              />
            </Form.Group>
          </Form.Column>
            {(amount === 'otherAmount') ? (
              <Form.Column>
                <Form.Group
                  fieldName='newAmount'
                  value={newAmount}
                  labelText='Ingrese el monto'
                  showErrorMessage={showFieldErrors}
                  validateFn={() => validateNewAmount(newAmount, appData.settings.general.amounts.min_other_amount)}
                  onUpdateHandler={onUpdateFieldHandler}
                >
                  <Elements.Input
                    name='newAmount'
                    type='text'
                    disabled={!(amount === 'otherAmount')} 
                    placeholder={`Ej. ${appData.settings.general.amounts.currency}${appData.settings.general.amounts.min_other_amount}`}
                    maxLength={8}
                    onChange={onChangeHandler}
                  />
                </Form.Group>
              </Form.Column>
            ) : null}
            {(params.couponType === 'regular') && (
               <Form.Column>
                  <Elements.P
                    dangerouslySetInnerHTML={{__html: appData.content.form.general.coupon_oneoff_label_text_2}}
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
              value={email}
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
                value={email}
                onChange={onChangeHandler}
              />
            </Form.Group>
            <Form.Group
              fieldName='genre'
              value={genre}
              labelText='Género'
              showErrorMessage={showFieldErrors}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Select
                id="genre"
                name="genre"
                data-checkout="genre"
                value={genre}
                onChange={onChangeHandler}
              >
                <option value=""></option>
                {['Femenino', 'Masculino', 'No binario'].map((value: string, key: number) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </Elements.Select>
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
              fieldName='firstName'
              value={firstName}
              labelText='Nombre'
              showErrorMessage={showFieldErrors}
              validateFn={validateFirstName}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Input
                name='firstName'
                type='text'
                placeholder=''
                value={firstName}
                onChange={onChangeHandler}
              />
            </Form.Group>
            <Form.Group
              fieldName='lastName'
              value={lastName}
              labelText='Apellido'
              showErrorMessage={showFieldErrors}
              validateFn={validateFirstName}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Input
                name='lastName'
                type='text'
                placeholder=''
                value={lastName}
                onChange={onChangeHandler}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column bottomText='Escribe solo números y no agregues guiones.'>
            <Form.Group
              fieldName='areaCode'
              value={areaCode}
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
                value={areaCode}
                maxLength={4}
                onChange={onChangeHandler}
              />
            </Form.Group>
            <Form.Group
              fieldName='phoneNumber'
              value={phoneNumber}
              labelText='Número telefónico'
              showErrorMessage={showFieldErrors}
              validateFn={validatePhoneNumber}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Elements.Input
                name='phoneNumber'
                type='text'
                placeholder={appData.settings.general.form_fields.phone_mobile_number?.placeholder || ''}
                value={phoneNumber}
                onChange={onChangeHandler}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>

        {(appData.settings.general.form_fields && appData.settings.general.form_fields.location.country.show) && (
          <Form.Row>
            <Form.Column>
              <Form.Group
                fieldName='country'
                value={country}
                labelText='País'
                showErrorMessage={showFieldErrors}
                validateFn={validateEmptyField}
                onUpdateHandler={onUpdateFieldHandler}
              >
                <Elements.Select
                  id="country"
                  name="country"
                  data-checkout="country"
                  value={country}
                  onChange={onChangeHandler}
                  disabled={appData.settings.general.form_fields.location.country.disabled}
                >
                  <option value=""></option>
                  {(countries || []).map((value: any, key: number) => (
                    <option key={key} value={value.label}>{value.label}</option>
                  ))}
                </Elements.Select>
              </Form.Group>
            </Form.Column>
          </Form.Row>
        )}

        {(appData.settings.general.form_fields && appData.settings.general.form_fields.location.province.show) && (
          <Form.Row>
            <Form.Column>
              <Form.Group
                fieldName='province'
                value={province}
                labelText={appData.settings.general.form_fields.location.province.label || 'Provincia'}
                showErrorMessage={showFieldErrors}
                validateFn={validateEmptyField}
                onUpdateHandler={onUpdateFieldHandler}
                isRequired={false}
              >
                <Elements.Select
                  id="province"
                  name="province"
                  data-checkout="province"
                  value={province}
                  onChange={onChangeHandler}
                >
                  <option value=""></option>
                  {(provinces || []).map((value: ProvinceType) => (
                    <option key={value.slug} value={value.name}>{value.name}</option>
                  ))}
                </Elements.Select>
              </Form.Group>
            {(appData.settings.general.form_fields && appData.settings.general.form_fields.location.province.show && appData.settings.general.form_fields.location.city.show) && (
              <Form.Group
                fieldName='city'
                value={city}
                labelText={appData.settings.general.form_fields.location.city.label || 'Ciudad'}
                showErrorMessage={showFieldErrors}
                validateFn={validateEmptyField}
                onUpdateHandler={onUpdateFieldHandler}
                isRequired={false}
              >
                <Elements.Select
                  id="city"
                  name="city"
                  data-checkout="city"
                  value={city}
                  onChange={onChangeHandler}
                  disabled={(!province ? true : false)}
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

        {(appData.settings.general.form_fields && appData.settings.general.form_fields.location.address.show) && (
          <Form.Row>
            <Form.Column>
              <Form.Group
                value={address}
                fieldName='address'
                labelText='Dirección completa'
                showErrorMessage={showFieldErrors}
                validateFn={validateEmptyField}
                onUpdateHandler={onUpdateFieldHandler}
                isRequired={false}
              >
                <Elements.Input
                  name='address'
                  type='address'
                  placeholder=''
                  value={address}
                  onChange={onChangeHandler}
                />
              </Form.Group>
              {(appData.settings.general.form_fields && appData.settings.general.form_fields.location.address.show && appData.settings.general.form_fields.location.zipCode.show) && (
                <Form.Group
                  fieldName='zipCode'
                  value={zipCode}
                  labelText='Código postal'
                  showErrorMessage={showFieldErrors}
                  validateFn={validateEmptyField}
                  onUpdateHandler={onUpdateFieldHandler}
                  customCss={css`
                    width: 40%;
                  `}
                >
                  <Elements.Input
                    name='zipCode'
                    type='text'
                    placeholder=''
                    value={zipCode}
                    maxLength={10}
                    onChange={onChangeHandler}
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
      <Form.Nav>
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
    address,
    firstName,
    lastName,
    genre,
    phoneNumber,
    amount,
    newAmount,
    email,
    country,
    province,
    city,
    areaCode,
    submitting,
    countries,
    provinces,
    cities,
    params,
    snackbarRef,
    showFieldErrors,
    appData,
    zipCode,
    onSubmitHandler,
    onChangeHandler,
    onUpdateFieldHandler,
  ]);
});

Component.displayName = 'RegistrationForm';
export default Component;
