import { TStylingStrategy } from '../../typings/styling';
import { AphroditeStyleBuilder } from './implementations/aphrodite';
import { CssStyleBuilder } from './implementations/CssCompatible/css';
import { LessStyleBuilder } from './implementations/CssCompatible/less';
import { ScssStyleBuilder } from './implementations/CssCompatible/scss';
import { RadiumStyleBuilder } from './implementations/radium';
import { StyledJsxStyleBuilder } from './implementations/styled-jsx';
import { EmotionStyleBuilder } from './implementations/StyledCompatible/emotion';
import { LinariaStyleBuilder } from './implementations/StyledCompatible/linaria';
import { ScStyleBuilder } from './implementations/StyledCompatible/sc';
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
