import { TStylingStrategy } from '../../typings/styling';

export const DEFAULT_STYLING_STRATEGY: TStylingStrategy = 'css';

export const LIB_TO_STYLING_STRATEGY_MAP: Record<
  TStylingStrategy | string,
  TStylingStrategy
> = {
  'styled-components': 'styled-components',
  '@linaria/react': 'linaria',
  '@emotion/react': 'emotion',
  aphrodite: 'aphrodite',
  radium: 'radium',
  'styled-jsx': 'styled-jsx',
  stylus: 'stylus',
  less: 'less',
  sass: 'sass',
};
