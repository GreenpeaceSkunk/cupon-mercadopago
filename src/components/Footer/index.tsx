import React, { memo, useMemo } from 'react';
import { css } from 'styled-components';
import { Footer } from '@bit/meema.ui-components.elements';
import { pixelToRem } from 'meema.utils';

// const Link = styled(A)`
//   color: white;
//   text-decoration: underline;
//   margin-bottom: ${pixelToRem(5)};
//   font-family: ${({theme}) => theme.font.family.primary.regular};
  
//   @media (min-width: ${props => pixelToRem(props.theme.responsive.tablet.minWidth)}) {
//     margin-bottom: 0;
    
//     &:after {
//       content: '|';
//       margin-right: ${pixelToRem(10)};
//       margin-left: ${pixelToRem(10)};
//     }
    
//     &:last-child {
//       &:after {
//         display: none;
//       }
//     }
//   }
// `;

const MainFooter: React.FunctionComponent<{}> = memo(() => useMemo(() => (
  <Footer
    customCss={css`
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding: ${pixelToRem(30)};
      margin-bottom: ${pixelToRem(30)};
      width: 100%;
      height: ${({theme}) => pixelToRem(theme.footer.mobile.height)};
      background-color: ${({theme}) => theme.footer.mobile.backgroundColor};
      color: white;
      transition: all 250ms ease;

      @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
        padding-left: ${pixelToRem(40)};
        padding-right: ${pixelToRem(40)}; 
        height: ${({theme}) => pixelToRem(theme.footer.tablet.height)};
        background-color: ${({theme}) => theme.footer.tablet.backgroundColor};
      }

      @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
        height: ${({theme}) => pixelToRem(theme.footer.desktop.height)};
        display: flex;
        align-self: flex-end;
        justify-self: flex-end;
        bottom: 0;
        background-color: ${({theme}) => theme.footer.desktop.backgroundColor};
      }
    `}
  >
    {/* <Nav>
      <Wrapper
        customCss={css`
          display: flex;
          flex-direction: column;
        
          @media (min-width: ${props => pixelToRem(props.theme.responsive.tablet.minWidth)}) {
            flex-direction: row;
            justify-content: center;
            margin-bottom: 0;
            width: auto;
          }
      `}>
        <Link
          href={`${process.env.REACT_APP_PRIVACY_POLICY_URL}`}
        >Politicas de privacidad</Link>
      </Wrapper>
    </Nav> */}
  </Footer>
), []));

MainFooter.displayName = 'MainFooter';
export default MainFooter;
