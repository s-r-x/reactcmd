import { ContainerModule } from 'inversify';
import { FileWriter } from '../../writers/file';
import type { IFileWriter } from '../../writers/file/interface';
import { TOKENS } from '../tokens';

export const writersModule = new ContainerModule(bind => {
  bind<IFileWriter>(TOKENS.fileWriter).to(FileWriter);
});
