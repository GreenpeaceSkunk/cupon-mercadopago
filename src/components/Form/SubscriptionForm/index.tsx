import React, { FormEvent, memo, useCallback, useContext, useEffect, useMemo, useReducer, } from 'react';
import { FormContext } from '../context';
import { OnChangeEvent } from 'greenpeace';
import { validateBirthDate, validateEmail, validateNewAmount, validatePhoneNumber, validateAreaCode, validateEmptyField } from '../../../utils/validators';
import { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import { HGroup } from '@bit/meema.ui-components.elements';
import { 
  Input,
  Select,
} from '@bit/meema.gpar-ui-components.form';
import Shared from '../../Shared';
import { addOrRemoveSlashToDate } from '../../../utils';
import { initialState, reducer } from './reducer';
import { synchroInit } from '../../../utils/dataCrush';

const Component: React.FunctionComponent<{}> = memo(() => {
  const { data: {
    user: {
      birthDate,
      email,
      areaCode,
      phoneNumber,
    },
    payment: {
      amount,
      newAmount,
    }
  }, dispatch, goNext } = useContext(FormContext);
  const [{ errors, submitting, submitted }, dispatchFormErrors ] = useReducer(reducer, initialState);
  
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
    email,
    areaCode,
    phoneNumber,
    amount,
    newAmount,
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
    dispatch,
  ]);

  const onSubmitHandler = useCallback((evt: FormEvent) => {
    evt.preventDefault();
    synchroInit({
      email,
      fecha_de_nacimiento: birthDate,
      phone: phoneNumber,
      area_code: areaCode,
      genero: "",
    }, 
      `${process.env.REACT_APP_DATA_CRUSH_EVENT_SK_DONACION_PASO_1}`
    );
    // trackDataCrushEvent(`${process.env.REACT_APP_DATA_CRUSH_EVENT_SK_THANK_YOU_PAGE}`);
    goNext();
  }, [
    birthDate,
    email,
    areaCode,
    phoneNumber,
  ]);
  
  useEffect(() => {
    (() => {
      if(submitted) {
        const timeOut = setTimeout(() => {
          goNext();
        }, 200);
        
        return () => {
          clearTimeout(timeOut);
        }
      }
    })();
  }, [
    submitted,
    goNext,
  ]);
  
  return useMemo(() => (
    <Shared.Form.Main onSubmit={onSubmitHandler}>
      <Shared.Form.Header>
        <HGroup>
          <Shared.General.Title>Suscribite para que juntos podamos lograr un futuro más sustentable</Shared.General.Title>
        </HGroup>
        <Shared.General.Text>Te enviaremos información sobre nuestras acciones y la forma en que puedes ayudarnos a lograrlo.</Shared.General.Text>
      </Shared.Form.Header>
      
      <Shared.Form.Content>
        <Shared.Form.Row>
          <Shared.Form.Group
            fieldName='amount'
            value={amount}
            labelText='Elegí con cuánto querés ayudar al planeta:'
            showErrorMessage={true}
            validateFn={validateEmptyField}
            onUpdateHandler={onUpdateFieldHandler}
          >
            <Select
              name='amount'
              value={amount}
              onChange={onChangeHandler}
            >
              {(['500', '700', '1500']).map((value: string, key: number) => (
                <option key={key} value={value}>${value}</option>
              ))}
              <option value='otherAmount'>Otro importe</option>
            </Select>
          </Shared.Form.Group>
          <Shared.Form.Group
            fieldName='newAmount'
            value={newAmount}
            labelText='Ingrese el monto'
            showErrorMessage={true}
            validateFn={validateNewAmount}
            onUpdateHandler={onUpdateFieldHandler}
          >
            <Input
              name='newAmount'
              type='text'
              disabled={!(amount === 'otherAmount')} 
              value={newAmount}
              placeholder='Ej. $350'
              maxLength={8}
              onChange={onChangeHandler}
            />
          </Shared.Form.Group>
        </Shared.Form.Row>

        <Shared.Form.Row>
          <Shared.Form.Group
            value={email}
            fieldName='email'
            labelText='Correo electrónico'
            showErrorMessage={true}
            validateFn={validateEmail}
            onUpdateHandler={onUpdateFieldHandler}
          >
            <Input
              name='email'
              type='email'
              placeholder='Ej. daniela.lopez@email.com'
              value={email}
              onChange={onChangeHandler}
            />
          </Shared.Form.Group>
        </Shared.Form.Row>
        
        <Shared.Form.Row>
          <Shared.Form.Group
            fieldName='birthDate'
            value={birthDate}
            labelText='Fecha de nacimiento'
            showErrorMessage={true}
            validateFn={validateBirthDate}
            onUpdateHandler={onUpdateFieldHandler}
          >
            <Input
              name='birthDate'
              type='text'
              placeholder='DD/MM/YYYY'
              value={birthDate}
              maxLength={10}
              onChange={onChangeHandler}
            />
          </Shared.Form.Group>
        </Shared.Form.Row>

        <Shared.Form.Row>
          <Shared.Form.Group
            fieldName='areaCode'
            value={areaCode}
            labelText='Código de área'
            labelBottomText='Sin el 0'
            showErrorMessage={true}
            validateFn={validateAreaCode}
            onUpdateHandler={onUpdateFieldHandler}
          >
            <Input
              name='areaCode'
              type='text'
              placeholder='Ej. 11'
              value={areaCode}
              maxLength={2}
              onChange={onChangeHandler}
            />
          </Shared.Form.Group>
          
          <Shared.Form.Group
            fieldName='phoneNumber'
            value={phoneNumber}
            labelText='Número telefónico'
            showErrorMessage={true}
            validateFn={validatePhoneNumber}
            onUpdateHandler={onUpdateFieldHandler}
          >
            <Input
              name='phoneNumber'
              type='text'
              placeholder='Ej. 41239876'
              value={phoneNumber}
              maxLength={8}
              onChange={onChangeHandler}
            />
          </Shared.Form.Group>
        </Shared.Form.Row>
      </Shared.Form.Content>

      <Shared.Form.Nav
        customCss={css`
          display: flex;
          align-items: flex-end;
          padding-top: ${pixelToRem(10)};
          height: 100%;
        `}
      >
        {(!submitting) ? (
          <Shared.General.Button
            type='submit'
            disabled={((errors) && Object.keys(errors).length) ? true : false}
            customCss={css`
              width: 100%;
            `}
          >Continuar</Shared.General.Button>
        ) : (
          <Shared.Loader mode='light' />
        )}
      </Shared.Form.Nav>
    </Shared.Form.Main>
  ), [
    birthDate,
    phoneNumber,
    amount,
    newAmount,
    email,
    areaCode,
    errors,
    submitted,
    submitting,
    goNext,
    onSubmitHandler,
    onChangeHandler,
    onUpdateFieldHandler,
    dispatch,
    dispatchFormErrors,
  ]);
});

Component.displayName = 'SubscriptionForm';
export default Component;
