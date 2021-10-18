import { inject, injectable } from 'inversify';
import { TOKENS } from '../ioc/tokens';
import { ICodeFormatterConfigReader } from '../readers/code-formatter-config/interface';
import { ICodeFormatOptions, ICodeFormatter } from './interface';
import { format } from 'prettier';

@injectable()
export class CodeFormatter implements ICodeFormatter {
  constructor(
    @inject(TOKENS.codeFormatterCfgReader)
    private cfgReader: ICodeFormatterConfigReader
  ) {}
  async format(input: string, opts: ICodeFormatOptions = {}): Promise<string> {
    const cfg = await this.cfgReader.read();
    return format(input, {
      parser: this.extractParser(opts),
      ...cfg,
    });
  }
  private extractParser(opts: ICodeFormatOptions) {
    if (opts.parser) return opts.parser;
    return 'babel';
  }
}
