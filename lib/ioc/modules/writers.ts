import { ContainerModule } from 'inversify';
import { ConfigWriter } from '../../writers/config';
import { IConfigWriter } from '../../writers/config/interface';
import { FileWriter } from '../../writers/file';
import type { IFileWriter } from '../../writers/file/interface';
import { TOKENS } from '../tokens';

export const writersModule = new ContainerModule(bind => {
  bind<IFileWriter>(TOKENS.fileWriter).to(FileWriter);
  bind<IConfigWriter>(TOKENS.cfgWriter).to(ConfigWriter);
});
