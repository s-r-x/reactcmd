import { TStylingStrategy } from '../../typings/styling';
import { AphroditeStyleBuilder } from './implementations/aphrodite';
import { CssStyleBuilder } from './implementations/css';
import { EmotionStyleBuilder } from './implementations/emotion';
import { LessStyleBuilder } from './implementations/less';
import { LinariaStyleBuilder } from './implementations/linaria';
import { RadiumStyleBuilder } from './implementations/radium';
import { ScssStyleBuilder } from './implementations/scss';
import { ScStyleBuilder } from './implementations/sc';
import { StyledJsxStyleBuilder } from './implementations/styled-jsx';
import { StylusStyleBuilder } from './implementations/stylus';
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
