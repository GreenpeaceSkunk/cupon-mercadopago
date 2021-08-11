import React, { FormEvent, memo, useCallback, useContext, useEffect, useMemo, useState, } from 'react';
import { FormContext } from '../context';
import { FormFieldsType, OnChangeEvent } from 'greenpeace';
import { validateBirthDate, validateEmail } from '../../../utils/validators';
import styled, { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import { HGroup, Wrapper, } from '@bit/meema.ui-components.elements';
import { 
  Group as FormGroup, 
  Label as FormLabel,
  Input,
  // Select as FormSelect,
} from '@bit/meema.gpar-ui-components.form';
import Shared from '../../Shared';
import { addOrRemoveSlashToDate } from '../../../utils';
// import { synchroInit } from '../../../utils/dataCrush';

const FormInput = styled(Input)`
  label {
    background-color: green !important;

  } 
`;

const Component: React.FunctionComponent<{}> = memo(() => {
  const { data: {
    user: {
      birthDate,
      email,
      // genre,
    },
    payment: {
      amount,
      newAmount,
    }
  }, dispatch, goNext } = useContext(FormContext);
  const [ isValid, setIsValid ] = useState<boolean>(false);
  const [ showError, setShowError ] = useState<boolean>(false);
  const [ allowContiunue, setAllowContinue ] = useState<boolean>(false);
  const [ errors, setErrors ] = useState<FormFieldsType>({
    birthDate: false,
    email: false,
    genre: false,
  });
  const [ fetching, setFetching ] = useState<boolean>(false);
  
  const onChange = useCallback((evt: OnChangeEvent) => {
    evt.preventDefault();
    const name = evt.currentTarget.name;
    let value = evt.currentTarget.value;

    if(name === 'birthDate') {
      value = addOrRemoveSlashToDate((value.length < birthDate.length && birthDate.charAt(birthDate.length - 1) === '/') ? birthDate : value);
    }

    if(name === 'monto' || name === 'newAmount') {
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

  const onSubmit = useCallback((evt: FormEvent) => {
    evt.preventDefault();
    if(!isValid) {
      setShowError(true);
    } else {
      setFetching(true);
      // synchroInit({
      //   email,
      //   fecha_de_nacimiento: birthDate,
      // });
    }
  }, [
    isValid,
    email,
    birthDate,
  ]);

  useEffect(() => {
    (() => {
      if(fetching) {
        const timeOut = setTimeout(() => {
          setFetching(false);
          goNext();
        }, 200);
        
        return () => {
          clearTimeout(timeOut);
        }
      }
    })();
  }, [
    fetching,
    goNext,
  ])

  useEffect(() => {
    setIsValid(!Object.values(errors).includes(true));
  }, [
    errors,
  ])

  useEffect(() => {
    setErrors({
      ...errors,
      email: !validateEmail(email),
      birthDate: !validateBirthDate(birthDate),
    });
    setAllowContinue(!(errors['email'] && errors['birthDate']));
  }, [
    email,
    birthDate,
  ]);
console.log(newAmount)
  return useMemo(() => (
    <Shared.Form.Main>
      <Shared.Form.Header>
        <HGroup>
          <Shared.General.Title>Suscribite para que juntos podamos lograr un futuro más sustentable</Shared.General.Title>
        </HGroup>
        <Shared.General.Text>Te enviaremos información sobre nuestras acciones y la forma en que puedes ayudarnos a lograrlo.</Shared.General.Text>
      </Shared.Form.Header>
      
      <Shared.Form.Content>
        <Shared.Form.Row
          customCss={css`
            &:before {
              content: "Elegí con cuánto querés ayudar al planeta:";
              width: 100%;
            }
          `}
        >
          <FormGroup>
            <Shared.Form.Select
              name='monto'
              value={amount}
              onChange={onChange}
            >
              {(['500', '700', '1500']).map((value: string, key: number) => (
                <option key={key} value={value}>${value}</option>
              ))}
              <option value='otherAmount'>Otro importe</option>
            </Shared.Form.Select>
          </FormGroup>
            
          <FormGroup>
            <FormInput
              disabled={!(amount === 'otherAmount')} 
              type='number'
              name='newAmount'
              value={newAmount}
              placeholder='Ingrese el monto'
              onChange={onChange}
            />
          </FormGroup>
        </Shared.Form.Row>

        <Shared.Form.Row>
          <FormGroup /*value={email}*/ hasError={errors['email']} showError={showError} errorMessage='Error en el correo electrónico.'>
            <FormLabel htmlFor='email'>Correo electrónico</FormLabel>
            <FormInput onChange={onChange} id="email" name='email' type='email' value={email || ''} placeholder='damian.lopez@email.com' />
          </FormGroup>
        </Shared.Form.Row>
        
        <Shared.Form.Row>
          <FormGroup /*value={birthDate}*/ hasError={errors['birthDate']} showError={showError} errorMessage='Error en la fecha de nacimiento.'>
            <FormLabel htmlFor='birthDate'>Fecha de nacimiento</FormLabel>
            <FormInput
              name='birthDate'
              type='text'
              placeholder='DD/MM/YYYY'
              onChange={onChange}
              value={birthDate || ''}
            />
          </FormGroup>
        </Shared.Form.Row>

        <Shared.Form.Row>
          <FormGroup>
            <FormLabel htmlFor='areaCode'>Código de área</FormLabel>
            <FormInput
              type='number'
              name='areaCode'
              value={'011'}
              placeholder='Código de área'
              onChange={onChange}
            />
          </FormGroup>
            
          <FormGroup>
            <FormLabel htmlFor='phoneNumber'>Número telefónico</FormLabel>
            <FormInput
              type='number'
              name='phoneNumber'
              value={'11111111'}
              placeholder='Número telefónico'
              onChange={onChange}
            />
          </FormGroup>
        </Shared.Form.Row>
      
        {/* <Shared.Form.Row>
          <FormGroup hasError={errors['genre']} showError={showError} errorMessage='Error en el campo.'>
            <FormLabel htmlFor='genre' />
            <Shared.Form.Select onChange={onChange} name='genre' value={genre || ''}>
              <Shared.Form.OptGroup>
                <Shared.Form.Option value='' disabled={true}>Género</Shared.Form.Option>
                <Shared.Form.Option value='female'>Femenino</Shared.Form.Option>
                <Shared.Form.Option value='male'>Masculino</Shared.Form.Option>
                <Shared.Form.Option value='non-binary'>No binario</Shared.Form.Option>
              </Shared.Form.OptGroup>
            </Shared.Form.Select>
          </FormGroup>
        </Shared.Form.Row> */}
      </Shared.Form.Content>

      <Shared.Form.Nav
        customCss={css`
          display: flex;
          align-items: flex-end;
          padding-top: ${pixelToRem(10)};
          height: 100%;
        `}
      >
        {(!fetching) ? (
          <Shared.General.Button
            onClick={onSubmit}
            type='button'
            disabled={!isValid}
            customCss={css`
              width: 100%;
            `}
          >Continuar</Shared.General.Button>
        ) : (
          <Shared.Loader />
        )}
      </Shared.Form.Nav>
    </Shared.Form.Main>
  ), [
    allowContiunue,
    isValid,
    showError,
    email,
    birthDate,
    amount,
    newAmount,
    errors,
    fetching,
    setShowError,
    onSubmit,
    onChange,
  ]);
});

Component.displayName = 'SubscriptionForm';
export default Component;
