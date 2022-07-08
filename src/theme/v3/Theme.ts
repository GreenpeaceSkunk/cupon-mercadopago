import { ITheme } from "greenpeace/theme";
import { pixelToRem } from 'meema.utils';
import { fontPrimaryBold, fontPrimaryBook, fontPrimaryLight, fontPrimaryMedium, fontPrimaryRegular, fontSecondaryBold, fontSecondaryBook, fontSecondaryLight, fontSecondaryMedium, fontSecondaryRegular } from "../constants";

export const colorPrimaryLight = '#73BE1E';
export const colorPrimaryNormal = '#66cc00';

export const colorSecondaryNormal = '#C4C4C4';
export const colorSecondaryDark = '#2A2929';

export const screenSmall = 576;
export const screenMedium = 768;
export const screenLarge = 992;
export const screenExtraLarge = 1200;
export const screenExtraExtraLarge = 1400;

const DefaultTheme: ITheme = {
  color: {
    primary: {
      light: '#96DF44',
      normal: '#6ACA25',
      dark: '#005C42',
    },
    secondary: {
      extraLight: '#BDBDBD',
      light: '#F3F6F9',
      normal: '#4F4F4F',
      dark: '#333333',
      extraDark: '#2A2929',
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
        extraLight: '#BDBDBD',
        light: '#F3F6F9',
        normal: '#4F4F4F',
        dark: '#333333',
        extraDark: '#2A2929',
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
      height: 400,
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
    screen: {
      extraSmall: {
        minWidth: 0,
        maxWidth: screenSmall - 1,
      },
      small: {
        minWidth: screenSmall,
        maxWidth: screenMedium - 1,
      },
      medium: {
        minWidth: screenMedium,
        maxWidth: screenLarge - 1,
      },
      large: {
        minWidth: screenLarge,
        maxWidth: screenExtraLarge - 1,
      },
      extraLarge: {
        minWidth: screenExtraLarge,
      },
      extraExtraLarge: {
        minWidth: screenExtraExtraLarge,
      },
    },
  },
};

export const LightTheme = {...DefaultTheme};
export const DarkTheme = {...DefaultTheme};

export default DefaultTheme;
