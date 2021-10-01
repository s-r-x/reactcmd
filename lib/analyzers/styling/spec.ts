import { createDepsReaderMock } from '../../tests/fixtures/create-deps-reader-mock';
import { StylingAnalyzer } from '.';
import { expect } from 'chai';
import {
  DEFAULT_STYLING_STRATEGY,
  LIB_TO_STYLING_STRATEGY_MAP,
} from './constants';

describe('StylingAnalyzer', () => {
  describe('determineStylingStrategy', () => {
    describe('should return correct styling strategy based on pkg deps', () => {
      for (const lib in LIB_TO_STYLING_STRATEGY_MAP) {
        const expected = LIB_TO_STYLING_STRATEGY_MAP[lib];
        it(`should return ${expected} with "${lib}" dep`, async () => {
          const depsReader = createDepsReaderMock({
            readAllDepsAndMerge: () =>
              Promise.resolve({
                [lib]: '',
              }),
          });
          const analyzer = new StylingAnalyzer(depsReader);
          const strategy = await analyzer.determineStylingStrategy();
          const expected = LIB_TO_STYLING_STRATEGY_MAP[lib];
          expect(strategy).to.eq(expected);
        });
      }
    });
    it(`should return ${DEFAULT_STYLING_STRATEGY} styling strategy when there are no supported libs in pkg deps`, async () => {
      const depsReader = createDepsReaderMock({
        readAllDepsAndMerge: () =>
          Promise.resolve({
            'unsupported-styling-lib': '',
          }),
      });
      const analyzer = new StylingAnalyzer(depsReader);
      const strategy = await analyzer.determineStylingStrategy();
      expect(strategy).to.eq(DEFAULT_STYLING_STRATEGY);
    });
  });
});
