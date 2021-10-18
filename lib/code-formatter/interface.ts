import type { Options as PrettierOpts } from 'prettier';

export type TPrettierParser = NonNullable<PrettierOpts['parser']>;
export interface ICodeFormatOptions {
  parser?: TPrettierParser;
  ext?: string;
}
export interface ICodeFormatter {
  format(input: string, opts?: ICodeFormatOptions): Promise<string>;
}
