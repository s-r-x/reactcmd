export interface IModuleImportsBuilder {
  build(): string;
  replaceImports(specs: IModuleImportSpec[]): this;
  addImport(spec: IModuleImportSpec): this;
  removeImport(from: string): this;
  reset(): this;
}
export interface IModuleImportSpec {
  named?: string[];
  default?: string;
  from: string;
}
