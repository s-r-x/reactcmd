import type { TPkgDeps } from '../../typings/pkg';

export interface IDepsReader {
  readDeps(): Promise<TPkgDeps>;
  readDevDeps(): Promise<TPkgDeps>;
  readAllDepsAndMerge(): Promise<TPkgDeps>;
}
