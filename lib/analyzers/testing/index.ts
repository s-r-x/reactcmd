import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import { IDepsReader } from '../../readers/deps/interface';
import { TTestLib, TTestRunner } from '../../typings/testing';
import {
  DEFAULT_TEST_LIB,
  DEFAULT_TEST_RUNNER,
  LIB_TO_TEST_LIB_MAP,
  LIB_TO_TEST_RUNNER_MAP,
} from './constants';
import { ITestingAnalyzer } from './interface';

@injectable()
export class TestingAnalyzer implements ITestingAnalyzer {
  constructor(@inject(TOKENS.depsReader) private depsReader: IDepsReader) {}
  async determineTestLib(): Promise<TTestLib> {
    const deps = await this.depsReader.readAllDeps();
    for (const lib in LIB_TO_TEST_LIB_MAP) {
      if (lib in deps) {
        return LIB_TO_TEST_LIB_MAP[lib];
      }
    }
    return DEFAULT_TEST_LIB;
  }
  async determineTestRunner(): Promise<TTestRunner> {
    const deps = await this.depsReader.readAllDeps();
    for (const lib in LIB_TO_TEST_RUNNER_MAP) {
      if (lib in deps) {
        return LIB_TO_TEST_RUNNER_MAP[lib];
      }
    }
    return DEFAULT_TEST_RUNNER;
  }
}
