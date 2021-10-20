import _ from 'lodash';
import type { IStyleBuilder } from '../interface';
import { CssStyleBuilder } from './css';
import { expectCodeToEq } from '../../../../tests/utils/expect-code-to-eq';
import { expect } from 'chai';
import j from 'jscodeshift';
import { LessStyleBuilder } from './less';
import { ScssStyleBuilder } from './scss';
import {
  CSS_MODULES_CLASSES_IMPORT_NAME,
  DEFAULT_CSS_RULES,
  DEFAULT_STYLUS_CSS_RULES,
} from '../constants';
import { StylusStyleBuilder } from './stylus';
import { stringifyAst } from '../../../utils/ast';

const builders: [constructor: new () => IStyleBuilder, ext: string][] = [
  [CssStyleBuilder, 'css'],
  [LessStyleBuilder, 'less'],
  [ScssStyleBuilder, 'scss'],
  [StylusStyleBuilder, 'styl'],
];
builders.forEach(([Builder, ext]) => {
  const isStylus = ext === 'styl';
  describe(`${_.capitalize(ext)}StyleBuilder`, () => {
    describe('build', () => {
      describe('should generate correct style artifacts', () => {
        (
          [
            ['span', 'my-class', 'style', false],
            ['div', 'another-class', 'my-style', true],
          ] as [string, string, string, boolean][]
        ).forEach(([rootTag, rootClass, filename, cssModules]) => {
          it(`tag: ${rootTag}, class: ${rootClass}, filename: ${filename}`, () => {
            const children = `jsx children for ${ext}`;
            const builder = new Builder();
            const result = builder.build({
              rootTag,
              rootClass,
              cssModules,
              filename,
              jsxChildren: [j.literal(children)],
            });
            const expectedFilename = cssModules
              ? filename + '.module' + '.' + ext
              : filename + '.' + ext;
            const expectedJsx = cssModules
              ? `
					    <${rootTag} className={${CSS_MODULES_CLASSES_IMPORT_NAME}["${rootClass}"]}>${children}</${rootTag}>	
            `
              : `
					    <${rootTag} className="${rootClass}">${children}</${rootTag}>	
				    `;
            const expectedImports = cssModules
              ? `
					    import ${CSS_MODULES_CLASSES_IMPORT_NAME} from "./${expectedFilename}";	
            `
              : `
					    import "./${expectedFilename}";	
				    `;
            let expectedStyles: string;
            if (isStylus) {
              expectedStyles = `.${rootClass}\n\t${DEFAULT_STYLUS_CSS_RULES}`;
            } else {
              expectedStyles = `
          	    .${rootClass} {
          		    ${DEFAULT_CSS_RULES};
          	    }
          `;
            }

            const jsx = stringifyAst(result.jsx);
            const imports = stringifyAst(result.imports!);
            const styles = result.standalone!.content;
            expect(result.standalone!.filename).to.eq(expectedFilename);
            expectCodeToEq(jsx, expectedJsx);
            expectCodeToEq(imports, expectedImports);
            if (isStylus) {
              expect(expectedStyles).to.eq(styles);
            } else {
              expectCodeToEq(styles, expectedStyles, { parser: ext });
            }
          });
        });
      });
    });
  });
});
