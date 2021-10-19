import 'reflect-metadata';
import { expect } from 'chai';
import { createFsMock } from '../../../tests/fixtures/create-fs-mock';
import sinon from 'sinon';
import { Maybe } from '../../typings/utils';
import { NoRootDirError } from './errors';
import { EnvReader } from '.';

const createEnv = (closestPkgDirValue: Maybe<string>) => {
  const stub = sinon.stub().returns(closestPkgDirValue);
  const env = new EnvReader(
    createFsMock({
      findClosestPkgDir: stub,
    })
  );
  return { stub, env };
};
describe('EnvReader', () => {
  describe('getCliRootDir', () => {
    it('should return the cli root dir and cache the result on subsequent calls', () => {
      const { env, stub } = createEnv('/cli');
      const [root] = Array.from(new Array(3)).map(() => env.getCliRootDir());
      expect(stub).to.have.been.calledOnce;
      expect(stub).to.have.been.calledWith(__dirname);
      expect(root).to.eq('/cli');
    });
    it('should raise when cli root dir cannot be found', () => {
      const { env } = createEnv(null);
      expect(() => env.getCliRootDir()).to.throw(NoRootDirError);
    });
  });
  describe('getProjectRootDir', () => {
    it('should return the project root dir and cache the result on subsequent calls', () => {
      const { env, stub } = createEnv('/proj');
      const [root] = Array.from(new Array(3)).map(() =>
        env.getProjectRootDir()
      );
      expect(stub).to.have.been.calledOnce;
      expect(stub).to.have.been.calledWith(process.cwd());
      expect(root).to.eq('/proj');
    });
    it('should raise when project root dir cannot be found', () => {
      const { env } = createEnv(null);
      expect(() => env.getProjectRootDir()).to.throw(NoRootDirError);
    });
  });
});
