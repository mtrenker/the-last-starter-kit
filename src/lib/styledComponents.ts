import { ComponentClass } from 'react';
import * as styledComponents from 'styled-components';

import { ITheme } from '@/themes/interface';

export interface IClassNameProps {
  className: string;
}

const {default: styled } = styledComponents as styledComponents.ThemedStyledComponentsModule<ITheme>;

const css = styledComponents.css;
const keyframes = styledComponents.keyframes;
const ThemeProvider = styledComponents.ThemeProvider as ComponentClass<styledComponents.ThemeProviderProps<ITheme>>;

export {
  css,
  keyframes,
  ITheme,
  ThemeProvider,
};

export default styled;
