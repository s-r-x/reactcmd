import { Arguments, CommandBuilder } from 'yargs';
import { ComponentGenerator } from '../../generators/component';
import container from '../../ioc/container';
import { TOKENS } from '../../ioc/tokens';
import { TStylingStrategy } from '../../typings/styling';
import { IGenerateComponentOptions as IOptions } from '../../generators/component/interface';

export const command = 'component <name> [dir]';
export const aliases = ['c'];
export const desc = 'Generate component';

const styleChoices: TStylingStrategy[] = [
  'styled-components',
  'emotion',
  'aphrodite',
  'radium',
  'styled-jsx',
  'linaria',
  'less',
  'css',
  'stylus',
  'sass',
];
export const builder: CommandBuilder<IOptions, IOptions> = yargs =>
  yargs
    .options({
      ts: { type: 'boolean', desc: 'Use typescript?', alias: 'tsx' },
      js: { type: 'boolean', desc: 'Use javascript?', alias: 'jsx' },
      class: { type: 'boolean', desc: 'Class component?' },
      fc: { type: 'boolean', desc: 'Functional component?' },
      mobx: { type: 'boolean', desc: 'Use mobx?' },
      redux: { type: 'boolean', desc: 'Use redux?' },
      nostyle: { type: 'boolean', desc: 'Disable styling?' },
      stories: { type: 'boolean', desc: 'Create stories?' },
      pure: { type: 'boolean', desc: 'Wrap in memo or extends PureComponent?' },
      style: {
        type: 'string',
        alias: 's',
        choices: styleChoices,
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

export const handler = async (argv: Arguments<IOptions>): Promise<void> => {
  const generator = container.get<ComponentGenerator>(TOKENS.cmpGen);
  await generator.gen(argv);
  process.exit(0);
};
