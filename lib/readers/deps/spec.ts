import { expect } from 'chai';
import { createEnvReaderMock } from '../../tests/fixtures/create-env-reader-mock';
import { createFsMock } from '../../tests/fixtures/create-fs-mock';
import sinon from 'sinon';
import path from 'path';
import { TPkg } from '../../typings/pkg';
import { DepsReader } from '.';

const projDir = '/proj-dir';
const pkgJsonPath = path.join(projDir, 'package.json');
const pkg: TPkg = {
  dependencies: {
    prodDep: '1.0.0',
  },
  devDependencies: {
    devDep: '1.0.0',
  },
};
const createReader = () => {
  const getProjectRootDirStub = sinon.stub().returns(projDir);
  const readJSONStub = sinon.stub().returns(Promise.resolve(pkg));
  const mocks = {
    env: createEnvReaderMock({
      getProjectRootDir: getProjectRootDirStub,
    }),
    fs: createFsMock({
      readJSON: readJSONStub,
    }),
  };
  const reader = new DepsReader(mocks.env, mocks.fs);
  return { mocks, reader };
};
describe('DepsReader', () => {
  describe('readDeps', () => {
    it('should return dependencies from package.json', async () => {
      const { mocks, reader } = createReader();
      const deps = await reader.readDeps();
      expect(mocks.env.getProjectRootDir).to.have.been.calledOnce;
      expect(mocks.fs.readJSON).to.have.been.calledWith(pkgJsonPath);
      expect(deps).to.deep.eq(pkg.dependencies);
    });
  });
  describe('readDevDeps', () => {
    it('should return devDependencies from package.json', async () => {
      const { mocks, reader } = createReader();
      const deps = await reader.readDevDeps();
      expect(mocks.env.getProjectRootDir).to.have.been.calledOnce;
      expect(mocks.fs.readJSON).to.have.been.calledWith(pkgJsonPath);
      expect(deps).to.deep.eq(pkg.devDependencies);
    });
  });
});
