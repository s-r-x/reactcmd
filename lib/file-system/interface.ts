import { Maybe } from '../typings/utils';

export interface IFileSystem {
  readFile(path: string): Promise<Maybe<string>>;
  readJSON<T = any>(path: string): Promise<Maybe<T>>;
  readDir(dir: string): Promise<Set<string>>;
  findClosestPkgDir(cwd: string): Maybe<string>;
}
