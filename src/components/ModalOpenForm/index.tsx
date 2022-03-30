import React, { FunctionComponent, memo, useContext, useEffect, useMemo, useState, MouseEvent, useCallback } from 'react';
import Elements from '../Shared/Elements';
import { pixelToRem } from 'meema.utils';
import { css } from 'styled-components';
import Shared from '../Shared';
import { AppContext } from '../App/context';

const Component: FunctionComponent<{}> = memo(() => {
  const { appData, isOpen, setIsOpen } = useContext(AppContext);
  const [ showPreview, setShowPreview ] = useState<boolean>(true);

  const onScrollHandler = useCallback(() => {
    if(window.innerHeight + window.scrollY > window.document.body.clientHeight - 50) {
      setShowPreview(true);
    } 
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler);

    return () => {
      window.removeEventListener('scroll', onScrollHandler);
    }
  }, [
    onScrollHandler,
  ]);

  return useMemo(() => (
    <Elements.Wrapper
      customCss={css`
        position: fixed;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        bottom: ${(showPreview) ? (showPreview && isOpen) ? pixelToRem(-300) : pixelToRem(0) : pixelToRem(-300)};
        transition: bottom 500ms ease;
        border-radius: ${pixelToRem(15)} ${pixelToRem(15)} 0 0;
        padding: ${pixelToRem(40)} ${pixelToRem(24)} ${pixelToRem(24)};
        background-color: ${({theme}) => theme.color.secondary.light};
        z-index: 999;
        box-shadow: 0 ${pixelToRem(-10)} ${pixelToRem(36)} rgba(0, 0, 0, 0.25);
        
        @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
          display: none;
        }
      `}
    >
      <Shared.General.ButtonClose
        onClick={(evt: MouseEvent<HTMLButtonElement>) => {
          setShowPreview(false)
        }}
        customCss={css`
          position: absolute;
          top: ${pixelToRem(15)};
          right: ${pixelToRem(15)};
        `}
      />
      {appData && appData.content && <Elements.H3
        customCss={css`
          font-size: ${pixelToRem(20)};
          margin-bottom: 0;
        `}
      >{appData.content.modal_form.title}</Elements.H3>}
      {appData && appData.content && <Elements.P>{appData.content.modal_form.text}</Elements.P>}
      <Elements.Button
        onClick={(evt: MouseEvent<HTMLButtonElement>) => {setIsOpen(true)}}
        customCss={css`
          width: 100%;
          box-shadow: 0 ${pixelToRem(4)} ${pixelToRem(14)} rgba(0, 0, 0, .25);
          padding: ${pixelToRem(7)} 0;
        `}
      >{appData && appData.content && appData.content.modal_form.button_text}</Elements.Button>
    </Elements.Wrapper>
  ), [
    isOpen,
    setIsOpen,
    appData,
    showPreview,
  ]);
});

Component.displayName = 'ModalOpenForm';
export default Component;
