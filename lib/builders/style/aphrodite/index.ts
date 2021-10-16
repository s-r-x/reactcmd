import {
  IStyleBuildArtifacts,
  TNormalizedStyleBuildSpec as TSpec,
} from '../interface';
import { AbstractStyleBuilder } from '../abstract';
import j from 'jscodeshift';

export class AphroditeStyleBuilder extends AbstractStyleBuilder {
  readonly stylesExport = 'styles';
  protected buildArtifacts({
    rootClass,
    rootTag: tag,
    file,
    jsxChildren,
  }: TSpec): IStyleBuildArtifacts {
    const { stylesExport } = this;
    return {
      standalone: {
        filename: file.nameWithExt,
        content: `
          import { StyleSheet } from 'aphrodite';

          export const ${stylesExport} = StyleSheet.create({
            ${rootClass}: {}
          });
				`,
      },
      imports: [
        j.importDeclaration(
          [j.importSpecifier(j.identifier('css'))],
          j.literal('aphrodite')
        ),
        j.importDeclaration(
          [j.importSpecifier(j.identifier(this.stylesExport))],
          j.literal(`./${file.name}`)
        ),
      ],
      jsx: j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier(tag), [
          j.jsxAttribute(
            j.jsxIdentifier('className'),
            j.jsxExpressionContainer(
              j.callExpression(j.identifier('css'), [
                j.identifier(`${stylesExport}.${rootClass}`),
              ])
            )
          ),
        ]),
        j.jsxClosingElement(j.jsxIdentifier(tag)),
        jsxChildren
      ),
    };
  }
}
