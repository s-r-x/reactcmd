import j from 'jscodeshift';
import { TStringDict } from '../../typings/utils';

export const DEFAULT_JSX = j.jsxElement(
  j.jsxOpeningElement(j.jsxIdentifier('div'), []),
  j.jsxClosingElement(j.jsxIdentifier('div')),
  [j.stringLiteral('^_^')]
);
export const DEFAULT_JSX_STR = j(DEFAULT_JSX).toSource();
export const DEFAULT_COMPONENT_NAME = 'Component';
export const DEFAULT_IMPORTS: j.ImportDeclaration[] = [
  j.importDeclaration(
    [j.importDefaultSpecifier(j.identifier('React'))],
    j.literal('react')
  ),
];
export const ENABLE_TS_BY_DEFAULT = false;
export const IS_PURE_BY_DEFAULT = false;
export const IS_CLASS_BY_DEFAULT = false;
export const DEFAULT_PROPS: TStringDict = {};
export const USE_MOBX_BY_DEFAULT = false;
export const USE_REDUX_BY_DEFAULT = false;

export const PROPS_TYPE_IDENTIFIER = 'Props';
