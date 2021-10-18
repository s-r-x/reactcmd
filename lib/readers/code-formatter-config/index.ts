import { ICodeFormatterConfigReader } from './interface';
import prettier, { Options } from 'prettier';
import { DEFAULT_PRETTIER_CONFIG } from './constants';

export class CodeFormatterConfigReader implements ICodeFormatterConfigReader {
  async read(): Promise<Options> {
    const config = await prettier.resolveConfig(process.cwd());
    return config || DEFAULT_PRETTIER_CONFIG;
  }
}
