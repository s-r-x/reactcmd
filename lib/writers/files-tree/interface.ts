import { TStringDict } from '../../typings/utils';

export interface IWriteFilesTreeDto {
  tree: TStringDict;
  shouldPromptOnOverride?: boolean;
}
export interface IFilesTreeWriter {
  write(dto: IWriteFilesTreeDto): Promise<void>;
}
