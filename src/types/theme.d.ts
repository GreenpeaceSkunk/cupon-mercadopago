type ColorType = {
  extraLight?: string;
  light?: string;
  normal?: string;
  dark?: string;
  extraDark?: string;
};

type FontFamilyType = {
  black?: string;
  blackItalic?: string;
  bold?: string;
  boldItalic?: string;
  book?: string;
  extraBold?: string;
  extraBoldItalic?: string;
  extraLight?: string;
  extraLightItalic?: string;
  extraBold?: string;
  extraBoldItalic?: string;
  italic?: string;
  light?: string;
  lightItalic?: string;
  normal?: string;
  medium?: string;
  mediumItalic?: string;
  regular?: string;
  semiBold?: string;
  semiBoldItalic?: string;
  thin?: string;
  thinItalic?: string;
};

type ResponsiveScreenType = {
  minWidth?: number;
  maxWidth?: number;
};

export interface ITheme {
  color: {
    primary: ColorType;
    secondary: ColorType;
    tertiary: ColorType;
    success: ColorType;
    warning: ColorType;
    error: ColorType;
  };
  heading: {
    color: {
      primary: ColorType;
      secondary: ColorType;
    }
  };
  text: {
    color: {
      primary: ColorType;
      secondary: ColorType;
    }
  };
  font: {
    size: {
      _default?: string;
      h1?: string;
      h2?: string;
      p?: string;
      span?: string;
      button?: string;
    };
    family: {
      primary: FontFamilyType;
      secondary: FontFamilyType;
      _default: {
        h1?: string;
        h2?: string;
        h3?: string;
        h4?: string;
        h5?: string;
        h6?: string;
        div?: string;
        p?: string;
        span?: string;
        button?: string;
      }
    };
  };
  header: {
    mobile?: {
      backgroundColor?: string;
      height?: number;
    };
    tablet?: {
      backgroundColor?: string;
      height?: number;
    };
    desktop?: {
      backgroundColor?: string;
      height?: number;
    };
    desktopLarge?: {
      backgroundColor?: string;
      height?: number;
    };
    desktopXLarge?: {
      backgroundColor?: string;
      height?: number;
    };
  };
  footer: {
    mobile?: {
      backgroundColor?: string;
      height?: number;
    };
    tablet?: {
      backgroundColor?: string;
      height?: number;
    };
    desktop?: {
      backgroundColor?: string;
      height?: number;
    };
  };
  responsive: {
    screen?: {
      extraSmall?: ResponsiveScreenType,
      small?: ResponsiveScreenType,
      medium?: ResponsiveScreenType,
      large?: ResponsiveScreenType,
      extraLarge?: ResponsiveScreenType,
      extraExtraLarge?: ResponsiveScreenType,
    },
    mobile: {
      minWidth?: number;
      maxWidth?: number;
    };
    tablet: {
      minWidth?: number;
      maxWidth?: number;
    };
    desktop: {
      minWidth?: number;
    };
  };
}
