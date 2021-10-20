import { injectable, inject } from 'inversify';
import { NoRootDirError } from './errors';
import { TOKENS } from '../../ioc/tokens';
import type { IEnvReader } from './interface';
import type { IFileSystem } from '../../file-system/interface';
import { Memoize } from 'typescript-memoize';

@injectable()
export class EnvReader implements IEnvReader {
  constructor(@inject(TOKENS.fs) private fs: IFileSystem) {}
  @Memoize()
  getCliRootDir(): string {
    const pkgDir = this.fs.findClosestPkgDir(__dirname);
    if (pkgDir) {
      return pkgDir;
    } else {
      throw new NoRootDirError('Cannot determine cli root dir');
    }
  }
  @Memoize()
  getProjectRootDir(): string {
    const pkgDir = this.fs.findClosestPkgDir(process.cwd());
    if (pkgDir) {
      return pkgDir;
    } else {
      throw new NoRootDirError('Cannot determine project root dir');
    }
  }
}
