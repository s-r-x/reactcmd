import { ConfigWriter as Writer } from '.';
import { createCfgReaderMock } from '../../../tests/fixtures/create-cfg-reader-mock';
import { createEnvReaderMock } from '../../../tests/fixtures/create-env-reader-mock';
import { createFileWriterMock } from '../../../tests/fixtures/create-file-writer-mock';
import { createPkgJsonWriterMock } from '../../../tests/fixtures/create-pkg-json-writer-mock';
import type { TCliConfigFile } from '../../typings/config';
import sinon from 'sinon';
import path from 'path';
import { expect } from 'chai';
import { CONFIG_NAME, DEFAULT_CONFIG_FILE } from '../../constants/config';

describe('ConfigWriter', () => {
  describe('write', () => {
    it('should write the config if there is no old config', async () => {
      const rootDir = '/root';
      const fileWriterMock = createFileWriterMock();
      const writer = new Writer(
        fileWriterMock,
        createCfgReaderMock(),
        createEnvReaderMock({
          getProjectRootDir: () => rootDir,
        }),
        createPkgJsonWriterMock()
      );
      const writeFileSpy = sinon.spy(fileWriterMock, 'write');
      const cfg: TCliConfigFile = {
        srcDir: 'dir',
        commands: {},
      };
      await writer.write(cfg);
      expect(writeFileSpy).to.have.been.calledWith({
        path: path.join(rootDir, DEFAULT_CONFIG_FILE),
        content: cfg,
      });
    });
    it('should write the config and merge it with old config if there is one', async () => {
      const rootDir = '/root';
      const configPath = path.join(rootDir, '.cfgpathrc');
      const oldCfg: TCliConfigFile = {
        commands: {
          generateComponent: {
            fc: true,
          },
        },
      };
      const cfg: TCliConfigFile = {
        srcDir: 'dir',
        commands: {
          generateComponent: {
            mobx: true,
          },
        },
      };
      const fileWriterMock = createFileWriterMock();
      const writer = new Writer(
        fileWriterMock,
        createCfgReaderMock({
          readConfig: () => Promise.resolve(oldCfg),
          getConfigPath: () => Promise.resolve(configPath),
        }),
        createEnvReaderMock({
          getProjectRootDir: () => rootDir,
        }),
        createPkgJsonWriterMock()
      );
      const writeFileSpy = sinon.spy(fileWriterMock, 'write');
      await writer.write(cfg);
      expect(writeFileSpy).to.have.been.calledWith({
        path: configPath,
        content: {
          srcDir: cfg.srcDir,
          commands: {
            generateComponent: {
              mobx: true,
              fc: true,
            },
          },
        },
      });
    });
    it('should write the config and merge it with old config if there is one and it is inside package.json', async () => {
      const rootDir = '/root';
      const configPath = path.join(rootDir, 'package.json');
      const oldCfg: TCliConfigFile = {
        commands: {
          generateComponent: {
            fc: true,
          },
        },
      };
      const cfg: TCliConfigFile = {
        srcDir: 'dir',
        commands: {
          generateComponent: {
            mobx: true,
          },
        },
      };
      const pkgJsonWriterMock = createPkgJsonWriterMock();
      const writer = new Writer(
        createFileWriterMock(),
        createCfgReaderMock({
          readConfig: () => Promise.resolve(oldCfg),
          getConfigPath: () => Promise.resolve(configPath),
        }),
        createEnvReaderMock({
          getProjectRootDir: () => rootDir,
        }),
        pkgJsonWriterMock
      );
      const writePkgFieldSpy = sinon.spy(pkgJsonWriterMock, 'writeField');
      await writer.write(cfg);
      expect(writePkgFieldSpy).to.have.been.calledWith(CONFIG_NAME, {
        srcDir: cfg.srcDir,
        commands: {
          generateComponent: {
            mobx: true,
            fc: true,
          },
        },
      });
    });
  });
});
