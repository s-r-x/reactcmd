import { TTestLib, TTestRunner } from '../../typings/testing';

export const DEFAULT_TEST_RUNNER: TTestRunner = 'jest';
export const DEFAULT_TEST_LIB: TTestLib = 'rtl';

export const LIB_TO_TEST_RUNNER_MAP: Record<string, TTestRunner> = {
  jest: 'jest',
};
export const LIB_TO_TEST_LIB_MAP: Record<string, TTestLib> = {
  enzyme: 'enzyme',
  '@testing-library/react': 'rtl',
};
