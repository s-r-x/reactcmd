import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import { IConfigReader } from '../../readers/config/interface';
import { TCliConfigFile as TCfg } from '../../typings/config';
import { IConfigWriter } from './interface';
import _ from 'lodash';
import path from 'path';
import { IEnvReader } from '../../readers/env/interface';
import { Maybe } from '../../typings/utils';
import { IPkgJsonWriter } from '../pkg-json/interface';
import { CONFIG_NAME, DEFAULT_CONFIG_FILE } from '../../constants/config';
import { IFileWriter } from '../file/interface';

@injectable()
export class ConfigWriter implements IConfigWriter {
  constructor(
    @inject(TOKENS.fileWriter) private fileWriter: IFileWriter,
    @inject(TOKENS.cfgReader) private cfgReader: IConfigReader,
    @inject(TOKENS.env) private env: IEnvReader,
    @inject(TOKENS.pkgJsonWriter) private pkgJsonWriter: IPkgJsonWriter
  ) {}
  async write(cfg: TCfg): Promise<void> {
    const [oldConfig, oldConfigPath] = await Promise.all([
      this.cfgReader.readConfig(),
      this.cfgReader.getConfigPath(),
    ]);
    const finalConfig = oldConfig ? this.mergeConfigs(oldConfig, cfg) : cfg;
    const shouldWriteInPkgJson =
      oldConfigPath && path.basename(oldConfigPath) === 'package.json';
    if (shouldWriteInPkgJson) {
      await this.pkgJsonWriter.writeField(CONFIG_NAME, finalConfig);
    } else {
      await this.writeInFile(finalConfig, oldConfigPath);
    }
  }
  private async writeInFile(cfg: TCfg, writePath: Maybe<string>) {
    writePath ||= path.join(this.env.getProjectRootDir(), DEFAULT_CONFIG_FILE);
    await this.fileWriter.write({ path: writePath, content: cfg });
  }
  private mergeConfigs(oldConfig: TCfg, newConfig: TCfg): TCfg {
    return _.merge(_.cloneDeep(oldConfig), newConfig);
  }
}
