import Elements, { IElement } from '@bit/meema.ui-components.elements';
// import { Button as StyledButton } from '@meema/styled-components.ui.button';
import styled, { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import Icons from '../../images/icons';

const customStyles = css<IElement>`
  ${({ customCss }) => customCss && customCss};
`;

const sharedInputStyles = css<IElement>`
  font-family: sans-serif;
  box-sizing: border-box;
  line-height: 100%;
  width: 100%;
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

export const A = styled(Elements.A)``;
export const Footer = styled(Elements.Footer)``;
export const Form = styled(Elements.Form)``;
export const H1 = styled(Elements.H1)`
  margin-bottom: ${pixelToRem(10)};
  color: ${({theme}) => theme.text.color.primary.normal};
  font-size: ${pixelToRem(36)};
  font-family: ${({theme}) => theme.font.family.primary.bold};
  ${customStyles};
`;
export const H2 = styled(Elements.H2)`
  margin-bottom: ${pixelToRem(10)};
  color: ${({theme}) => theme.text.color.secondary.normal};
  font-size: ${pixelToRem(32)};
  font-family: ${({theme}) => theme.font.family.primary.bold};
  ${customStyles};
`;
export const H3 = styled(Elements.H3)`
  margin-bottom: ${pixelToRem(10)};
  color: ${({theme}) => theme.text.color.primary.normal};
  font-size: ${pixelToRem(28)};
  font-family: ${({theme}) => theme.font.family.primary.bold};
  ${customStyles};
`;
export const Header = styled(Elements.Header)``;
export const HGroup = styled(Elements.HGroup)``;
export const Img = styled(Elements.Img)``;
export const Input = styled(Elements.Input)`
  ${sharedInputStyles};
  ${customStyles};
`;
export const Label = styled(Elements.Label)``;
export const Nav = styled(Elements.Nav)``;
export const Option = styled(Elements.Option)`
  background-color: white;
  ${customStyles};
`;
export const OptGroup = styled(Elements.OptGroup)`
  background-color: white;
  ${customStyles};
`;
export const P = styled(Elements.P)`
  color: ${({theme}) => theme.text.color.primary.normal};
  font-family: ${({theme}) => theme.font.family.primary.regular};
  margin-bottom: ${pixelToRem(14)};
  ${customStyles};
`;
export const Select = styled(Elements.Select)`
  ${sharedInputStyles};
  background: url(${Icons.SelectArrowIcon}) no-repeat right ${pixelToRem(14)} top 50% white;
  cursor: pointer;
  ${customStyles};
`;
export const Span = styled(Elements.Span)`
  font-family: ${({theme}) => theme.font.family.primary.regular};
  ${customStyles};
`;
export const Strong = styled.strong`
  font-family: ${({theme}) => theme.font.family.primary.bold};
`; // Import from @meema.Elements
export const TextArea = styled(Elements.TextArea)``;
export const View = styled(Elements.View)``;
export const Wrapper = styled(Elements.Wrapper)``;
export const WrapperHtml = styled(Elements.Wrapper)`
  color: ${({theme}) => theme.text.color.primary.normal};
  font-family: ${({theme}) => theme.font.family.primary.regular};
  
  p {
    margin-bottom: ${pixelToRem(14)};
  }

  strong {
    font-family: ${({theme}) => theme.font.family.primary.bold};
  }

  ${customStyles};
`;

export const Button = styled(Elements.Button)`
  padding: ${pixelToRem(13)} 0;
  color: white;
  background-color: ${({theme}) => theme.color.primary.normal};
  border-radius: ${(({theme}) => pixelToRem(theme.borderRadius))};
  font-size: ${pixelToRem(18)};
  font-family: ${({theme}) => theme.font.family.primary.bold};
  white-space: nowrap;

  &:hover {
    background-color: ${({theme}) => theme.color.primary.dark};
  }
  
  &:disabled {
    background-color: ${({theme}) => theme.color.secondary.normal};
    opacity: 1;
  
    &:hover {
      background-color: ${({theme}) => theme.color.secondary.normal};
    }
  }
  
  ${({customCss}) => (customCss) && customCss};
`;

const _ = {
  A,
  Button,
  Footer,
  Form,
  H1,
  H2,
  H3,
  Header,
  HGroup,
  Img,
  Input,
  Label,
  Nav,
  Option,
  OptGroup,
  P,
  Select,
  Span,
  Strong,
  TextArea,
  View,
  Wrapper,
  WrapperHtml,
};

export default _;

/* ${({ variant }) => (variant === 'text') && css`
  background-color: transparent;
  color: ${({theme}) => theme.color.primary.normal};
  text-decoration: underline;
  padding: 0;

  &:hover {
    background-color: transparent;
    box-shadow: none !important;
  }
`} */
