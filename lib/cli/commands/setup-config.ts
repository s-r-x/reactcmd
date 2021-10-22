import { Arguments, CommandBuilder } from 'yargs';
import container from '../../ioc/container';
import { TOKENS } from '../../ioc/tokens';
import type {
  ICfgSetuper,
  ICfgSetuperOptions as IOpts,
} from '../../setupers/config/interface';

export const command = 'setup config';
export const aliases = ['c'];
export const desc = 'Setup config';

export const builder: CommandBuilder<IOpts, IOpts> = yargs =>
  yargs.options({
    dry: {
      type: 'boolean',
      desc: 'Print generated config, but do not write it to disk',
    },
  });
export const handler = async (argv: Arguments<IOpts>): Promise<void> => {
  const setuper = container.get<ICfgSetuper>(TOKENS.cfgSetuper);
  await setuper.setup(argv);
  process.exit(0);
};
