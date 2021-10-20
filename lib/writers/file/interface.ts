export interface IWriteFileSpec {
  path: string;
  content: string;
  shouldPromptOnOverride?: boolean;
  shouldFormat?: boolean;
}
export interface IFileWriter {
  write(spec: IWriteFileSpec): Promise<boolean>;
}
