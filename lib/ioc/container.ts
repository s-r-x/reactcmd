import { Container } from 'inversify';
import { StylingAnalyzer } from '../analyzers/styling';
import { IStylingAnalyzer } from '../analyzers/styling/interface';
import { ModuleExportsBuilder } from '../builders/module-exports';
import { IModuleExportsBuilder } from '../builders/module-exports/interface';
import { ModuleImportsBuilder } from '../builders/module-imports';
import { IModuleImportsBuilder } from '../builders/module-imports/interface';
import { styleBuilderFactory } from '../builders/style/factory';
import { TStyleBuilderFactory } from '../builders/style/interface';
import { FileSystem } from '../file-system';
import { IFileSystem } from '../file-system/interface';
import { ComponentGenerator } from '../generators/component';
import { IComponentGenerator } from '../generators/component/interface';
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
  c.bind<IModuleExportsBuilder>(TOKENS.mdlExprtBldr).to(ModuleExportsBuilder);
  c.bind<IModuleImportsBuilder>(TOKENS.mdlImprtBldr).to(ModuleImportsBuilder);
  return c;
};

const container = createContainer();
export default container;
