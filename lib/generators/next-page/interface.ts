import type { TLang } from '../../typings';

export interface IGenerateNextPageOptions {
  lang?: TLang;
  gsps?: boolean;
  gsp?: boolean;
  gssp?: boolean;
  dry?: boolean;
  y?: boolean;
}
export interface INextPageGenerator {
  gen(args: IGenerateNextPageOptions): Promise<void>;
}
