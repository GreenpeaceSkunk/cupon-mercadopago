import Images from '../../images';
import Elements from '../Shared/Elements';
import ThreeCircles from '@bit/meema.ui-components.loaders.three-circles';
import { pixelToRem, CustomCSSType } from 'meema.utils';
import { css } from 'styled-components';
import Form from './Form';
import General from './General';

export const Logo: React.FunctionComponent<{ color?: 'white' | 'green'; customCss?: CustomCSSType }> = ({
  customCss,
  color,
}) => (
  <Elements.A
    href='https://greenpeace.org.ar'
  >
    <Elements.Img 
      alt='Greenpeace'
      src={(color === 'green') ? Images.Icons.GreenpeaceLogoGreen : Images.Icons.GreenpeaceLogoWhite }
      customCss={css`
        width: ${pixelToRem(140)};
        height: auto;

        ${(customCss) && customCss};
      `}
    />
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
        background-color: ${(mode === 'light') ? 'white' : (({ theme }) => theme.color.primary.normal)};
      `}
    />
  </Elements.Wrapper>
);

const defaults = {
  Loader,
  Logo,
  Form,
  General,
};

export default defaults;
