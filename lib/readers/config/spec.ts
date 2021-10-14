import path from 'path/posix';
import { ConfigReader, CONFIG_NAME } from '.';
import { createEnvReaderMock } from '../../tests/fixtures/create-env-reader-mock';
import { createFsMock } from '../../tests/fixtures/create-fs-mock';
import sinon from 'sinon';
import { expect } from 'chai';
import { TCliConfigFile } from '../../typings/config';
import { IConfigReader } from './interface';
import { Maybe } from '../../typings/utils';

describe('ConfigReader', () => {
  describe('readConfig', () => {
    it('should read the cli config from the project root dir', async () => {
      const projDir = '/proj-dir';
      const config: TCliConfigFile = {
        srcDir: '/src',
      };
      const configPath = path.join(projDir, CONFIG_NAME);
      const env = createEnvReaderMock({
        getProjectRootDir: sinon.stub().returns(projDir),
      });
      const fs = createFsMock({
        readJSON: sinon.stub().returns(Promise.resolve(config)),
      });
      const reader = new ConfigReader(env, fs);
      expect(await reader.readConfig()).to.deep.eq(config);
      expect(env.getProjectRootDir).to.have.been.calledOnce;
      expect(fs.readJSON).to.have.been.calledWith(configPath);
    });
  });
  describe('getSrcDir', () => {
    it('should return srcDir from the cli config as it is if path is absolute', async () => {
      const config: TCliConfigFile = {
        srcDir: '/src',
      };
      const reader = new ConfigReader(createEnvReaderMock(), createFsMock());
      stubReadConfig(reader, config);
      const src = await reader.getSrcDir();
      expect(src).to.eq(config.srcDir);
    });
    it('should return srcDir from the cli config as it is if path is absolute', async () => {
      const root = '/root';
      const config: TCliConfigFile = {
        srcDir: './src',
      };
      const reader = new ConfigReader(
        createEnvReaderMock({
          getProjectRootDir: () => root,
        }),
        createFsMock()
      );
      stubReadConfig(reader, config);
      const src = await reader.getSrcDir();
      console.log(src);
      expect(src).to.eq(path.join(root, config.srcDir!));
    });
    it('should return null if there is no cli config', async () => {
      const reader = new ConfigReader(createEnvReaderMock(), createFsMock());
      stubReadConfig(reader, null);
      const src = await reader.getSrcDir();
      expect(src).to.be.null;
    });
  });
});

const stubReadConfig = (
  reader: IConfigReader,
  config: Maybe<TCliConfigFile>
) => {
  sinon.stub(reader, 'readConfig').returns(Promise.resolve(config));
};
