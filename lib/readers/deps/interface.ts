import type { TPkgDeps } from '../../typings/pkg';

export interface IAllPkgDeps {
  dev: TPkgDeps;
  prod: TPkgDeps;
}
export interface IDepsReader {
  readDeps(): Promise<TPkgDeps>;
  readDevDeps(): Promise<TPkgDeps>;
  readAllDeps(): Promise<TPkgDeps>;
}
