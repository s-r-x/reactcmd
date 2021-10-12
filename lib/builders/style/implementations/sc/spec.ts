import { ScStyleBuilder as Builder } from '.';
import j from 'jscodeshift';
import { expectCodeToEq } from '../../../../tests/expect-generated-code-to-eq';
import { expect } from 'chai';

describe('ScStyleBuilder', () => {
  describe('build', () => {
    it('should generate correct style artifacts', () => {
      const builder = new Builder();
      (
        [
          ['span', 'Root', 'styled', true],
          ['div', 'Another', 'sty', false],
        ] as [string, string, string, boolean][]
      ).forEach(([rootTag, rootClass, filename, ts]) => {
        const result = builder.build({
          rootTag,
          rootClass,
          filename,
          ts,
        });
        const children = 'hello';
        const { nsExport } = builder;
        const expectedJsx = `
        	<${nsExport}.${rootClass}>${children}</${nsExport}.${rootClass}>
        `;
        const expectedImports = `
        	import * as ${nsExport} from "./${filename}";
        `;
        const expectedStyles = `
					import styled from "styled-components";

					export const ${rootClass} = styled.${rootTag}\`
						${builder.defaultCssRules}	
					\`;
        `;
        const styles = result.standalone!.content;
        expectCodeToEq(styles, expectedStyles);
        const ext = ts ? '.ts' : '.js';
        const jsx = j(result.jsx).toSource();
        const imports = j(result.imports!).toSource();
        expect(result.standalone!.filename).to.eq(`${filename}${ext}`);
        expectCodeToEq(jsx, expectedJsx);
        expectCodeToEq(imports, expectedImports);
      });
    });
  });
});
