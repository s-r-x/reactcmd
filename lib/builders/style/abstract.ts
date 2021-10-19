import {
  DEFAULT_JSX_CHILDREN,
  DEFAULT_ROOT_CLASS,
  DEFAULT_ROOT_TAG,
  STYLE_DEFAULT_FILENAME,
} from './constants';
import path from 'path';
import { pascalCase } from '../../utils/pascal-case';
import type {
  IStyleBuildSpec,
  IStyleBuildArtifacts,
  IStyleBuilder,
  TNormalizedStyleBuildSpec,
} from './interface';
import { removeSpaces } from '../../utils/remove-spaces';

export abstract class AbstractStyleBuilder implements IStyleBuilder {
  protected immutableFileExt?: string;
  protected usePascalCaseForRootClass?: boolean;
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
      cls = pascalCase(cls);
    }
    return removeSpaces(cls);
  }
  private generateStandaloneFileMeta(
    filename?: string,
    ts?: boolean,
    cssModules?: boolean
  ): TNormalizedStyleBuildSpec['file'] {
    filename ||= STYLE_DEFAULT_FILENAME;
    if (
      cssModules &&
      this.isCssModulesCompatible &&
      !filename.endsWith('.module')
    ) {
      filename += '.module';
    }
    const ext = this.immutableFileExt || (ts ? '.ts' : '.js');
    const parsed = path.parse(filename + ext);
    return {
      ext: parsed.ext,
      name: parsed.name,
      nameWithExt: parsed.base,
    };
  }
}
