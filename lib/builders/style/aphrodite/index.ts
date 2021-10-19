import type {
  IStyleBuildArtifacts,
  TNormalizedStyleBuildSpec as TSpec,
} from '../interface';
import { AbstractStyleBuilder } from '../abstract';
import j from 'jscodeshift';
import { aphroditeStylesTemplate as stylesTmpl } from './templates';

export class AphroditeStyleBuilder extends AbstractStyleBuilder {
  readonly stylesExport = 'styles';
  protected buildArtifacts({
    rootClass,
    rootTag: tag,
    file,
    jsxChildren,
  }: TSpec): IStyleBuildArtifacts {
    const { stylesExport } = this;
    const content = stylesTmpl({
      exportName: this.stylesExport,
      rootClass,
    });
    return {
      standalone: {
        filename: file.nameWithExt,
        content,
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
                j.memberExpression(
                  j.identifier(stylesExport),
                  j.stringLiteral(rootClass),
                  true
                ),
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
