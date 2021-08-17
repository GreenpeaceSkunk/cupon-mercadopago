import React, { useMemo, lazy, Suspense, memo, useRef, } from 'react';
import Elements, { P, View, Wrapper, HGroup } from '@bit/meema.ui-components.elements';
import Shared from '../Shared';
import styled, { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import ErrorBoundary from '../ErrorBoundary';
import Footer from '../Footer';
// import { useRouteMatch } from 'react-router';
import { HomeBackground } from '../../images/backgrounds';

const Header = lazy(() => import('../Header'));
const Router = lazy(() => import('./router'));

const FormComponent = lazy(() => import('../Form'));

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

const Heading3 = styled(Elements.H3)`
  color: white;

  ${({customCss}) => (customCss) && customCss};
`;

const Component: React.FunctionComponent<{}> = memo(() => {
  const viewRef = useRef<HTMLElement>(null);
  // const { path } = useRouteMatch();

  return useMemo(() => (
    <View
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
      <Wrapper
        customCss={css`
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 100vh;
          transition: all 250ms ease;
          background-color: ${({theme}) => theme.color.secondary.dark};
          padding-bottom: ${pixelToRem(200)};

          @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
            min-height: 100vh;
            padding-bottom: 0;
            display: flex;
            justify-content: space-between;
          }
        `}
      >
        <ErrorBoundary fallback='Header Error.'>
          <Suspense fallback={<Shared.Loader />}>
            <Header />
          </Suspense>
        </ErrorBoundary>

        <Wrapper
          customCss={css`
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 0;

            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              /* padding: ${pixelToRem(80)} ${pixelToRem(20)} ${pixelToRem(20)} ${pixelToRem(20)}; */
            }
          `}
        >
          <Wrapper
            customCss={css`
              display: flex;
              align-items: flex-end;
              justify-content: space-between;
              padding: ${pixelToRem(40)};
              width: 100%;
              height: ${pixelToRem(300)};
              background-image: linear-gradient(0deg, rgba(0, 0, 0, .75) 0%, rgba(0, 0, 0, 0) 100%), url(${HomeBackground});
              background-position: center;
              background-size: cover;
              background-repeat: no-repeat;
            `}
          >
            <HGroup
              customCss={css`
                @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                  padding-right: ${pixelToRem(10)};
                }
              `}
            >
              <Heading1>Repensemos la sustentabilidad.</Heading1>
              <Heading2
                customCss={css`
                  display: none;
                  
                  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                    display: block;
                  }
                `}
              >En Greenpeace creemos, como vos, que un mejor futuro es posible. ¡Unite!</Heading2>
            </HGroup>
            {/* <Shared.General.ButtonLink
              href={`${process.env.REACT_APP_UNITE_URL}`}
              target='blank'
              customCss={css`
                display: none;
                
                @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                  display: inherit;
                }
              `}
            >¡UNITE AHORA!</Shared.General.ButtonLink> */}
          </Wrapper>

          <Wrapper
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
            <HGroup
              customCss={css`
                > * {
                margin-bottom: ${pixelToRem(28)};

                &:last-child {
                  margin-bottom: 0;
                }
              }
              `}
            >
              <Heading2
                customCss={css`
                  color: ${({theme}) => theme.color.tertiary.normal};
                  font-size: ${pixelToRem(20)};
                  
                  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                    display: none;
                  }
                `}
              >En Greenpeace creemos, como vos, que un mejor futuro es posible. ¡Unite!</Heading2>
              <Heading3
                customCss={css`
                  display: none;
                
                  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                    display: block;
                  }
                `}
              >Firmá esta petición para que se prohíban y penalicen los desmontes y los incendios forestales. Destruir bosques es un crimen y no podemos perder ni una hectárea más.</Heading3>
            </HGroup>
            {/* <Shared.General.ButtonLink
              format='text'
              href={`${process.env.REACT_APP_UNITE_URL}`}
              target='blank'
              customCss={css`
                margin-bottom: ${pixelToRem(20)} !important;
              `}
            >¡UNITE AHORA!</Shared.General.ButtonLink> */}
            <P
              customCss={css`
                color: white;
                font-size: ${pixelToRem(18)};
                line-height: 140%;
              `}
            >
              En las últimas tres décadas perdimos cerca de <strong>8 millones de hectáreas</strong> y somos uno de los 10 países que más destruyen sus bosques. Las principales razones son el avance de la frontera agropecuaria (ganadería y soja), los incendios forestales y los desarrollos inmobiliarios. <strong>ESTAMOS EN UNA EMERGENCIA CLIMÁTICA, SANITARIA Y DE BIODEVIRSIDAD.</strong> Más desmonte significa más cambio climático, más inundaciones, más desalojos de comunidades campesinas e indígenas, más desaparición de especies en peligro de extinción y más enfermedades.
            </P>

            <Shared.General.Text
              customCss={css`
                background-color: ${({theme}) => theme.color.tertiary.normal};
                padding: ${pixelToRem(20)};
                border-radius: ${(({theme}) => pixelToRem(theme.borderRadius))};

                @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                  width: 90%;
                }
              `}
            >
              Las multas no son suficientes para desalentar incendios intencionales y desmontes ilegales y, a su vez, los responsables rara vez son obligados a reforestar. En muchos casos resulta evidente la complicidad de los funcionarios.
            </Shared.General.Text>
          </Wrapper>
        </Wrapper>
      
        <Footer />
      </Wrapper>
      
      <Wrapper
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
        {/* TODO: Enable Router */}
        <ErrorBoundary fallback="Home Router Error">
          {(!!process.env.REACT_APP_SETTINGS_USE_DATA_CRUSH_ROUTE) ? (
            <FormComponent />
          ) : (
            <Router />
          )}
        </ErrorBoundary>
      </Wrapper>
    </View>
  ), [
    // path,
    viewRef,
  ]);
});

Component.displayName = 'Home';
export default Component;
