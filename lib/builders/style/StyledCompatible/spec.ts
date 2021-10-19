import { expect } from 'chai';
import { StyledCompatibleStyleBuilder } from '.';
import { expectCodeToEq } from '../../../../tests/utils/expect-code-to-eq';
import { stringifyAst } from '../../../utils/ast';
import { pascalCase } from '../../../utils/pascal-case';
import { EmotionStyleBuilder } from './emotion';
import { LinariaStyleBuilder } from './linaria';
import { ScStyleBuilder } from './sc';
import j from 'jscodeshift';

const builders: [
  constructor: new () => StyledCompatibleStyleBuilder,
  name: string
][] = [
  [ScStyleBuilder, 'Sc'],
  [LinariaStyleBuilder, 'Linaria'],
  [EmotionStyleBuilder, 'Emotion'],
];
builders.forEach(([Builder, name]) => {
  describe(`${name}StyleBuilder`, () => {
    describe('build', () => {
      describe('should generate correct style artifacts', () => {
        (
          [
            ['span', 'my-class', 'style', false],
            ['div', 'another-class', 'my-style', true],
          ] as [tag: string, cls: string, filename: string, ts: boolean][]
        ).forEach(([rootTag, rootClass, filename, ts]) => {
          it(`tag: ${rootTag}, class: ${rootClass}, filename: ${filename}, ts: ${ts}`, () => {
            const finalClass = pascalCase(rootClass);
            const children = 'jsx children';
            const builder = new Builder();
            const result = builder.build({
              rootClass,
              rootTag,
              ts,
              filename,
              jsxChildren: [j.literal(children)],
            });
            const jsx = stringifyAst(result.jsx);
            const expectedJsx = `
					    <${builder.nsExport}.${finalClass}>${children}</${builder.nsExport}.${finalClass}>	
				    `;
            expect(result.standalone!.filename).to.eq(
              filename + (ts ? '.ts' : '.js')
            );

            expectCodeToEq(jsx, expectedJsx);
            expectCodeToEq(
              `
								${stringifyAst(builder.styledImport)};

								export const ${finalClass} = styled.${rootTag}\`\`;
							`,
              result.standalone!.content
            );
            expectCodeToEq(
              `
								import * as ${builder.nsExport} from "./${result.standalone!.filename.slice(
                0,
                -3
              )}"

							`,
              stringifyAst(result.imports!)
            );
            expectCodeToEq;
          });
        });
      });
    });
  });
});
