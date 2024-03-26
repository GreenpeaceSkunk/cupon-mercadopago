import React, { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { pixelToRem, CustomCSSType } from 'meema.utils';
import { OnChangeEvent, OnClickEvent } from 'greenpeace';
import { ValidationType } from '../../../utils/validators';
import Icons from '../../../images/icons';
import Elements from '../../Shared/Elements';

/**
 * Defines margin right and left. Also resets margins at first and last child.
 * @param marginRight Margin Right
 * @param marginLeft Margin Right
 * @returns 
 */
 const innerMargin = (marginRight: number, marginLeft: number) => css`
 margin-right: ${pixelToRem(marginRight)};
 
 &:last-child {
   margin-right: 0;
 }
`;

const Main = styled(Elements.Form)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-shrink: 0;
  flex-basis: 100%;
  padding: ${pixelToRem(50)} ${pixelToRem(40)} ${pixelToRem(160)};
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;

  @media (min-width: ${({ theme }) => pixelToRem(theme.responsive.tablet.minWidth)}) {
    padding-bottom: 0; 
  }

  ${({customCss}) => (customCss) && customCss};
`;

const Content = styled(Elements.Wrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled(Elements.Header)`
  margin-bottom: ${pixelToRem(14)};
`;

const Nav: React.FunctionComponent<{
  children?: React.ReactNode | HTMLAllCollection;
  customCss?: CustomCSSType;
  formIndex?: number;
}> = ({
  children,
  customCss,
  formIndex = 0,
}) => {
  return useMemo(() => (
    <Elements.Nav
      customCss={css`
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        align-self: flex-end;
        justify-self: flex-end;
        width: 100%;
        height: 100%;
        
        > * {
          margin-bottom: ${pixelToRem(20)};
        }
        
        @media (max-width: ${({theme}) => pixelToRem(theme.responsive.tablet.maxWidth)}) {
          position: fixed;
          padding: ${pixelToRem(20)} 10vw;
          width: 100vw;
          height: auto;
          left: calc(100vw * ${formIndex});
          right: 0;
          bottom: 0;
          box-shadow: 0 0 ${pixelToRem(20)} rgba(0, 0, 0, .2);
        }
        
        ${customCss && customCss};
      `}
    >
      {children}
    </Elements.Nav>
  ), [
    children,
    customCss,
    formIndex,
  ]);
}

const Title = styled(Elements.H2)``;

const TextArea = styled(Elements.TextArea)`
  border: none;
  overflow: auto;
  outline: none;
  resize: none; 
  height: ${pixelToRem(100)};
  padding: ${pixelToRem(10)};
  background-color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, .05);
  font-family: ${({theme}) => theme.font.family.primary.normal};
  border-radius: ${pixelToRem(5)};

  &:disabled {
    opacity: .5;
  }
