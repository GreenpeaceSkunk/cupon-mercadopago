import React, { useMemo, lazy, Suspense, memo, useRef, useContext, MouseEvent } from 'react';
import Elements from '../Shared/Elements';
import Shared from '../Shared';
import styled, { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import ErrorBoundary from '../ErrorBoundary';
import { AppContext } from '../App/context';

const Header = lazy(() => import('../Header'));
const Router = lazy(() => import('./router'));
const Footer = lazy(() => import('../Footer'));

const Heading3 = styled(Elements.H3)`
  color: ${({theme}) => theme.color.secondary.dark};

  ${({customCss}) => (customCss) && customCss};
`;

const Component: React.FunctionComponent<{}> = memo(() => {
  const viewRef = useRef<HTMLElement>(null);
  const { setIsOpen } = useContext(AppContext);

  return useMemo(() => (
    <>
      <Elements.View
        ref={viewRef}
        customCss={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 100vh;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          
          @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
            flex-direction: row;
          }
        `}
      >
        <Elements.Wrapper
          customCss={css`
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            min-height: 100vh;
            transition: all 250ms ease;

            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              min-height: 100vh;
              padding-bottom: 0;
              display: flex;
            }
          `}
        >
          <ErrorBoundary fallback='Header Error.'>
            <Suspense fallback={<Shared.Loader />}>
              <Header />
            </Suspense>
          </ErrorBoundary>

          <Elements.Wrapper
            customCss={css`
              display: flex;
              flex-direction: column;
              width: 100%;
              padding: 0;
            `}
          >
            <Elements.Wrapper
              customCss={css`
                padding: ${pixelToRem(30)} ${pixelToRem(40)};

                > * {
                  margin-bottom: ${pixelToRem(28)};

                  &:last-child {
                    margin-bottom: 0;
                  }
                }

                @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                  padding-right: ${pixelToRem(70)};
                }
              `}
            >
              <Elements.HGroup
                customCss={css`
                  > * {
                  margin-bottom: ${pixelToRem(28)};

                  &:last-child {
                    margin-bottom: 0;
                  }
                }
                `}
              >
                <Heading3
                  customCss={css`
                    font-size: ${pixelToRem(20)};
                    font-family: ${({theme}) => theme.font.family.primary.bold};
                    line-height: 1.2;
                    
                    @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                      font-size: ${pixelToRem(24)};
                    }
                  `}
                >Firmá esta petición para que se prohíban y penalicen los desmontes y los incendios forestales. Destruir bosques es un crimen y no podemos perder ni una hectárea más.</Heading3>
              </Elements.HGroup>
              <Elements.P
                customCss={css`
                  color: ${({theme}) => theme.color.secondary.dark};
                  font-size: ${pixelToRem(18)};
                  line-height: 140%;
                  `}
              >En las últimas tres décadas perdimos cerca de <Elements.Strong>8 millones de hectáreas</Elements.Strong> y somos uno de los 10 países que más destruyen sus bosques. Las principales razones son el avance de la frontera agropecuaria (ganadería y soja), los incendios forestales y los desarrollos inmobiliarios.<br/><strong>ESTAMOS EN UNA EMERGENCIA CLIMÁTICA, SANITARIA Y DE BIODEVIRSIDAD.</strong> Más desmonte significa más cambio climático, más inundaciones, más desalojos de comunidades campesinas e indígenas, más desaparición de especies en peligro de extinción y más enfermedades.</Elements.P>
              <Elements.A
                customCss={css`
                  font-family: ${({theme}) => theme.font.family.primary.bold};
                  font-size: ${pixelToRem(18)};
                  color: ${({theme}) => theme.color.primary.normal};

                  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                    font-size: ${pixelToRem(24)};
                  }
                `}
              >¡Sumate ahora, seamos muchos más!</Elements.A>

              <Elements.Button
                variant='contained'
                onClick={(evt: MouseEvent<HTMLButtonElement>) => {setIsOpen(true)}}
                customCss={css`
                  width: 100%;
                  box-shadow: 0 ${pixelToRem(4)} ${pixelToRem(14)} rgba(0, 0, 0, .25);
                  margin: ${pixelToRem(20)} 0;

                  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                    display: none;
                  }
                `}
              >¡Sumate!</Elements.Button>
            </Elements.Wrapper>
          </Elements.Wrapper>
        </Elements.Wrapper>
        <Elements.Wrapper
          customCss={css`
            position: relative;
            flex-shrink: 0;
            flex-grow: 0;
            width: 100%;

            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              width: ${pixelToRem(480)};
            }
          `}
        >
          <Router />
        </Elements.Wrapper>
      </Elements.View>
      <ErrorBoundary fallback='Footer Error.'>
        <Suspense fallback={<Shared.Loader />}>
          <Elements.Wrapper
            customCss={css`
              @media (max-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
                padding-bottom: ${pixelToRem(180)};
              }
            `}
          >  
            <Footer />
          </Elements.Wrapper>
        </Suspense>
      </ErrorBoundary>
    </>
  ), [
    viewRef,
    setIsOpen,
  ]);
});

Component.displayName = 'Home';
export default Component;
