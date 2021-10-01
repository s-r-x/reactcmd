import { createEnvReaderMock } from '../../tests/fixtures/create-env-reader-mock';
import { createFsMock } from '../../tests/fixtures/create-fs-mock';
import sinon from 'sinon';
import { expect } from 'chai';
import path from 'path/posix';
import { TEMPLATES_DIR, TmplReader } from '.';
import { NoTemplateError } from './errors';

describe('TmplReader', () => {
  describe('readTemplate', () => {
    it('should read template with provided name', async () => {
      const cliDir = '/cli-dir';
      const tmpl = '<h1>hi</h1>';
      const tmplName = 'tmpl.hbs';
      const tmplPath = path.join(cliDir, TEMPLATES_DIR, tmplName);
      const env = createEnvReaderMock({
        getCliRootDir: sinon.stub().returns(cliDir),
      });
      const fs = createFsMock({
        readFile: sinon.stub().returns(Promise.resolve(tmpl)),
      });
      const reader = new TmplReader(env, fs);
      expect(await reader.readTemplate(tmplName)).to.eq(tmpl);
      expect(fs.readFile).to.have.been.calledWith(tmplPath);
      expect(env.getCliRootDir).to.have.been.calledOnce;
    });
    it('should raise if the template cannot be found', async () => {
      const reader = new TmplReader(
        createEnvReaderMock(),
        createFsMock({
          readFile: sinon.stub().returns(Promise.resolve(null)),
        })
      );
      let error: any;
      try {
        await reader.readTemplate('void.hbs');
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceOf(NoTemplateError);
    });
  });
});
