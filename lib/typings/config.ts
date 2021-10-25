import type { TLang } from '.';
import type { IGenerateComponentOptions } from '../generators/component/interface';
import { IGenerateNextPageOptions } from '../generators/next-page/interface';

export type TCliConfigCommands = {
  generateComponent?: Partial<IGenerateComponentOptions>;
  generateNextPage?: Partial<IGenerateNextPageOptions>;
};
export type TCliConfigFile = {
  lang?: TLang;
  srcDir?: string;
  commands: TCliConfigCommands;
};
export type TCliConfigCmdName = keyof TCliConfigCommands;
