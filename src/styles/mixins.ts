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
