import type { Arguments, CommandBuilder } from 'yargs';
import type { ComponentGenerator } from '../../generators/component';
import container from '../../ioc/container';
import { TOKENS } from '../../ioc/tokens';
import type { IGenerateComponentOptions as IOptions } from '../../generators/component/interface';
import {
  COMPONENT_DEFAULT_FILENAME,
  STORIES_DEFAULT_FILENAME,
  TEST_DEFAULT_FILENAME,
} from '../../generators/component/constants';
import { STYLE_DEFAULT_FILENAME } from '../../builders/style/constants';
import { AVAILABLE_STYLING_OPTIONS } from '../../constants/styling';
import { AVAILABLE_LANGS } from '../../constants/lang';
import {
  AVAILABLE_TEST_LIBS,
  AVAILABLE_TEST_RUNNERS,
} from '../../constants/testing';
import type { IConfigReader } from '../../readers/config/interface';

export const command = 'generate component <name> [dir]';
export const aliases = ['c'];
export const desc = 'Generate new component';

export const builder: CommandBuilder = async yargs => {
  const cfgReader = container.get<IConfigReader>(TOKENS.cfgReader);
  const baseCfg = await cfgReader.readConfig();
  const cfg = baseCfg?.commands.generateComponent;
  return yargs
    .options({
      style: {
        type: 'string',
        alias: 's',
        desc: 'Styling. Detected automatically',
        default: cfg?.style,
        choices: AVAILABLE_STYLING_OPTIONS,
      },
      cssmodules: {
        type: 'boolean',
        desc: 'Use CSS modules?',
        alias: 'cssm',
        default: cfg?.cssmodules,
      },
      classname: {
        type: 'string',
        desc: 'CSS class',
        alias: 'cn',
        default: cfg?.classname,
      },
      ugly: { type: 'boolean', desc: 'Disable styling?', default: cfg?.ugly },
      tag: {
        type: 'string',
        desc: 'JSX tag',
        default: cfg?.tag ?? 'div',
        alias: 't',
      },
      pure: {
        type: 'boolean',
        desc: 'Memoize the component?',
        default: cfg?.pure,
      },
      sb: { type: 'boolean', desc: 'Create stories?', default: cfg?.sb },
      test: { type: 'boolean', desc: 'Create tests?', default: cfg?.test },
      cc: { type: 'boolean', desc: 'Class component?', default: cfg?.cc },
      fc: { type: 'boolean', desc: 'Functional component?', default: cfg?.fc },
      componentfile: {
        type: 'string',
        desc: 'Name of the component file',
        default: cfg?.componentfile ?? COMPONENT_DEFAULT_FILENAME,
        alias: 'cfile',
      },
      stylefile: {
        type: 'string',
        desc: 'Name of the style file',
        default: cfg?.stylefile ?? STYLE_DEFAULT_FILENAME,
        alias: 'sfile',
      },
      testfile: {
        type: 'string',
        desc: 'Name of the test file',
        default: cfg?.testfile ?? TEST_DEFAULT_FILENAME,
        alias: 'tfile',
      },
      storiesfile: {
        type: 'string',
        desc: 'Name of the stories file',
        default: cfg?.storiesfile ?? STORIES_DEFAULT_FILENAME,
        alias: 'sbfile',
      },
      mobx: {
        type: 'boolean',
        desc: 'Wrap in mobx observer?',
        default: cfg?.mobx,
      },
      redux: {
        type: 'boolean',
        desc: 'Wrap in redux connect?',
        default: cfg?.redux,
      },
      testlib: {
        type: 'string',
        desc: 'Testing library. Detected automatically',
        default: cfg?.testlib,
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
        default: cfg?.lang ?? baseCfg?.lang ?? undefined,
        alias: 'l',
      },
      dry: {
        type: 'boolean',
        desc: 'Do not write generated files to disk',
        default: cfg?.dry,
      },
      y: {
        type: 'boolean',
        desc: 'Auto confirm all prompts',
        default: cfg?.y,
      },
    })
    .positional('name', {
      type: 'string',
      demandOption: true,
      desc: 'Name of the component',
    })
    .positional('dir', {
      type: 'string',
      desc: 'Directory of the component',
    });
};

export const handler = async (argv: Arguments<IOptions>): Promise<void> => {
  const generator = container.get<ComponentGenerator>(TOKENS.cmpGen);
  await generator.gen(argv);
};
