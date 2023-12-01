import Elements from '../Shared/Elements';
import ThreeCircles from '@bit/meema.ui-components.loaders.three-circles';
import { pixelToRem, CustomCSSType } from 'meema.utils';
import { css } from 'styled-components';
import General from './General';
import GreenpeaceLogo from '../../images/greenpeace-logo.svg';

export const Logo: React.FunctionComponent<{ color?: 'white' | 'green'; customCss?: CustomCSSType }> = ({
  customCss,
  color,
}) => (
  <Elements.A
    href='https://greenpeace.org.ar'
    customCss={css`
       ${(customCss) && customCss};
    `}
  >
    <Elements.Wrapper
      customCss={css`
        width: ${pixelToRem(160)};
        height: ${pixelToRem(30)};
        background-color: ${({theme}) => theme.color.primary.normal};
        ${color && css`
          background-color: ${color};
        `}
        mask-image: url(${GreenpeaceLogo});
        mask-size: 100%;
        mask-repeat: no-repeat;
      `}
    >

    </Elements.Wrapper>
  </Elements.A>
);

export const Loader:React.FunctionComponent<{ mode?: 'light' | 'default' }> = ({ mode }) => (
  <Elements.Wrapper
    customCss={css`
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    `}
  >
    <ThreeCircles 
      circleCss={css`
        background-color: #6ACA25;

        ${({theme}) => theme && theme.color && css`
          background-color: ${(mode === 'light') ? 'white' : (({ theme }) => theme.color.primary.normal)};
        `}
      `}
    />
  </Elements.Wrapper>
);

const defaults = {
  Loader,
  Logo,
  General,
};

export default defaults;
