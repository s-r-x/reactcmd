import type { TStylingStrategy } from '../typings/styling';

export const AVAILABLE_STYLING_OPTIONS: TStylingStrategy[] = [
  'sc',
  'emotion',
  'aphrodite',
  'radium',
  'styled-jsx',
  'linaria',
  'less',
  'css',
  'stylus',
  'sass',
];

export const CSS_MODULES_SUPPORTED_STYLINGS: TStylingStrategy[] = [
  'css',
  'less',
  'stylus',
  'sass',
];
