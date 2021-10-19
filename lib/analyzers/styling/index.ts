import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import {
  DEFAULT_STYLING_STRATEGY,
  LIB_TO_STYLING_STRATEGY_MAP,
} from './constants';
import type { IStylingAnalyzer } from './interface';
import type { IDepsReader } from '../../readers/deps/interface';
import type { TPkgDeps } from '../../typings/pkg';
import type { TStylingStrategy } from '../../typings/styling';

// TODO:: css modules detector
@injectable()
export class StylingAnalyzer implements IStylingAnalyzer {
  constructor(@inject(TOKENS.depsReader) private depsReader: IDepsReader) {}
  async determineStylingStrategy(): Promise<TStylingStrategy> {
    const deps = await this.depsReader.readAllDepsAndMerge();
    return this.determineStrategyByPkg(deps);
  }

  private determineStrategyByPkg(deps: TPkgDeps): TStylingStrategy {
    for (const lib in LIB_TO_STYLING_STRATEGY_MAP) {
      if (lib in deps) {
        return LIB_TO_STYLING_STRATEGY_MAP[lib];
      }
    }
    return DEFAULT_STYLING_STRATEGY;
  }
}
