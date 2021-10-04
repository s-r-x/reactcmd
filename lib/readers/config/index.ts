import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import path from 'path';
import { Maybe } from '../../typings/utils';
import { TCliConfigFile } from '../../typings/config';
import { IFileSystem } from '../../file-system/interface';
import { IConfigReader } from './interface';
import { IEnvReader } from '../env/interface';

export const CONFIG_NAME = 'react-std-cli.config.json';

@injectable()
export class ConfigReader implements IConfigReader {
  constructor(
    @inject(TOKENS.env) private env: IEnvReader,
    @inject(TOKENS.fs) private fs: IFileSystem
  ) {}
  async readConfig(): Promise<Maybe<TCliConfigFile>> {
    return await this.fs.readJSON(this.getConfigPath());
  }
  private getConfigPath(): string {
    const root = this.env.getProjectRootDir();
    return path.join(root, CONFIG_NAME);
  }
}
