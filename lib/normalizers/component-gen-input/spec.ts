import { ComponentGenInputNormalizer as Nrmlz } from '.';
import { createEnvAnalyzerMock } from '../../../tests/fixtures/create-env-analyzer-mock';
import { createStyleAnalyzerMock } from '../../../tests/fixtures/create-style-analyzer-mock';
import type { IGenerateComponentOptions as IInput } from '../../generators/component/interface';
import { expect } from 'chai';
import path from 'path';
import { createTestAnalyzerMock } from '../../../tests/fixtures/create-test-analyzer-mock';
import type { IEnvAnalyzer } from '../../analyzers/env/interface';
import type { IStylingAnalyzer } from '../../analyzers/styling/interface';
import type { ITestingAnalyzer } from '../../analyzers/testing/interface';

const createDefaultMocks = (): [
  IEnvAnalyzer,
  IStylingAnalyzer,
  ITestingAnalyzer
] => [
  createEnvAnalyzerMock(),
  createStyleAnalyzerMock(),
  createTestAnalyzerMock(),
];
const createBaseInput = (flags: Partial<IInput> = {}): IInput => ({
  name: 'my-component',
  ...flags,
});
describe('ComponentGenInputNormalizer', () => {
  describe('normalizeDir', () => {
    const src = '/src';
    const components = '/src/components';
    it('should use components dir if there is one if no "dir" flag has been passed', async () => {
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock({
          determineSourceDir: () => Promise.resolve(src),
          determineComponentsDir: () => Promise.resolve(components),
        }),
        createStyleAnalyzerMock(),
        createTestAnalyzerMock()
      );
      const input: IInput = createBaseInput();
      await nrmlz.normalizeDir(input);
      expect(input.dir).to.eq(components);
    });
    it('should use source dir if there is no components dir and no "dir" flag has been passed', async () => {
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock({
          determineSourceDir: () => Promise.resolve(src),
        }),
        createStyleAnalyzerMock(),
        createTestAnalyzerMock()
      );
      const input: IInput = createBaseInput();
      await nrmlz.normalizeDir(input);
      expect(input.dir).to.eq(src);
    });
    it('should do not touch dir if dir is an absolute path', async () => {
      const nrmlz = new Nrmlz(...createDefaultMocks());
      const input: IInput = createBaseInput({
        dir: '/dir',
      });
      await nrmlz.normalizeDir(input);
      expect(input.dir).to.eq('/dir');
    });
    it('should concat dir with cwd if it starts with "."', async () => {
      const nrmlz = new Nrmlz(...createDefaultMocks());
      const dir = './lib/my-dir';
      const input: IInput = createBaseInput({
        dir,
      });
      await nrmlz.normalizeDir(input);
      expect(input.dir).to.eq(path.join(process.cwd(), dir));
    });
    it('should concat dir and the source dir otherwise', async () => {
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock({
          determineSourceDir: () => Promise.resolve(src),
        }),
        createStyleAnalyzerMock(),
        createTestAnalyzerMock()
      );
      const dir = 'lib/my-dir';
      const input: IInput = createBaseInput({
        dir,
      });
      await nrmlz.normalizeDir(input);
      expect(input.dir).to.eq(path.join(src, dir));
    });
  });
  describe('normalizeComponentName', () => {
    it('should convert component name to pascal case', () => {
      const nrmlz = new Nrmlz(...createDefaultMocks());
      const input = createBaseInput();
      nrmlz.normalizeComponentName(input);
      expect(input.name).to.eq('MyComponent');
    });
  });
  describe('normalizeStyle', () => {
    it('should guess the styling strategy if no "style" and no "ugly" flags have been passed', async () => {
      const strategy: any = 'my-strategy';
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock(),
        createStyleAnalyzerMock({
          determineStylingStrategy: () => Promise.resolve(strategy),
        }),
        createTestAnalyzerMock()
      );
      const input = createBaseInput();
      await nrmlz.normalizeStyle(input);
      expect(input.style).to.eq(strategy);
    });
    it('should reset style input if "ugly" flag has been passed', async () => {
      const nrmlz = new Nrmlz(...createDefaultMocks());
      {
        const input = createBaseInput({
          style: 'less',
          ugly: true,
        });
        await nrmlz.normalizeStyle(input);
        expect(input.style).to.be.undefined;
      }
      {
        const input = createBaseInput({
          ugly: true,
        });
        await nrmlz.normalizeStyle(input);
        expect(input.style).to.be.undefined;
      }
    });
  });
  describe('normalizeLang', () => {
    it('should guess the language if no js or ts flags have been passed', async () => {
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock({
          determineLang: () => Promise.resolve('ts'),
        }),
        createStyleAnalyzerMock(),
        createTestAnalyzerMock()
      );
      const input = createBaseInput();
      await nrmlz.normalizeLang(input);
      expect(input.lang).to.eq('ts');
    });
    it('should not touch the input otherwise', async () => {
      const nrmlz = new Nrmlz(...createDefaultMocks());
      const input = createBaseInput({
        lang: 'js',
      });
      await nrmlz.normalizeLang(input);
      expect(input.lang).to.eq('js');
    });
  });
});
