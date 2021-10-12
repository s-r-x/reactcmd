import { DEFAULT_ROOT_CLASS, DEFAULT_ROOT_TAG } from '../constants';
import {
  IStyleBuildSpec,
  IStyleBuildArtifacts,
  IStyleBuilder,
  TNormalizedStyleBuildSpec,
} from '../interface';
import _ from 'lodash';
import path from 'path';
import j from 'jscodeshift';

export abstract class AbstractStyleBuilder implements IStyleBuilder {
  protected fileExt?: string;
  protected shouldCapitalizeRootClass?: boolean;
  protected defaultFilename = 'styles';

  build(spec: IStyleBuildSpec): IStyleBuildArtifacts {
    return this.buildArtifacts(this.normalizeSpec(spec));
  }

  protected abstract buildArtifacts(
    spec: TNormalizedStyleBuildSpec
  ): IStyleBuildArtifacts;
  private normalizeSpec({
    rootClass,
    rootTag = DEFAULT_ROOT_TAG,
    ts = false,
    filename,
    jsxChildren = [j.literal('hello world')],
  }: IStyleBuildSpec): TNormalizedStyleBuildSpec {
    return {
      rootClass: this.normalizeRootClass(rootClass),
      rootTag,
      ts,
      jsxChildren,
      file: this.generateStandaloneFileMeta(filename, ts),
    };
  }
  private normalizeRootClass(cls: string = DEFAULT_ROOT_CLASS): string {
    if (this.shouldCapitalizeRootClass) {
      return _.capitalize(cls);
    }
    return cls;
  }
  private generateStandaloneFileMeta(
    filename?: string,
    ts?: boolean
  ): TNormalizedStyleBuildSpec['file'] {
    const parsed = path.parse(filename || this.defaultFilename);
    const ext = this.fileExt || (ts ? '.ts' : '.js');
    return {
      ext,
      name: parsed.name,
      nameWithExt: parsed.name + ext,
    };
  }
}
