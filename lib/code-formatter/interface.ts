import { Options } from 'prettier';
export interface ICodeFormatOptions {
  parser?: Options['parser'];
  ext?: string;
}
export interface ICodeFormatter {
  format(input: string, opts?: ICodeFormatOptions): Promise<string>;
}
