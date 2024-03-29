import React, { FunctionComponent, memo, useMemo } from 'react';
import Elements from '../Shared/Elements';
import { pixelToRem, CustomCSSType } from 'meema.utils';
import styled, { css } from 'styled-components';
import Icons from '../../images/icons';

const SocialButton = styled(Elements.A)<{ icon: string; showBackground?: boolean; }>`
  display: inline-block;
  width: ${pixelToRem(38)};
  height: ${pixelToRem(38)};
  border-radius: 50%;

  ${({showBackground}) => showBackground && css`
    background: white;
    box-shadow: 0 0 ${pixelToRem(5)} rgba(0, 0, 0, 0.1);
  `}

  ${({icon}) => icon && css`
    background-image: url(${icon});
    background-position: center;
    background-repeat: no-repeat;
  `}
`;

const Component: FunctionComponent<{
  children?: React.ReactNode | HTMLAllCollection;
  customCss?: CustomCSSType;
  theme?: 'light' | 'dark' | 'color';
  text?: string;
  showBackground?: boolean;
  textWeight?: 'normal' | 'bold';
  data?: any;
}> = memo(({
  customCss,
  theme = 'light',
  text = '',
  showBackground = false,
  textWeight = 'normal',
  data = null,
}) => useMemo(() => {
  return (
    <Elements.Wrapper
      customCss={css`
        display: flex;
        flex-direction: column;
        align-items: center;

        ${(customCss) && customCss};
      `}
    >
      {(text) && (
        <Elements.Span
          customCss={css`
            font-size: ${pixelToRem(14)};
            margin-bottom: ${pixelToRem(18)};
            color: ${({theme}) => theme.text.color.secondary.normal};
            text-align: center;
            font-family: ${({theme}) => (textWeight === 'bold') ? theme.font.family.primary.bold : theme.font.family.primary.normal };
          `}
          dangerouslySetInnerHTML={{__html: text}}
        />
      )}
      <Elements.Nav
        customCss={css`
          > * {
            &:not(:last-child) {
              margin-right: ${pixelToRem(16)};
            }
          }
        `}
      >
        {data?.facebook.show && (
          <SocialButton
            href={data.facebook.url}
            icon={theme === 'color' ? Icons.FacebookOrangeLogo : Icons.FacebookLogo}
            showBackground={showBackground}
          />
        )}
        {data?.twitter.show && (
          <SocialButton
            href={data.twitter.url}
            icon={theme === 'color' ? Icons.TwitterOrangeLogo : Icons.TwitterLogo}
            showBackground={showBackground}
          />
        )}
        {data?.instagram.show && (
          <SocialButton
            href={data.instagram.url}
            icon={theme === 'color' ? Icons.InstagramOrangeLogo : Icons.InstagramLogo}
            showBackground={showBackground}
          />
        )}
      </Elements.Nav>
    </Elements.Wrapper>
  )
}, [
  customCss,
  theme,
  text,
  textWeight,
]));

Component.displayName = 'SocialMediaNav';
export default Component;
