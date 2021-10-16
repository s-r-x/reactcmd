import { LinariaStyleBuilder as Builder } from '.';
import j from 'jscodeshift';
import { expectCodeToEq } from '../../../../../tests/expect-generated-code-to-eq';
import { expect } from 'chai';
import {
  DEFAULT_CSS_RULES,
  DEFAULT_JSX_CHILDREN_STR,
} from '../../../constants';

describe('LinariaStyleBuilder', () => {
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
        const { nsExport } = builder;
        const expectedJsx = `
        	<${nsExport}.${rootClass}>${DEFAULT_JSX_CHILDREN_STR}</${nsExport}.${rootClass}>
        `;
        const expectedImports = `
        	import * as ${nsExport} from "./${filename}";
        `;
        const expectedStyles = `
					import {styled} from "@linaria/react";

					export const ${rootClass} = styled.${rootTag}\`
            ${DEFAULT_CSS_RULES}
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
