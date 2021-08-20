import React, { Suspense, memo, useMemo, lazy, useEffect, useContext } from 'react';
import { Wrapper, View, Nav, A } from '@bit/meema.ui-components.elements';
import styled, { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import Shared from '../Shared';
import { carouselItemStyles } from '../../styles/mixins';
import { trackEvent as trackDataCrushEvent } from '../../utils/dataCrush';
import { pushToDataLayer } from '../../utils/googleTagManager';
import { FormContext } from '../Form/context';

const SocialMediaNav = lazy(() => import('../SocialMediaNav'));

const Link = styled(A)`
  /* color: white; */
  text-decoration: underline;
  margin-bottom: ${pixelToRem(5)};
  font-family: ${({theme}) => theme.font.family.primary.regular};
  
  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
    margin-bottom: 0;
    
    &:after {
      content: '|';
      margin-right: ${pixelToRem(10)};
      margin-left: ${pixelToRem(10)};
    }
    
    &:last-child {
      &:after {
        display: none;
      }
    }
  }
`;

const Component: React.FunctionComponent<{}> = memo(() => {
  const { data: { payment } } = useContext(FormContext);

  // useEffect(() => {
    // const id = Math.floor((Math.random() * 100) + 1);
    // console.log(payment.amount);
    // pushToDataLayer({
    //   event: 'eecPurchase',
    //   ecommerce: {
    //     currencyCode: 'ARS',
    //     purchase: {
    //       actionField: {
    //         id,
    //         revenue: payment.amount,              
    //       },
    //       products: [{
    //         id,
    //         name: 'Suscripcion',                        
    //         quantity: 1,
    //         price: 'pesos',
    //       }],
    //     },
    //   },
    // });
    // trackDataCrushEvent(`${process.env.REACT_APP_DATA_CRUSH_EVENT_SK_THANK_YOU_PAGE}`);
  // }, []);

  return useMemo(() => (
    <View
      id='thank-you-page'
      customCss={css`
        ${carouselItemStyles};
        padding-top: ${pixelToRem(100)};
              
        @media (min-width: ${({ theme }) => pixelToRem(theme.responsive.tablet.minWidth)}) {
          padding-top: ${pixelToRem(200)};
    
        }
      `}
    >
      <Wrapper
        customCss={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: ${pixelToRem(24)};

          > * {
            margin-bottom: ${pixelToRem(24)} !important;

            &:last-child {
              margin-bottom: 0 !important;
            }
          }
        `}
      >
        <Shared.General.Title
          customCss={css`
            font-size: ${pixelToRem(32)};
          `}
        >¡GRACIAS POR APOYAR NUESTRA CAUSA!</Shared.General.Title>
        {/* <Shared.General.Text
          customCss={css`
            font-size: ${pixelToRem(18)};
            text-align: center;
          `}
        >Si querés colaborar con nuestras causas, elegí tu aporte mensual y sé parte.</Shared.General.Text> */}
        {/* <Shared.General.ButtonLink
          format='text'
          href={`${process.env.REACT_APP_DONA_URL}`}
          target='blank'
        >¡Doná ahora!</Shared.General.ButtonLink> */}
      </Wrapper>
      <Wrapper
        customCss={css`
          display: flex;
          flex-direction: column;
          justify-self: flex-start;
        `}
      >
        <Suspense fallback={<Shared.Loader />}>
        <SocialMediaNav
          customCss={css`
            margin-top: ${pixelToRem(40)};
          `}
        />
        </Suspense>
      </Wrapper>
      
      <Nav
        customCss={css`
          display: flex;
          justify-content: center;
          align-items: flex-end;
          display: flex;
          width: 100%;
          height: 100%;
        `}
      >
        <Wrapper>
          <Link
            href={`${process.env.REACT_APP_PRIVACY_POLICY_URL}`}
          >Politicas de privacidad</Link>
        </Wrapper>
      </Nav>
    </View>
  ), [
    payment,
  ]);
});

Component.displayName = 'ThankYou';
export default Component;
