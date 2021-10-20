import type { IUi } from '../../lib/ui/interface';

export const createUiMock = (args: Partial<IUi> = {}): IUi => ({
  confirm: () => Promise.resolve(false),
  select: () => Promise.resolve('' as any),
  ...args,
});
