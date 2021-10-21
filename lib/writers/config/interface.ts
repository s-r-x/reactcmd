import { TCliConfigFile } from '../../typings/config';

export interface IConfigWriter {
  write(cfg: TCliConfigFile): Promise<void>;
}
