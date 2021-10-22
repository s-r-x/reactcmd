import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import path from 'path';
import type { Maybe } from '../../typings/utils';
import type { TCliConfigFile } from '../../typings/config';
import type { IConfigReader } from './interface';
import type { IEnvReader } from '../env/interface';
import { cosmiconfig } from 'cosmiconfig';
import { Memoize } from 'typescript-memoize';
import { CONFIG_NAME, SUPPORTED_CONFIG_SOURCES } from '../../constants/config';
import { CosmiconfigResult } from 'cosmiconfig/dist/types';

const configExplorer = cosmiconfig(CONFIG_NAME, {
  searchPlaces: SUPPORTED_CONFIG_SOURCES,
});
@injectable()
export class ConfigReader implements IConfigReader {
  constructor(@inject(TOKENS.env) private env: IEnvReader) {}
  @Memoize()
  async readConfig(): Promise<Maybe<TCliConfigFile>> {
    try {
      return this.normalizeConfig(await this.searchConfig());
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
  private normalizeConfig(res: CosmiconfigResult): Maybe<TCliConfigFile> {
    if (!res || res.isEmpty || !res.config) return null;
    const cfg: TCliConfigFile = res.config;
    if (!cfg.commands) {
      cfg.commands = {};
    }
    return cfg;
  }
  private async searchConfig() {
    return await configExplorer.search(this.env.getProjectRootDir());
  }
}
