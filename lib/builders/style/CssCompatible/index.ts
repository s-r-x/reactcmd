import type {
  TNormalizedStyleBuildSpec as TSpec,
  IStyleBuildArtifacts,
} from '../interface';
import { AbstractStyleBuilder } from '../abstract';
import j from 'jscodeshift';
import {
  CSS_MODULES_CLASSES_IMPORT_NAME as CSS_MODULES_IMPORT,
  DEFAULT_CSS_RULES,
} from '../constants';

// abstract class for css/less/scss/stylus
export abstract class CssCompatibleStyleBuilder extends AbstractStyleBuilder {
  override isCssModulesCompatible = true;
  protected buildArtifacts({
    rootTag: tag,
    rootClass,
    jsxChildren,
    file,
    cssModules,
  }: TSpec): IStyleBuildArtifacts {
    const content = this.buildStyles(rootClass);
    return {
      standalone: {
        filename: file.nameWithExt,
        content,
      },
      imports: cssModules
        ? [
            j.importDeclaration(
              [j.importDefaultSpecifier(j.identifier(CSS_MODULES_IMPORT))],
              j.literal(`./${file.nameWithExt}`)
            ),
          ]
        : [j.importDeclaration([], j.literal(`./${file.nameWithExt}`))],
      jsx: j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier(tag), [
          j.jsxAttribute(
            j.jsxIdentifier('className'),
            cssModules
              ? j.jsxExpressionContainer(
                  j.memberExpression(
                    j.identifier(CSS_MODULES_IMPORT),
                    j.stringLiteral(rootClass),
                    true
                  )
                )
              : j.stringLiteral(rootClass)
          ),
        ]),
        j.jsxClosingElement(j.jsxIdentifier(tag)),
        jsxChildren
      ),
    };
  }
  protected buildStyles(className: string): string {
    return `
      .${className} {
        ${DEFAULT_CSS_RULES}
      }
    `;
  }
}
