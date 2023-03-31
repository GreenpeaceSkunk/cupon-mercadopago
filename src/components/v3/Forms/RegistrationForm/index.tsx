import React, { FormEvent, memo, SyntheticEvent, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { FormContext } from '../../../Forms/context';
import { OnChangeEvent } from 'greenpeace';
import {
  validateEmail,
  validatePhoneNumber,
  validateAreaCode,
  validateFirstName,
  validateEmptyField,
  validateCitizenId,
} from '../../../../utils/validators';
import { css } from 'styled-components';
import Shared from '../../../Shared';
import Form from '../../Shared/Form';
import Elements from '../../Shared/Elements';
import { initialState, reducer } from '../../../Forms/RegistrationForm/reducer';
import { pushToDataLayer } from '../../../../utils/googleTagManager';
import { pixelToRem } from 'meema.utils';
import useQuery from '../../../../hooks/useQuery';
import Snackbar, { IRef as ISnackbarRef } from '../../../Snackbar';
import { createContact, getUserByEmail, updateContact } from '../../../../services/greenlab';
import { AppContext } from '../../../App/context';
import { Spacer } from '../../Shared/Widgets';

const Component: React.FunctionComponent<{}> = memo(() => {
  const { appData } = useContext(AppContext);
  const {
    data: {
      user,
    },
    params,
    dispatch,
  } = useContext(FormContext);
  const [{ submitting, allowNext, error }, dispatchFormErrors ] = useReducer(reducer, initialState);
  const [ searching, setSearching ] = useState<boolean>(false);
  const [ showFieldErrors, setShowFieldErrors ] = useState<boolean>(false);
  const navigate = useNavigate();
  const { searchParams } = useQuery();
  const snackbarRef = useRef<ISnackbarRef>(null);
  
  const onChangeHandlerField = useCallback((evt: OnChangeEvent) => {
    evt.preventDefault();
    
    dispatch({
      type: 'UPDATE_FIELD',
      payload: { [ evt.currentTarget.name ]: evt.currentTarget.value }
    });
  }, [ dispatch ]);

  const onUpdateFieldHandler = useCallback((fieldName: string, isValid: boolean, value: any) => {
    dispatchFormErrors({
      type: 'UPDATE_FIELD_ERRORS',
      payload: {
        fieldName,
        isValid,
      }
    });
  }, [ dispatchFormErrors ]);

  const onSearchHandler = useCallback(async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    setSearching(true);
    const response = await getUserByEmail(user.email) as any;
    setSearching(false);
    
    if(!response.error) {
      dispatch({
        type: 'UPDATE_USER_DATA',
        payload: {
          email: response.email,
          firstName: response.firstname,
          lastName: response.lastname,
          areaCode: '',
          phoneNumber: response.phone,
          docNumber: response.dni__c,
          docType: '',
          constituentId: response.constituent_id,
        }
      });
    } else {
      console.log('Not found')
    }
  }, [
    user.email,
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
        // Don't need to check if the contact has been created.
        // await updateContact(user.email, {
        //   firstname: user.firstName,
        //   lastname: user.lastName,
        //   dni__c: user.docNumber,
        // });
        pushToDataLayer({ 'event' : 'petitionSignup' });
  
        if(params) {
          navigate({
            pathname: generatePath('/:couponType/forms/:formType', {
              couponType: `${params.couponType}`,
              formType: 'checkout',
            }),
            search: searchParams,
          }, { replace: true });
        }
      })();
    }
  }, [
    user,
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
  }, [ error ]);

  return useMemo(() => (
    <Form.Main id='sign-form' onSubmit={onSubmitHandler}>
      <Form.Header>
        <Elements.HGroup>
          <Form.Title>{appData && appData.content && appData.content.form.registration.title}</Form.Title>
        </Elements.HGroup>
        <Elements.WrapperHtml
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
          {appData!.content.form!.registration!.content_title && (
            <Form.ContentText>{appData.content.form.registration.content_title}</Form.ContentText>
          )}
          
          {appData!.content.form!.registration!.content_text && (
            <Form.ContentTitle>{appData.content.form.registration.content_text}</Form.ContentTitle>
          )}
        </Elements.Wrapper>
        <Form.Row>
          <Form.Column>
            <Form.Group
              value={user.email}
              fieldName='email'
              labelText='Correo electrónico'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validateEmail}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                name='email'
                type='email'
                placeholder='daniela.lopez@email.com'
                value={user.email}
                onChange={onChangeHandlerField}
              />
            </Form.Group>
          </Form.Column>
          {appData!.features!.enable_search_contact && (
          <Form.Column
            customCss={css`
              flex-direction: column !important;
            `}
          >
            <Elements.P
              customCss={css`
                margin-bottom: ${pixelToRem(10)};
              `}
            >{(appData!.content!.form!.registration!.search_text)}</Elements.P>
            <Form.Nav
              customCss={css`
                align-items: flex-start;
              `}
            >
              <Elements.Button
                format='text'
                onClick={onSearchHandler}
                disabled={searching && true}
              >
                {(searching)
                  ? <Shared.Loader mode='light' />
                  : (appData!.content!.form!.registration!.search_button_text)}
              </Elements.Button>
            </Form.Nav>
            <Spacer small={20} medium={0} large={0} />
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
              isRequired={true}
              validateFn={validateFirstName}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                name='firstName'
                type='text'
                placeholder='Lucas'
                value={user.firstName}
                onChange={onChangeHandlerField}
                disabled={false}
              />
            </Form.Group>
          </Form.Column>
          <Form.Column>
            <Form.Group
              fieldName='lastName'
              value={user.lastName}
              labelText='Apellido'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validateFirstName}
              onUpdateHandler={onUpdateFieldHandler}
              >
              <Form.Input
                name='lastName'
                type='text'
                placeholder='Rodriguez'
                value={user.lastName}
                onChange={onChangeHandlerField}
                disabled={false}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
              fieldName='areaCode'
              value={user.areaCode}
              labelText='Cód. área'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validateAreaCode}
              onUpdateHandler={onUpdateFieldHandler}
              customCss={css`
                width: 40%;
              `}
            >
              <Form.Input
                name='areaCode'
                type='number'
                placeholder='11'
                value={user.areaCode}
                maxLength={4}
                onChange={onChangeHandlerField}
                disabled={false}
              />
            </Form.Group>
            <Form.Group
              fieldName='phoneNumber'
              value={user.phoneNumber}
              labelText='Número telefónico'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validatePhoneNumber}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                name='phoneNumber'
                type='number'
                placeholder='41239876'
                value={user.phoneNumber}
                onChange={onChangeHandlerField}
                disabled={false}
              />
            </Form.Group>
          </Form.Column>
          <Form.Column>
            <Form.Group
              fieldName='docType'
              value={user.docType}
              labelText='Tipo de documento'
              isRequired={true}
              showErrorMessage={showFieldErrors}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Select
                id='docType'
                name='docType'
                data-checkout='docType'
                value={user.docType}
                onChange={onChangeHandlerField}
              >
                <option value=""></option>
                {['DNI', 'Cédula de identidad', 'LC', 'LE', 'Otro'].map((value: string, key: number) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group
              fieldName='docNumber'
              value={user.docNumber}
              labelText='Número'
              isRequired={true}
              showErrorMessage={showFieldErrors}
              validateFn={validateCitizenId}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                type='text'
                id='docNumber'
                name='docNumber'
                placeholder='31402931'
                data-checkout='docNumber'
                maxLength={8}
                value={user.docNumber}
                onChange={onChangeHandlerField}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
        
        <Spacer small={40} medium={20} large={25} />

        <Elements.Wrapper>
          {appData!.content.form!.registration!.content_title_2 && (
            <Form.ContentText>{appData.content.form.registration.content_title_2}</Form.ContentText>
          )}

          {appData!.content.form!.registration!.content_text_2 && (
            <Form.ContentTitle>{appData.content.form.registration.content_text_2}</Form.ContentTitle>
          )}
        </Elements.Wrapper>

        <Form.Row>
          <Form.Column>
            <Form.Group
              value={user!.referredEmail}
              fieldName='referredEmail'
              labelText='Correo electrónico'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validateEmail}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                name='referredEmail'
                type='email'
                placeholder='daniela.lopez@email.com'
                value={user!.referredEmail}
                onChange={onChangeHandlerField}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
              fieldName='referredFirstName'
              value={user!.referredFirstName}
              labelText='Nombre'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validateFirstName}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                name='referredFirstName'
                type='text'
                placeholder='Lucas'
                value={user!.referredFirstName}
                onChange={onChangeHandlerField}
                disabled={false}
              />
            </Form.Group>
          </Form.Column>
          <Form.Column>
            <Form.Group
              fieldName='referredLastName'
              value={user!.referredLastName}
              labelText='Apellido'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validateFirstName}
              onUpdateHandler={onUpdateFieldHandler}
              >
              <Form.Input
                name='referredLastName'
                type='text'
                placeholder='Rodriguez'
                value={user!.referredLastName}
                onChange={onChangeHandlerField}
                disabled={false}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Form.Group
              fieldName='referredAreaCode'
              value={user!.referredAreaCode}
              labelText='Cód. área'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validateAreaCode}
              onUpdateHandler={onUpdateFieldHandler}
              customCss={css`
                width: 40%;
              `}
            >
              <Form.Input
                name='referredAreaCode'
                type='number'
                placeholder='11'
                value={user!.referredAreaCode}
                maxLength={4}
                onChange={onChangeHandlerField}
                disabled={false}
              />
            </Form.Group>
            <Form.Group
              fieldName='referredPhoneNumber'
              value={user!.referredPhoneNumber}
              labelText='Número telefónico'
              showErrorMessage={showFieldErrors}
              isRequired={true}
              validateFn={validatePhoneNumber}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                name='referredPhoneNumber'
                type='number'
                placeholder='41239876'
                value={user!.referredPhoneNumber}
                onChange={onChangeHandlerField}
                disabled={false}
              />
            </Form.Group>
          </Form.Column>
          <Form.Column>
            <Form.Group
              fieldName='referredDocType'
              value={user.referredDocType}
              labelText='Tipo de documento'
              showErrorMessage={showFieldErrors}
              validateFn={validateEmptyField}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Select
                id='referredDocType'
                name='referredDocType'
                data-checkout='referredDocType'
                value={user!.referredDocType}
                onChange={onChangeHandlerField}
              >
                <option value=""></option>
                {['DNI', 'Cédula de identidad', 'LC', 'LE', 'Otro'].map((value: string, key: number) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group
              fieldName='referredDocNumber'
              value={user!.referredDocNumber}
              labelText='Número'
              showErrorMessage={showFieldErrors}
              validateFn={validateCitizenId}
              onUpdateHandler={onUpdateFieldHandler}
            >
              <Form.Input
                type='text'
                id='referredDocNumber'
                name='referredDocNumber'
                placeholder='31402931'
                data-checkout='referredDocNumber'
                maxLength={8}
                value={user!.referredDocNumber}
                onChange={onChangeHandlerField}
              />
            </Form.Group>
          </Form.Column>
        </Form.Row>
      </Form.Content>
      <Snackbar
        ref={snackbarRef}
        text='Tenés campos incompletos o con errores, revisalos para continuar.'
      />
      <Spacer small={20} medium={20} large={0} />
      <Form.Nav
        customCss={css`
          align-items: flex-end;
        `}
      >
        <Elements.Button
          type='submit'
          disabled={submitting && true}
        >
          {(submitting) ? <Shared.Loader mode='light' /> : (appData!.content!.form!.registration!.submit_button_text)}
        </Elements.Button>
      </Form.Nav>
    </Form.Main>
  ), [
    allowNext,
    user,
    submitting,
    searching,
    params,
    snackbarRef,
    showFieldErrors,
    error,
    appData,
    onSearchHandler,
    onSubmitHandler,
    onChangeHandlerField,
    onUpdateFieldHandler,
    dispatch,
    dispatchFormErrors,
  ]);
});

Component.displayName = 'RegistrationForm';
export default Component;
