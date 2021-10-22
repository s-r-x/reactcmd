import type { IPkgJsonWriter } from '../../lib/writers/pkg-json/interface';

export const createPkgJsonWriterMock = (
  args: Partial<IPkgJsonWriter> = {}
): IPkgJsonWriter => ({
  writeField: () => Promise.resolve(),
  ...args,
});
