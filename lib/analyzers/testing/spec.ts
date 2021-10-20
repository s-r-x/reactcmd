import { expect } from 'chai';
import { TestingAnalyzer as Anlz } from '.';
import { createDepsReaderMock } from '../../../tests/fixtures/create-deps-reader-mock';
import {
  DEFAULT_TEST_LIB,
  DEFAULT_TEST_RUNNER,
  LIB_TO_TEST_LIB_MAP,
  LIB_TO_TEST_RUNNER_MAP,
} from './constants';

describe('TestingAnalyzer', () => {
  describe('determineTestLib', () => {
    describe('should return correct test library based on pkg deps', () => {
      for (const lib in LIB_TO_TEST_LIB_MAP) {
        const expected = LIB_TO_TEST_LIB_MAP[lib];
        it(`should return ${expected} with "${lib}" dep`, async () => {
          const depsReader = createDepsReaderMock({
            readAllDeps: () =>
              Promise.resolve({
                [lib]: '',
              }),
          });
          const analyzer = new Anlz(depsReader);
          expect(await analyzer.determineTestLib()).to.eq(expected);
        });
      }
    });
    it(`should return ${DEFAULT_TEST_LIB} when there are no supported libs in pkg deps`, async () => {
      const depsReader = createDepsReaderMock({
        readAllDeps: () => Promise.resolve({ unsupported: '' }),
      });
      const analyzer = new Anlz(depsReader);
      expect(await analyzer.determineTestLib()).to.eq(DEFAULT_TEST_LIB);
    });
  });
  describe('determineTestRunner', () => {
    describe('should return correct test runner based on pkg deps', () => {
      for (const lib in LIB_TO_TEST_RUNNER_MAP) {
        const expected = LIB_TO_TEST_RUNNER_MAP[lib];
        it(`should return ${expected} with "${lib}" dep`, async () => {
          const depsReader = createDepsReaderMock({
            readAllDeps: () =>
              Promise.resolve({
                [lib]: '',
              }),
          });
          const analyzer = new Anlz(depsReader);
          expect(await analyzer.determineTestRunner()).to.eq(expected);
        });
      }
    });
    it(`should return ${DEFAULT_TEST_RUNNER} when there are no supported libs in pkg deps`, async () => {
      const depsReader = createDepsReaderMock({
        readAllDeps: () => Promise.resolve({ unsupported: '' }),
      });
      const analyzer = new Anlz(depsReader);
      expect(await analyzer.determineTestRunner()).to.eq(DEFAULT_TEST_RUNNER);
    });
  });
});
