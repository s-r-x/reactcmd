import { Container } from 'inversify';
import { EnvAnalyzer } from '../analyzers/env';
import { IEnvAnalyzer } from '../analyzers/env/interface';
import { StylingAnalyzer } from '../analyzers/styling';
import { IStylingAnalyzer } from '../analyzers/styling/interface';
import { ComponentBuilder } from '../builders/component';
import { ComponentBuilderFacade } from '../builders/component/facade';
import { IComponentBuilderFacade } from '../builders/component/interface';
import { styleBuilderFactory } from '../builders/style/factory';
import { TStyleBuilderFactory } from '../builders/style/interface';
import { FileSystem } from '../file-system';
import { IFileSystem } from '../file-system/interface';
import { ComponentGenerator } from '../generators/component';
import { IComponentGenerator } from '../generators/component/interface';
import { Logger } from '../logger';
import { ILogger } from '../logger/interface';
import { ComponentGenInputNormalizer } from '../normalizers/component-gen-input';
import { IComponentGenInputNormalizer } from '../normalizers/component-gen-input/interface';
import { ConfigReader } from '../readers/config';
import { IConfigReader } from '../readers/config/interface';
import { DepsReader } from '../readers/deps';
import { IDepsReader } from '../readers/deps/interface';
import { EnvReader } from '../readers/env';
import { IEnvReader } from '../readers/env/interface';
import { FilesTreeWriter } from '../writers/files-tree';
import { IFilesTreeWriter } from '../writers/files-tree/interface';
import { TOKENS } from './tokens';

export const createContainer = () => {
  const c = new Container();
  c.bind(ComponentBuilder).toSelf();
  c.bind<IComponentBuilderFacade>(TOKENS.componentBuilderFacade).to(
    ComponentBuilderFacade
  );
  c.bind<IFilesTreeWriter>(TOKENS.filesTreeWriter).to(FilesTreeWriter);
  c.bind<ILogger>(TOKENS.logger).to(Logger).inSingletonScope();
  c.bind<IEnvAnalyzer>(TOKENS.envAnalyzer).to(EnvAnalyzer).inSingletonScope();
  c.bind<IEnvReader>(TOKENS.env).to(EnvReader).inSingletonScope();
  c.bind<IFileSystem>(TOKENS.fs).to(FileSystem).inSingletonScope();
  c.bind<IConfigReader>(TOKENS.cfgReader).to(ConfigReader);
  c.bind<IDepsReader>(TOKENS.depsReader).to(DepsReader);
  c.bind<IStylingAnalyzer>(TOKENS.styleAnlz).to(StylingAnalyzer);
  c.bind<TStyleBuilderFactory>(TOKENS.styBldrFctry).toConstantValue(
    styleBuilderFactory
  );
  c.bind<IComponentGenerator>(TOKENS.cmpGen).to(ComponentGenerator);
  c.bind<IComponentGenInputNormalizer>(TOKENS.cmpGenInputNrmlz).to(
    ComponentGenInputNormalizer
  );
  return c;
};

const container = createContainer();
export default container;
