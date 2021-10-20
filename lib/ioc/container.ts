import { Container } from 'inversify';
import { EnvAnalyzer } from '../analyzers/env';
import type { IEnvAnalyzer } from '../analyzers/env/interface';
import { StylingAnalyzer } from '../analyzers/styling';
import type { IStylingAnalyzer } from '../analyzers/styling/interface';
import { ComponentBuilder } from '../builders/component';
import { ComponentTestsBuilder } from '../builders/component-tests';
import type { IComponentTestsBuilder } from '../builders/component-tests/interface';
import { ComponentBuilderFacade } from '../builders/component/facade';
import type { IComponentBuilderFacade } from '../builders/component/interface';
import { styleBuilderFactory } from '../builders/style/factory';
import type { TStyleBuilderFactory } from '../builders/style/interface';
import { CliUi } from '../cli-ui';
import type { ICliUi } from '../cli-ui/interface';
import { CodeFormatter } from '../code-formatter';
import type { ICodeFormatter } from '../code-formatter/interface';
import { FileSystem } from '../file-system';
import type { IFileSystem } from '../file-system/interface';
import { ComponentGenerator } from '../generators/component';
import type { IComponentGenerator } from '../generators/component/interface';
import { Logger } from '../logger';
import type { ILogger } from '../logger/interface';
import { ComponentGenInputNormalizer } from '../normalizers/component-gen-input';
import type { IComponentGenInputNormalizer } from '../normalizers/component-gen-input/interface';
import { ConfigReader } from '../readers/config';
import type { IConfigReader } from '../readers/config/interface';
import { DepsReader } from '../readers/deps';
import type { IDepsReader } from '../readers/deps/interface';
import { EnvReader } from '../readers/env';
import type { IEnvReader } from '../readers/env/interface';
import { PkgJsonReader } from '../readers/pkg-json';
import type { IPkgJsonReader } from '../readers/pkg-json/interface';
import { CodeFormatterConfigReader } from '../readers/code-formatter-config';
import type { ICodeFormatterConfigReader } from '../readers/code-formatter-config/interface';
import { TOKENS } from './tokens';
import type { IFileWriter } from '../writers/file/interface';
import { FileWriter } from '../writers/file';
import type { IComponentStoriesBuilder } from '../builders/component-stories/interface';
import { ComponentStoriesBuilder } from '../builders/component-stories';
import { TestingAnalyzer } from '../analyzers/testing';
import type { ITestingAnalyzer } from '../analyzers/testing/interface';

export const createContainer = () => {
  const c = new Container();
  c.bind(ComponentBuilder).toSelf();
  c.bind<IComponentBuilderFacade>(TOKENS.componentBuilderFacade).to(
    ComponentBuilderFacade
  );
  c.bind<ICodeFormatterConfigReader>(TOKENS.codeFormatterCfgReader)
    .to(CodeFormatterConfigReader)
    .inSingletonScope();
  c.bind<ICodeFormatter>(TOKENS.codeFormatter)
    .to(CodeFormatter)
    .inSingletonScope();
  c.bind<ICliUi>(TOKENS.cliUi).to(CliUi);
  c.bind<ILogger>(TOKENS.logger).to(Logger).inSingletonScope();
  c.bind<IEnvAnalyzer>(TOKENS.envAnalyzer).to(EnvAnalyzer).inSingletonScope();
  c.bind<IEnvReader>(TOKENS.env).to(EnvReader).inSingletonScope();
  c.bind<IFileSystem>(TOKENS.fs).to(FileSystem).inSingletonScope();
  c.bind<IFileWriter>(TOKENS.fileWriter).to(FileWriter);
  c.bind<IPkgJsonReader>(TOKENS.pkgJsonReader)
    .to(PkgJsonReader)
    .inSingletonScope();
  c.bind<IConfigReader>(TOKENS.cfgReader).to(ConfigReader);
  c.bind<IDepsReader>(TOKENS.depsReader).to(DepsReader);
  c.bind<ITestingAnalyzer>(TOKENS.testAnlz).to(TestingAnalyzer);
  c.bind<IStylingAnalyzer>(TOKENS.styleAnlz).to(StylingAnalyzer);
  c.bind<TStyleBuilderFactory>(TOKENS.styBldrFctry).toConstantValue(
    styleBuilderFactory
  );
  c.bind<IComponentTestsBuilder>(TOKENS.componentTestsBuilder).to(
    ComponentTestsBuilder
  );
  c.bind<IComponentStoriesBuilder>(TOKENS.componentStoriesBuilder).to(
    ComponentStoriesBuilder
  );
  c.bind<IComponentGenerator>(TOKENS.cmpGen).to(ComponentGenerator);
  c.bind<IComponentGenInputNormalizer>(TOKENS.cmpGenInputNrmlz).to(
    ComponentGenInputNormalizer
  );
  return c;
};

const container = createContainer();
export default container;
