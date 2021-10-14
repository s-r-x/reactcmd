import { ComponentGenInputNormalizer as Nrmlz } from '.';
import { createEnvAnalyzerMock } from '../../tests/fixtures/create-env-analyzer-mock';
import { createStyleAnalyzerMock } from '../../tests/fixtures/create-style-analyzer-mock';
import { IGenerateComponentOptions as IInput } from '../../generators/component/interface';
import { expect } from 'chai';

describe.only('ComponentGenInputNormalizer', () => {
  describe.skip('normalizeDir', () => {
    // TODO
  });
  describe('normalizeComponentName', () => {
    it('should convert component name to pascal case', () => {
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock(),
        createStyleAnalyzerMock()
      );
      const input: IInput = {
        name: 'my-component',
      };
      nrmlz.normalizeComponentName(input);
      expect(input.name).to.eq('MyComponent');
    });
  });
  describe('normalizeStyle', () => {
    it('should guess the styling strategy if no "style" and no "nostyle" flags have been passed', async () => {
      const strategy: any = 'my-strategy';
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock(),
        createStyleAnalyzerMock({
          determineStylingStrategy: () => Promise.resolve(strategy),
        })
      );
      const input: IInput = {
        name: 'name',
      };
      await nrmlz.normalizeStyle(input);
      expect(input.style).to.eq(strategy);
    });
    it('should reset style input if "nostyle" flag has been passed', async () => {
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock(),
        createStyleAnalyzerMock()
      );
      {
        const input: IInput = {
          name: 'name',
          style: 'less',
          nostyle: true,
        };
        await nrmlz.normalizeStyle(input);
        expect(input.style).to.be.undefined;
      }
      {
        const input: IInput = {
          name: 'name',
          nostyle: true,
        };
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
        createStyleAnalyzerMock()
      );
      const input: IInput = {
        name: 'name',
      };
      await nrmlz.normalizeLang(input);
      expect(input.js).to.be.false;
      expect(input.ts).to.be.true;
    });
    it('should not touch the input otherwise', async () => {
      const nrmlz = new Nrmlz(
        createEnvAnalyzerMock(),
        createStyleAnalyzerMock()
      );
      const input: IInput = {
        name: 'name',
        js: true,
        ts: true,
      };
      await nrmlz.normalizeLang(input);
      expect(input.js).to.be.true;
      expect(input.ts).to.be.true;
    });
  });
});
