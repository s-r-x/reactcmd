import { IBuildComponentSpec } from './interface';
import j from 'jscodeshift';

export const BUILD_COMPONENT_DEFAULT_SPEC: IBuildComponentSpec = {
  name: 'Component',
  lang: 'js',
  isPure: false,
  useClass: false,
  usePT: false,
  useRedux: false,
};

export const DEFAULT_COMPONENT_NAME = 'Component';
export const DEFAULT_IMPORTS: j.ImportDeclaration[] = [
  j.importDeclaration(
    [j.importDefaultSpecifier(j.identifier('React'))],
    j.literal('react')
  ),
];
