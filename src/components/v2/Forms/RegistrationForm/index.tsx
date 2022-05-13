import React, { FormEvent, memo, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../Forms/context';
import { OnChangeEvent } from 'greenpeace';
import {
  validateEmail,
  validatePhoneNumber,
  validateAreaCode,
  validateFirstName,
} from '../../../../utils/validators';
import { css } from 'styled-components';
import Shared from '../../../Shared';
import Form from '../../Shared/Form';
import Elements from '../../../Shared/Elements';
import { initialState, reducer } from '../../../Forms/RegistrationForm/reducer';
import { pushToDataLayer } from '../../../../utils/googleTagManager';
import { pixelToRem } from 'meema.utils';
import useQuery from '../../../../hooks/useQuery';
import Snackbar, { IRef as ISnackbarRef } from '../../../Snackbar';
import { createContact } from '../../../../services/greenlab';
import { AppContext } from '../../../App/context';

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
      },
    },
    params,
    dispatch,
  } = useContext(FormContext);
  const [{ submitting, allowNext, error }, dispatchFormErrors ] = useReducer(reducer, initialState);
  const [ showFieldErrors, setShowFieldErrors ] = useState<boolean>(false);
  const navigate = useNavigate();
  const { searchParams } = useQuery();
  const snackbarRef = useRef<ISnackbarRef>(null);
  
  const onChangeHandler = useCallback((evt: OnChangeEvent) => {
    evt.preventDefault();
    
    dispatch({
      type: 'UPDATE_USER_DATA',
      payload: { [ evt.currentTarget.name ]: evt.currentTarget.value }
    });
  }, [
    dispatch,
  ]);

  const onUpdateFieldHandler = useCallback((fieldName: string, isValid: boolean, value: any) => {
    dispatchFormErrors({
      type: 'UPDATE_FIELD_ERRORS',
      payload: {
        fieldName,
        isValid,
      }
    });
  }, [
    dispatchFormErrors,
  ]);

  const onSubmitHandler = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();

    dispatchFormErrors({ type: 'SUBMIT' });

    if(!allowNext) {
      setShowFieldErrors(true);
      
      dispatchFormErrors({
        type: 'SET_ERROR',
        error: 'Tenés campos incompletos o con errores. Revisalos para continuar.',
      });

      if(snackbarRef && snackbarRef.current) {
        snackbarRef.current.showSnackbar();
      }
    } else {
      (async () => {

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
              pathname: generatePath('/:couponType/forms/:formType', {
                couponType: params.couponType,
                formType: 'checkout',
              }),
              search: searchParams,
            }, { replace: true });
          }
        }
      })();
    }
  }, [
    firstName,
    lastName,
    email,
    areaCode,
    phoneNumber,
    params,
    allowNext,
    searchParams,
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
  
  return useMemo(() => (
    <Form.Main id='sign-form' onSubmit={onSubmitHandler}>
      <Form.Header>
        <Elements.HGroup>
          <Form.Title>{appData && appData.content && appData.content.form.registration.title}</Form.Title>
        </Elements.HGroup>
        <Shared.Elements.WrapperHtml
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
      <Form.Content>
        <Elements.Wrapper>
          <Form.ContentText>Completá tus datos y empezá a  contribuir con el planeta</Form.ContentText>
          <Form.ContentTitle>Datos personales</Form.ContentTitle>
        </Elements.Wrapper>
        <Form.Row>
          <Form.Column>
            <Form.Group
              fieldName='firstName'
              value={firstName}
              labelText='Nombre'
              showErrorMessage={showFieldErrors}
              isRequired={true}
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
            </Form.Group>
          </Form.Column>
          <Form.Column>
            <Form.Group
              fieldName='lastName'
              value={lastName}
              labelText='Apellido'
              showErrorMessage={showFieldErrors}
              isRequired={true}
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
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
              value={email}
              fieldName='email'
              labelText='Correo electrónico'
              showErrorMessage={showFieldErrors}
              isRequired={true}
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
            </Form.Group>
          </Form.Column>
          <Form.Column bottomText='Escribe solo números y no agregues guiones.'>
            <Form.Group
              fieldName='areaCode'
              value={areaCode}
              labelText='Cód. área'
              showErrorMessage={showFieldErrors}
              isRequired={true}
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
            </Form.Group>
            <Form.Group
              fieldName='phoneNumber'
              value={phoneNumber}
              labelText='Número telefónico'
              showErrorMessage={showFieldErrors}
              isRequired={true}
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
            </Form.Group>
          </Form.Column>
        </Form.Row>
      </Form.Content>
      <Snackbar
        ref={snackbarRef}
        text='Tenés campos incompletos o con errores, revisalos para continuar.'
      />
      <Form.Nav
        customCss={css`
          align-items: flex-end;
        `}
      >
        <Form.Button
          type='submit'
          disabled={submitting && true}
        >
          {(submitting) ? <Shared.Loader mode='light' /> : (appData && appData.content && appData.content.form.registration.button_text)}
        </Form.Button>
      </Form.Nav>
    </Form.Main>
  ), [
    allowNext,
    firstName,
    lastName,
    phoneNumber,
    email,
    areaCode,
    submitting,
    params,
    snackbarRef,
    showFieldErrors,
    error,
    appData,
    onSubmitHandler,
    onChangeHandler,
    onUpdateFieldHandler,
    dispatch,
    dispatchFormErrors,
  ]);
});

Component.displayName = 'RegistrationForm';
export default Component;
