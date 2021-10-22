import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
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
import type { TTestLib, TTestRunner } from '../../typings/testing';
import type { ILogger } from '../../logger/interface';
import type { TLang } from '../../typings';

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
    private storiesBuilder: IComponentStoriesBuilder,
    @inject(TOKENS.logger) private logger: ILogger
  ) {}
  async gen(rawOpts: IGenerateComponentOptions): Promise<void> {
    const opts = await this.inputNormalizer.normalize(rawOpts);
    const filesList = this.genWritableFilesList(opts);
    const writtenFiles: string[] = opts.dry
      ? Object.keys(filesList)
      : await this.writeFiles(filesList, opts.y);
    if (!_.isEmpty(writtenFiles)) {
      this.printFilesList(writtenFiles);
    }
  }

  private printFilesList(files: string[]) {
    const payload = files
      .map(file => path.relative(process.cwd(), file))
      .map(file => chalk.green('+') + ' ' + chalk.underline(file))
      .join('\n');
    this.logger.log(payload);
  }
  private async writeFiles(
    files: TStringDict,
    autoConfirm?: boolean
  ): Promise<string[]> {
    const acc: string[] = [];
    for (const file in files) {
      const success = await this.fileWriter.write({
        path: file,
        content: files[file],
        shouldPromptOnOverride: !autoConfirm,
        shouldFormat: true,
      });
      if (success) {
        acc.push(file);
      }
    }
    return acc;
  }
  private genWritableFilesList(opts: IGenerateComponentOptions): TStringDict {
    const style = this.genStyleArtifacts(opts);
    const component = this.componentBuilder.buildUsingComponentGeneratorSpec(
      this.genComponentBuilderSpec(opts, style)
    );
    const tests = this.genTests(opts);
    const stories = this.genStories(opts);

    const rootDir = path.join(opts.dir!, opts.name);
    const ext = this.getExt(opts.lang);
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
    if (opts.lang === 'ts') {
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
        ts: opts.lang === 'ts',
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
        'lang',
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
  private getExt(lang?: TLang): string {
    return lang === 'ts' ? 'tsx' : 'jsx';
  }
}
