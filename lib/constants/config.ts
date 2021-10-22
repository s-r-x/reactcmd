export const CONFIG_NAME = 'rcmd';
export const SUPPORTED_CONFIG_SOURCES = [
  `.${CONFIG_NAME}rc`,
  'package.json',
  `.${CONFIG_NAME}rc.json`,
];
export const DEFAULT_CONFIG_FILE = SUPPORTED_CONFIG_SOURCES[0];
