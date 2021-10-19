import { Options } from 'prettier';
import { CodeFormatterConfigReader as Reader } from '.';
import { createTempDir } from '../../../tests/fixtures/create-temp-dir';
import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import { DEFAULT_PRETTIER_CONFIG } from './constants';

describe('CodeFormatterConfigReader', () => {
  describe('read', () => {
    it('should read the config', async () => {
      const reader = new Reader();
      const [dir] = await createTempDir(true);
      const expectedConfig: Options = {
        tabWidth: 2,
      };
      await fs.writeJSON(path.join(dir, '.prettierrc.json'), expectedConfig);
      const config = await reader.read();
      expect(config).to.deep.eq(expectedConfig);
    });
    it('should return the default config if there is no user defined config', async () => {
      const reader = new Reader();
      await createTempDir(true);
      const config = await reader.read();
      expect(config).to.deep.eq(DEFAULT_PRETTIER_CONFIG);
    });
  });
});
