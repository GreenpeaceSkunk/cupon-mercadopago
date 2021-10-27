import React, { Suspense, memo, useMemo, lazy } from 'react';
import Elements from '../Shared/Elements';
import { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import Shared from '../Shared';
import { carouselItemStyles } from '../../styles/mixins';
import { data as jsonData } from '../../data/data.json';

const SocialMediaNav = lazy(() => import('../SocialMediaNav'));

const Component: React.FunctionComponent<{}> = memo(() => {
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
        >{jsonData.campaign.regular.texts.thank_you.title}</Elements.H1>
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
            text={jsonData.campaign.regular.texts.thank_you.social_media_text}
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
      />
    </Elements.View>
  ), []);
});

Component.displayName = 'ThankYou';
export default Component;
