import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';
import path from 'path';
import { TPkg, TPkgDeps } from '../../typings/pkg';
import { IFileSystem } from '../../file-system/interface';
import { IEnvReader } from '../env/interface';
import { IDepsReader } from './interface';

@injectable()
export class DepsReader implements IDepsReader {
  constructor(
    @inject(TYPES.env) private env: IEnvReader,
    @inject(TYPES.fs) private fs: IFileSystem
  ) {}
  async readDeps(): Promise<TPkgDeps> {
    const pkg = await this.readPkg();
    return pkg.dependencies || {};
  }
  async readDevDeps(): Promise<TPkgDeps> {
    const pkg = await this.readPkg();
    return pkg.devDependencies || {};
  }
  async readAllDepsAndMerge(): Promise<TPkgDeps> {
    const [deps, allDeps] = await Promise.all([
      this.readDeps(),
      this.readDevDeps(),
    ]);
    return { ...deps, ...allDeps };
  }
  private async readPkg(): Promise<TPkg> {
    if (this.cachedPkg) return this.cachedPkg;
    const rootDir = this.env.getProjectRootDir();
    const pkg = await this.fs.readJSON(path.join(rootDir, 'package.json'));
    if (!pkg) {
      this.cachedPkg = {};
    } else {
      this.cachedPkg = pkg;
    }
    return this.cachedPkg;
  }
  private cachedPkg!: TPkg;
}
