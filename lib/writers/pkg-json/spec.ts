import { PkgJsonWriter as Writer } from '.';
import { createFileWriterMock } from '../../../tests/fixtures/create-file-writer-mock';
import { createPkgJsonReaderMock } from '../../../tests/fixtures/create-pkg-json-reader-mock';
import sinon from 'sinon';
import { expect } from 'chai';

describe('PkgJsonWriter', () => {
  describe('writeField', () => {
    it('should write new field in existing package.json', async () => {
      const writeFileStub = sinon.stub().returns(Promise.resolve());
      const pkg = {
        name: 'name',
      };
      const fieldName = 'my-field';
      const fieldContent = {
        hi: 'there',
      };
      const pkgPath = '/proj/package.json';
      const writer = new Writer(
        createFileWriterMock({
          write: writeFileStub,
        }),
        createPkgJsonReaderMock({
          read: () => Promise.resolve(pkg),
          getPath: () => pkgPath,
        })
      );
      await writer.writeField(fieldName, fieldContent);
      expect(writeFileStub).to.have.been.calledWith({
        path: pkgPath,
        content: { ...pkg, [fieldName]: fieldContent },
      });
    });
  });
});
