import type { IGenerateComponentOptions } from '../../generators/component/interface';
import type j from 'jscodeshift';

export interface IComponentGeneratorSpec
  extends Pick<
    IGenerateComponentOptions,
    'name' | 'fc' | 'cc' | 'lang' | 'tag' | 'mobx' | 'redux' | 'pure'
  > {
  jsx?: j.JSXElement;
  imports?: j.ImportDeclaration[];
  hocs?: string[];
}
export interface IComponentBuilderFacade {
  buildUsingComponentGeneratorSpec(spec: IComponentGeneratorSpec): string;
}
