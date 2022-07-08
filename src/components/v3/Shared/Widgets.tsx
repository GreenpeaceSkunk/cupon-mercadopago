import styled, { css } from "styled-components"
import { CustomCSSType } from '@dan.tovbein/meema-styled-elements';
import { customStyles } from './Styles';
// import { Div, Img } from "../Elements";
import Elements from '@bit/meema.ui-components.elements';
import { pixelToRem } from "meema.utils";
import { largeAndUpScreen, mediumAndUpScreen } from "../../../styles/mixins";

export const BorderLine = ({
  styles,
}: {
  styles?: CustomCSSType;
}) => {
  return (
    <Elements.Wrapper
      customCss={css`
        position: relative;
        width: 100%;
        border-top: solid ${pixelToRem(2)} black;

        &:after {
          display: block;
          position: absolute;
          width: 0;
          height: 0;
          border-top: ${pixelToRem(6)} solid transparent;
          border-bottom: ${pixelToRem(6)} solid transparent; 
          border-right: ${pixelToRem(12)} solid black;
          top: -${pixelToRem(7)};
          right: 0;
          content: "";
        }

        ${styles && styles};
      `}
    />
  );
};

export const Spacer= (
  props: {
    small?: number;
    medium?: number;
    large?: number;
  } = {
    small: 1,
    medium: 1,
    large: 1,
  }
) => {
  return (
    <Elements.Wrapper
      customCss={css`
        display: ${props.small === 0 ? 'none' : 'block'};
        width: 100%;
        height: ${pixelToRem(props.small!)};
        
        ${mediumAndUpScreen(css`
          display: ${props.medium === 0 ? 'none' : 'block'};
          height: ${pixelToRem(props.medium!)};
        `)};
        
        ${largeAndUpScreen(css`
          display: ${props.large === 0 ? 'none' : 'block'};
          height: ${pixelToRem(props.large!)};
        `)};
      `}
    />
  );
};
