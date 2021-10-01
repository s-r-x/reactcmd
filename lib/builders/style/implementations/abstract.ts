import { DEFAULT_ROOT_CLASS, DEFAULT_ROOT_TAG } from '../constants';
import {
  IStyleBuildSpec,
  IStyleBuildArtifacts,
  IStyleBuilder,
} from '../interface';
import _ from 'lodash';

export abstract class AbstractStyleBuilder implements IStyleBuilder {
  abstract build(spec: IStyleBuildSpec): IStyleBuildArtifacts;

  protected normalizeSpec({
    rootClass = DEFAULT_ROOT_CLASS,
    rootTag = DEFAULT_ROOT_TAG,
    ts = false,
  }: IStyleBuildSpec): Required<IStyleBuildSpec> {
    return {
      rootClass,
      rootTag,
      ts,
    };
  }
  protected normalizeSpecAndCapitalizeRootClass(
    rawSpec: IStyleBuildSpec
  ): ReturnType<AbstractStyleBuilder['normalizeSpec']> {
    const spec = this.normalizeSpec(rawSpec);
    spec.rootClass = _.capitalize(spec.rootClass);
    return spec;
  }
}
