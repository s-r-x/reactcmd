import { TTestLib, TTestRunner } from '../../typings/testing';

export interface IBuildComponentTestsSpec {
  name: string;
  importPath: string;
  lib: TTestLib;
  runner: TTestRunner;
}
export interface IComponentTestsBuilder {
  build(spec: IBuildComponentTestsSpec): string;
}
