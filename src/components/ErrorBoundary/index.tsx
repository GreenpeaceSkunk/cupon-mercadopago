import React from 'react';
import Elements from '../Shared/Elements';
import { pixelToRem } from 'meema.utils';
import { css } from 'styled-components';

interface IProps { fallback?: string }
interface IState { hasError: boolean }

class ErrorBoundary extends React.Component<IProps, IState> {
  
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: {componentStack: string}) {
    console.log('Error', error, errorInfo.componentStack);
  }

  render() {
    return (
      <>
        {
          (this.state.hasError) ? (
            <Elements.Wrapper
              className='error-boundary'
              customCss={css`
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: ${pixelToRem(30)};
                background-color: #ffacac;
                color: #8b2020;
                height: 100%;
              `}
            >
              {
                (this.props.fallback) ? (
                  this.props.fallback
                ) : 'Something went wrong'
              }
            </Elements.Wrapper>
          ) : this.props.children
        }
      </>
    )
  }
}

export default ErrorBoundary;
