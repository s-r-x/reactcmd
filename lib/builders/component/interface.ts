import { TLang } from '../../typings';
import { IModuleImportSpec } from '../module-imports/interface';

export interface IComponentBuilder {
  build(spec: IBuildComponentSpec): string;
}

export interface IBuildComponentStyleSpec {
  imports?: IModuleImportSpec[];
  hocs?: string[];
  render?: (children: string) => string;
}
export interface IBuildComponentSpec {
  name: string;
  lang?: TLang;
  isPure?: boolean;
  useClass?: boolean;
  usePT?: boolean;
  useRedux?: boolean;
  styleSpec?: IBuildComponentStyleSpec;
}
