import { FileWriter as Writer } from '.';
import { createUiMock } from '../../../tests/fixtures/create-ui-mock';
import { createFsMock } from '../../../tests/fixtures/create-fs-mock';
import sinon from 'sinon';
import { expect } from 'chai';
import { createCodeFormatterMock } from '../../../tests/fixtures/create-code-formatter-mock';
import path from 'path';
import type { IWriteFileSpec as ISpec } from './interface';

describe('FileWriter', () => {
  describe('write', () => {
    it('should format and write file', async () => {
      const spec: ISpec = {
        path: 'path.txt',
        content: 'content',
        shouldFormat: true,
        shouldPromptOnOverride: true,
      };
      const fsWriteStub = sinon.stub().returns(Promise.resolve());
      const confirmStub = sinon.stub().returns(Promise.resolve(true));
      const formatMock = sinon.stub().returns(Promise.resolve(spec.content));
      const writer = new Writer(
        createFsMock({
          isExists: () => Promise.resolve(true),
          writeFile: fsWriteStub,
        }),
        createUiMock({
          confirm: confirmStub,
        }),
        createCodeFormatterMock({ format: formatMock })
      );
      await writer.write(spec);

      expect(confirmStub).to.have.been.called;
      expect(formatMock).to.have.been.calledWith(spec.content, {
        ext: path.extname(spec.path),
      });
      expect(fsWriteStub).to.have.been.calledWith(spec.path, spec.content);
    });
    it('should write json', async () => {
      const spec: ISpec = {
        path: 'path.json',
        content: { hi: 'there' },
      };
      const fsWriteStub = sinon.stub().returns(Promise.resolve());
      const writer = new Writer(
        createFsMock({
          isExists: () => Promise.resolve(true),
          writeJSON: fsWriteStub,
        }),
        createUiMock(),
        createCodeFormatterMock()
      );
      await writer.write(spec);

      expect(fsWriteStub).to.have.been.calledWith(spec.path, spec.content);
    });
  });
});
