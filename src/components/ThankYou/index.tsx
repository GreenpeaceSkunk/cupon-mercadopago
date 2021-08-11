import React, { Suspense, memo, useMemo, lazy, } from 'react';
import { Wrapper, View } from '@bit/meema.ui-components.elements';
import { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import Shared from '../Shared';
import { carouselItemStyles } from '../../styles/mixins';

const SocialMediaNav = lazy(() => import('../SocialMediaNav'));

const Component: React.FunctionComponent<{}> = memo(() => {
  return useMemo(() => (
    <View
      customCss={css`
        ${carouselItemStyles};

        padding-top: ${pixelToRem(200)};
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
        >¡Gracias por firmar!</Shared.General.Title>
        <Shared.General.Text
          customCss={css`
            font-size: ${pixelToRem(18)};
            text-align: center;
          `}
        >Si querés colaborar con nuestras causas, elegí tu aporte mensual y sé parte.</Shared.General.Text>
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
    </View>
  ), [
  ]);
});

Component.displayName = 'ThankYou';
export default Component;
