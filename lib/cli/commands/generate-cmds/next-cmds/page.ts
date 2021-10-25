import type { Arguments, CommandBuilder } from 'yargs';
import { AVAILABLE_LANGS } from '../../../../constants/lang';
import type {
  IGenerateNextPageOptions,
  INextPageGenerator,
} from '../../../../generators/next-page/interface';
import container from '../../../../ioc/container';
import { TOKENS } from '../../../../ioc/tokens';
import { IConfigReader } from '../../../../readers/config/interface';

export const command = 'page <name> [dir]';
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

export const handler = async (
  argv: Arguments<IGenerateNextPageOptions>
): Promise<void> => {
  const generator = container.get<INextPageGenerator>(TOKENS.nextPageGen);
  await generator.gen(argv);
};
