import { expect } from 'chai';
import { FileSystem } from '.';
import { createTempDir } from '../tests/fixtures/create-temp-dir';
import systemFs from 'fs-extra';
import path from 'path';

describe('FileSystem', () => {
  describe('readFile', () => {
    it('should read file', async () => {
      const fs = new FileSystem();
      const [dir] = await createTempDir(true);

      const name = path.join(dir, 'file.txt');
      const content = 'content';
      await systemFs.outputFile(name, content);
      expect(await fs.readFile(name)).to.eq(content);
    });
    it('should return null if file does not exist', async () => {
      const fs = new FileSystem();
      const [dir] = await createTempDir(true);

      const name = path.join(dir, 'file.txt');
      expect(await fs.readFile(name)).to.be.null;
    });
  });
  describe('readJSON', () => {
    it('should read json', async () => {
      const fs = new FileSystem();
      const [dir] = await createTempDir(true);

      const name = path.join(dir, 'file.json');
      const json = { 1: 2 };
      await systemFs.outputJSON(name, json);
      expect(await fs.readJSON(name)).to.deep.eq(json);
    });
    it('should return null if json does not exist', async () => {
      const fs = new FileSystem();
      const [dir] = await createTempDir(true);

      const name = path.join(dir, 'file.json');
      expect(await fs.readJSON(name)).to.be.null;
    });
  });
  describe('findClosestPkgDir', () => {
    it('should find the closest directory with package.json', async () => {
      const fs = new FileSystem();
      const [tempDir] = await createTempDir(true);
      const jsonDir = path.join(tempDir, 'nested');
      const dir = path.join(jsonDir, 'dir');
      await systemFs.ensureDir(dir);
      await systemFs.outputJSON(path.join(jsonDir, 'package.json'), {});
      process.chdir(dir);
      expect(fs.findClosestPkgDir(process.cwd())).to.eq(jsonDir);

      process.chdir(jsonDir);
      expect(fs.findClosestPkgDir(process.cwd())).to.eq(jsonDir);
    });
    it('should return null if the closest directory with package.json cannot be found', async () => {
      const fs = new FileSystem();
      const [tempDir] = await createTempDir(true);
      process.chdir(tempDir);
      expect(fs.findClosestPkgDir(process.cwd())).to.be.null;
    });
  });
});
