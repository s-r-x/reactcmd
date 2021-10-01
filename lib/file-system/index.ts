import fs from 'fs-extra';
import { injectable } from 'inversify';
import findPkgDir from 'pkg-dir';
import { Maybe } from '../typings/utils';
import { IFileSystem } from './interface';

@injectable()
export class FileSystem implements IFileSystem {
  async readFile(path: string): Promise<Maybe<string>> {
    if (await fs.pathExists(path)) {
      return await fs.readFile(path, 'utf8');
    } else {
      return null;
    }
  }
  async readJSON<T = any>(path: string): Promise<Maybe<T>> {
    if (await fs.pathExists(path)) {
      return await fs.readJSON(path);
    } else {
      return null;
    }
  }
  findClosestPkgDir(cwd: string): Maybe<string> {
    const dir = findPkgDir.sync(cwd);
    return dir || null;
  }
}
