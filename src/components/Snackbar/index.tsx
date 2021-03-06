import React, { useImperativeHandle, useMemo, useState } from 'react';
import Elements from '../Shared/Elements';
import { pixelToRem } from 'meema.utils';
import { css } from 'styled-components';
import Icons from '../../images/icons';

export interface IRef {
  showSnackbar: () => void;
  hideSnackbar: () => void;
}
interface IProps {
  text: string | null;
  milliseconds?: number;
}

const Component: React.ForwardRefRenderFunction<IRef, IProps> = ({
  text = null,
  milliseconds = 5000,
}, innerRef: React.ForwardedRef<IRef>) => {
  const [ animate, setAnimate ] = useState<boolean>(false);

  useImperativeHandle(innerRef, () => {
    return {
      showSnackbar: () => {
        setAnimate(true);
        
        const timer = setTimeout(() => {
          setAnimate(false);
        }, milliseconds);
    
        return () => {
          clearTimeout(timer);
        }
      },
      hideSnackbar: () => {
        setAnimate(false);
      }
    }
  });

  return useMemo(() => (
    <Elements.Wrapper
      className='snackbar'
      customCss={css`
        position: absolute;
        display: flex;
        align-items: center;
        padding: ${pixelToRem(12)};
        border-radius: ${pixelToRem(5)};
        background-color: ${({theme}) => theme.color.error.normal};
        opacity: 0;
        z-index: 9999;
        animation-duration: ${milliseconds}ms;
        animation-direction: alternate;
        animation-fill-mode: forwards;
        animation-iteration-count: 1;
        pointer-events: none;
        bottom: 0;
        width: 100%;

        ${(animate) && css`
          animation-name: show-snackbar;
        `};

        @media (min-width: ${({ theme }) => pixelToRem(theme.responsive.tablet.minWidth)}) {
          position: relative;
          margin-bottom: ${pixelToRem(12)};
          z-index: 1;
        }

        &:before {
          display: inline-flex;
          flex: 0 0 auto;
          width: ${pixelToRem(20)};
          height: ${pixelToRem(20)};
          background-size: ${pixelToRem(20)} ${pixelToRem(20)};
          background-position: center center;
          background-repeat: no-repeat;
          transform-origin: center;
          background-image: url(${Icons.WarningIcon});
          margin-right: ${pixelToRem(12)};
          content: "";
        }
        
        @keyframes show-snackbar {
          1% {
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          85% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }
      `}
    >
      <Elements.Span
        customCss={css`
          color: white;
          font-weight: 600;
          font-size: ${pixelToRem(16)};
        `}>{text}</Elements.Span></Elements.Wrapper>
  ), [
    text,
    animate,
    milliseconds,
  ]);
}

Component.displayName = 'Snackbar';
export default React.forwardRef<IRef, IProps>(Component);
