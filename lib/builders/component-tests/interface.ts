export interface IBuildComponentTestsSpec {
  name: string;
  importPath: string;
}
export interface IComponentTestsBuilder {
  build(spec: IBuildComponentTestsSpec): string;
}
