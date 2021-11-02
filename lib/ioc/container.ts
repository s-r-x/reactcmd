import { Container } from 'inversify';
import { Ui } from '../ui';
import type { IUi } from '../ui/interface';
import { CodeFormatter } from '../code-formatter';
import type { ICodeFormatter } from '../code-formatter/interface';
import { FileSystem } from '../file-system';
import type { IFileSystem } from '../file-system/interface';
import { Logger } from '../logger';
import type { ILogger } from '../logger/interface';
import { TOKENS } from './tokens';
import { modules } from './modules';

export const createContainer = () => {
  const c = new Container();
  c.load(...modules);
  c.bind<ICodeFormatter>(TOKENS.codeFormatter)
    .to(CodeFormatter)
    .inSingletonScope();
  c.bind<IUi>(TOKENS.ui).to(Ui);
  c.bind<ILogger>(TOKENS.logger).to(Logger).inSingletonScope();
  c.bind<IFileSystem>(TOKENS.fs).to(FileSystem).inSingletonScope();
  return c;
};

const container = createContainer();
export default container;
