import React, { Suspense, memo, useMemo, lazy, useContext } from 'react';
// import Elements from '../../Shared/Elements';
import { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import Elements from '../Shared/Elements';
import { NavLink } from '../Shared/Form';
import { Loader } from '../../Shared';
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
        <Elements.HGroup>
          <Elements.H1
            customCss={css`
              text-align: center;
              font-size: ${pixelToRem(20)};

              @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
                font-size: ${pixelToRem(36)};
              }
            `}>{appData && appData.content && appData.content.thankyou.title}</Elements.H1>
        </Elements.HGroup>

        <Elements.Img src={ThankYouPicture} alt="Gracias!"></Elements.Img>
        
        <Elements.Wrapper
          customCss={css`

            @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
              width: 50%;
            }
          `}
        >
          {appData && appData.content && appData.content.thankyou.text && (
            <Elements.P
              customCss={css`
                text-align: center;
                background: white;
                padding: ${pixelToRem(16)};
                margin-top: ${pixelToRem(16)};
                margin-bottom: ${pixelToRem(36)};
                border-radius: ${pixelToRem(8)};
              `}
            >{appData.content.thankyou.text}</Elements.P>
          )}

        {appData && appData.content && appData.content.thankyou.social_media_text && (
          <Elements.H3
            customCss={css`
              text-align: center;
              color: ${({theme}) => theme.text.color.primary.normal};
            `}
          >{appData.content.thankyou.social_media_text}</Elements.H3>
        )} 
        </Elements.Wrapper>
        </Elements.Wrapper>
      <Elements.Wrapper
        customCss={css`
          display: flex;
          flex-direction: column;
          justify-self: flex-start;
        `}
      >
        <Suspense fallback={<Loader />}>
          <SocialMediaNav
            customCss={css`
              margin-top: ${pixelToRem(40)};
            `}
            theme='color'
            showBackground={true}
          />
        </Suspense>
      </Elements.Wrapper>
      
      {appData && appData.content && appData.content.thankyou.button_cta && (
        <Elements.Nav
          customCss={css`
            display: flex;
            justify-content: center;
            align-items: flex-end;
            display: flex;
            width: 100%;
            height: 100%;
            margin-top: ${pixelToRem(90)};
          `}
        >
          {appData.content.thankyou.button_cta.is_external ? (
            <Elements.A
              href={
                appData.content.thankyou.button_cta.link && appData.content.thankyou.button_cta.link !== '/'
                ? `${appData.content.thankyou.button_cta.link}`
                : `https://greenpeace.org.ar/argentina`}
                target='_blank'
                customCss={css`
                  color: ${({theme}) => theme.text.color.secondary.normal};
                  text-decoration: underline;
                  font-weight: 700;
                `}
              >
              {appData.content.thankyou.button_cta.text}
            </Elements.A>
          ) : (
            <NavLink
              to={process.env.PUBLIC_URL}
              customCss={css`
                color: ${({theme}) => theme.text.color.secondary.normal};
                text-decoration: underline;
                font-weight: 700;
              `}
            >{appData.content.thankyou.button_cta.text}</NavLink>
          )}
        </Elements.Nav>
      )}
    </Elements.View>
  ), [
    appData,
  ]);
});

Component.displayName = 'ThankYou';
export default Component;
