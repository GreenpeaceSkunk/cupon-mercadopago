import React, { FormEvent, memo, useCallback, useContext, useMemo, useReducer, useRef, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { FormContext } from '../context';
import { OnChangeEvent } from 'greenpeace';
import {
  validateEmail,
  validateNewAmount,
  validatePhoneNumber,
  validateAreaCode,
  validateEmptyField,
  validateFirstName,
} from '../../../utils/validators';
import { css } from 'styled-components';
import Shared from '../../Shared';
import Elements from '../../Shared/Elements';
import { addOrRemoveSlashToDate } from '../../../utils';
import { initialState, reducer } from './reducer';
import { pushToDataLayer } from '../../../utils/googleTagManager';
import { pixelToRem } from 'meema.utils';
import { data as jsonData } from '../../../data/data.json';
import useQuery from '../../../hooks/useQuery';
import Snackbar, { IRef as ISnackbarRef } from '../../Snackbar';
import { createContact } from '../../../utils/greenlabApi';

const Component: React.FunctionComponent<{}> = memo(() => {
  const {
    data: {
      user: {
        firstName,
        lastName,
        birthDate,
        email,
        areaCode,
        phoneNumber,
      },
      payment: {
        amount,
        newAmount,
      }
    },
    params,
    dispatch,
  } = useContext(FormContext);
  const [{ submitting, allowNext }, dispatchFormErrors ] = useReducer(reducer, initialState);
  const [ showFieldErrors, setShowFieldErrors ] = useState<boolean>(false);
  const history = useHistory();
  const { searchParams } = useQuery();
  const snackbarRef = useRef<ISnackbarRef>(null);
  
  const onChangeHandler = useCallback((evt: OnChangeEvent) => {
    evt.preventDefault();
    const name = evt.currentTarget.name;
    let value = evt.currentTarget.value;

    if(name === 'birthDate') {
      value = addOrRemoveSlashToDate((value.length < birthDate.length && birthDate.charAt(birthDate.length - 1) === '/') ? birthDate : value);
    }

    if(name === 'amount' || name === 'newAmount') {
      dispatch({
        type: 'UPDATE_PAYMENT_DATA',
        payload: { [name]: value }
      });
    } else {
      dispatch({
        type: 'UPDATE_USER_DATA',
        payload: { [name]: value }
      });
    }
  }, [
    birthDate,
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
          ? validateNewAmount(value).isValid
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
    dispatchFormErrors,
  ]);

  const onSubmitHandler = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();

    if(!allowNext) {
      setShowFieldErrors(true);
      if(snackbarRef && snackbarRef.current) {
        snackbarRef.current.showSnackbar();
      }
    } else {
      dispatchFormErrors({
        type: 'SUBMIT',
      });

      if(process.env.REACT_APP_ENVIRONMENT === 'test' ||
        process.env.REACT_APP_ENVIRONMENT === 'production') {
        
        const contact = await createContact({
          email,
          firstname: firstName,
          lastname: lastName,
          phone: `${areaCode}${phoneNumber}`,
        });
        
        if(contact) {
          pushToDataLayer({ 'event' : 'petitionSignup' });

          history.push({
            pathname: generatePath('/:couponType/forms/checkout', {
              couponType: params.couponType,
            }),
            search: searchParams,
          });
        }
        pushToDataLayer({
          'event' : 'petitionSignup',
        });
      } else {
        console.log('Contact will not be synchronized');
        const timer = setTimeout(() => {
          history.push({
            pathname: generatePath(`/:couponType/forms/checkout`, {
              couponType: params.couponType,
            }),
            search: `${searchParams}`,
          });
        }, 1000);
  
        return () => {
          clearTimeout(timer);
        }
      }
    }
  }, [
    firstName,
    lastName,
    birthDate,
    email,
    areaCode,
    phoneNumber,
    history,
    params.couponType,
    allowNext,
    searchParams,
  ]);
  
  return useMemo(() => (
    <Shared.Form.Main id='sign-form' onSubmit={onSubmitHandler}>
      <Shared.Form.Header>
        <Elements.HGroup>
          <Shared.Form.Title>{jsonData.campaign.regular.texts.forms.subscription.title}</Shared.Form.Title>
        </Elements.HGroup>
        <Shared.General.Text>{jsonData.campaign.regular.texts.forms.subscription.text}</Shared.General.Text>
      </Shared.Form.Header>
      <Shared.Form.Content>
        <Shared.Form.Row>
          <Shared.Form.Column>
            <Shared.Form.Group
              value={amount}
              fieldName='amount'
              labelText={`${params.couponType === 'oneoff' ? 'Autorizo el pago por única vez de:' : 'Autorizo el débito automático mensual de:'}`}
              showErrorMessage={showFieldErrors}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
              >
                {[
                  { text: '$699', value: '699' },
                  { text: '$799', value: '799' },
                  { text: '$1500', value: '1500' },
                  { text: 'Otras donaciones', value: 'otherAmount' },
                ].map((option: { text: string; value: string; }) => (
                  <Shared.Form.RadioButton
                    key={option.text}
                    text={option.text}
                    name='amount'
                    value={option.value}
                    checkedValue={amount}
                    onChangeHandler={onChangeHandler}
                  />
                ))}
            </Shared.Form.Group>
            </Shared.Form.Column>
            {(amount === 'otherAmount') ? (
              <Shared.Form.Column>
                <Shared.Form.Group
                  fieldName='newAmount'
                  value={newAmount}
                  labelText='Ingrese el monto'
                  showErrorMessage={showFieldErrors}
                  validateFn={validateNewAmount}
                  onUpdateHandler={onUpdateFieldHandler}
                >
                  <Elements.Input
                    name='newAmount'
                    type='text'
                    disabled={!(amount === 'otherAmount')} 
                    value={newAmount}
                    placeholder='Ej. $350'
                    maxLength={8}
                    onChange={onChangeHandler}
                  />
                </Shared.Form.Group>
              </Shared.Form.Column>
            ) : null}
        </Shared.Form.Row>
        <Shared.Form.Row>
          <Shared.Form.Column>
            <Shared.Form.Group
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
                placeholder='Ej. daniela.lopez@email.com'
                value={email}
                onChange={onChangeHandler}
              />
            </Shared.Form.Group>
          </Shared.Form.Column>
        </Shared.Form.Row>
        <Shared.Form.Row>
          <Shared.Form.Column>
            <Shared.Form.Group
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
                placeholder='Ej. Lucas'
                value={firstName}
                onChange={onChangeHandler}
              />
            </Shared.Form.Group>
            <Shared.Form.Group
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
                placeholder='Ej. Rodriguez'
                value={lastName}
                onChange={onChangeHandler}
              />
            </Shared.Form.Group>
          </Shared.Form.Column>
        </Shared.Form.Row>
        <Shared.Form.Row>
          <Shared.Form.Column
            bottomText='Escribe solo números y no agregues guiones.'
          >
            <Shared.Form.Group
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
                placeholder='Ej. 11'
                value={areaCode}
                maxLength={4}
                onChange={onChangeHandler}
              />
            </Shared.Form.Group>
            <Shared.Form.Group
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
                placeholder='Ej. 41239876'
                value={phoneNumber}
                onChange={onChangeHandler}
              />
            </Shared.Form.Group>
          </Shared.Form.Column>
        </Shared.Form.Row>
      </Shared.Form.Content>
      <Snackbar
        ref={snackbarRef}
        text='Tenés campos incompletos o con errores. Revisalos para continuar.'
      />
      <Shared.Form.Nav>
        <Elements.Button
          type='submit'
          variant='contained'
          disabled={(submitting) ? true : false}
          customCss={css`
            width: 100%;

            ${(submitting) && css`
              padding-top: ${pixelToRem(10)};
              padding-bottom: ${pixelToRem(10)};
            `}
          `}
        >{(submitting) ? <Shared.Loader mode='light' /> : jsonData.campaign.regular.texts.forms.subscription.button_text}</Elements.Button>
      </Shared.Form.Nav>
    </Shared.Form.Main>
  ), [
    firstName,
    lastName,
    phoneNumber,
    amount,
    newAmount,
    email,
    areaCode,
    submitting,
    params,
    snackbarRef,
    showFieldErrors,
    onSubmitHandler,
    onChangeHandler,
    onUpdateFieldHandler,
  ]);
});

Component.displayName = 'SubscriptionForm';
export default Component;
