import { ITheme } from "greenpeace/theme";
import { pixelToRem } from 'meema.utils';

export const colorPrimaryLight = '#73BE1E';
export const colorPrimaryNormal = '#66cc00';

export const colorSecondaryNormal = '#C4C4C4';
export const colorSecondaryDark = '#2A2929';

export const fontPrimaryThin = 'Font-Primary-Thin';
export const fontPrimaryLight = 'Font-Primary-Light';
export const fontPrimaryBook = 'Font-Primary-Book';
export const fontPrimaryRegular = 'Font-Primary-Regular';
export const fontPrimaryMedium = 'Font-Primary-Medium';
export const fontPrimaryBold = 'Font-Primary-Bold';

export const fontSecondaryLight = 'Font-Secondary-Light';
export const fontSecondaryBook = 'Font-Secondary-Book';
export const fontSecondaryRegular = 'Font-Secondary-Regular';
export const fontSecondaryMedium = 'Font-Secondary-Medium';
export const fontSecondaryBold = 'Font-Secondary-Bold';

const DefaultTheme: ITheme = {
  color: {
    primary: {
      light: '#96DF44',
      normal: '#6ACA25',
      dark: '#005C42',
    },
    secondary: {
      light: '#F3F6F9',
      normal: '#C4C4C4',
      dark: '#2A2929',
    },
    tertiary: {
      light: '',
      normal: '#FAAF1E',
      dark: '',
    },
    success: {
      normal: '#3c763d',
    },
    warning: {},
    error: {
      normal: '#FF543E',
    },
  },
  heading: {
    color: {
      primary: {
        normal: "",
      },
      secondary: {
        normal: "",
      },
    },
  },
  text: {
    color: {
      primary: {
        light: '#F3F6F9',
        normal: '#4F4F4F',
        dark: '#2A2929',
      },
      secondary: {
        light: '#73BE1E',
        normal: '#6ACA25',
        dark: '#005C42',
      },
    },
  },
  font: {
    size: {
      _default: pixelToRem(16),
      h1: pixelToRem(30),
      h2: pixelToRem(20),
      p: pixelToRem(16),
      span: pixelToRem(16),
      button: pixelToRem(16),
    },
    family: {
      primary: {
        light: fontPrimaryLight,
        book: fontPrimaryBook,
        regular: fontPrimaryRegular,
        medium: fontPrimaryMedium,
        bold: fontPrimaryBold,
      },
      secondary: {
        light: fontSecondaryLight,
        book: fontSecondaryBook,
        regular: fontSecondaryRegular,
        medium: fontSecondaryMedium,
        bold: fontSecondaryBold,
      },
      _default: {
        h1: fontPrimaryRegular,
        h2: fontPrimaryRegular,
        h3: fontPrimaryRegular,
        h4: fontPrimaryRegular,
        h5: fontPrimaryRegular,
        h6: fontPrimaryRegular,
        div: fontPrimaryRegular,
        p: fontPrimaryRegular,
        span: fontPrimaryRegular,
        button: fontPrimaryRegular,
      }
    }
  },
  header: {
    mobile: {
      backgroundColor: '#FFFFFF',
      height: 250,
    },
    tablet: {
      backgroundColor: '#FFFFFF',
      height: 320,
    },
    desktop: {
      backgroundColor: '#FFFFFF',
      height: 538,
    },
  },
  footer: {
    mobile: {
      backgroundColor: '#0A0A0A',
      height: 50,
    },
    tablet: {
      backgroundColor: '#0A0A0A',
      height: 177,
    },
    desktop: {
      backgroundColor: '#0A0A0A',
      height: 177,
    },
  },
  responsive: {
    mobile: {
      minWidth: 321,
      maxWidth: 413,
    },
    tablet: {
      minWidth: 767,
      maxWidth: 1023,
    },
    desktop: {
      minWidth: 1024,
    },
  },
};

export const LightTheme = {...DefaultTheme};
export const DarkTheme = {...DefaultTheme};

export default DefaultTheme;
