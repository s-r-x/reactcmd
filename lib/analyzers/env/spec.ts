import { expect } from 'chai';
import path from 'path';
import { EnvAnalyzer as Analyzer } from '.';
import { createCfgReaderMock } from '../../../tests/fixtures/create-cfg-reader-mock';
import { createEnvReaderMock } from '../../../tests/fixtures/create-env-reader-mock';
import { createFsMock } from '../../../tests/fixtures/create-fs-mock';
import { POSSIBLE_SRC_FOLDERS } from './constants';

describe('EnvAnalyzer', () => {
  describe('determineLang', () => {
    it('should determine typescript if there is tsconfig.json file in the root folder', async () => {
      const analyzer = new Analyzer(
        createEnvReaderMock(),
        createFsMock({
          readDir: () => Promise.resolve(new Set(['tsconfig.json'])),
        }),
        createCfgReaderMock()
      );
      const lang = await analyzer.determineLang();
      expect(lang).to.eq('ts');
    });
    it('should determine typescript if there are any files that starts with tsconfig in the root folder', async () => {
      const analyzer = new Analyzer(
        createEnvReaderMock(),
        createFsMock({
          readDir: () => Promise.resolve(new Set(['tsconfig.build.json'])),
        }),
        createCfgReaderMock()
      );
      const lang = await analyzer.determineLang();
      expect(lang).to.eq('ts');
    });
    it('should determine javascript otherwise', async () => {
      const analyzer = new Analyzer(
        createEnvReaderMock(),
        createFsMock(),
        createCfgReaderMock()
      );
      const lang = await analyzer.determineLang();
      expect(lang).to.eq('js');
    });
  });
  describe('determineSourceDir', () => {
    it('should return src folder from cli config, if there is one', async () => {
      const mockSrc = '/folder';
      const analyzer = new Analyzer(
        createEnvReaderMock(),
        createFsMock(),
        createCfgReaderMock({
          getSrcDir: () => Promise.resolve(mockSrc),
        })
      );
      const src = await analyzer.determineSourceDir();
      expect(src).to.eq(mockSrc);
    });
    POSSIBLE_SRC_FOLDERS.forEach(folder => {
      const root = '/some-project-root';
      const expected = path.join(root, folder);
      it(`should return ${expected}, if one exists, and there is no src folder in cli config`, async () => {
        const analyzer = new Analyzer(
          createEnvReaderMock({
            getProjectRootDir: () => root,
          }),
          createFsMock({
            readDir: () => Promise.resolve(new Set([folder])),
          }),
          createCfgReaderMock()
        );
        const src = await analyzer.determineSourceDir();
        expect(src).to.eq(expected);
      });
    });
    it('should return project root folder otherwise', async () => {
      const root = '/root';
      const analyzer = new Analyzer(
        createEnvReaderMock({
          getProjectRootDir: () => root,
        }),
        createFsMock(),
        createCfgReaderMock()
      );
      const src = await analyzer.determineSourceDir();
      expect(src).to.eq(root);
    });
  });
});
