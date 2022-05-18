import { IElement } from "@bit/meema.ui-components.elements";
import { pixelToRem } from "meema.utils";
import { css } from "styled-components";

export const customStyles = css<IElement>`
  ${({ customCss }) => customCss && customCss};
`;

export const inputStyles = css<IElement>`
  font-family: ${({theme}) => theme.font.family.primary.medium};
  box-sizing: border-box;
  line-height: 100%;
  width: 100%;
  min-height: ${pixelToRem(48)};
  margin: 0;
  border: ${pixelToRem(1)} solid black;
  font-size: ${pixelToRem(16)};
  padding: ${pixelToRem(15)} ${pixelToRem(16)};
  border-radius: ${pixelToRem(10)};
  outline: none;
  appearance: none;
  border-color: ${({ theme }) => theme.color.secondary.extraLight};

  &::placeholder {
    color: ${({theme}) => theme.color.secondary.extraLight};
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.primary.normal};
  
    &::placeholder {
      color: transparent;
    } 
  }

  &::-webkit-inner-spin-button {
    appearance: none;
  }

  &[type=number] {
    appearance: textfield;
  }
`;

const defaults = {
  inputStyles,
}

export default defaults;
