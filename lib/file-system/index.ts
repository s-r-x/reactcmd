import fs from 'fs-extra';
import { injectable } from 'inversify';
import findPkgDir from 'pkg-dir';
import type { Maybe } from '../typings/utils';
import type { IFileSystem } from './interface';

@injectable()
export class FileSystem implements IFileSystem {
  async readFile(path: string): Promise<Maybe<string>> {
    if (await this.isExists(path)) {
      return await fs.readFile(path, 'utf8');
    } else {
      return null;
    }
  }
  async readJSON<T = any>(path: string): Promise<Maybe<T>> {
    if (await this.isExists(path)) {
      return await fs.readJSON(path);
    } else {
      return null;
    }
  }
  findClosestPkgDir(cwd: string): Maybe<string> {
    const dir = findPkgDir.sync(cwd);
    return dir || null;
  }
  async isExists(path: string) {
    return await fs.pathExists(path);
  }
  async readDir(dir: string): Promise<Set<string>> {
    try {
      const list = await fs.readdir(dir);
      return new Set(list);
    } catch (_e) {
      return new Set();
    }
  }
  async writeFile(path: string, content: string): Promise<void> {
    await fs.outputFile(path, content);
  }
}
