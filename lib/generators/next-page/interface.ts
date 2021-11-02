import type { IGenerateComponentOptions } from '../component/interface';

export interface IGenerateNextPageOptions
  extends Pick<
    IGenerateComponentOptions,
    | 'y'
    | 'dry'
    | 'quite'
    | 'lang'
    | 'pure'
    | 'cc'
    | 'fc'
    | 'tag'
    | 'mobx'
    | 'redux'
  > {
  path: string;
  dir: string;
  gsps?: boolean;
  gsp?: boolean;
  gssp?: boolean;
}
export interface INextPageGenerator {
  gen(args: IGenerateNextPageOptions): Promise<void>;
}
