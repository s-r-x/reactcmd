import { ScssStyleBuilder as Builder } from '.';
import j from 'jscodeshift';
import { expectCodeToEq } from '../../../../tests/expect-generated-code-to-eq';
import { expect } from 'chai';

describe('ScssStyleBuilder', () => {
  describe('build', () => {
    it('should generate correct style artifacts', () => {
      const builder = new Builder();
      (
        [
          ['span', 'my-class', 'styles.scss', true],
          ['div', 'another-class', 'my-style.scss', false],
        ] as [string, string, string, boolean][]
      ).forEach(([rootTag, rootClass, filename, ts]) => {
        const result = builder.build({
          rootTag,
          rootClass,
          filename,
          ts,
        });
        const children = 'hello';
        const expectedJsx = `
					<${rootTag} className="${rootClass}">${children}</${rootTag}>	
				`;
        const expectedImports = `
					import "./${filename}";	
				`;
        const expectedStyles = `
					.${rootClass} {
						${builder.defaultCssRules};
					}	
				`;
        const jsx = j(result.jsx).toSource();
        const imports = j(result.imports!).toSource();
        const styles = result.standalone!.content;
        expect(result.standalone!.filename).to.eq(filename);
        expectCodeToEq(jsx, expectedJsx);
        expectCodeToEq(imports, expectedImports);
        expectCodeToEq(styles, expectedStyles, { parser: 'scss' });
      });
    });
  });
});
