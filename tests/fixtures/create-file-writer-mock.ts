import { IFileWriter } from '../../lib/writers/file/interface';

export const createFileWriterMock = (
  args: Partial<IFileWriter> = {}
): IFileWriter => ({
  write: () => Promise.resolve(true),
  ...args,
});
