import React, { FunctionComponent, memo, useMemo } from 'react';
import { Wrapper, CustomCSSType, Nav, H1, Img, } from '@bit/meema.ui-components.elements';
import { pixelToRem } from 'meema.utils';
import { css } from 'styled-components';
// import { FacebookLogo, TwitterLogo, WhatsappLogo, } from '../../images/icons'
import Icons from '../../images/icons';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from 'react-share';

const SHARE_MODAL_HEIGHT = 800;
const SHARE_MODAL_WIDTH = 600;

const Component: FunctionComponent<{
  children?: React.ReactNode | HTMLAllCollection;
  customCss?: CustomCSSType;
}> = memo(({
  children,
  customCss,
}) => useMemo(() => (
  <Wrapper
    customCss={css`
      display: flex;
      flex-direction: column;
      align-items: center;

      ${(customCss) && customCss};
    `}
  >
    <H1
      customCss={css`
        text-align: center;
        font-size: ${pixelToRem(16)};
        margin-bottom: ${pixelToRem(18)};
      `}
    >
      Conocé más sobre Greenpeace en nuestro sitio web o seguinos en redes sociales:
    </H1>
    <Nav
      customCss={css`
        display: flex;
        justify-content: center;
        margin-bottom: ${pixelToRem(20)};

        button {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          margin-right: ${pixelToRem(14)};
          width: ${pixelToRem(35)};
          height: ${pixelToRem(35)};
          background-color: white;
          border-radius: 50%;
          box-shadow: 0 0 ${pixelToRem(15)} rgba(0, 0, 0, .1);
          transition: all 250ms ease;

          &:last-child {
            margin-right: 0;
          }

          &:hover {
            box-shadow: 0 0 ${pixelToRem(15)} rgba(0, 0, 0, .3) !important;
          }
        }
      `}
    >
      <FacebookShareButton
        quote={`${process.env.REACT_APP_SHARE_FACEBOOK_TITLE}`}
        url={`${process.env.REACT_APP_SHARE_URL}`}
        windowHeight={SHARE_MODAL_HEIGHT}
        windowWidth={SHARE_MODAL_WIDTH}
      >
        <Img src={Icons.FacebookLogo} alt='Facebook' width='auto' height='auto' />
      </FacebookShareButton>

      {/* <EmailShareButton
        onClick={(evt: MouseEvent<HTMLButtonElement>) => {}}
        openShareDialogOnClick={true}
        url={`${process.env.REACT_APP_SHARE_URL}`}
        subject={`${process.env.REACT_APP_SHARE_EMAIL_SUBJECT}`}
        body={`${process.env.REACT_APP_SHARE_EMAIL_BODY}`}
        separator=" "
        windowHeight={SHARE_MODAL_HEIGHT}
        windowWidth={SHARE_MODAL_WIDTH}
      >
        <Img src={EmailLogo} alt='Email' width='auto' height='auto' />
      </EmailShareButton> */}

      <TwitterShareButton
        title={`${process.env.REACT_APP_SHARE_TWITTER_TITLE}`}
        url={`${process.env.REACT_APP_SHARE_URL}`}
        windowHeight={SHARE_MODAL_HEIGHT}
        windowWidth={SHARE_MODAL_WIDTH}
      >
        <Img src={Icons.TwitterLogo} alt='Twitter' width='auto' height='auto' />
      </TwitterShareButton>
      
      <WhatsappShareButton
        title={`${process.env.REACT_APP_SHARE_WHATSAPP_TITLE}`}
        url={`${process.env.REACT_APP_SHARE_URL}`}
        separator=" "
        windowHeight={SHARE_MODAL_HEIGHT}
        windowWidth={SHARE_MODAL_WIDTH}
      >
        <Img src={Icons.WhatsappLogo} alt='Whatsapp' width='auto' height='auto' />
      </WhatsappShareButton>
    </Nav>
    {children}
  </Wrapper>
), [
  children,
  customCss,
]));

Component.displayName = 'SocialShareNav';
export default Component;
