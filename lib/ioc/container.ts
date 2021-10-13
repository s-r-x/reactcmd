import { Container } from 'inversify';
import { EnvAnalyzer } from '../analyzers/env';
import { IEnvAnalyzer } from '../analyzers/env/interface';
import { StylingAnalyzer } from '../analyzers/styling';
import { IStylingAnalyzer } from '../analyzers/styling/interface';
import { ComponentBuilder } from '../builders/component';
import { styleBuilderFactory } from '../builders/style/factory';
import { TStyleBuilderFactory } from '../builders/style/interface';
import { FileSystem } from '../file-system';
import { IFileSystem } from '../file-system/interface';
import { ComponentGenerator } from '../generators/component';
import { IComponentGenerator } from '../generators/component/interface';
import { ComponentGeneratorOptionsNormalizer } from '../generators/component/options-normalizer';
import { Logger } from '../logger';
import { ILogger } from '../logger/interface';
import { ConfigReader } from '../readers/config';
import { IConfigReader } from '../readers/config/interface';
import { DepsReader } from '../readers/deps';
import { IDepsReader } from '../readers/deps/interface';
import { EnvReader } from '../readers/env';
import { IEnvReader } from '../readers/env/interface';
import { TmplReader } from '../readers/templates';
import { ITmplReader } from '../readers/templates/interface';
import { TOKENS } from './tokens';

export const createContainer = () => {
  const c = new Container();
  c.bind<ILogger>(TOKENS.logger).to(Logger).inSingletonScope();
  c.bind<IEnvAnalyzer>(TOKENS.envAnalyzer).to(EnvAnalyzer).inSingletonScope();
  c.bind<IEnvReader>(TOKENS.env).to(EnvReader).inSingletonScope();
  c.bind<IFileSystem>(TOKENS.fs).to(FileSystem).inSingletonScope();
  c.bind<IConfigReader>(TOKENS.cfgReader).to(ConfigReader);
  c.bind<IDepsReader>(TOKENS.depsReader).to(DepsReader);
  c.bind<ITmplReader>(TOKENS.tmplReader).to(TmplReader);
  c.bind<IStylingAnalyzer>(TOKENS.styleAnlz).to(StylingAnalyzer);
  c.bind<TStyleBuilderFactory>(TOKENS.styBldrFctry).toConstantValue(
    styleBuilderFactory
  );
  c.bind<IComponentGenerator>(TOKENS.cmpGen).to(ComponentGenerator);
  c.bind(ComponentGeneratorOptionsNormalizer).toSelf();
  c.bind(ComponentBuilder).toSelf();
  return c;
};

const container = createContainer();
export default container;
