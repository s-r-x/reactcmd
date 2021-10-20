import { expect } from 'chai';
import type { TPkg } from '../../typings/pkg';
import { DepsReader } from '.';
import { createPkgJsonReaderMock } from '../../../tests/fixtures/create-pkg-json-reader-mock';

const pkg: TPkg = {
  dependencies: {
    prodDep: '1.0.0',
  },
  devDependencies: {
    devDep: '1.0.0',
  },
};
const createReader = () => {
  const mocks = {
    pkg: createPkgJsonReaderMock({ read: () => Promise.resolve(pkg) }),
  };
  const reader = new DepsReader(mocks.pkg);
  return { mocks, reader };
};
describe.only('DepsReader', () => {
  describe('readDeps', () => {
    it('should return dependencies from package.json', async () => {
      const { reader } = createReader();
      const deps = await reader.readDeps();
      expect(deps).to.deep.eq(pkg.dependencies);
    });
  });
  describe('readDevDeps', () => {
    it('should return devDependencies from package.json', async () => {
      const { reader } = createReader();
      const deps = await reader.readDevDeps();
      expect(deps).to.deep.eq(pkg.devDependencies);
    });
  });
  describe('readAllDeps', () => {
    it('should return dev and prod dependencies from package.json', async () => {
      const { reader } = createReader();
      const deps = await reader.readAllDeps();
      expect(deps).to.deep.eq({
        ...pkg.dependencies,
        ...pkg.devDependencies,
      });
    });
  });
});
