export interface ITheme {
  borderRadius: number;
  color: {
    primary: {
      light?: string;
      normal?: string;
      dark?: string;
    };
    secondary: {
      light?: string;
      normal?: string;
      dark?: string;
    };
    tertiary: {
      light?: string;
      normal?: string;
      dark?: string;
    };
    success: {
      light?: string;
      normal?: string;
      dark?: string;
    };
    warning: {
      light?: string;
      normal?: string;
      dark?: string;
    };
    error: {
      light?: string;
      normal?: string;
      dark?: string;
    };
  };
  heading: {
    color: {
      primary: {
        light?: string;
        normal?: string;
        dark?: string;
      };
      secondary: {
        light?: string;
        normal?: string;
        dark?: string;
      };
    }
  };
  text: {
    color: {
      primary: {
        light?: string;
        normal?: string;
        dark?: string;
      };
      secondary: {
        light?: string;
        normal?: string;
        dark?: string;
      };
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
      primary: {
        light?: string;
        thin?: string;
        book?: string;
        medium?: string;
        regular?: string;
        bold?: string;
      };
      secondary: {
        light?: string;
        thin?: string;
        book?: string;
        medium?: string;
        regular?: string;
        bold?: string;
      };
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