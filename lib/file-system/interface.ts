import type { Maybe, TAnyDict } from '../typings/utils';

export interface IFileSystem {
  findClosestPkgDir(cwd: string): Maybe<string>;
  isExists(path: string): Promise<boolean>;
  readFile(path: string): Promise<Maybe<string>>;
  readJSON<T = any>(path: string): Promise<Maybe<T>>;
  readDir(dir: string): Promise<Set<string>>;
  writeFile(path: string, content: string): Promise<void>;
  writeJSON(path: string, json: TAnyDict): Promise<void>;
}
