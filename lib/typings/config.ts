import type { TLang } from '.';
import type { IGenerateComponentOptions } from '../generators/component/interface';

export type TCliConfigCommands = {
  generateComponent?: Partial<IGenerateComponentOptions>;
};
export type TCliConfigFile = {
  lang?: TLang;
  srcDir?: string;
  commands: TCliConfigCommands;
};
export type TCliConfigCmdName = keyof TCliConfigCommands;
