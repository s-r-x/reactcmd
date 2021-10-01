import path from 'path/posix';
import { ConfigReader, CONFIG_NAME } from '.';
import { createEnvReaderMock } from '../../tests/fixtures/create-env-reader-mock';
import { createFsMock } from '../../tests/fixtures/create-fs-mock';
import sinon from 'sinon';
import { expect } from 'chai';

describe('ConfigReader', () => {
  describe('readConfig', () => {
    it('should read the cli config from the project root dir', async () => {
      const projDir = '/proj-dir';
      const config = {
        key: 'value',
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
});
