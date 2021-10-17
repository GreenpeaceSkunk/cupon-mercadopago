import React, { FunctionComponent, memo, useMemo } from 'react';
import Elements from '../Shared/Elements';
import { pixelToRem, CustomCSSType } from 'meema.utils';
import { css } from 'styled-components';
import { Logo } from '../Shared';
import { HomeBackground } from '../../images/backgrounds';

const MainHeader: FunctionComponent<{
  customCss?: CustomCSSType;
}> = memo(({
  customCss,
}) => useMemo(() => (
  <Elements.Header
    customCss={css`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: ${pixelToRem(40)};
      width: 100%;
      min-height: ${({theme}) => pixelToRem(theme.header.mobile.height)};
      background-color: ${({theme}) => theme.header.mobile.backgroundColor};
      background-image: linear-gradient(0deg, rgba(0, 0, 0, .75) 0%, rgba(0, 0, 0, 0) 100%), url(${HomeBackground});
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      transition: all 250ms ease;

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
        <Elements.H1
          customCss={css`
            color: white;
            font-size: ${pixelToRem(24)};
            font-family: ${({theme}) => theme.font.family.primary.bold};
            letter-spacing: ${pixelToRem(6)};
            
            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              font-size: ${pixelToRem(30)};
            }
          `}
        >CAMBIO CLIMÁTICO</Elements.H1>
      </Elements.HGroup>
    </Elements.Wrapper>
  </Elements.Header>
), [
  customCss,
]));

export default MainHeader;
