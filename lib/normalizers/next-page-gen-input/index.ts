import { inject, injectable } from 'inversify';
import path from 'path';
import { TOKENS } from '../../ioc/tokens';
import type { INextPageGenInputNormalizer as INormalizer } from './interface';
import type { IEnvAnalyzer } from '../../analyzers/env/interface';
import type { IGenerateNextPageOptions as IOptions } from '../../generators/next-page/interface';
import { langToJsxFileExt } from '../../utils/lang-to-file-ext';

@injectable()
export class NextPageGenInputNormalizer implements INormalizer {
  constructor(@inject(TOKENS.envAnalyzer) private envAnalyzer: IEnvAnalyzer) {}
  async normalize(rawInput: IOptions): Promise<IOptions> {
    const input = { ...rawInput };
    await Promise.all([this.normalizeDir(input), this.normalizeLang(input)]);
    this.normalizePath(input);
    return input;
  }
  normalizePath(input: IOptions) {
    input.path = input.path.trim();
    const file = input.path;
    if (!path.isAbsolute(file)) {
      if (file.startsWith('.')) {
        input.path = path.join(process.cwd(), file);
      } else {
        input.path = path.join(input.dir, file);
      }
    }
    const ext = langToJsxFileExt(input.lang);
    input.path = input.path + ext;
  }
  async normalizeDir(input: IOptions) {
    input.dir = input.dir.trim();
    const dir = input.dir;
    if (!path.isAbsolute(dir)) {
      const srcDir = await this.envAnalyzer.determineSourceDir();
      input.dir = path.join(srcDir, dir);
    }
  }
  async normalizeLang(input: IOptions) {
    if (!input.lang) {
      input.lang = await this.envAnalyzer.determineLang();
    }
  }
}
