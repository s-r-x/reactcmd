import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import path from 'path';
import { Maybe } from '../../typings/utils';
import { TCliConfigFile } from '../../typings/config';
import { IConfigReader } from './interface';
import { IEnvReader } from '../env/interface';
import { cosmiconfig } from 'cosmiconfig';
import { CONFIG_NAME } from './constants';

const configExplorer = cosmiconfig(CONFIG_NAME);
@injectable()
export class ConfigReader implements IConfigReader {
  constructor(@inject(TOKENS.env) private env: IEnvReader) {}
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
