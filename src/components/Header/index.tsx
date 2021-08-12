import React, { FunctionComponent, memo, useMemo } from 'react';
import { Wrapper, Header, CustomCSSType } from '@bit/meema.ui-components.elements';
import { pixelToRem } from 'meema.utils';
import { css } from 'styled-components';
import { Logo } from '../Shared';

const MainHeader: FunctionComponent<{
  customCss?: CustomCSSType;
}> = memo(({
  customCss,
}) => useMemo(() => (
  <Header
    customCss={css`
      position: absolute;
      display: flex;
      align-items: center;
      /* padding-left: ${pixelToRem(16)};
      padding-right: ${pixelToRem(16)}; */
      width: 100%;
      min-height: ${({theme}) => pixelToRem(theme.header.mobile.height)};
      background-color: ${({theme}) => theme.header.mobile.backgroundColor};
      transition: all 250ms ease;

      @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
        /* padding-left: ${pixelToRem(40)}; */
        /* padding-right: ${pixelToRem(40)}; */
        padding: ${pixelToRem(40)} ${pixelToRem(40)} ${pixelToRem(40)} ${pixelToRem(40)};
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
  </Header>
), [
  customCss,
]));

export default MainHeader;
