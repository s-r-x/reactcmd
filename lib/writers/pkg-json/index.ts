import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import { IPkgJsonReader } from '../../readers/pkg-json/interface';
import { TAnyDict } from '../../typings/utils';
import { IFileWriter } from '../file/interface';
import { IPkgJsonWriter } from './interface';

@injectable()
export class PkgJsonWriter implements IPkgJsonWriter {
  constructor(
    @inject(TOKENS.fileWriter) private fileWriter: IFileWriter,
    @inject(TOKENS.pkgJsonReader) private pkgJsonReader: IPkgJsonReader
  ) {}
  async writeField(field: string, payload: TAnyDict | string): Promise<void> {
    const pkg = await this.pkgJsonReader.read();
    pkg[field] = payload;
    await this.fileWriter.write({
      path: this.pkgJsonReader.getPath(),
      content: pkg,
    });
  }
}
