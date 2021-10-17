import React, { memo, useMemo } from 'react';
import styled, { css } from 'styled-components';
// import { Footer, A, Nav, Span, Elements.Wrapper, } from '@bit/meema.ui-components.elements';
import Elements from '../Shared/Elements';
import { pixelToRem } from 'meema.utils';
import SocialMediaNav from '../SocialMediaNav';
import { Logo } from '../Shared';

const Link = styled(Elements.A)`
  color: white;
  text-decoration: underline;
  font-family: ${({theme}) => theme.font.family.primary.regular};
  font-size: ${pixelToRem(14)};
  
  @media (min-width: ${props => pixelToRem(props.theme.responsive.tablet.minWidth)}) {
    margin-bottom: 0;
  }
`;

const Component: React.FunctionComponent<{}> = memo(() => useMemo(() => (
  <Elements.Footer
    customCss={css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      /* justify-content: flex-start; */
      padding: ${pixelToRem(30)};
      /* width: 100%; */
      width: 100vw;
      min-height: ${({theme}) => pixelToRem(theme.footer.mobile.height)};
      background-color: ${({theme}) => theme.footer.mobile.backgroundColor};
      color: white;
      transition: all 250ms ease;

      @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
        flex-direction: row-reverse;
        align-items: flex-start;
        min-height: ${({theme}) => pixelToRem(theme.footer.tablet.height)};
        background-color: ${({theme}) => theme.footer.tablet.backgroundColor};
      }
      
      @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
        min-height: ${({theme}) => pixelToRem(theme.footer.desktop.height)};
        background-color: ${({theme}) => theme.footer.desktop.backgroundColor};
      }
      `}
  >
    <SocialMediaNav />
    <Elements.Wrapper>
      <Logo customCss={css`
        display: none;
        
        @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
          display: block;
        }

      `}/>
      <Elements.Nav
        customCss={css`
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: ${pixelToRem(48)};

          @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
            justify-content: flex-start;
          }
        `}
      >
        <Link href={`${process.env.REACT_APP_TERMS_AND_CONDITIONS_URL}`}>Términos y condiciones</Link>
        <Elements.Span customCss={css`color: white; margin: 0 ${pixelToRem(10)};`}>|</Elements.Span>
        <Link href={`${process.env.REACT_APP_PRIVACY_POLICY_URL}`}>Política de privacidad</Link>
      </Elements.Nav>
    </Elements.Wrapper>
  </Elements.Footer>
), []));

Component.displayName = 'MainFooter';
export default Component;
