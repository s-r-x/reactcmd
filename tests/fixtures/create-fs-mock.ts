import type { IFileSystem } from '../../lib/file-system/interface';

export const createFsMock = (args: Partial<IFileSystem> = {}): IFileSystem => ({
  isExists: () => Promise.resolve(false),
  readFile: () => Promise.resolve(''),
  readJSON: () => Promise.resolve(null),
  findClosestPkgDir: () => null,
  readDir: () => Promise.resolve(new Set()),
  writeFile: () => Promise.resolve(),
  writeJSON: () => Promise.resolve(),
  ...args,
});
