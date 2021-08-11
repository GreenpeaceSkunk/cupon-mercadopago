import Elements from '@bit/meema.ui-components.elements';
import styled, { css } from 'styled-components';
import { pixelToRem } from 'meema.utils';
import { XIcon } from '../../images/icons';

const Title = styled(Elements.H1)`
  margin-bottom: ${pixelToRem(10)};
  font-size: ${pixelToRem(32)};
  font-family: ${({theme}) => theme.font.family.primary.bold};
  text-align: center;
  width: 100%;

  ${({customCss}) => (customCss) && customCss};
`;

const Subtitle = styled(Elements.H2)`
  margin-bottom: ${pixelToRem(10)};
  font-size: ${pixelToRem(24)};
  font-family: ${({theme}) => theme.font.family.primary.light};

  ${({customCss}) => (customCss) && customCss};
`;

const Text = styled(Elements.P)<{ highlighted?: boolean; textAlign?: string; }>`
  font-size: ${pixelToRem(18)};
  margin-bottom: ${pixelToRem(10)};
  
  ${({highlighted}) => (highlighted) && css`
    font-family: ${({theme}) => theme.font.family.primary.bold};
  `};
  
  ${({textAlign}) => (textAlign) && css`
    text-align: ${textAlign};
  `};
`;

const Button = styled(Elements.Button)`
  padding: ${pixelToRem(5)} ${pixelToRem(30)};
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

  ${({format}) => (format === 'text') && css`
    background-color: transparent;
    color: ${({theme}) => theme.color.primary.normal};
    text-decoration: underline;
    padding: 0;

    &:hover {
      background-color: transparent;
      box-shadow: none !important;
    }
  `}

  ${({customCss}) => (customCss) && customCss};
`;

const ButtonLink = styled(Elements.A)<{ format?: 'contained' | 'outlined' | 'text' }>`
  display: inline-flex;
  padding: ${pixelToRem(5)} ${pixelToRem(30)};
  color: white;
  background-color: ${({theme}) => theme.color.primary.normal};
  border-radius: ${(({theme}) => pixelToRem(theme.borderRadius))};
  font-family: ${({theme}) => theme.font.family.primary.bold};
  font-size: ${pixelToRem(18)};
  white-space: nowrap;
  transition: all 250ms ease;

  &:hover {
    background-color: ${({theme}) => theme.color.primary.dark};
  }

  ${({format}) => (format === 'text') && css`
    background-color: transparent;
    color: ${({theme}) => theme.color.primary.normal};
    text-decoration: underline;
    padding: 0;

    &:hover {
      background-color: transparent;
      box-shadow: none !important;
    }
  `}

  ${({customCss}) => (customCss) && customCss};
`;

const ButtonClose = styled(Elements.Button)`
  display: inline-flex;
  align-items: center;
  padding: 0;
  z-index: 1;

  &:before {
    display: flex;
    width: ${pixelToRem(20)};
    height: ${pixelToRem(20)};
    background-image: url(${XIcon});
    background-size: ${pixelToRem(20)} ${pixelToRem(20)};
    background-repeat: no-repeat;
    content: "";
  }

  &:hover {
    background-color: transparent;
    box-shadow: none !important;
  }

  ${({customCss}) => (customCss) && customCss};
`;

const defaults = {
  Text,
  Title,
  Subtitle,
  Button,
  ButtonClose,
  ButtonLink,
};

export default defaults;