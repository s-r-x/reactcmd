import type { Arguments, CommandBuilder } from 'yargs';
import type { ComponentGenerator } from '../../../generators/component';
import container from '../../../ioc/container';
import { TOKENS } from '../../../ioc/tokens';
import type { IGenerateComponentOptions as IOptions } from '../../../generators/component/interface';
import {
  COMPONENT_DEFAULT_FILENAME,
  STORIES_DEFAULT_FILENAME,
  TEST_DEFAULT_FILENAME,
} from '../../../generators/component/constants';
import { STYLE_DEFAULT_FILENAME } from '../../../builders/style/constants';
import { AVAILABLE_STYLING_OPTIONS } from '../../../constants/styling';
import { AVAILABLE_LANGS } from '../../../constants/lang';
import {
  AVAILABLE_TEST_LIBS,
  AVAILABLE_TEST_RUNNERS,
} from '../../../constants/testing';

export const command = 'component <name> [dir]';
export const aliases = ['c'];
export const desc = 'Generate new component';

export const builder: CommandBuilder = yargs =>
  yargs
    .options({
      style: {
        type: 'string',
        alias: 's',
        desc: 'Styling. Detected automatically',
        choices: AVAILABLE_STYLING_OPTIONS,
      },
      cssmodules: { type: 'boolean', desc: 'Use CSS modules?', alias: 'cssm' },
      classname: {
        type: 'string',
        desc: 'CSS class',
        alias: 'cn',
      },
      ugly: { type: 'boolean', desc: 'Disable styling?' },
      tag: { type: 'string', desc: 'JSX tag', default: 'div', alias: 't' },
      pure: { type: 'boolean', desc: 'Memoize the component?' },
      sb: { type: 'boolean', desc: 'Create stories?' },
      test: { type: 'boolean', desc: 'Create tests?' },
      cc: { type: 'boolean', desc: 'Class component?' },
      fc: { type: 'boolean', desc: 'Functional component?' },
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
      mobx: { type: 'boolean', desc: 'Wrap in mobx observer?' },
      redux: { type: 'boolean', desc: 'Wrap in redux connect?' },
      testlib: {
        type: 'string',
        desc: 'Testing library. Detected automatically',
        choices: AVAILABLE_TEST_LIBS,
      },
      testrunner: {
        type: 'string',
        desc: 'Test runner. Detected automatically',
        choices: AVAILABLE_TEST_RUNNERS,
      },
      lang: {
        type: 'string',
        desc: 'Language. Detected automatically',
        choices: AVAILABLE_LANGS,
        alias: 'l',
      },
      dry: {
        type: 'boolean',
        desc: 'Do not write generated files to disk',
      },
      y: {
        type: 'boolean',
        desc: 'Auto confirm all prompts',
      },
    })
    .positional('name', {
      type: 'string',
      demandOption: true,
      desc: 'Name of the component',
    })
    .positional('dir', {
      type: 'string',
      demandOption: true,
      desc: 'Directory of the component',
    });

export const handler = async (argv: Arguments<IOptions>): Promise<void> => {
  const generator = container.get<ComponentGenerator>(TOKENS.cmpGen);
  await generator.gen(argv);
  process.exit(0);
};
