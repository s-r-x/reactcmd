import type { IEnvReader } from '../../lib/readers/env/interface';

export const createEnvReaderMock = (
  args: Partial<IEnvReader> = {}
): IEnvReader => ({
  getCliRootDir: () => '/cli-dir',
  getProjectRootDir: () => '/proj-dir',
  ...args,
});
