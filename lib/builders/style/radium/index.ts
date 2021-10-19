import type {
  IStyleBuildArtifacts,
  TNormalizedStyleBuildSpec as TSpec,
} from '../interface';
import { AbstractStyleBuilder } from '../abstract';
import j from 'jscodeshift';
import { radiumStylesTemplate as stylesTmpl } from './templates';

export class RadiumStyleBuilder extends AbstractStyleBuilder {
  readonly stylesExport = 'styles';
  readonly radiumDefaultExport = 'Radium';
  protected buildArtifacts({
    file,
    rootTag: tag,
    rootClass,
    jsxChildren,
  }: TSpec): IStyleBuildArtifacts {
    const { stylesExport, radiumDefaultExport } = this;
    const content = stylesTmpl({
      exportName: this.stylesExport,
      rootClass,
    });
    return {
      imports: [
        j.importDeclaration(
          [j.importDefaultSpecifier(j.identifier(radiumDefaultExport))],
          j.literal('radium')
        ),
        j.importDeclaration(
          [j.importSpecifier(j.identifier(stylesExport))],
          j.literal(`./${file.name}`)
        ),
      ],
      standalone: {
        filename: file.nameWithExt,
        content,
      },
      hocs: [radiumDefaultExport],
      jsx: j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier(tag), [
          j.jsxAttribute(
            j.jsxIdentifier('style'),
            j.jsxExpressionContainer(
              j.memberExpression(
                j.identifier(stylesExport),
                j.stringLiteral(rootClass),
                true
              )
            )
          ),
        ]),
        j.jsxClosingElement(j.jsxIdentifier(tag)),
        jsxChildren
      ),
    };
  }
}
