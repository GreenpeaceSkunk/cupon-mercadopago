import React, { useImperativeHandle, useMemo, useState } from 'react';
import Elements from '../Shared/Elements';
import { pixelToRem } from 'meema.utils';
import { css } from 'styled-components';
import Icons from '../../images/icons';

export interface IRef {
  showSnackbar: () => void;
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
      }
    }
  });

  return useMemo(() => (
    <Elements.Wrapper
      className='snackbar'
      customCss={css`
        position: relative;
        display: flex;
        align-items: center;
        padding: ${pixelToRem(12)};
        border-radius: ${pixelToRem(5)};
        background-color: ${({theme}) => theme.color.error.normal};
        color: white;
        opacity: 0;
        animation-duration: ${milliseconds}ms;
        animation-direction: alternate;
        animation-fill-mode: forwards;
        animation-iteration-count: 1;
        pointer-events: none;

        ${(animate) && css`
          animation-name: show-snackbar;
        `};

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
          content: "";

          @media (min-width: ${({ theme }) => pixelToRem(theme.responsive.tablet.minWidth)}) {
            margin-right: ${pixelToRem(12)};
          }

          @keyframes show-snackbar {
            0% {
              display: flex;
            }
            
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
        }
      `}
    ><Elements.Span>{text}</Elements.Span></Elements.Wrapper>
  ), [
    text,
    animate,
    milliseconds,
  ]);
}

Component.displayName = 'Snackbar';
export default React.forwardRef<IRef, IProps>(Component);
