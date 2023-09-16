interface Themed<T> {
  light: T;
  dark: T;
}

interface ColorsList {
  white: string;
  background: string;
}

const getThemed = <T>(lightParams: T, darkParams: T): Themed<T> => {
  return {
    light: lightParams,
    dark: { ...lightParams, ...darkParams },
  };
};

export const colors = getThemed<ColorsList>(
  {
    white: '#ffffff',
    background: '#ffffff',
  },
  {
    white: '#eeeeee',
    background: '#3c3c3c',
  },
);
