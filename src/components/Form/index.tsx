import React, { FunctionComponent, memo, useContext, useEffect, useMemo, useRef, useState, MouseEvent, useCallback } from 'react';
import { HGroup, View, Wrapper } from '@bit/meema.ui-components.elements';
import { pixelToRem } from 'meema.utils';
import { css } from 'styled-components';
import Carousel, { IRef as ICarouselRef } from '@bit/meema.ui-components.carousel';
import { FormContext, FormProvider, FormComponentsType } from './context';
import Shared from '../Shared';

const ThankYouPage = React.lazy(() => import('../ThankYou'))

const Component: FunctionComponent<{}> = memo(() => {
  const { step, Forms } = useContext(FormContext); 
  const carouselRef = useRef<ICarouselRef>(null);
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const [ showPreview, setShowPreview ] = useState<boolean>(false);

  const onScrollHandler = useCallback(() => {
    if(window.innerHeight + window.scrollY > window.document.body.clientHeight - 200) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
  }, [
  ]);

  useEffect(() => {
    if(carouselRef && carouselRef.current) {
      // carouselRef.current.setIndex(parseInt(step) - 1);
      carouselRef.current.setIndex(step - 1); // Used only for Data Crush Router
    }
  }, [
    step,
  ]);

  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler);

    return () => {
      window.removeEventListener('scroll', onScrollHandler);
    }
  }, [
    onScrollHandler,
  ]);

  return useMemo(() => (
    <View
      className="form-view"
      customCss={css`
        position: fixed;
        display: flex;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: ${pixelToRem(480)}; /* The same as its parent, cause it's fixed */
        width: ${pixelToRem(480)};
        
        flex-direction: row;
        justify-content: space-between;
        height: 100vh;
        /* background-color: ${({theme}) => theme.color.secondary.light}; */
        background-color: white;
        transition: all 250ms ease;
        bottom: 0;

        @media (max-width: ${({theme}) => pixelToRem(theme.responsive.tablet.maxWidth)}) {
          width: 100%;
          bottom: ${pixelToRem((showPreview) ? 0 : -200)};
          
          ${(!isOpen) && css`
            padding: ${pixelToRem(30)} ${pixelToRem(40)};
            height: ${pixelToRem(200)};
            border-radius: ${pixelToRem(15)} ${pixelToRem(15)} 0 0;
          `}
        }
      `}
    >
      <Wrapper
        customCss={css`
          display: flex;
          flex-direction: column;
          width: 100%;

          @media (max-width: ${({theme}) => pixelToRem(theme.responsive.tablet.maxWidth)}) {
            ${(isOpen) ? css`
              border-radius: 0;
            ` : css`
              display: none;
            `}
          }
        `}
      >
        <Shared.General.ButtonClose
          onClick={(evt: MouseEvent<HTMLButtonElement>) => {setIsOpen(false)}}
          customCss={css`
            position: absolute;
            top: ${pixelToRem(15)};
            right: ${pixelToRem(15)};
    
            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              display: none;
            }
          `}
        />
        <Carousel
          ref={carouselRef}
          showControls={false}
          showIndicators={false}
          allowSlide={false}
        >
          <>
            <React.Suspense fallback={<Shared.Loader />}>
              {Object.values(Forms).map(
                (Child: FormComponentsType, key: number) => (
                  <Child.Component key={key} />
                )
              )}
            </React.Suspense>
            {((step - 1) === Object.values(Forms).length) ? (
              <React.Suspense fallback={<Shared.Loader />}>
                <ThankYouPage />
              </React.Suspense>
            ) : null}
          </>
        </Carousel>
      </Wrapper>

      <Wrapper
        customCss={css`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          height: 100%;

          
          @media (max-width: ${({theme}) => pixelToRem(theme.responsive.tablet.maxWidth)}) {
            ${(isOpen) && css`
              display: none;
            `}
          }

          @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
            display: none;
          }
        `}
      >
        <HGroup>
          <Shared.General.Title
            customCss={css`
              font-size: ${pixelToRem(20)};
              text-align: left;
            `}
          >Firmá ahora!</Shared.General.Title>
          <Shared.General.Subtitle
            customCss={css`
              font-size: ${pixelToRem(18)};
            `}
          >Sumate y conocé nuestras causas</Shared.General.Subtitle>
        </HGroup>
        <Shared.General.Button
          onClick={(evt: MouseEvent<HTMLButtonElement>) => {setIsOpen(true)}}
          customCss={css`
            width: 100%;
            box-shadow: 0 ${pixelToRem(4)} ${pixelToRem(14)} rgba(0, 0, 0, .25);
          `}
        >FIRMAR</Shared.General.Button>
      </Wrapper>
    </View>
  ), [
    step,
    Forms,
    isOpen,
    showPreview,
  ])
});

Component.displayName = 'CancellationForm';
export default function CancellationForm() {
  return useMemo(() => (
    <FormProvider>
      <Component />
    </FormProvider>
  ), []);
} 


