import React, { FormEvent, memo, useCallback, useContext, useEffect, useMemo, useReducer, } from 'react';
import { FormContext, IFormComponent } from '../context';
import { OnChangeEvent } from 'greenpeace';
import { validateBirthDate, validateEmail, validateNewAmount, validatePhoneNumber, validateAreaCode, validateEmptyField, validateFirstName, validateLastName } from '../../../utils/validators';
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

const Component: React.FunctionComponent<IFormComponent> = memo(({
  formIndex,
}) => {
  const { data: {
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
  }, step, dispatch, goNext } = useContext(FormContext);
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
      first_name: firstName,
      last_name: lastName,
      email,
      fecha_de_nacimiento: birthDate,
      phone: phoneNumber,
      area_code: areaCode,
      genero: "",
    }, 
      `${process.env.REACT_APP_DATA_CRUSH_EVENT_SK_DONACION_PASO_1}`
    );
    goNext();
  }, [
    firstName,
    lastName,
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
    <Shared.Form.Main
      id='sign-form'
      onSubmit={onSubmitHandler}
    >
      <Shared.Form.Header>
        <HGroup>
          <Shared.General.Title>DONÁ AHORA</Shared.General.Title>
        </HGroup>
        <Shared.General.Text>Te enviaremos información sobre nuestras acciones y la forma en que puedes ayudarnos a lograrlo.</Shared.General.Text>
      </Shared.Form.Header>
      
      <Shared.Form.Content>
        <Shared.Form.Row>
          <Shared.Form.Column>
            <Shared.Form.Group
              value={amount}
              fieldName='amount'
              labelText='Autorizo el débito automático mensual de:'
              showErrorMessage={true}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
              >
                {[
                  { text: '$500', value: '500' },
                  { text: '$700', value: '700' },
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

            {/* <Shared.Form.Group
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
            </Shared.Form.Group> */}
            </Shared.Form.Column>
            {(amount === 'otherAmount') ? (
              <Shared.Form.Column>
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
              </Shared.Form.Column>
            ) : null}
        </Shared.Form.Row>

        <Shared.Form.Row>
          <Shared.Form.Column>
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
          </Shared.Form.Column>
        </Shared.Form.Row>
        
        {/* <Shared.Form.Row>
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
        </Shared.Form.Row> */}

        <Shared.Form.Row>
          <Shared.Form.Column>
            <Shared.Form.Group
              fieldName='firstName'
              value={firstName}
              labelText='Nombre'
              showErrorMessage={true}
              validateFn={validateFirstName}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Input
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
              showErrorMessage={true}
              validateFn={validateFirstName}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Input
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
              showErrorMessage={true}
              validateFn={validateAreaCode}
              onUpdateHandler={onUpdateFieldHandler}
              customCss={css`
                width: 40%;
              `}
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
          </Shared.Form.Column>
        </Shared.Form.Row>
      </Shared.Form.Content>

      <Shared.Form.Nav
        formIndex={formIndex}
        customCss={css`
          /* ${((step - 1) !== formIndex) && css`
            display: none;
          `} */
          /* position: relative; */
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
        <Shared.General.Link href={`${process.env.REACT_APP_PRIVACY_POLICY_URL}`}>
          Politicas de privacidad
        </Shared.General.Link>
      </Shared.Form.Nav>
    </Shared.Form.Main>
  ), [
    firstName,
    lastName,
    birthDate,
    phoneNumber,
    amount,
    newAmount,
    email,
    areaCode,
    errors,
    submitted,
    submitting,
    step,
    formIndex,
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
