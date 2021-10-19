import { inject, injectable } from 'inversify';
import { TOKENS } from '../ioc/tokens';
import type { ICodeFormatterConfigReader } from '../readers/code-formatter-config/interface';
import type {
  ICodeFormatOptions,
  ICodeFormatter,
  TPrettierParser,
} from './interface';
import { format } from 'prettier';
import type { Maybe } from '../typings/utils';

@injectable()
export class CodeFormatter implements ICodeFormatter {
  constructor(
    @inject(TOKENS.codeFormatterCfgReader)
    private cfgReader: ICodeFormatterConfigReader
  ) {}
  async format(input: string, opts: ICodeFormatOptions = {}): Promise<string> {
    const cfg = await this.cfgReader.read();
    const parser = this.extractParser(opts);
    if (!parser) return input;
    return format(input, {
      parser,
      ...cfg,
    });
  }
  private extractParser(opts: ICodeFormatOptions): Maybe<TPrettierParser> {
    if (opts.parser) return opts.parser;
    else if (opts.ext) return this.mapFileExtToParser(opts.ext);
    else return 'babel';
  }
  private mapFileExtToParser(ext: string): Maybe<TPrettierParser> {
    ext = ext.startsWith('.') ? ext : '.' + ext;
    switch (ext) {
      case '.less':
      case '.css':
      case '.scss':
      case '.html':
      case '.json':
        return ext.slice(1);
      case '.ts':
      case '.tsx':
      case '.js':
      case '.jsx':
        return 'babel';
    }
    return null;
  }
}
