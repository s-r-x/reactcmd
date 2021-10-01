import { IEnvReader } from '../../readers/env/interface';

export const createEnvReaderMock = (
  args: Partial<IEnvReader> = {}
): IEnvReader => ({
  getCliRootDir: () => '/cli-dir',
  getProjectRootDir: () => '/proj-dir',
  ...args,
});
