import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';
import { IDepsReader } from '../../readers/deps/interface';
import { TPkgDeps } from '../../typings/pkg';
import { TStylingStrategy } from '../../typings/styling';
import {
  DEFAULT_STYLING_STRATEGY,
  LIB_TO_STYLING_STRATEGY_MAP,
} from './constants';
import { IStylingAnalyzer } from './interface';

// TODO:: css modules
@injectable()
export class StylingAnalyzer implements IStylingAnalyzer {
  constructor(@inject(TYPES.depsReader) private depsReader: IDepsReader) {}
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
