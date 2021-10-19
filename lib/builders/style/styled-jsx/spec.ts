import { expect } from 'chai';
import { StyledJsxStyleBuilder as Builder } from '.';
import j from 'jscodeshift';
import { expectCodeToEq } from '../../../../tests/utils/expect-code-to-eq';
import { stringifyAst } from '../../../utils/ast';

describe('StyledJsxStyleBuilder', () => {
  describe('build', () => {
    it('should build correct style artifacts', () => {
      const builder = new Builder();
      const cls = 'my-class';
      const tag = 'span';
      const children = `children`;
      const result = builder.build({
        rootTag: tag,
        rootClass: cls,
        jsxChildren: [j.literal(children)],
      });
      expect(result.standalone).to.be.null;
      expect(result.imports).to.be.undefined;
      expect(result.hocs).to.be.undefined;
      expectCodeToEq(
        `
				<${tag} className="${cls}">
					${children}
					<style jsx />	
				</${tag}>	
			`,
        stringifyAst(result.jsx)
      );
    });
  });
});
