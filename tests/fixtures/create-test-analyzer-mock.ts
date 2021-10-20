import {
  DEFAULT_TEST_LIB,
  DEFAULT_TEST_RUNNER,
} from '../../lib/analyzers/testing/constants';
import { ITestingAnalyzer } from '../../lib/analyzers/testing/interface';

export const createTestAnalyzerMock = (
  args: Partial<ITestingAnalyzer> = {}
): ITestingAnalyzer => ({
  determineTestLib: () => Promise.resolve(DEFAULT_TEST_LIB),
  determineTestRunner: () => Promise.resolve(DEFAULT_TEST_RUNNER),
  ...args,
});
