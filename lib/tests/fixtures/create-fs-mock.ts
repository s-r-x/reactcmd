import { IFileSystem } from '../../file-system/interface';

export const createFsMock = (args: Partial<IFileSystem> = {}): IFileSystem => ({
  readFile: () => Promise.resolve(''),
  readJSON: () => Promise.resolve(null),
  findClosestPkgDir: () => null,
  readDir: () => Promise.resolve(new Set()),
  ...args,
});
