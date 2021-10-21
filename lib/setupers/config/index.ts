import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import { CFG_CMD_SETUPERS_SELECT_LIST } from './constants';
import type { IEnvAnalyzer } from '../../analyzers/env/interface';
import type { IConfigReader } from '../../readers/config/interface';
import type { TLang } from '../../typings';
import type { TCliConfigFile } from '../../typings/config';
import type { IUi } from '../../ui/interface';
import type {
  ICfgSetuper,
  TCfgCmdSetuperFactory,
  TCfgCmdSetuperName,
} from './interface';
import util from 'util';

@injectable()
export class ConfigSetuper implements ICfgSetuper {
  constructor(
    @inject(TOKENS.ui) private ui: IUi,
    @inject(TOKENS.envAnalyzer) private envAnalyzer: IEnvAnalyzer,
    @inject(TOKENS.cfgCmdSetuperFctry)
    private cfgCmdSetuperFactory: TCfgCmdSetuperFactory,
    @inject(TOKENS.cfgReader) private cfgReader: IConfigReader
  ) {}
  private config: TCliConfigFile = { commands: {} };
  async setup(): Promise<void> {
    await this.readInitialConfig();
    const cmdSetuper = this.cfgCmdSetuperFactory(
      await this.selectCommandToSetup()
    );
    await this.maybeSelectLanguage();
    await this.maybeSelectSrcDir();
    await cmdSetuper.setup(this.config);
    console.log(util.inspect(this.config, { depth: 10 }));
  }
  private async readInitialConfig() {
    const cfg = await this.cfgReader.readConfig();
    if (cfg) {
      this.config = cfg;
    }
  }
  private async selectCommandToSetup(): Promise<TCfgCmdSetuperName> {
    return await this.ui.select<TCfgCmdSetuperName>({
      message: 'Select command to setup:',
      options: CFG_CMD_SETUPERS_SELECT_LIST,
    });
  }
  private async maybeSelectSrcDir() {
    if (this.config.srcDir) return;
    const initial = await this.envAnalyzer.determineSourceDir();
    this.config.srcDir = await this.ui.textInput({
      trim: true,
      message:
        'Source folder (absolute or relative to the project root folder):',
      initial,
    });
  }
  private async maybeSelectLanguage() {
    if (this.config.lang) return;
    const initial = await this.envAnalyzer.determineLang();
    this.config.lang = await this.ui.select<TLang>({
      message: 'Language:',
      options: [{ value: 'ts' }, { value: 'js' }],
      initial,
    });
  }
}
