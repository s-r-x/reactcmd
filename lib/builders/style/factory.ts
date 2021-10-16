import { TStylingStrategy } from '../../typings/styling';
import { AphroditeStyleBuilder } from './aphrodite';
import { CssStyleBuilder } from './CssCompatible/css';
import { LessStyleBuilder } from './CssCompatible/less';
import { ScssStyleBuilder } from './CssCompatible/scss';
import { RadiumStyleBuilder } from './radium';
import { StyledJsxStyleBuilder } from './styled-jsx';
import { EmotionStyleBuilder } from './StyledCompatible/emotion';
import { LinariaStyleBuilder } from './StyledCompatible/linaria';
import { ScStyleBuilder } from './StyledCompatible/sc';
import { StylusStyleBuilder } from './stylus';
import { IStyleBuilder, TStyleBuilderFactory } from './interface';

const implementations: Record<TStylingStrategy, new () => IStyleBuilder> = {
  aphrodite: AphroditeStyleBuilder,
  css: CssStyleBuilder,
  emotion: EmotionStyleBuilder,
  less: LessStyleBuilder,
  linaria: LinariaStyleBuilder,
  radium: RadiumStyleBuilder,
  sass: ScssStyleBuilder,
  stylus: StylusStyleBuilder,
  'styled-jsx': StyledJsxStyleBuilder,
  'styled-components': ScStyleBuilder,
};
const DEFAULT_IMPLEMENTATION = CssStyleBuilder;

export const styleBuilderFactory: TStyleBuilderFactory = strategy => {
  const builder = implementations[strategy] || DEFAULT_IMPLEMENTATION;
  return new builder();
};
