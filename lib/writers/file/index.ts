import { inject, injectable } from 'inversify';
import { ICliUi } from '../../cli-ui/interface';
import { ICodeFormatter } from '../../code-formatter/interface';
import { IFileSystem } from '../../file-system/interface';
import { TOKENS } from '../../ioc/tokens';
import { IFileWriter, IWriteFileSpec } from './interface';
import path from 'path';

@injectable()
export class FileWriter implements IFileWriter {
  constructor(
    @inject(TOKENS.fs) private fs: IFileSystem,
    @inject(TOKENS.cliUi) private ui: ICliUi,
    @inject(TOKENS.codeFormatter) private codeFormatter: ICodeFormatter
  ) {}
  async write(spec: IWriteFileSpec): Promise<void> {
    if (spec.shouldPromptOnOverride && (await this.fs.isExists(spec.path))) {
      const isOverrideConfirmed = await this.ui.confirm({
        message: `${spec.path} already exists. Override?`,
        initial: false,
      });
      if (!isOverrideConfirmed) return;
    }
    const finalContent = spec.shouldFormat
      ? await this.codeFormatter.format(spec.content, {
          ext: path.extname(spec.path),
        })
      : spec.content;
    await this.fs.writeFile(spec.path, finalContent);
  }
}
