import 'reflect-metadata';
import container from '../ioc/container';
import * as chai from 'chai';
import sinonChai from 'sinon-chai';

const initialCwd = process.cwd();
export const mochaHooks = {
  beforeAll() {
    chai.use(sinonChai);
  },
  beforeEach() {
    container.snapshot();
  },
  afterEach() {
    container.restore();
    process.chdir(initialCwd);
  },
};
