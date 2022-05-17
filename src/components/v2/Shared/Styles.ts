import { IElement } from "@bit/meema.ui-components.elements";
import { pixelToRem } from "meema.utils";
import { css } from "styled-components";

export const customStyles = css<IElement>`
  ${({ customCss }) => customCss && customCss};
`;

export const inputStyles = css<IElement>`
  font-family: sans-serif;
  box-sizing: border-box;
  line-height: 100%;
  width: 100%;
  min-height: ${pixelToRem(48)};
  margin: 0;
  border: ${pixelToRem(1)} solid black;
  font-size: ${pixelToRem(16)};
  padding: ${pixelToRem(13)} ${pixelToRem(20)};
  border-radius: ${pixelToRem(10)};
  outline: none;
  appearance: none;

  &:focus {
    border-color: ${({ theme }) => theme.color.primary.normal};
  }

  ${({theme}) => (theme) && css`
    ${(theme.font) && css`
      ${(theme.font.family) && css`
        font-family: ${theme.font.family.primary};
      `};
    `};
    
    ${(theme.color) && css`
      border-color: ${theme.color.secondary.normal};
    
      &:focus {
        border-color: ${theme.color.primary.normal};
      }
    `};
  `};

  ${({ customCss }) => customCss && customCss};
`;

const defaults = {
  inputStyles,
}

export default defaults;

// input[type="text"],
// input[type="email"],
// input[type="password"],
// input[type="number"],
// textarea {
//   width: 100%;
//   height: 100%;
//   font-size: ${pixelToRem(16)};
//   line-height: ${pixelToRem(18)};
//   padding: ${pixelToRem(15)} ${pixelToRem(16)} ${pixelToRem(15)};
//   color: ${({theme}) => theme.color.secondary.dark};
//   border-color: ${({theme}) => theme.color.secondary.extraLight};
//   font-family: ${({theme}) => theme.font.family.primary.medium};

//   &::placeholder {
//     color: ${({theme}) => theme.color.secondary.extraLight};
//   }

//   &:focus {
//     border-color: ${({theme}) => theme.color.primary.normal};
//   }
// }
