import { inject, injectable } from 'inversify';
import {
  IComponentBuilderFacade,
  IComponentGeneratorSpec,
} from '../../builders/component/interface';
import {
  IStyleBuildArtifacts,
  TStyleBuilderFactory,
} from '../../builders/style/interface';
import { TOKENS } from '../../ioc/tokens';
import { IComponentGenInputNormalizer } from '../../normalizers/component-gen-input/interface';
import { TStylingStrategy } from '../../typings/styling';
import { Maybe, TStringDict } from '../../typings/utils';
import { IComponentGenerator, IGenerateComponentOptions } from './interface';
import _ from 'lodash';
import { IFilesListWriter } from '../../writers/files-list/interface';
import path from 'path';

@injectable()
export class ComponentGenerator implements IComponentGenerator {
  constructor(
    @inject(TOKENS.styBldrFctry)
    private styleBuilderFactory: TStyleBuilderFactory,
    @inject(TOKENS.cmpGenInputNrmlz)
    private inputNormalizer: IComponentGenInputNormalizer,
    @inject(TOKENS.componentBuilderFacade)
    private componentBuilder: IComponentBuilderFacade,
    @inject(TOKENS.filesListWriter)
    private filesListWriter: IFilesListWriter
  ) {}
  async gen(rawOpts: IGenerateComponentOptions): Promise<void> {
    const { componentBuilder: builder } = this;
    const opts = await this.inputNormalizer.normalize(rawOpts);
    const styleArtifacts = this.genStyleArtifacts(opts);
    const componentBuilderSpec = this.genComponentBuilderSpec(
      opts,
      styleArtifacts
    );
    const component =
      builder.buildUsingComponentGeneratorSpec(componentBuilderSpec);
    const filesList = this.genWritableFilesList(
      opts,
      component,
      styleArtifacts
    );
    await this.filesListWriter.write({
      list: filesList,
      shouldPromptOnOverride: true,
    });
  }
  private genWritableFilesList(
    opts: IGenerateComponentOptions,
    component: string,
    styleArtifacts: Maybe<IStyleBuildArtifacts>
  ): TStringDict {
    const rootDir = path.join(opts.dir!, opts.name);
    return {
      [path.join(rootDir, `index.${opts.ts ? 'tsx' : 'jsx'}`)]: component,
      ...(styleArtifacts?.standalone && {
        [path.join(rootDir, styleArtifacts.standalone.filename)]:
          styleArtifacts.standalone.content,
      }),
    };
  }
  private genStyleArtifacts(
    opts: IGenerateComponentOptions
  ): Maybe<IStyleBuildArtifacts> {
    if (opts.style && !opts.nostyle) {
      return this.styleBuilderFactory(opts.style as TStylingStrategy).build({
        rootTag: opts.tag,
        ts: opts.ts,
      });
    }
    return null;
  }
  private genComponentBuilderSpec(
    opts: IGenerateComponentOptions,
    styleArtifacts: Maybe<IStyleBuildArtifacts>
  ): IComponentGeneratorSpec {
    return {
      ..._.pick(opts, [
        'name',
        'fc',
        'class',
        'ts',
        'tag',
        'mobx',
        'redux',
        'pure',
      ]),
      imports: styleArtifacts?.imports,
      hocs: styleArtifacts?.hocs,
      jsx: styleArtifacts?.jsx,
    };
  }
}
