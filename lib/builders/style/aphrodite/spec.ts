import { AphroditeStyleBuilder as Builder } from '.';
import { expect } from 'chai';
import { expectCodeToEq } from '../../../../tests/utils/expect-code-to-eq';
import { stringifyAst } from '../../../utils/ast';
import { aphroditeStylesTemplate as stylesTmpl } from './templates';
import j from 'jscodeshift';

describe('AphroditeStyleBuilder', () => {
  describe('build', () => {
    it('should generate correct style artifacts', () => {
      const builder = new Builder();
      const cls = 'my-class';
      const tag = 'span';
      const filename = 'file';
      const children = `children`;
      const result = builder.build({
        rootClass: cls,
        rootTag: tag,
        ts: true,
        filename,
        jsxChildren: [j.literal(children)],
      });
      expect(result.standalone!.filename).to.eq(filename + '.ts');
      expect(result.hocs).to.be.undefined;
      expectCodeToEq(
        stylesTmpl({
          exportName: builder.stylesExport,
          rootClass: cls,
        }),
        result.standalone!.content
      );
      expectCodeToEq(
        stringifyAst(result.jsx),
        `
        <${tag} className={css(${builder.stylesExport}["${cls}"])}>
          ${children}
        </${tag}>
      `
      );
      expectCodeToEq(
        `
        import { css } from "aphrodite"; 
        import {${builder.stylesExport}} from "./${filename}";
      `,
        stringifyAst(result.imports!)
      );
    });
  });
});
