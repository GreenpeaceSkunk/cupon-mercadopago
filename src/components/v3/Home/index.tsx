import React, { useCallback, useMemo, lazy, Suspense, memo, useRef, useContext } from 'react';
import Elements from '../../Shared/Elements';
import Shared from '../../Shared';
import { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import ErrorBoundary from '../../ErrorBoundary';
import { AppContext } from '../../App/context';
import { Outlet, useLocation } from 'react-router';

const Header = lazy(() => import('../Header'));
const Footer = lazy(() => import('../../Footer'));
const ModalOpenForm = lazy(() => import('../ModalOpenForm'));

const Component: React.FunctionComponent<{}> = memo(() => {
  const viewRef = useRef<HTMLDivElement>(null);
  const { appData, setIsOpen } = useContext(AppContext);
  const location = useLocation();

  const scrollToForm = useCallback(() => {
    if(viewRef && viewRef.current) {
      viewRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, []);

  return useMemo(() => (
    <>
      <Elements.View
        customCss={css`
          background: ${({theme}) => theme.color.secondary.light};
          width: 100%;
          min-height: 100vh;
        `}
      >
        <ErrorBoundary fallback='Header Error.'>
          <Suspense fallback={<Shared.Loader />}>
            <Header />
          </Suspense>
        </ErrorBoundary>
        <Elements.Wrapper
          ref={viewRef}
          customCss={css`
            padding: ${pixelToRem(36)} ${pixelToRem(24)};
            
            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
              padding-left: ${pixelToRem(40)};
              padding-right: ${pixelToRem(40)};
            }
            
            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              padding: ${pixelToRem(73)} 0;
              max-width: ${pixelToRem(860)};
              min-height: ${pixelToRem(300)};
              margin: auto;
            }
          `}
        >
          <Outlet />
        </Elements.Wrapper>
        <ErrorBoundary fallback='Footer Error.'>
          <Suspense fallback={<Shared.Loader />}>
            <Elements.Wrapper>  
              <Footer />
            </Elements.Wrapper>
          </Suspense>
        </ErrorBoundary>
      </Elements.View>
      <ErrorBoundary fallback='Modal open form Error.'>
        <Suspense fallback={<Shared.Loader />}>
        {(!location.pathname.includes('/checkout')) ? (
          <Elements.Wrapper>  
            <ModalOpenForm onClickSubmit={() => scrollToForm()}/>
          </Elements.Wrapper>
        ) : null}
        </Suspense>
      </ErrorBoundary>
    </> 
  ), [
    viewRef,
    appData,
    location,
    setIsOpen,
  ]);
});

Component.displayName = 'Home';
export default Component;
