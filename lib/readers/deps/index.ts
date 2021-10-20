import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import type { TPkgDeps } from '../../typings/pkg';
import type { IDepsReader } from './interface';
import type { IPkgJsonReader } from '../pkg-json/interface';

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
  async readAllDeps(): Promise<TPkgDeps> {
    const pkg = await this.pkgReader.read();
    return {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
  }
}
