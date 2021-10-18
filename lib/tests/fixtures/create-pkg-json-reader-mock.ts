import { IPkgJsonReader } from '../../readers/pkg-json/interface';

export const createPkgJsonReaderMock = (
  args: Partial<IPkgJsonReader> = {}
): IPkgJsonReader => ({
  read: () => Promise.resolve({}),
  ...args,
});
