import type { Arguments, CommandBuilder } from 'yargs';
import type { ComponentGenerator } from '../../generators/component';
import container from '../../ioc/container';
import { TOKENS } from '../../ioc/tokens';
import type { TStylingStrategy } from '../../typings/styling';
import type { IGenerateComponentOptions as IOptions } from '../../generators/component/interface';
import {
  COMPONENT_DEFAULT_FILENAME,
  STORIES_DEFAULT_FILENAME,
  TEST_DEFAULT_FILENAME,
} from '../../generators/component/constants';
import { STYLE_DEFAULT_FILENAME } from '../../builders/style/constants';

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
      style: {
        type: 'string',
        alias: 's',
        choices: styleChoices,
      },
      cssmodules: { type: 'boolean', desc: 'Use CSS modules?', alias: 'cssm' },
      classname: {
        type: 'string',
        desc: 'CSS class',
        alias: 'cn',
      },
      ugly: { type: 'boolean', desc: 'Disable styling?' },
      tag: { type: 'string', desc: 'JSX tag', default: 'div', alias: 't' },
      pure: { type: 'boolean', desc: 'Wrap in memo or extends PureComponent?' },
      sb: { type: 'boolean', desc: 'Create stories?' },
      test: { type: 'boolean', desc: 'Create tests?' },
      cc: { type: 'boolean', desc: 'Class component?' },
      fc: { type: 'boolean', desc: 'Functional component?' },
      ts: { type: 'boolean', desc: 'Use typescript?' },
      js: { type: 'boolean', desc: 'Use javascript?' },
      componentfile: {
        type: 'string',
        desc: 'Name of the component file',
        default: COMPONENT_DEFAULT_FILENAME,
        alias: 'cfile',
      },
      stylefile: {
        type: 'string',
        desc: 'Name of the style file',
        default: STYLE_DEFAULT_FILENAME,
        alias: 'sfile',
      },
      testfile: {
        type: 'string',
        desc: 'Name of the test file',
        default: TEST_DEFAULT_FILENAME,
        alias: 'tfile',
      },
      storiesfile: {
        type: 'string',
        desc: 'Name of the stories file',
        default: STORIES_DEFAULT_FILENAME,
        alias: 'sbfile',
      },
      mobx: { type: 'boolean', desc: 'Use mobx?' },
      redux: { type: 'boolean', desc: 'Use redux?' },
      'prop-types': { type: 'boolean', desc: 'Use prop-types?', alias: 'PT' },
    })
    .positional('name', {
      type: 'string',
      demandOption: true,
      desc: 'Name of the component',
    })
    .positional('dir', {
      type: 'string',
      demandOption: true,
      desc: 'Directory to create the component',
    });

export const handler = async (argv: Arguments<IOptions>): Promise<void> => {
  const generator = container.get<ComponentGenerator>(TOKENS.cmpGen);
  await generator.gen(argv);
  process.exit(0);
};
