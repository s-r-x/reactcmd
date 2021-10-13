import { inject, injectable } from 'inversify';
import { IFileSystem } from '../../file-system/interface';
import { TOKENS } from '../../ioc/tokens';
import { IEnvReader } from '../../readers/env/interface';
import { TLang } from '../../typings';
import { IEnvAnalyzer } from './interface';
import _ from 'lodash';
import path from 'path';
import {
  DEFAULT_COMPONENTS_FOLDER,
  POSSIBLE_COMPONENTS_FOLDERS,
  POSSIBLE_SRC_FOLDERS,
} from './constants';

@injectable()
export class EnvAnalyzer implements IEnvAnalyzer {
  constructor(
    @inject(TOKENS.env) private env: IEnvReader,
    @inject(TOKENS.fs) private fs: IFileSystem
  ) {}
  async determineComponentsDir(): Promise<string> {
    const src = await this.determineSourceDir();
    const list = await this.fs.readDir(src);
    const defaultFolder = path.join(src, DEFAULT_COMPONENTS_FOLDER);
    if (_.isEmpty(list)) return defaultFolder;
    for (const option in POSSIBLE_COMPONENTS_FOLDERS) {
      if (list.has(option)) {
        return path.join(src, option);
      }
    }
    return defaultFolder;
  }
  async determineSourceDir(): Promise<string> {
    const rootDir = this.env.getProjectRootDir();
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
