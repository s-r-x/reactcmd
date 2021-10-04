import { TStylingStrategy } from '../../typings/styling';
import { Maybe } from '../../typings/utils';
import { IModuleImportSpec } from '../module-imports/interface';

export type TStyleBuilderFactory = (
  strategy: TStylingStrategy
) => IStyleBuilder;

export interface IStyleBuildSpec {
  rootClass?: string;
  rootTag: string;
  ts?: boolean;
}

export interface IStyleBuildArtifacts {
  imports?: IModuleImportSpec[];
  standalone: Maybe<{
    filename: string;
    content: string;
  }>;
  render(children: string): string;
  hoc?: (component: string) => string;
}
export interface IStyleBuilder {
  build(spec: IStyleBuildSpec): IStyleBuildArtifacts;
}
