import { inject, injectable } from 'inversify';
import { ICliUi } from '../../cli-ui/interface';
import { IFileSystem } from '../../file-system/interface';
import { TOKENS } from '../../ioc/tokens';
import { IFilesListWriter, IWriteFilesTreeDto } from './interface';

@injectable()
export class FilesListWriter implements IFilesListWriter {
  constructor(
    @inject(TOKENS.fs) private fs: IFileSystem,
    @inject(TOKENS.cliUi) private ui: ICliUi
  ) {}
  async write({
    list,
    shouldPromptOnOverride = true,
  }: IWriteFilesTreeDto): Promise<void> {
    for (const file in list) {
      if (shouldPromptOnOverride && (await this.fs.isExists(file))) {
        const isOverrideConfirmed = await this.ui.confirm({
          message: `${file} already exists. Override?`,
          initial: false,
        });
        if (!isOverrideConfirmed) {
          continue;
        }
      }
      await this.fs.writeFile(file, list[file]);
    }
    return;
  }
}
