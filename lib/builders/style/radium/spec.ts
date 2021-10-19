import { RadiumStyleBuilder as Builder } from '.';
import { expect } from 'chai';
import { expectCodeToEq } from '../../../../tests/utils/expect-code-to-eq';
import { stringifyAst } from '../../../utils/ast';
import { radiumStylesTemplate as stylesTmpl } from './templates';
import j from 'jscodeshift';

describe('RadiumStyleBuilder', () => {
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
      expect(result.hocs).to.deep.eq([builder.radiumDefaultExport]);
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
        <${tag} style={${builder.stylesExport}["${cls}"]}>
          ${children}
        </${tag}>
      `
      );
      expectCodeToEq(
        `
        import ${builder.radiumDefaultExport} from "radium"; 
        import {${builder.stylesExport}} from "./${filename}";
      `,
        stringifyAst(result.imports!)
      );
    });
  });
});
