import type { ICliUi } from '../../lib/cli-ui/interface';

export const createCliUiMock = (args: Partial<ICliUi> = {}): ICliUi => ({
  confirm: () => Promise.resolve(false),
  ...args,
});
