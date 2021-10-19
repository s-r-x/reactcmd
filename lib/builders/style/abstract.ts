import {
  DEFAULT_JSX_CHILDREN,
  DEFAULT_ROOT_CLASS,
  DEFAULT_ROOT_TAG,
} from './constants';
import path from 'path';
import { pascalCase } from '../../utils/pascal-case';
import type {
  IStyleBuildSpec,
  IStyleBuildArtifacts,
  IStyleBuilder,
  TNormalizedStyleBuildSpec,
} from './interface';

export abstract class AbstractStyleBuilder implements IStyleBuilder {
  protected immutableFileExt?: string;
  protected usePascalCaseForRootClass?: boolean;
  protected defaultFilename = 'styles';
  protected isCssModulesCompatible = false;

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
    jsxChildren = DEFAULT_JSX_CHILDREN,
    cssModules = false,
  }: IStyleBuildSpec): TNormalizedStyleBuildSpec {
    return {
      rootClass: this.normalizeRootClass(rootClass),
      rootTag,
      ts,
      jsxChildren,
      file: this.generateStandaloneFileMeta(filename, ts, cssModules),
      cssModules,
    };
  }
  private normalizeRootClass(cls: string = DEFAULT_ROOT_CLASS): string {
    if (this.usePascalCaseForRootClass) {
      return pascalCase(cls);
    }
    return cls;
  }
  private generateStandaloneFileMeta(
    filename?: string,
    ts?: boolean,
    cssModules?: boolean
  ): TNormalizedStyleBuildSpec['file'] {
    filename ||= this.defaultFilename;
    let ext: string;
    if (this.immutableFileExt) {
      if (cssModules && this.isCssModulesCompatible) {
        ext = '.module' + this.immutableFileExt;
      } else {
        ext = this.immutableFileExt;
      }
    } else {
      ext = ts ? '.ts' : '.js';
    }
    const parsed = path.parse(filename);
    return {
      ext,
      name: parsed.name,
      nameWithExt: parsed.name + ext,
    };
  }
}
