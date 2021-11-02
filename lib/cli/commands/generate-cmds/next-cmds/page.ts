import type { Arguments, CommandBuilder } from 'yargs';
import { AVAILABLE_LANGS } from '../../../../constants/lang';
import { NEXT_DEFAULT_PAGES_FOLDER } from '../../../../generators/next-page/constants';
import type {
  IGenerateNextPageOptions,
  INextPageGenerator,
} from '../../../../generators/next-page/interface';
import container from '../../../../ioc/container';
import { TOKENS } from '../../../../ioc/tokens';
import type { IConfigReader } from '../../../../readers/config/interface';

export const command = 'page <path> [dir]';
export const aliases = ['p'];
export const desc = 'Generate new next.js page';

export const builder: CommandBuilder = async yargs => {
  const cfgReader = container.get<IConfigReader>(TOKENS.cfgReader);
  const baseCfg = await cfgReader.readConfig();
  const cfg = baseCfg?.commands.generateNextPage;
  return yargs
    .options({
      gsp: {
        type: 'boolean',
        desc: 'getStaticProps?',
        default: cfg?.gsp,
      },
      gsps: {
        type: 'boolean',
        desc: 'getStaticPaths?',
        default: cfg?.gsps,
      },
      gssp: {
        type: 'boolean',
        desc: 'getServerSideProps?',
        default: cfg?.gssp,
      },
      lang: {
        type: 'string',
        desc: 'Language. Detected automatically',
        choices: AVAILABLE_LANGS,
        default: cfg?.lang ?? baseCfg?.lang ?? undefined,
        alias: 'l',
      },
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
      cc: { type: 'boolean', desc: 'Class component?', default: cfg?.cc },
      fc: { type: 'boolean', desc: 'Functional component?', default: cfg?.fc },
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
      quite: {
        type: 'boolean',
        desc: 'Suppress output',
        alias: 'q',
      },
    })
    .positional('path', {
      type: 'string',
      demandOption: true,
      desc: 'Path to the page relative to next.js pages folder. Examples: article/[slug], index',
    })
    .positional('dir', {
      type: 'string',
      desc: 'Next.js pages folder(relative to the project source folder)',
      default: cfg?.dir ?? NEXT_DEFAULT_PAGES_FOLDER,
    });
};

export const handler = async (
  argv: Arguments<IGenerateNextPageOptions>
): Promise<void> => {
  const generator = container.get<INextPageGenerator>(TOKENS.nextPageGen);
  await generator.gen(argv);
};
