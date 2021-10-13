import { TLang } from '../../typings';

export interface IEnvAnalyzer {
  determineSourceDir(): Promise<string>;
  determineComponentsDir(): Promise<string>;
  determineLang(): Promise<TLang>;
}
