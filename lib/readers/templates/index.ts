import { inject, injectable } from 'inversify';
import { TOKENS } from '../../ioc/tokens';
import path from 'path';
import { IFileSystem } from '../../file-system/interface';
import { IEnvReader } from '../env/interface';
import { ITmplReader } from './interface';
import { NoTemplateError } from './errors';

export const TEMPLATES_DIR = 'templates';

@injectable()
export class TmplReader implements ITmplReader {
  constructor(
    @inject(TOKENS.env) private env: IEnvReader,
    @inject(TOKENS.fs) private fs: IFileSystem
  ) {}
  async readTemplate(tmpl: string): Promise<string> {
    const tmplContent = await this.fs.readFile(
      path.join(this.getTemplatesPath(), tmpl)
    );
    if (!tmplContent) {
      throw new NoTemplateError(`Cannot read template ${tmpl}`);
    }
    return tmplContent;
  }
  private getTemplatesPath(): string {
    return path.join(this.env.getCliRootDir(), TEMPLATES_DIR);
  }
}
