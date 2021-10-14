import { IGenerateComponentOptions } from '../../generators/component/interface';
import j from 'jscodeshift';

export interface IComponentGeneratorSpec
  extends Pick<
    IGenerateComponentOptions,
    'name' | 'fc' | 'class' | 'ts' | 'tag' | 'mobx' | 'redux' | 'pure'
  > {
  jsx?: j.JSXElement;
  imports?: j.ImportDeclaration[];
  hocs?: string[];
}
export interface IComponentBuilderFacade {
  buildUsingComponentGeneratorSpec(spec: IComponentGeneratorSpec): string;
}
