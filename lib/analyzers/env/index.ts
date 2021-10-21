import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import _ from 'lodash';
import path from 'path';
import { POSSIBLE_COMPONENTS_FOLDERS, POSSIBLE_SRC_FOLDERS } from './constants';
import type { IConfigReader } from '../../readers/config/interface';
import type { Maybe } from '../../typings/utils';
import type { IFileSystem } from '../../file-system/interface';
import type { IEnvReader } from '../../readers/env/interface';
import type { TLang } from '../../typings';
import type { IEnvAnalyzer } from './interface';

@injectable()
export class EnvAnalyzer implements IEnvAnalyzer {
  constructor(
    @inject(TOKENS.env) private env: IEnvReader,
    @inject(TOKENS.fs) private fs: IFileSystem,
    @inject(TOKENS.cfgReader) private cfgReader: IConfigReader
  ) {}
  async determineComponentsDir(): Promise<Maybe<string>> {
    const src = await this.determineSourceDir();
    const list = await this.fs.readDir(src);
    if (_.isEmpty(list)) return null;
    for (const option in POSSIBLE_COMPONENTS_FOLDERS) {
      if (list.has(option)) {
        return path.join(src, option);
      }
    }
    return null;
  }
  async determineSourceDir(): Promise<string> {
    const rootDir = this.env.getProjectRootDir();
    const srcDir = await this.cfgReader.getSrcDir();
    if (srcDir) return srcDir;
    const list = await this.fs.readDir(rootDir);
    if (_.isEmpty(list)) return rootDir;
    for (const option of POSSIBLE_SRC_FOLDERS) {
      if (list.has(option)) {
        return path.join(rootDir, option);
      }
    }

    return rootDir;
  }
  async determineLang(): Promise<TLang> {
    const rootDir = this.env.getProjectRootDir();
    const cfg = await this.cfgReader.readConfig();
    if (cfg?.lang) {
      return cfg.lang;
    }
    const list = await this.fs.readDir(rootDir);
    if (!_.isEmpty(list)) {
      if (list.has('tsconfig.json')) {
        return 'ts';
      }
      for (const file of Array.from(list)) {
        if (file.startsWith('tsconfig')) {
          return 'ts';
        }
      }
    }
    return 'js';
  }
}
