import { TAnyDict } from '../../typings/utils';

export interface IWriteFileSpec {
  path: string;
  content: string | TAnyDict;
  shouldPromptOnOverride?: boolean;
  shouldFormat?: boolean;
}
export interface IFileWriter {
  write(spec: IWriteFileSpec): Promise<boolean>;
}
