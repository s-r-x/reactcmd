import { inject, injectable } from 'inversify';
import { IFileSystem } from '../../file-system/interface';
import { TOKENS } from '../../ioc/tokens';
import { IFilesTreeWriter, IWriteFilesTreeDto } from './interface';

@injectable()
export class FilesTreeWriter implements IFilesTreeWriter {
  constructor(@inject(TOKENS.fs) private fs: IFileSystem) {}
  async write({
    tree,
    shouldPromptOnOverride,
  }: IWriteFilesTreeDto): Promise<void> {
    for (const file in tree) {
      if (shouldPromptOnOverride && (await this.fs.isExists(file))) {
        // TODO:: prompt
        console.log('exists...');
      }
      await this.fs.writeFile(file, tree[file]);
    }
    console.log(tree, shouldPromptOnOverride);
    return;
  }
}
