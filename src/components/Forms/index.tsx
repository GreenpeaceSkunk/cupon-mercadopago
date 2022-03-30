import React, { FunctionComponent, memo, useContext, useMemo, MouseEvent, useEffect } from 'react';
import Elements from '../Shared/Elements';
import { pixelToRem } from 'meema.utils';
import { css } from 'styled-components';
import { FormProvider } from './context';
import Shared from '../Shared';
import FormRouter from './router';
import { Outlet } from 'react-router';
import { AppContext } from '../App/context';
import { useNavigate } from "react-router-dom";

const Component: FunctionComponent<{}> = memo(() => {
  const { isOpen, setIsOpen } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    navigate('registration');
  }, []);

  return useMemo(() => (
    <Elements.View
      className="form-view"
      customCss={css`
        position: fixed;
        display: flex;
        flex-grow: 0;
        flex-shrink: 0;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        height: 100%;
        transition: all 150ms ease;
        background-color: ${({theme}) => theme.color.secondary.light};
        z-index: 99;
        transition: bottom 500ms ease;
        
        ${(isOpen) && css`
          bottom: 0;
        `}
        
        @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
          position: relative;
        }
      `}
    >
      <Elements.Wrapper
        customCss={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;

          @media (max-width: ${({theme}) => pixelToRem(theme.responsive.tablet.maxWidth)}) {
            ${(isOpen) ? css`
              border-radius: 0;
            ` : css`
              display: none;
            `}
          }
        `}
      >
        <Shared.General.ButtonClose
          onClick={(evt: MouseEvent<HTMLButtonElement>) => {setIsOpen(false)}}
          customCss={css`
            position: absolute;
            top: ${pixelToRem(15)};
            right: ${pixelToRem(15)};
    
            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              display: none;
            }
          `}
        />
        {/* <FormRouter /> */}
        <Outlet />
      </Elements.Wrapper>
    </Elements.View>
  ), [
    isOpen,
    setIsOpen,
  ]);
});

Component.displayName = 'CancellationForm';
export default function CancellationForm() {
  return useMemo(() => (
    <FormProvider>
      <Component />
    </FormProvider>
  ), []);
};
