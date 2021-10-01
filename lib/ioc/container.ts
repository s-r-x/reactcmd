import { Container } from 'inversify';
import { StylingAnalyzer } from '../analyzers/styling';
import { IStylingAnalyzer } from '../analyzers/styling/interface';
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
import { TYPES } from './types';

export const createContainer = () => {
  const c = new Container();
  c.bind<ILogger>(TYPES.logger).to(Logger).inSingletonScope();
  c.bind<IEnvReader>(TYPES.env).to(EnvReader).inSingletonScope();
  c.bind<IFileSystem>(TYPES.fs).to(FileSystem).inSingletonScope();
  c.bind<IConfigReader>(TYPES.cfgReader).to(ConfigReader);
  c.bind<IDepsReader>(TYPES.depsReader).to(DepsReader);
  c.bind<ITmplReader>(TYPES.tmplReader).to(TmplReader);
  c.bind<IStylingAnalyzer>(TYPES.styleAnlz).to(StylingAnalyzer);
  c.bind<TStyleBuilderFactory>(TYPES.styBldrFctry).toConstantValue(
    styleBuilderFactory
  );
  c.bind<IComponentGenerator>(TYPES.cmpGen).to(ComponentGenerator);
  return c;
};

const container = createContainer();
export default container;
