import { injectable, inject } from 'inversify';
import type { TCliConfigFile as TConfig } from '../../../typings/config';
import type { IEnvAnalyzer } from '../../../analyzers/env/interface';
import type { IStylingAnalyzer } from '../../../analyzers/styling/interface';
import type { ITestingAnalyzer } from '../../../analyzers/testing/interface';
import { TOKENS } from '../../../ioc/tokens';
import type { IUi } from '../../../ui/interface';
import type { ICfgCmdSetuper } from '../interface';

@injectable()
export abstract class CfgCmdSetuper implements ICfgCmdSetuper {
  constructor(
    @inject(TOKENS.ui) protected ui: IUi,
    @inject(TOKENS.styleAnlz) protected styleAnalyzer: IStylingAnalyzer,
    @inject(TOKENS.envAnalyzer) protected envAnalyzer: IEnvAnalyzer,
    @inject(TOKENS.testAnlz) protected testAnalyzer: ITestingAnalyzer
  ) {}
  abstract setup(config: TConfig): Promise<TConfig>;
}
