import {
  IStyleBuildArtifacts,
  TNormalizedStyleBuildSpec as TSpec,
} from '../interface';
import { AbstractStyleBuilder } from '../abstract';
import j from 'jscodeshift';

export class RadiumStyleBuilder extends AbstractStyleBuilder {
  readonly stylesExport = 'styles';
  protected buildArtifacts({
    file,
    rootTag: tag,
    rootClass,
    jsxChildren,
  }: TSpec): IStyleBuildArtifacts {
    const radiumDefaultExport = 'Radium';
    const { stylesExport } = this;
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
        content: `
          export const ${stylesExport} = {
            ${rootClass}: {}
          };
				`,
      },
      applyHocs(identifier) {
        return j.callExpression(j.identifier(radiumDefaultExport), [
          identifier,
        ]);
      },
      jsx: j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier(tag), [
          j.jsxAttribute(
            j.jsxIdentifier('style'),
            j.jsxExpressionContainer(
              j.identifier(`${stylesExport}.${rootClass}`)
            )
          ),
        ]),
        j.jsxClosingElement(j.jsxIdentifier(tag)),
        jsxChildren
      ),
    };
  }
}
