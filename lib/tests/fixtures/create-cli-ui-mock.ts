import { ICliUi } from '../../cli-ui/interface';

export const createCliUiMock = (args: Partial<ICliUi> = {}): ICliUi => ({
  confirm: () => Promise.resolve(false),
  ...args,
});
