import { TTestLib, TTestRunner } from '../../typings/testing';

export interface ITestingAnalyzer {
  determineTestLib: () => Promise<TTestLib>;
  determineTestRunner: () => Promise<TTestRunner>;
}
