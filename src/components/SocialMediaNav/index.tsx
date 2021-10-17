import React, { FunctionComponent, memo, useMemo } from 'react';
import Elements from '../Shared/Elements';
import { pixelToRem, CustomCSSType } from 'meema.utils';
import styled, { css } from 'styled-components';
import Icons from '../../images/icons';

const SocialButton = styled(Elements.A)<{ icon: string }>`
  display: inline-block;
  width: ${pixelToRem(30)};
  height: ${pixelToRem(30)};
  ${({icon}) => icon && css`
    background-image: url(${icon});
    background-position: center;
    background-repeat: no-repeat;
  `}
`;

const Component: FunctionComponent<{
  children?: React.ReactNode | HTMLAllCollection;
  customCss?: CustomCSSType;
  theme?: 'light' | 'color'
}> = memo(({
  children,
  customCss,
  theme = 'light',
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
        font-size: ${pixelToRem(18)};
        margin-bottom: ${pixelToRem(18)};
        color: ${(theme === 'color') ? 'black' : 'white'};
        text-align: center;
      `}
    >¡Seamos muchos más los que ayudamos al planeta!</Elements.Span>
    <Elements.Nav
      customCss={css`
        > * {
          &:not(:last-child) {
            margin-right: ${pixelToRem(20)};
          }
        }
      `}
    >
      <SocialButton
        href={`${process.env.REACT_APP_GREENPEACE_FACEBOOK}`}
        icon={theme === 'color' ? Icons.FacebookOrangeLogo : Icons.FacebookLogo} />
      <SocialButton
        href={`${process.env.REACT_APP_GREENPEACE_TWITTER}`}
        icon={theme === 'color' ? Icons.TwitterOrangeLogo : Icons.TwitterLogo} />
      <SocialButton
        href={`${process.env.REACT_APP_GREENPEACE_INSTAGRAM}`}
        icon={theme === 'color' ? Icons.InstagramOrangeLogo : Icons.InstagramLogo} />
    </Elements.Nav>
  </Elements.Wrapper>
), [
  customCss,
  theme,
]));

Component.displayName = 'SocialMediaNav';
export default Component;
