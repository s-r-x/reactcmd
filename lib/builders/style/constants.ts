import j from 'jscodeshift';

export const DEFAULT_ROOT_CLASS = 'root';
export const DEFAULT_ROOT_TAG = 'div';
export const DEFAULT_CSS_RULES = `cursor: inherit;`;
export const DEFAULT_STYLUS_CSS_RULES = 'cursor: inherit';
export const DEFAULT_JSX_CHILDREN_STR = 'hello world';
export const DEFAULT_JSX_CHILDREN = [j.literal(DEFAULT_JSX_CHILDREN_STR)];
export const CSS_MODULES_CLASSES_IMPORT_NAME = 'cls';
export const STYLE_DEFAULT_FILENAME = 'styles';
