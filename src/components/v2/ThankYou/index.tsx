import React, { Suspense, memo, useMemo, lazy, useContext } from 'react';
import Elements from '../../Shared/Elements';
import { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import Shared from '../../Shared';
import Form from '../Shared/Form';
import { carouselItemStyles } from '../../../styles/mixins';
import { AppContext } from '../../App/context';
import ThankYouPicture from '../../../images/thank-you.png';

const SocialMediaNav = lazy(() => import('../../SocialMediaNav'));

const Component: React.FunctionComponent<{}> = memo(() => {
  const { appData } = useContext(AppContext);

  return useMemo(() => (
    <Elements.View id='thank-you-page'>
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
        <Shared.Elements.HGroup>
          <Form.Title customCss={css`text-align: center;`}>{appData && appData.content && appData.content.thankyou.title}</Form.Title>
        </Shared.Elements.HGroup>

        <Elements.Img src={ThankYouPicture} alt="Gracias!"></Elements.Img>
        
        <Elements.P
          customCss={css`
            text-align: center;
            background: white;
            padding: ${pixelToRem(16)};
            margin-top: ${pixelToRem(16)};
            border-radius: ${pixelToRem(8)};
          `}
        >{appData && appData.content && appData.content.thankyou.text}</Elements.P>
      </Elements.Wrapper>
      <Elements.H3
        customCss={css`
          text-align: center;
          color: ${({theme}) => theme.text.color.primary.normal};
        `}
        >{appData && appData.content && appData.content.thankyou.text}</Elements.H3>
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
            showBackground={true}
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
  ), [
    appData,
  ]);
});

Component.displayName = 'ThankYou';
export default Component;
