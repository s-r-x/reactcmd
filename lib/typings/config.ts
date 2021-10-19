import type { IGenerateComponentOptions } from '../generators/component/interface';

export type TCliConfigFile = {
  srcDir?: string;
  commands?: {
    component?: IGenerateComponentOptions;
  };
};
