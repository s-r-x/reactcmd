import { inject, injectable } from 'inversify';
import { IEnvAnalyzer } from '../../analyzers/env/interface';
import { IStylingAnalyzer } from '../../analyzers/styling/interface';
import { TOKENS } from '../../ioc/tokens';
import { IGenerateComponentOptions as IOptions } from './interface';

@injectable()
export class ComponentGeneratorOptionsNormalizer {
  constructor(
    @inject(TOKENS.envAnalyzer) private envAnalyzer: IEnvAnalyzer,
    @inject(TOKENS.styleAnlz) private styleAnalyzer: IStylingAnalyzer
  ) {}
  async normalize(args: IOptions): Promise<IOptions> {
    const opts: IOptions = { ...args };
    if (!opts.style && !opts.nostyle) {
      opts.style = await this.styleAnalyzer.determineStylingStrategy();
    }
    if (!opts.js && !opts.ts) {
      const lang = await this.envAnalyzer.determineLang();
      opts.js = lang === 'js';
      opts.ts = lang === 'ts';
    }
    return opts;
  }
}
