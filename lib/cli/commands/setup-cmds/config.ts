import container from '../../../ioc/container';
import { TOKENS } from '../../../ioc/tokens';
import { IConfigSetuper } from '../../../setupers/config/interface';

export const command = 'config';
export const aliases = ['c'];
export const desc = 'Setup rcmd config';

export const handler = async (): Promise<void> => {
  const setuper = container.get<IConfigSetuper>(TOKENS.cfgSetuper);
  await setuper.setup();
  process.exit(0);
};
