import type { IDepsReader } from '../../lib/readers/deps/interface';

export const createDepsReaderMock = (
  args: Partial<IDepsReader> = {}
): IDepsReader => ({
  readDeps: () => Promise.resolve({}),
  readDevDeps: () => Promise.resolve({}),
  readAllDeps: () => Promise.resolve({}),
  ...args,
});
