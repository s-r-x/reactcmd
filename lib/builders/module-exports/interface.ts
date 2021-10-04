export interface IModuleExportsBuilder {
  build(): string;
  replaceExports(specs: TModuleExportsSpec[]): this;
  addExport(spec: TModuleExportsSpec): this;
  removeExport(arg: IRemoveExportDto): this;
  reset(): this;
}

export interface INamedModuleExportsSpec {
  type: 'named';
  name: string;
  alias?: string;
}
export interface IDefaultModuleExportsSpec {
  type: 'default';
  name: string;
  hocs?: string[];
}

export type TModuleExportsSpec =
  | INamedModuleExportsSpec
  | IDefaultModuleExportsSpec;

export interface IRemoveExportDto
  extends Pick<TModuleExportsSpec, 'type' | 'name'> {}
