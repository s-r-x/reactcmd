import path from 'path/posix';
import { ConfigReader } from '.';
import { createEnvReaderMock } from '../../../tests/fixtures/create-env-reader-mock';
import sinon from 'sinon';
import { expect } from 'chai';
import type { TCliConfigFile } from '../../typings/config';
import type { IConfigReader } from './interface';
import type { Maybe } from '../../typings/utils';
import { createTempDir } from '../../../tests/fixtures/create-temp-dir';
import fs from 'fs-extra';
import { CONFIG_NAME } from '../../constants/config';

const stubReadConfig = (
  reader: IConfigReader,
  config: Maybe<TCliConfigFile>
) => {
  sinon.stub(reader, 'readConfig').returns(Promise.resolve(config));
};

describe('ConfigReader', () => {
  describe('readConfig', () => {
    [`.${CONFIG_NAME}rc`, `.${CONFIG_NAME}rc.json`].forEach(baseName => {
      it(`should read the cli config from ${baseName}`, async () => {
        const config: TCliConfigFile = {
          srcDir: '/src',
          commands: {},
        };
        const [dir] = await createTempDir();
        const configPath = path.join(dir, baseName);
        await fs.outputJSON(configPath, config);
        const env = createEnvReaderMock({
          getProjectRootDir: sinon.stub().returns(dir),
        });
        const reader = new ConfigReader(env);
        expect(await reader.readConfig()).to.deep.eq(config);
      });
    });
    it('should read the cli config from the package.json in project root dir', async () => {
      const config: TCliConfigFile = {
        srcDir: '/src',
        commands: {},
      };
      const [dir] = await createTempDir();
      const pkg = {
        [CONFIG_NAME]: config,
      };
      const configPath = path.join(dir, 'package.json');
      await fs.outputJSON(configPath, pkg);
      const env = createEnvReaderMock({
        getProjectRootDir: sinon.stub().returns(dir),
      });
      const reader = new ConfigReader(env);
      expect(await reader.readConfig()).to.deep.eq(config);
    });
    it('should return null if there is no config', async () => {
      const [dir] = await createTempDir();
      const env = createEnvReaderMock({
        getProjectRootDir: sinon.stub().returns(dir),
      });
      const reader = new ConfigReader(env);
      expect(await reader.readConfig()).to.be.null;
    });
  });
  describe('getConfigPath', () => {
    it('should return filepath of the cli config', async () => {
      const config: TCliConfigFile = { commands: {} };
      const [dir] = await createTempDir();
      const configPath = path.join(dir, `.${CONFIG_NAME}rc`);
      await fs.outputJSON(configPath, config);
      const env = createEnvReaderMock({
        getProjectRootDir: sinon.stub().returns(dir),
      });
      const reader = new ConfigReader(env);
      expect(configPath).to.eq(await reader.getConfigPath());
    });
    it('should return filepath of the cli config from the package.json', async () => {
      const config: TCliConfigFile = { commands: {} };
      const [dir] = await createTempDir();
      const pkg = { [CONFIG_NAME]: config };
      const configPath = path.join(dir, 'package.json');
      await fs.outputJSON(configPath, pkg);
      const env = createEnvReaderMock({
        getProjectRootDir: sinon.stub().returns(dir),
      });
      const reader = new ConfigReader(env);
      expect(await reader.readConfig()).to.deep.eq(config);
    });
  });
  describe('getSrcDir', () => {
    it('should return srcDir from the cli config as it is if path is absolute', async () => {
      const config: TCliConfigFile = {
        srcDir: '/src',
        commands: {},
      };
      const reader = new ConfigReader(createEnvReaderMock());
      stubReadConfig(reader, config);
      const src = await reader.getSrcDir();
      expect(src).to.eq(config.srcDir);
    });
    it('should return absolute srcDir from the cli config if path is relative', async () => {
      const root = '/root';
      const config: TCliConfigFile = {
        srcDir: './src',
        commands: {},
      };
      const reader = new ConfigReader(
        createEnvReaderMock({
          getProjectRootDir: () => root,
        })
      );
      stubReadConfig(reader, config);
      const src = await reader.getSrcDir();
      expect(src).to.eq(path.join(root, config.srcDir!));
    });
    it('should return null if there is no cli config', async () => {
      const reader = new ConfigReader(createEnvReaderMock());
      stubReadConfig(reader, null);
      const src = await reader.getSrcDir();
      expect(src).to.be.null;
    });
  });
});
