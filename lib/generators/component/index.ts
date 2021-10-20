import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import _ from 'lodash';
import path from 'path';
import type { IComponentTestsBuilder } from '../../builders/component-tests/interface';
import type { IFileWriter } from '../../writers/file/interface';
import type { IComponentStoriesBuilder } from '../../builders/component-stories/interface';
import type {
  IComponentBuilderFacade,
  IComponentGeneratorSpec,
} from '../../builders/component/interface';
import type {
  IStyleBuildArtifacts,
  TStyleBuilderFactory,
} from '../../builders/style/interface';
import type { IComponentGenInputNormalizer } from '../../normalizers/component-gen-input/interface';
import type { TStylingStrategy } from '../../typings/styling';
import type { Maybe, TStringDict } from '../../typings/utils';
import type {
  IComponentGenerator,
  IGenerateComponentOptions,
} from './interface';
import { TTestLib, TTestRunner } from '../../typings/testing';

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
    const opts = await this.inputNormalizer.normalize(rawOpts);
    const filesList = this.genWritableFilesList(opts);
    await this.writeFiles(filesList);
  }

  private async writeFiles(files: TStringDict) {
    for (const file in files) {
      await this.fileWriter.write({
        path: file,
        content: files[file],
        shouldPromptOnOverride: true,
        shouldFormat: true,
      });
    }
  }
  private genWritableFilesList(opts: IGenerateComponentOptions): TStringDict {
    const style = this.genStyleArtifacts(opts);
    const component = this.componentBuilder.buildUsingComponentGeneratorSpec(
      this.genComponentBuilderSpec(opts, style)
    );
    const tests = this.genTests(opts);
    const stories = this.genStories(opts);

    const rootDir = path.join(opts.dir!, opts.name);
    const ext = this.getExt(opts.ts);
    return {
      [path.join(rootDir, `${opts.componentfile!}.${ext}`)]: component,
      ...(tests && {
        [path.join(rootDir, `${opts.testfile!}.${ext}`)]: tests,
      }),
      ...(stories && {
        [path.join(rootDir, `${opts.storiesfile!}.${ext}`)]: stories,
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
      importPath: './' + opts.componentfile!,
      runner: opts.testrunner as TTestRunner,
      lib: opts.testlib as TTestLib,
    });
  }
  private genStories(opts: IGenerateComponentOptions): Maybe<string> {
    if (!opts.sb) return null;
    const { storiesBuilder: bldr } = this;
    bldr
      .reset()
      .withComponentName(opts.name)
      .withComponentImportPath('./' + opts.componentfile!);
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
        rootClass: opts.classname,
        cssModules: opts.cssmodules,
        filename: opts.stylefile!,
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
        'cc',
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
