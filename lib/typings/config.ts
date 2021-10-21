import type { TLang } from '.';
import type { IGenerateComponentOptions } from '../generators/component/interface';

export type TCliConfigFile = {
  lang?: TLang;
  srcDir?: string;
  commands?: {
    component?: Partial<IGenerateComponentOptions>;
  };
};
