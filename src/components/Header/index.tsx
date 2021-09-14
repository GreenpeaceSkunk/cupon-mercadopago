import React, { FunctionComponent, memo, useMemo } from 'react';
import Elements, { Wrapper, Header, HGroup, CustomCSSType } from '@bit/meema.ui-components.elements';
import { pixelToRem } from 'meema.utils';
import styled, { css } from 'styled-components';
import { Logo } from '../Shared';
import { HomeBackground } from '../../images/backgrounds';

const Heading1 = styled(Elements.H1)`
  color: ${({theme}) => theme.color.tertiary.normal};
  font-size: ${pixelToRem(32)};
  line-height: 110%;

  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
    font-size: ${pixelToRem(36)};
  }

  ${({customCss}) => (customCss) && customCss};
`;

const Heading2 = styled(Elements.H2)`
  color: white;
  font-size: ${pixelToRem(24)};

  ${({customCss}) => (customCss) && customCss};
`;

const MainHeader: FunctionComponent<{
  customCss?: CustomCSSType;
}> = memo(({
  customCss,
}) => useMemo(() => (
  <Header
    customCss={css`
      /* position: absolute; */
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
    <Wrapper>
      <Logo />
    </Wrapper>
    <Wrapper
      customCss={css`
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        /* padding: ${pixelToRem(40)}; */
        width: 100%;
        /* height: ${pixelToRem(300)}; */

      `}
    >
      <HGroup
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
        {/* <Heading1>Repensemos la sustentabilidad.</Heading1> */}
        {/* <Heading2
          customCss={css`
            display: none;
            
            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              display: block;
            }
          `}
        >En Greenpeace creemos, como vos, que un mejor futuro es posible. ¡Unite!</Heading2> */}
      </HGroup>
    </Wrapper>
  </Header>
), [
  customCss,
]));

export default MainHeader;
