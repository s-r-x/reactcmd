import j from 'jscodeshift';
import type { TStringDict } from '../../typings/utils';

export const DEFAULT_COMPONENT_NAME = 'Component';
export const DEFAULT_TAG = 'div';
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

export const MOBX_HOC_NAME = 'observer';
export const REDUX_HOC_NAME = 'connect';
export const REDUX_TYPE_EXTRACTOR_NAME = 'ConnectedProps';
export const REDUX_CONNECTOR_NAME = 'connector';
