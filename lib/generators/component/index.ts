import { inject, injectable } from 'inversify';
import type {
  IComponentBuilderFacade,
  IComponentGeneratorSpec,
} from '../../builders/component/interface';
import type {
  IStyleBuildArtifacts,
  TStyleBuilderFactory,
} from '../../builders/style/interface';
import { TOKENS } from '../../ioc/tokens';
import type { IComponentGenInputNormalizer } from '../../normalizers/component-gen-input/interface';
import type { TStylingStrategy } from '../../typings/styling';
import type { Maybe, TStringDict } from '../../typings/utils';
import type {
  IComponentGenerator,
  IGenerateComponentOptions,
} from './interface';
import _ from 'lodash';
import path from 'path';
import type { IComponentTestsBuilder } from '../../builders/component-tests/interface';
import type { IFileWriter } from '../../writers/file/interface';
import type { IComponentStoriesBuilder } from '../../builders/component-stories/interface';
import { COMPONENT_DEFAULT_FILENAME } from './constants';

@injectable()
export class ComponentGenerator implements IComponentGenerator {
  constructor(
    @inject(TOKENS.styBldrFctry)
    private styleBuilderFactory: TStyleBuilderFactory,
    @inject(TOKENS.cmpGenInputNrmlz)
    private inputNormalizer: IComponentGenInputNormalizer,
    @inject(TOKENS.componentBuilderFacade)
    private componentBuilder: IComponentBuilderFacade,
    @inject(TOKENS.fileWriter) private fileWriter: IFileWriter,
    @inject(TOKENS.componentTestsBuilder)
    private testsBuilder: IComponentTestsBuilder,
    @inject(TOKENS.componentStoriesBuilder)
    private storiesBuilder: IComponentStoriesBuilder
  ) {}
  async gen(rawOpts: IGenerateComponentOptions): Promise<void> {
    const { componentBuilder: builder } = this;
    const opts = await this.inputNormalizer.normalize(rawOpts);

    const styleArtifacts = this.genStyleArtifacts(opts);
    const component = builder.buildUsingComponentGeneratorSpec(
      this.genComponentBuilderSpec(opts, styleArtifacts)
    );
    const tests = this.genTests(opts);
    const stories = this.genStories(opts);

    const filesList = this.genWritableFilesList(
      opts,
      component,
      styleArtifacts,
      tests,
      stories
    );
    for (const file in filesList) {
      await this.fileWriter.write({
        path: file,
        content: filesList[file],
        shouldPromptOnOverride: true,
        shouldFormat: true,
      });
    }
  }
  private genWritableFilesList(
    opts: IGenerateComponentOptions,
    component: string,
    style: Maybe<IStyleBuildArtifacts>,
    tests: Maybe<string>,
    stories: Maybe<string>
  ): TStringDict {
    const rootDir = path.join(opts.dir!, opts.name);
    const ext = this.getExt(opts.ts);
    return {
      [path.join(rootDir, `${COMPONENT_DEFAULT_FILENAME}.${ext}`)]: component,
      ...(tests && {
        [path.join(rootDir, `${COMPONENT_DEFAULT_FILENAME}.spec.${ext}`)]:
          tests,
      }),
      ...(stories && {
        [path.join(rootDir, `${COMPONENT_DEFAULT_FILENAME}.stories.${ext}`)]:
          stories,
      }),
      ...(style?.standalone && {
        [path.join(rootDir, style.standalone.filename)]:
          style.standalone.content,
      }),
    };
  }
  private genTests(opts: IGenerateComponentOptions): Maybe<string> {
    if (!opts.test) return null;
    return this.testsBuilder.build({
      name: opts.name,
      importPath: './' + COMPONENT_DEFAULT_FILENAME,
    });
  }
  private genStories(opts: IGenerateComponentOptions): Maybe<string> {
    if (!opts.sb) return null;
    const { storiesBuilder: bldr } = this;
    bldr.reset().withComponentName(opts.name);
    bldr.withComponentImportPath('./' + COMPONENT_DEFAULT_FILENAME);
    if (opts.ts) {
      bldr.withTypescript();
    }
    return bldr.build();
  }
  private genStyleArtifacts(
    opts: IGenerateComponentOptions
  ): Maybe<IStyleBuildArtifacts> {
    if (opts.style && !opts.ugly) {
      return this.styleBuilderFactory(opts.style as TStylingStrategy).build({
        rootTag: opts.tag,
        ts: opts.ts,
        cssModules: opts.cssmodules,
      });
    }
    return null;
  }
  private genComponentBuilderSpec(
    opts: IGenerateComponentOptions,
    style: Maybe<IStyleBuildArtifacts>
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
      imports: style?.imports,
      hocs: style?.hocs,
      jsx: style?.jsx,
    };
  }
  private getExt(ts?: boolean): string {
    return ts ? 'tsx' : 'jsx';
  }
}
