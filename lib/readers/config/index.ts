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
      const res = await this.searchConfig();
      if (!res || res.isEmpty || !res.config) return null;
      const cfg: TCliConfigFile = res.config;
      if (!cfg.commands) {
        cfg.commands = {};
      }
      return cfg;
    } catch (_e) {
      return null;
    }
  }
  @Memoize()
  async getConfigPath(): Promise<Maybe<string>> {
    const cfg = await this.searchConfig();
    return cfg?.filepath ?? null;
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
  private async searchConfig() {
    return await configExplorer.search(this.env.getProjectRootDir());
  }
}
