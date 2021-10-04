import { injectable, inject } from 'inversify';
import { NoRootDirError } from './errors';
import { TOKENS } from '../../ioc/tokens';
import { IEnvReader } from './interface';
import { IFileSystem } from '../../file-system/interface';

@injectable()
export class EnvReader implements IEnvReader {
  constructor(@inject(TOKENS.fs) private fs: IFileSystem) {}
  getCliRootDir(): string {
    if (this.cachedCliRootDir) {
      return this.cachedCliRootDir;
    }
    const pkgDir = this.fs.findClosestPkgDir(process.cwd());
    if (pkgDir) {
      this.cachedCliRootDir = pkgDir;
      return pkgDir;
    } else {
      throw new NoRootDirError('Cannot determine cli root dir');
    }
  }
  getProjectRootDir(): string {
    if (this.cachedProjectRootDir) {
      return this.cachedProjectRootDir;
    }
    const pkgDir = this.fs.findClosestPkgDir(__dirname);
    if (pkgDir) {
      this.cachedProjectRootDir = pkgDir;
      return pkgDir;
    } else {
      throw new NoRootDirError('Cannot determine project root dir');
    }
  }

  private cachedCliRootDir!: string;
  private cachedProjectRootDir!: string;
}
