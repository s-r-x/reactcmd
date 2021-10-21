import { injectable, inject } from 'inversify';
import type {
  TCliConfigCmdName,
  TCliConfigFile as TConfig,
  TCliConfigCommands as TCommands,
} from '../../../typings/config';
import type { IEnvAnalyzer } from '../../../analyzers/env/interface';
import type { IStylingAnalyzer } from '../../../analyzers/styling/interface';
import type { ITestingAnalyzer } from '../../../analyzers/testing/interface';
import { TOKENS } from '../../../ioc/tokens';
import type { IUi } from '../../../ui/interface';
import type { ICfgCmdSetuper } from '../interface';
import _ from 'lodash';

@injectable()
export abstract class CfgCmdSetuper<T extends TCliConfigCmdName>
  implements ICfgCmdSetuper
{
  protected abstract cmdName: T;
  constructor(
    @inject(TOKENS.ui) protected ui: IUi,
    @inject(TOKENS.styleAnlz) protected styleAnalyzer: IStylingAnalyzer,
    @inject(TOKENS.envAnalyzer) protected envAnalyzer: IEnvAnalyzer,
    @inject(TOKENS.testAnlz) protected testAnalyzer: ITestingAnalyzer
  ) {}
  async setup(cfg: TConfig): Promise<void> {
    this.normalizeIncomingConfig(cfg);
    await this.setupCommand(cfg);
  }
  protected abstract setupCommand(cfg: TConfig): Promise<void>;
  protected normalizeIncomingConfig(cfg: TConfig) {
    if (!cfg.commands[this.cmdName]) {
      cfg.commands[this.cmdName] = {};
    }
  }
  protected setField<TK extends keyof NonNullable<TCommands[T]>>(
    cfg: TConfig,
    key: TK,
    value: NonNullable<TCommands[T]>[TK]
  ) {
    cfg.commands[this.cmdName]![key] = value;
  }
  protected getField<TK extends keyof NonNullable<TCommands[T]>>(
    cfg: TConfig,
    key: TK
  ) {
    return cfg.commands[this.cmdName]![key];
  }
}
