import { IConfigReader } from '../../readers/config/interface';

export const createCfgReaderMock = (
  args: Partial<IConfigReader> = {}
): IConfigReader => ({
  readConfig: () => Promise.resolve({}),
  ...args,
});
