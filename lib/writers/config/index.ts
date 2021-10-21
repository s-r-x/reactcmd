import { inject, injectable } from 'inversify';
import { IFileSystem } from '../../file-system/interface';
import { TOKENS } from '../../ioc/tokens';
import { TCliConfigFile } from '../../typings/config';
import { IConfigWriter } from './interface';

@injectable()
export class ConfigWriter implements IConfigWriter {
  constructor(@inject(TOKENS.fs) private fs: IFileSystem) {}
  async write(cfg: TCliConfigFile): Promise<void> {
    console.log(cfg);
  }
}
