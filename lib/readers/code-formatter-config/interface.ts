import { Options } from 'prettier';

export interface ICodeFormatterConfigReader {
  read(): Promise<Options>;
}
