import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import path from 'path';
import type { Maybe } from '../../typings/utils';
import type { TCliConfigFile } from '../../typings/config';
import type { IConfigReader } from './interface';
import type { IEnvReader } from '../env/interface';
import { cosmiconfig } from 'cosmiconfig';
import { CONFIG_NAME } from './constants';
import { Memoize } from 'typescript-memoize';

const configExplorer = cosmiconfig(CONFIG_NAME);
@injectable()
export class ConfigReader implements IConfigReader {
  constructor(@inject(TOKENS.env) private env: IEnvReader) {}
  @Memoize()
  async readConfig(): Promise<Maybe<TCliConfigFile>> {
    try {
      const cfg = await configExplorer.search(this.env.getProjectRootDir());
      if (!cfg || cfg.isEmpty) return null;
      return cfg.config;
    } catch (_e) {
      return null;
    }
  }
  async getSrcDir(): Promise<Maybe<string>> {
    const cfg = await this.readConfig();
    const src = cfg?.srcDir;
    if (!src) return null;
    if (path.isAbsolute(src)) {
      return src;
    } else {
      return path.join(this.env.getProjectRootDir(), src);
    }
  }
}
