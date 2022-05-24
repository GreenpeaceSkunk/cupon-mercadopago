import React, { FunctionComponent, useContext, useMemo } from 'react';
import Elements from '../../Shared/Elements';
import { pixelToRem, CustomCSSType } from 'meema.utils';
import { css } from 'styled-components';
import { AppContext } from '../../App/context';
import GreenpeaceLogo from '../../../images/greenpeace-logo.svg';
import { getApiImagesUrl } from '../../../services/greenlab';

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
        background-position: center bottom;
        background-repeat: no-repeat;
        transition: all 250ms ease;
        background-size: contain;
        
        @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
          background-position: center center;
          min-height: ${({theme}) => pixelToRem(theme.header.tablet.height)};
          background-color: ${({theme}) => theme.header.tablet.backgroundColor};
        }
        
        @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
          min-height: ${({theme}) => pixelToRem(theme.header.desktop.height)};
          background-color: ${({theme}) => theme.header.desktop.backgroundColor};
        }
        
        ${appData && css`
          background-image: url(${getApiImagesUrl()}/${appData && appData.content && appData.content.header.picture});
          background-color: ${appData.content && appData.content.header && appData.content.header.background_color && appData.content.header.background_color} !important;
        `}

        ${customCss && customCss};
      `}
    >

    {appData && appData.content && appData.content.header.logo && appData.content.header.logo.show && (
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
              
              ${appData.content.header.logo.color && css`
                background-color: ${appData.content.header.logo.color} !important;
              `} 
            `}
          />
        </Elements.A>
      </Elements.Wrapper>
    )}
    </Elements.Header>
  ), [
    customCss,
    appData,
  ])
};

export default MainHeader;
