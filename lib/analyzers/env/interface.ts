import type { TLang } from '../../typings';
import type { Maybe } from '../../typings/utils';

export interface IEnvAnalyzer {
  determineSourceDir(): Promise<string>;
  determineComponentsDir(): Promise<Maybe<string>>;
  determineLang(): Promise<TLang>;
}
