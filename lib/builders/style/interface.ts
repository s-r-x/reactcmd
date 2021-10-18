import { TStylingStrategy } from '../../typings/styling';
import { Maybe } from '../../typings/utils';
import { ImportDeclaration } from 'jscodeshift';
import {
  JSXElement,
  JSXText,
  JSXSpreadChild,
  JSXFragment,
  Literal,
  JSXExpressionContainer,
} from 'jscodeshift';

export type TStyleBuilderFactory = (
  strategy: TStylingStrategy
) => IStyleBuilder;

export interface IStyleBuildSpec {
  rootClass?: string;
  rootTag?: string;
  filename?: string;
  ts?: boolean;
  cssModules?: boolean;
  jsxChildren?: (
    | JSXText
    | JSXExpressionContainer
    | JSXSpreadChild
    | JSXElement
    | JSXFragment
    | Literal
  )[];
}
export type TNormalizedStyleBuildSpec = Required<
  Omit<IStyleBuildSpec, 'filename'>
> & {
  file: {
    name: string;
    ext: string;
    nameWithExt: string;
  };
};

export interface IStyleBuildArtifacts {
  imports?: ImportDeclaration[];
  standalone: Maybe<{
    filename: string;
    content: string;
  }>;
  jsx: JSXElement;
  hocs?: string[];
}
export interface IStyleBuilder {
  build(spec: IStyleBuildSpec): IStyleBuildArtifacts;
}
