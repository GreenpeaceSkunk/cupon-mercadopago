import React, { FunctionComponent, memo, useMemo } from 'react';
import Elements from '../Shared/Elements';
import { pixelToRem, CustomCSSType } from 'meema.utils';
import styled, { css } from 'styled-components';
import Icons from '../../images/icons';

const SocialButton = styled(Elements.A)<{ icon: string }>`
  display: inline-block;
  width: ${pixelToRem(38)};
  height: ${pixelToRem(38)};
  /* background: black; */
  border-radius: 50%;

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
  textWeight?: 'normal' | 'bold';
}> = memo(({
  customCss,
  theme = 'light',
  text = '',
  textWeight = 'normal',
}) => useMemo(() => (
  <Elements.Wrapper
    customCss={css`
      display: flex;
      flex-direction: column;
      align-items: center;

      ${(customCss) && customCss};
    `}
  >
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
    <Elements.Nav
      customCss={css`
        > * {
          &:not(:last-child) {
            margin-right: ${pixelToRem(16)};
          }
        }
      `}
    >
      <SocialButton
        href={'https://www.facebook.com/GreenpeaceArg/'}
        icon={theme === 'color' ? Icons.FacebookOrangeLogo : Icons.FacebookLogo} />
      <SocialButton
        href={'https://twitter.com/GreenpeaceArg'}
        icon={theme === 'color' ? Icons.TwitterOrangeLogo : Icons.TwitterLogo} />
      <SocialButton
        href={'https://www.instagram.com/greenpeacearg/'}
        icon={theme === 'color' ? Icons.InstagramOrangeLogo : Icons.InstagramLogo} />
    </Elements.Nav>
  </Elements.Wrapper>
), [
  customCss,
  theme,
  text,
  textWeight,
]));

Component.displayName = 'SocialMediaNav';
export default Component;
