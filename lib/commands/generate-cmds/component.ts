import { Arguments, CommandBuilder } from 'yargs';
import { ComponentGenerator } from '../../generators/component';
import container from '../../ioc/container';
import { TYPES } from '../../ioc/types';

type Options = {
  name: string;
  ts?: boolean;
  js?: boolean;
  'no-style'?: boolean;
  style?: string;
  stories?: boolean;
  class?: boolean;
  fc?: boolean;
};

export const command = 'component <name> [dir]';
export const aliases = ['c'];
export const desc = 'Generate component';

export const builder: CommandBuilder<Options, Options> = yargs =>
  yargs
    .options({
      ts: { type: 'boolean', desc: 'Use typescript?', alias: 'tsx' },
      js: { type: 'boolean', desc: 'Use javascript?', alias: 'jsx' },
      class: { type: 'boolean', desc: 'Class component?' },
      fc: { type: 'boolean', desc: 'Functional component?' },
      stories: { type: 'boolean', desc: 'Create stories?' },
      memo: { type: 'boolean', desc: 'Wrap in memo or extends PureComponent?' },
      style: {
        type: 'string',
        alias: 's',
        choices: ['sc', 'lin', 'less', 'css', 'styl', 'sass', 'scss', 'no'],
      },
      'prop-types': { type: 'boolean', desc: 'Use prop-types?', alias: 'pt' },
    })
    .positional('name', {
      type: 'string',
      demandOption: true,
      desc: 'Name of the component',
      default: 'Component',
    })
    .positional('dir', {
      type: 'string',
      demandOption: true,
      desc: 'Directory of the components',
      default: 'components',
    });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const generator = container.get<ComponentGenerator>(TYPES.cmpGen);
  await generator.gen(argv);
  process.exit(0);
};