`;

const RadioButton: React.FunctionComponent<{
  name: string;
  value: string | number;
  text: string;
  checkedValue: string | number;
  customCss?: CustomCSSType;
  dataSchema?: 'payment' | 'user'; // Remove ?
  onChangeHandler: (evt: OnChangeEvent) => void;
  onClickHandler?: (evt: OnClickEvent) => void;
}> = ({
  name,
  value,
  text,
  checkedValue,
  customCss,
  dataSchema,
  onChangeHandler,
  onClickHandler,
}) => {
  return useMemo(() => (
    <Elements.Label
      customCss={css`
        display: inline-flex;
        align-items: center;
        width: fit-content;
        cursor: pointer;
        margin-bottom: ${pixelToRem(0)};
        user-select: none;
        text-align: left;
        font-family: ${({theme}) => theme.font.family.primary.regular};
        font-size: ${pixelToRem(15)};
        
        ${(customCss) && customCss};
      `}
    >
      <Elements.Input
        type='radio'
        name={name}
        value={value}
        checked={checkedValue === value}
        data-text={text}
        onChange={onChangeHandler}
        {...(onClickHandler) ? {onClick: onClickHandler} : null}
        data-schema={dataSchema}
        customCss={css`
          position: absolute;
          width: ${pixelToRem(20)};
          opacity: 0;
          cursor: pointer;
          z-index: 1;
        `}
      />
      <Elements.Wrapper
        customCss={css`
          flex: 0 0 ${pixelToRem(20)};
          width: ${pixelToRem(20)};
          height: ${pixelToRem(20)};
          border-radius: ${pixelToRem(2)};
          background-color: white;
          border: solid ${pixelToRem(1)} ${({theme}) => theme.color.secondary.normal};
          margin-right: ${pixelToRem(10)};

          ${(checkedValue === value) && css`
            border-color: ${({theme}) => theme.color.primary.normal};
            background-color: ${({theme}) => theme.color.primary.normal};
            border-width: ${pixelToRem(4)};

            &:after {
              flex: 0 0 auto;
              width: ${pixelToRem(12)};
              height: ${pixelToRem(12)};
              background-size: ${pixelToRem(12)} ${pixelToRem(12)};
              background-position: center center;
              background-repeat: no-repeat;
              transform-origin: center;
              background-image: url(${Icons.TickIcon});
              position: absolute;
              content: "";
            }
          `}
        `}
      />
      {text}
    </Elements.Label>
  ), [
    name,
    value,
    text,
    checkedValue,
    customCss,
    dataSchema,
    onChangeHandler,
    onClickHandler,
  ]);
};

const Row = styled(Elements.Wrapper)`
  display: grid;

  > * {
    margin-bottom: ${pixelToRem(10)};

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }
`;

const Column: React.FunctionComponent<{
  children: React.ReactNode | HTMLAllCollection;
  bottomText?: string;
  topText?: string;
  customCss?: CustomCSSType;
}> = ({
  children,
  topText,
  bottomText,
  topText,
  customCss,
}) => (
  <Elements.Wrapper
    className='column'
    customCss={css`
      ${(customCss) && customCss};
    `}
  >
    {(topText) && (
      <Elements.Span
        customCss={css`
          font-size: ${pixelToRem(16)};
          font-weight: bold;
          display: block;
          margin: ${pixelToRem(8)} 0;
        `}
      >{topText}</Elements.Span>
    )}
    <Elements.Wrapper
      customCss={css`
        display: flex;
        width: 100%;
        flex-direction: column;

        ${innerMargin(20, 20)};

        @media (min-width: ${({ theme }) => pixelToRem(theme.responsive.desktop.minWidth)}) {
          flex-direction: row;
        }
      `}
    >{children}</Elements.Wrapper>
    {(bottomText) && (
      <Elements.Span
        customCss={css`
          font-size: ${pixelToRem(15)};
        `}
      >{bottomText}</Elements.Span>
    )}
  </Elements.Wrapper>
);

const Group: React.FunctionComponent<{
  children?: React.ReactNode | HTMLAllCollection;
  fieldName: string;
  labelText?: string;
  labelBottomText?: string;
  value?: string|number|boolean;
  showErrorMessage?: boolean;
  customCss?: CustomCSSType;
  maxLength?: number;
  regExp?: string;
  isRequired?: boolean;
  displayAs?: 'grid' | 'flex' | 'block';
  gridColumns?: number;
  validateFn?: (value: any, maxLength?: number) => ValidationType;
  onUpdateHandler?: (fieldName: string, isValid: boolean, value?: string|number|boolean) => void;
}> = ({
  children,
  fieldName,
  labelText,
  labelBottomText,
  showErrorMessage = false,
  isRequired = true,
  value = '',
  customCss,
  maxLength,
  displayAs = 'block',
  gridColumns = 3,
  validateFn,
  onUpdateHandler,
}) => {
  const [ isValid, setIsValid ] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState<string>('');

  useEffect(() => {
    if(isRequired && validateFn) {
      let validator: ValidationType;      
      if(maxLength) {
        validator = validateFn(value, maxLength);
      } else {
        validator = validateFn(value);
      }

      if(validator) {
        setIsValid(validator.isValid);
        setErrorMessage(validator.errorMessage ? validator.errorMessage : '');
        
        if(onUpdateHandler && fieldName) {
          onUpdateHandler(fieldName, validator.isValid, value);
        }
      }
    }
  }, [
    maxLength,
    onUpdateHandler,
    validateFn,
    fieldName,
    value,
    isRequired,
  ]);

  return useMemo(() => (
    <Elements.Wrapper
      customCss={css`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;
        
        &:after {
          width: 100%;
          margin-top: ${pixelToRem(10)};
          font-size: ${pixelToRem(15)};
          font-family: ${({theme}) => theme.font.family.primary.regular};
          color: ${({theme}) => theme.color.error.normal};
          text-align: left;
          content: "${(!isValid && value !== '' && showErrorMessage && errorMessage) ? errorMessage : ""}";
        }
  
        input[type="text"], input[type="email"], textarea {
          width: 100%;
  
          ${(value === '') && css`
            border-color: ${({theme}) => theme.color.secondary.normal};
          `}
          
          ${(!isValid && value !== '') && css`
            border-color: ${({theme}) => theme.color.error.normal};
          `}
        }

        ${innerMargin(20, 20)};
        ${(customCss) && customCss};
      `}
    >
      {(labelText) && (
        <Elements.Label
          htmlFor={fieldName}
          customCss={css`
            text-align: left;
            font-family: ${({theme}) => theme.font.family.primary.regular};
            margin-bottom: ${pixelToRem(14)};
          `}
        >{labelText}</Elements.Label>
      )}
      <Elements.Wrapper
        customCss={css`
          display: ${displayAs};

          ${(displayAs === 'grid') && css`
            grid-template-columns: repeat(1, 1fr);
            gap: ${pixelToRem(5)};

            @media (min-width: ${({ theme }) => pixelToRem(theme.responsive.tablet.minWidth)}) {
              grid-template-columns: repeat(${gridColumns}, 1fr);
            }
          `}
        `}
      >{children}</Elements.Wrapper>
      {(labelBottomText) ? (
        <Elements.Label
          customCss={css`
            font-size: ${pixelToRem(14)};
            margin-top: ${pixelToRem(4)};
            text-align: left;
            font-family: ${({theme}) => theme.font.family.primary.regular};
          `}
        >{labelBottomText}</Elements.Label>
      ) : null}
    </Elements.Wrapper>
  ), [
    errorMessage,
    children,
    fieldName,
    labelText,
    labelBottomText,
    showErrorMessage,
    value,
    customCss,
    isValid,
    isRequired,
    displayAs,
    gridColumns,
  ]);
};

const Label = styled(Elements.Label)`
  position: relative;
  width: 100%;
