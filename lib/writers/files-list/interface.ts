import { TStringDict } from '../../typings/utils';

export interface IWriteFilesTreeDto {
  list: TStringDict;
  shouldPromptOnOverride?: boolean;
}
export interface IFilesListWriter {
  write(dto: IWriteFilesTreeDto): Promise<void>;
}
