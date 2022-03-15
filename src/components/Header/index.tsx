import React, { FunctionComponent, useContext, useMemo } from 'react';
import Elements from '../Shared/Elements';
import { pixelToRem, CustomCSSType } from 'meema.utils';
import { css } from 'styled-components';
import { Logo } from '../Shared';
import { AppContext } from '../App/context';

const MainHeader: FunctionComponent<{
  customCss?: CustomCSSType;
}> = ({
  customCss,
}) => {
  const { appData } = useContext(AppContext);

  return useMemo(() => (
    <Elements.Header
      customCss={css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: ${pixelToRem(40)};
        width: 100%;
        min-height: ${({theme}) => pixelToRem(theme.header.mobile.height)};
        background-color: ${({theme}) => theme.header.mobile.backgroundColor};
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        transition: all 250ms ease;

        ${appData && css`
          background-image: linear-gradient(
            0deg,
            rgba(0, 0, 0, .75) 0%,
            rgba(0, 0, 0, 0) 100%),
            url(${process.env.REACT_APP_GREENLAB_API_IMAGES}${appData && appData.content && appData.content.header.picture});
        `}
  
        @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
          min-height: ${({theme}) => pixelToRem(theme.header.tablet.height)};
          background-color: ${({theme}) => theme.header.tablet.backgroundColor};
        }
        
        @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
          min-height: ${({theme}) => pixelToRem(theme.header.desktop.height)};
          background-color: ${({theme}) => theme.header.desktop.backgroundColor};
        }
  
        ${customCss && customCss};
      `}
    >
      <Elements.Wrapper>
        <Logo />
      </Elements.Wrapper>
      <Elements.Wrapper
        customCss={css`
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 100%;
        `}
      >
        <Elements.HGroup
          customCss={css`
            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              padding-right: ${pixelToRem(10)};
            }
          `}
        >
          {appData && (
            <Elements.H1
              customCss={css`
                color: white;
                font-size: ${pixelToRem(24)};
                font-family: ${({theme}) => theme.font.family.primary.bold};
                letter-spacing: ${pixelToRem(0)};
                
                @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                  font-size: ${pixelToRem(30)};
                }
              `}
            >{appData && appData.content && appData.content.header.title}</Elements.H1>
          )} 
        </Elements.HGroup>
      </Elements.Wrapper>
    </Elements.Header>
  ), [
    customCss,
    appData,
  ])
};

export default MainHeader;
