export interface IModuleImportsBuilder {
  build(): string;
  addImport(spec: IModuleImportSpec): this;
  removeImport(from: string): this;
  reset(): this;
}
export interface IModuleImportSpec {
  named?: string[];
  default?: string;
  from: string;
}
