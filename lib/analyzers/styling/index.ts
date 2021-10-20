import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import {
  DEFAULT_STYLING_STRATEGY,
  LIB_TO_STYLING_STRATEGY_MAP,
} from './constants';
import type { IStylingAnalyzer } from './interface';
import type { IDepsReader } from '../../readers/deps/interface';
import type { TStylingStrategy } from '../../typings/styling';
import type { Maybe } from '../../typings/utils';

// TODO:: css modules detector
@injectable()
export class StylingAnalyzer implements IStylingAnalyzer {
  constructor(@inject(TOKENS.depsReader) private depsReader: IDepsReader) {}
  async determineStylingStrategy(): Promise<TStylingStrategy> {
    const fromDeps = await this.determineStrategyByDeps();
    if (fromDeps) return fromDeps;
    return DEFAULT_STYLING_STRATEGY;
  }

  private async determineStrategyByDeps(): Promise<Maybe<TStylingStrategy>> {
    const deps = await this.depsReader.readAllDeps();
    for (const lib in LIB_TO_STYLING_STRATEGY_MAP) {
      if (lib in deps) {
        return LIB_TO_STYLING_STRATEGY_MAP[lib];
      }
    }
    return null;
  }
}
