import { ITheme } from "greenpeace/theme";
import { pixelToRem } from 'meema.utils';
import { fontPrimaryBold, fontPrimaryBook, fontPrimaryLight, fontPrimaryMedium, fontPrimaryRegular, fontSecondaryBold, fontSecondaryBook, fontSecondaryLight, fontSecondaryMedium, fontSecondaryRegular } from "../constants";

export const colorPrimaryLight = '#73BE1E';
export const colorPrimaryNormal = '#66cc00';
export const colorPrimaryDark = '#005C42';

export const colorSecondaryNormal = '#C4C4C4';
export const colorSecondaryDark = '#2A2929';

export const colorTertiaryNormal = '#BDBDBD';

export const headingColorPrimaryNormal = '#4F4F4F';
export const headingColorSecondaryNormal = colorPrimaryDark;

export const textColorPrimaryNormal = '#4F4F4F';
export const textColorSecondaryNormal = colorPrimaryDark;

const DefaultTheme: ITheme = {
  color: {
    primary: {
      light: '#73BE1E',
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
      light: '#FFF2F1',
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
        normal: '#000000',
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
      backgroundColor: '#2A2929',
      height: 300,
    },
    tablet: {
      backgroundColor: '#2A2929',
      height: 300,
    },
    desktop: {
      backgroundColor: '#2A2929',
      height: 350,
    },
  },
  footer: {
    mobile: {
      backgroundColor: '#2A2929',
      height: 50,
    },
    tablet: {
      backgroundColor: '#2A2929',
      height: 50,
    },
    desktop: {
      backgroundColor: '#2A2929',
      height: 50,
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
      small: {
        minWidth: 576,
      },
      medium: {
        minWidth: 768,
      },
      large: {
        minWidth: 992,
      },
      extraLarge: {
        minWidth: 1200,
      },
      extraExtraLarge: {
        minWidth: 1600,
      },
    }
  },
};

export const LightTheme = {...DefaultTheme};
export const DarkTheme = {...DefaultTheme};

export default DefaultTheme;
