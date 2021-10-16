import _ from 'lodash';
import { IStyleBuilder } from '../../interface';
import { CssStyleBuilder } from './css';
import { expectCodeToEq } from '../../../../tests/expect-generated-code-to-eq';
import { expect } from 'chai';
import j from 'jscodeshift';
import { LessStyleBuilder } from './less';
import { ScssStyleBuilder } from './scss';
import { DEFAULT_CSS_RULES } from '../../constants';

const builders: [constructor: new () => IStyleBuilder, ext: string][] = [
  [CssStyleBuilder, 'css'],
  [LessStyleBuilder, 'less'],
  [ScssStyleBuilder, 'scss'],
];
builders.forEach(([Builder, ext]) => {
  describe(`${_.capitalize(ext)}StyleBuilder`, () => {
    describe('build', () => {
      describe('should generate correct style artifacts', () => {
        (
          [
            ['span', 'my-class', 'style'],
            ['div', 'another-class', 'my-style'],
          ] as [string, string, string][]
        ).forEach(([rootTag, rootClass, filename]) => {
          it(`tag: ${rootTag}, class: ${rootClass}, filename: ${filename}`, () => {
            const children = `jsx children for ${ext}`;
            const builder = new Builder();
            const result = builder.build({
              rootTag,
              rootClass,
              filename,
              jsxChildren: [j.literal(children)],
            });
            const expectedJsx = `
					<${rootTag} className="${rootClass}">${children}</${rootTag}>	
				`;
            const expectedImports = `
					import "./${filename}.${ext}";	
				`;
            const expectedStyles = `
          	.${rootClass} {
          		${DEFAULT_CSS_RULES};
          	}
          `;
            const jsx = j(result.jsx).toSource();
            const imports = j(result.imports!).toSource();
            const styles = result.standalone!.content;
            expect(result.standalone!.filename).to.eq(filename + '.' + ext);
            expectCodeToEq(jsx, expectedJsx);
            expectCodeToEq(imports, expectedImports);
            expectCodeToEq(styles, expectedStyles, { parser: ext });
          });
        });
      });
    });
  });
});
