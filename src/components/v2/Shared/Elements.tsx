import Elements from '@bit/meema.ui-components.elements';
import styled from 'styled-components';
import { pixelToRem } from 'meema.utils';
import { customStyles } from './Styles';

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
  font-size: ${pixelToRem(20)};
  font-family: ${({theme}) => theme.font.family.primary.bold};
  
  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
    font-size: ${pixelToRem(22)};
  }

  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.desktop.minWidth)}) {
    font-size: ${pixelToRem(24)};
  }

  ${customStyles};
`;
export const Header = styled(Elements.Header)``;

export const HGroup = styled(Elements.HGroup)``;

export const Img = styled(Elements.Img)``;

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

export const Span = styled(Elements.Span)`
  font-family: ${({theme}) => theme.font.family.primary.regular};
  ${customStyles};
`;

export const Strong = styled.strong`
  font-family: ${({theme}) => theme.font.family.primary.bold};
`;

export const TextArea = styled(Elements.TextArea)``;

export const View = styled(Elements.View)``;

export const Wrapper = styled(Elements.Wrapper)``;

export const WrapperHtml = styled(Elements.Wrapper)`
  color: ${({theme}) => theme.text.color.primary.normal};
  font-family: ${({theme}) => theme.font.family.primary.regular};
  
  p {
    margin-top: ${pixelToRem(12)};
    margin-bottom: ${pixelToRem(12)};
    font-size: ${pixelToRem(16)};
    line-height: 1.2;
    
    @media (min-width: ${({theme}) => pixelToRem(theme.responsive.tablet.minWidth)}) {
      font-size: ${pixelToRem(18)};
    }
  }

  strong {
    font-family: ${({theme}) => theme.font.family.primary.bold};
  }

  ${customStyles};
`;

export const Button = styled(Elements.Button)`
  padding: 0 ${pixelToRem(20)};
  min-height: ${pixelToRem(48)};
  color: white;
  background-color: ${({theme}) => theme.color.primary.normal};
  border-radius: ${pixelToRem(5)};
  font-size: ${pixelToRem(18)};
  font-family: ${({theme}) => theme.font.family.primary.bold};
  white-space: nowrap;

  &:hover {
    background-color: ${({theme}) => theme.color.primary.dark};
  }
  
  &:disabled {
    background-color: ${({theme}) => theme.color.secondary.extraLight};
    opacity: 1;
  
    &:hover {
      background-color: ${({theme}) => theme.color.secondary.extraLight};
    }
  }
  
  ${customStyles};
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
  Label,
  Nav,
  Option,
  OptGroup,
  P,
  Span,
  Strong,
  TextArea,
  View,
  Wrapper,
  WrapperHtml,
};

export default _;