`;

const MPSecurityFieldWrapper = styled(Elements.Wrapper)`
  background: white;
  width: 100%;
  height: ${pixelToRem(48)};
  border: solid ${pixelToRem(1)} ${({theme}) => theme.color.secondary.normal};
  padding: ${pixelToRem(13)} ${pixelToRem(20)};
  border-radius: ${pixelToRem(10)};
`;

const ErrorMessage = styled(Elements.Wrapper)`
  display: flex;
  align-items: center;
  padding: ${pixelToRem(12)};
  border-radius: ${pixelToRem(5)};
  background-color: ${({theme}) => theme.color.error.normal};
  color: white;
  margin-top: ${pixelToRem(18)};
  font-family: ${({theme}) => theme.font.family.primary.regular};

  &:before {
    flex: 0 0 auto;
    width: ${pixelToRem(20)};
    height: ${pixelToRem(20)};
    background-size: ${pixelToRem(20)} ${pixelToRem(20)};
    background-position: center center;
    background-repeat: no-repeat;
    transform-origin: center;
    background-image: url(${Icons.WarningIcon});
    content: "";

    @media (min-width: ${({ theme }) => pixelToRem(theme.responsive.tablet.minWidth)}) {
      margin-right: ${pixelToRem(12)};
    }
  }
`;

const defaults = {
  Content,
  Row,
  Column,
  Group,
  Header,
  Label,
  Main,
  Nav,
  RadioButton,
  TextArea,
  Title,
  ErrorMessage,
  MPSecurityFieldWrapper,
};

export default defaults;
