import { pixelToRem } from "meema.utils";
import { css } from "styled-components";

export const backgroundImage = (
  image: string,
) => css`
  background-color: ${({theme}) => theme.color.secondary.normal};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: linear-gradient(0deg, rgba(0, 0, 0, .75) 0%, rgba(0, 0, 0, 0) 100%), url(${image});
`;

export const carouselItemStyles = css`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-shrink: 0;
  flex-basis: 100%;
  width: 100%;
  height: 100%;
  padding: ${pixelToRem(50)} ${pixelToRem(40)};
`;

export const extraSmallScreen = (styles: any) => css`
  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.screen.extraSmall.minWidth)}) and (max-width: ${({theme}) => pixelToRem(theme.responsive.screen.extraSmall.maxWidth)}) {
    ${styles && styles};
  }
`;

export const smallScreen = (styles: any) => css`
  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.screen.small.minWidth)}) and (max-width: ${({theme}) => pixelToRem(theme.responsive.screen.small.maxWidth)}) {
    ${styles && styles};
  }
`;

export const smallAndUpScreen = (styles: any) => css`
  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.screen.small.minWidth)}) {
    ${styles && styles};
  }
`;

export const mediumScreen = (styles: any) => css`
  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.screen.medium.minWidth)}) and (max-width: ${({theme}) => pixelToRem(theme.responsive.screen.medium.maxWidth)}) {
    ${styles && styles};
  }
`;

export const mediumAndUpScreen = (styles: any) => css`
  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.screen.medium.minWidth)}) {
    ${styles && styles};
  }
`;

export const mediumAndLessScreen = (styles: any) => css`
  @media (max-width: ${({theme}) => pixelToRem(theme.responsive.screen.medium.maxWidth)}) {
    ${styles && styles};
  }
`;

export const largeScreen = (styles: any) => css`
  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.screen.large.minWidth)}) and (max-width: ${({theme}) => pixelToRem(theme.responsive.screen.large.maxWidth)}) {
    ${styles && styles};
  }
`;

export const largeAndUpScreen = (styles: any) => css`
  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.screen.large.minWidth)}) {
    ${styles && styles};
  }
`;

export const extraLargeAndUpScreen = (styles: any) => css`
  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.screen.extraLarge.minWidth)}) {
    ${styles && styles};
  }
`;

export const extraExtraLargeAndUpScreen = (styles: any) => css`
  @media (min-width: ${({theme}) => pixelToRem(theme.responsive.screen.extraExtraLarge.minWidth)}) {
    ${styles && styles};
  }
`;
