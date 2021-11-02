import type { TLang } from '../typings';

export const langToJsxFileExt = (lang?: TLang): string => {
  return lang === 'ts' ? '.tsx' : '.jsx';
};
