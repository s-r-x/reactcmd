import { inject, injectable } from 'inversify';
import { IFileSystem } from '../../file-system/interface';
import { TOKENS } from '../../ioc/tokens';
import { IPkgJsonReader } from '../../readers/pkg-json/interface';
import { TAnyDict } from '../../typings/utils';
import { IPkgJsonWriter } from './interface';

@injectable()
export class PkgJsonWriter implements IPkgJsonWriter {
  constructor(
    @inject(TOKENS.fs) private fs: IFileSystem,
    @inject(TOKENS.pkgJsonReader) private pkgJsonReader: IPkgJsonReader
  ) {}
  async writeField(field: string, payload: TAnyDict | string): Promise<void> {
    const pkg = await this.pkgJsonReader.read();
    pkg[field] = payload;
    await this.fs.writeJSON(this.pkgJsonReader.getPath(), pkg);
  }
}
