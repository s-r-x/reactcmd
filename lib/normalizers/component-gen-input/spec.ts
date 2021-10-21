import { ComponentGenInputNormalizer as Nrmlz } from '.';
import { createEnvAnalyzerMock } from '../../../tests/fixtures/create-env-analyzer-mock';
import { createStyleAnalyzerMock } from '../../../tests/fixtures/create-style-analyzer-mock';
import type { IGenerateComponentOptions as IInput } from '../../generators/component/interface';
import { expect } from 'chai';
import path from 'path';
import { createCfgReaderMock } from '../../../tests/fixtures/create-cfg-reader-mock';
import type { TCliConfigFile } from '../../typings/config';
import { createTestAnalyzerMock } from '../../../tests/fixtures/create-test-analyzer-mock';

const createBaseInput = (flags: Partial<IInput> = {}): IInput => ({
  name: 'my-component',
  ...flags,
});
describe('ComponentGenInputNormalizer', () => {
  describe('merge with config', () => {
    it('should merge input  with user defined config', async () => {
      const config: TCliConfigFile = {
        commands: {
          generateComponent: {
            dir: 'dir',
            redux: true,
          },
        },
      };
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock(),
        createStyleAnalyzerMock(),
        createCfgReaderMock({
          readConfig: () => Promise.resolve(config),
        }),
        createTestAnalyzerMock()
      );
      const input: IInput = {
        name: 'name',
        dir: 'my-dir',
      };
      const newInput = await nrmlz.mergeWithConfig(input);
      expect(newInput.dir).to.eq(input.dir);
      expect(newInput.name).to.eq(input.name);
      expect(newInput.redux).to.eq(config.commands!.generateComponent!.redux);
    });
    it('should return input  as it is if there is no config', async () => {
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock(),
        createStyleAnalyzerMock(),
        createCfgReaderMock({
          readConfig: () => Promise.resolve(null),
        }),
        createTestAnalyzerMock()
      );
      const input: IInput = {
        name: 'name',
        dir: 'my-dir',
      };
      const newInput = await nrmlz.mergeWithConfig(input);
      expect(newInput).to.deep.eq(input);
    });
  });
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
        createCfgReaderMock(),
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
        createCfgReaderMock(),
        createTestAnalyzerMock()
      );
      const input: IInput = createBaseInput();
      await nrmlz.normalizeDir(input);
      expect(input.dir).to.eq(src);
    });
    it('should do not touch dir if dir is an absolute path', async () => {
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock(),
        createStyleAnalyzerMock(),
        createCfgReaderMock(),
        createTestAnalyzerMock()
      );
      const input: IInput = createBaseInput({
        dir: '/dir',
      });
      await nrmlz.normalizeDir(input);
      expect(input.dir).to.eq('/dir');
    });
    it('should concat dir with cwd if it starts with "."', async () => {
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock(),
        createStyleAnalyzerMock(),
        createCfgReaderMock(),
        createTestAnalyzerMock()
      );
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
        createCfgReaderMock(),
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
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock(),
        createStyleAnalyzerMock(),
        createCfgReaderMock(),
        createTestAnalyzerMock()
      );
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
        createCfgReaderMock(),
        createTestAnalyzerMock()
      );
      const input = createBaseInput();
      await nrmlz.normalizeStyle(input);
      expect(input.style).to.eq(strategy);
    });
    it('should reset style input if "ugly" flag has been passed', async () => {
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock(),
        createStyleAnalyzerMock(),
        createCfgReaderMock(),
        createTestAnalyzerMock()
      );
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
        createCfgReaderMock(),
        createTestAnalyzerMock()
      );
      const input = createBaseInput();
      await nrmlz.normalizeLang(input);
      expect(input.lang).to.eq('ts');
    });
    it('should not touch the input otherwise', async () => {
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock(),
        createStyleAnalyzerMock(),
        createCfgReaderMock(),
        createTestAnalyzerMock()
      );
      const input = createBaseInput({
        lang: 'js',
      });
      await nrmlz.normalizeLang(input);
      expect(input.lang).to.eq('js');
    });
  });
});
