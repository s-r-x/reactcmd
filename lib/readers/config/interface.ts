import type { Maybe } from '../../typings/utils';
import type { TCliConfigFile } from '../../typings/config';

export interface IConfigReader {
  readConfig(): Promise<Maybe<TCliConfigFile>>;
  getSrcDir(): Promise<Maybe<string>>;
}
