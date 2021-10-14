import { Maybe } from '../../typings/utils';
import { TCliConfigFile } from '../../typings/config';

export interface IConfigReader {
  readConfig(): Promise<Maybe<TCliConfigFile>>;
  getSrcDir(): Promise<Maybe<string>>;
}
