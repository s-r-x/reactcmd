import { TLang } from '../../typings';
import { Maybe } from '../../typings/utils';

export interface IEnvAnalyzer {
  determineSourceDir(): Promise<string>;
  determineComponentsDir(): Promise<Maybe<string>>;
  determineLang(): Promise<TLang>;
}
