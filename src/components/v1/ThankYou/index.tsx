import React, { Suspense, memo, useMemo, lazy, useContext } from 'react';
import Elements from '../../Shared/Elements';
import { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import Shared from '../../Shared';
import { carouselItemStyles } from '../../../styles/mixins';
import { AppContext } from '../../App/context';
import {CouponType} from 'greenpeace';
import { generatePath, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import useQuery from '../../../hooks/useQuery';
import { FormContext } from '../../Forms/context';
import { Button } from '@bit/meema.ui-components.elements';

const SocialMediaNav = lazy(() => import('../../SocialMediaNav'));

const Component: React.FunctionComponent<{}> = memo(() => {
  const { appData } = useContext(AppContext);
  const {
    params,
    dispatch,
  } = useContext(FormContext);
  const { searchParams } = useQuery();
  const navigate = useNavigate();

  return useMemo(() => (
    <Elements.View
      id='thank-you-page'
      customCss={css`
        ${carouselItemStyles};
        padding-top: ${pixelToRem(100)};
              
        @media (min-width: ${({ theme }) => pixelToRem(theme.responsive.tablet.minWidth)}) {
          padding-top: ${pixelToRem(200)};
        }
      `}
    >
      <Elements.Wrapper
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
        <Elements.H1
          customCss={css`
            text-align: center;
          `}
        >{appData && appData.content && appData.content.thank_you.title}</Elements.H1>
        <Elements.P
          customCss={css`
            text-align: center;
          `}
        >{appData && appData.content && appData.content.thank_you.text}</Elements.P>
      </Elements.Wrapper>
      <Elements.Wrapper
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
            theme='color'
            text={appData && appData.content && appData.content.social_media.text}
            data={appData && appData.content && appData.content.social_media.profiles}
          />
        </Suspense>
      </Elements.Wrapper>
      
      <Elements.Nav
        customCss={css`
          display: flex;
          justify-content: center;
          align-items: flex-end;
          display: flex;
          width: 100%;
          height: 100%;
        `}
      >
        <Button
          customCss={css`
            padding: 0;
            font-size: ${pixelToRem(16)};
            &:hover {
              background: none;
              &:not(:disabled) {
                box-shadow: none;
              }
            }
          `}
          onClick={() => {
            dispatch({type: 'RESET'})
            navigate({
              pathname: generatePath(`/:couponType/forms/registration`, {
                couponType: `${params.couponType}`,
              }),
              search: `${searchParams}`,
            }, { replace: true });
          }}
        >
          Volver a donar
        </Button>
      </Elements.Nav>
    </Elements.View>
  ), [
    appData,
    params,
  ]);
});

Component.displayName = 'ThankYou';
export default Component;
