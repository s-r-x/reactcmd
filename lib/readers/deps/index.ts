import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import { TPkgDeps } from '../../typings/pkg';
import { IDepsReader } from './interface';
import { IPkgJsonReader } from '../pkg-json/interface';

@injectable()
export class DepsReader implements IDepsReader {
  constructor(
    @inject(TOKENS.pkgJsonReader) private pkgReader: IPkgJsonReader
  ) {}
  async readDeps(): Promise<TPkgDeps> {
    const pkg = await this.pkgReader.read();
    return pkg.dependencies || {};
  }
  async readDevDeps(): Promise<TPkgDeps> {
    const pkg = await this.pkgReader.read();
    return pkg.devDependencies || {};
  }
  async readAllDepsAndMerge(): Promise<TPkgDeps> {
    const [deps, allDeps] = await Promise.all([
      this.readDeps(),
      this.readDevDeps(),
    ]);
    return { ...deps, ...allDeps };
  }
}
