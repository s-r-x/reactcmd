import { inject, injectable } from 'inversify';
import { IFileSystem } from '../../file-system/interface';
import { TOKENS } from '../../ioc/tokens';
import { TPkg } from '../../typings/pkg';
import { IEnvReader } from '../env/interface';
import { IPkgJsonReader } from './interface';
import path from 'path';

@injectable()
export class PkgJsonReader implements IPkgJsonReader {
  private cachedPkg!: TPkg;
  constructor(
    @inject(TOKENS.fs) private fs: IFileSystem,
    @inject(TOKENS.env) private env: IEnvReader
  ) {}
  async read(): Promise<TPkg> {
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
}
