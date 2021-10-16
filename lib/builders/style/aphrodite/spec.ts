// TODO
import { AphroditeStyleBuilder as Builder } from '.';
import j from 'jscodeshift';

describe('AphroditeStyleBuilder', () => {
  describe('build', () => {
    it('should generate correct style artifacts', () => {
      const builder = new Builder();
      const result = builder.build({});
      console.log(j(result.jsx).toSource());
    });
  });
});
