import { ContainerModule } from 'inversify';
import { ConfigWriter } from '../../writers/config';
import { IConfigWriter } from '../../writers/config/interface';
import { FileWriter } from '../../writers/file';
import type { IFileWriter } from '../../writers/file/interface';
import { PkgJsonWriter } from '../../writers/pkg-json';
import { IPkgJsonWriter } from '../../writers/pkg-json/interface';
import { TOKENS } from '../tokens';

export const writersModule = new ContainerModule(bind => {
  bind<IFileWriter>(TOKENS.fileWriter).to(FileWriter);
  bind<IConfigWriter>(TOKENS.cfgWriter).to(ConfigWriter);
  bind<IPkgJsonWriter>(TOKENS.pkgJsonWriter).to(PkgJsonWriter);
});
