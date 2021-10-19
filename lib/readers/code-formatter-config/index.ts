import type { ICodeFormatterConfigReader } from './interface';
import type { Options } from 'prettier';
import prettier from 'prettier';
import { DEFAULT_PRETTIER_CONFIG } from './constants';
import { injectable } from 'inversify';

@injectable()
export class CodeFormatterConfigReader implements ICodeFormatterConfigReader {
  async read(): Promise<Options> {
    const config = await prettier.resolveConfig(process.cwd());
    return config || DEFAULT_PRETTIER_CONFIG;
  }
}
