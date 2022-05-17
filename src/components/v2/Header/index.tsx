import React, { FunctionComponent, useContext, useMemo } from 'react';
import Elements from '../../Shared/Elements';
import { pixelToRem, CustomCSSType } from 'meema.utils';
import { css } from 'styled-components';
import { AppContext } from '../../App/context';
import GreenpeaceLogo from '../../../images/greenpeace-logo.svg';

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
        padding: ${pixelToRem(0)};
        width: 100%;
        min-height: ${({theme}) => pixelToRem(theme.header.mobile.height)};
        background-color: ${({theme}) => theme.header.mobile.backgroundColor};
        background-position: bottom center;
        background-repeat: no-repeat;
        background-size: contain;
        transition: all 250ms ease;

        ${appData && css`
          background-image: url(${process.env.REACT_APP_GREENLAB_API_IMAGES}/${appData && appData.content && appData.content.header.picture});
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
      <Elements.Wrapper
        customCss={css`
          position: absolute;
          top: ${pixelToRem(24)};
          left: ${pixelToRem(24)};
          
          @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
            top: ${pixelToRem(32)};
            left: ${pixelToRem(32)};
          }
        `}
      >
        <Elements.A href={window.location.href}>
          <Elements.Wrapper
            customCss={css`
              width: ${pixelToRem(140)};
              height: ${pixelToRem(20)};
              background-color: ${({theme}) => theme.color.primary.normal};
              mask-image: url(${GreenpeaceLogo});
              mask-size: 100%;
              mask-repeat: no-repeat;
            `}
          />
        </Elements.A>
      </Elements.Wrapper>
    </Elements.Header>
  ), [
    customCss,
    appData,
  ])
};

export default MainHeader;
