import { Options } from 'prettier';

export interface IPrettierConfigReader {
  read(): Promise<Options>;
}
