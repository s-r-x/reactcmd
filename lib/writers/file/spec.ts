// @ts-nocheck
// TODO
import { FilesListWriter as Writer } from '.';
import { createCliUiMock } from '../../../tests/fixtures/create-cli-ui-mock';
import { createFsMock } from '../../../tests/fixtures/create-fs-mock';
import sinon from 'sinon';
import { expect } from 'chai';
import { TStringDict } from '../../typings/utils';
import _ from 'lodash';

describe('FilesListWriter', () => {
  describe('write', () => {
    it('should write files if none of them does not exist', async () => {
      const fsWriteStub = sinon.stub().returns(Promise.resolve());
      const confirmStub = sinon.stub().returns(Promise.resolve(false));
      const writer = new Writer(
        createFsMock({
          isExists: () => Promise.resolve(false),
          writeFile: fsWriteStub,
        }),
        createCliUiMock({
          confirm: confirmStub,
        })
      );
      const list: TStringDict = {
        'file.txt': 'content',
        'some.json': 'content2',
      };
      await writer.write({
        list,
      });

      expect(confirmStub).to.not.have.been.called;
      expect(fsWriteStub.callCount).to.eq(_.size(list));
      let call = 0;
      for (const file in list) {
        expect(fsWriteStub.getCall(call).calledWith(file, list[file])).to.be
          .true;
        call++;
      }
    });
  });
});
