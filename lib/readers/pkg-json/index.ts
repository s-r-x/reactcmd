import { inject, injectable } from 'inversify';
import type { IFileSystem } from '../../file-system/interface';
import { TOKENS } from '../../ioc/tokens';
import type { TPkg } from '../../typings/pkg';
import type { IEnvReader } from '../env/interface';
import type { IPkgJsonReader } from './interface';
import path from 'path';
import { Memoize } from 'typescript-memoize';

@injectable()
export class PkgJsonReader implements IPkgJsonReader {
  constructor(
    @inject(TOKENS.fs) private fs: IFileSystem,
    @inject(TOKENS.env) private env: IEnvReader
  ) {}
  @Memoize()
  async read(): Promise<TPkg> {
    const pkg = await this.fs.readJSON(this.getPath());
    return pkg || {};
  }
  getPath(): string {
    const rootDir = this.env.getProjectRootDir();
    return path.join(rootDir, 'package.json');
  }
}
