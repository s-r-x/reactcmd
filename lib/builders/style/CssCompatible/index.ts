import type {
  TNormalizedStyleBuildSpec as TSpec,
  IStyleBuildArtifacts,
} from '../interface';
import { AbstractStyleBuilder } from '../abstract';
import j from 'jscodeshift';
import { DEFAULT_CSS_RULES } from '../constants';

// abstract class for css/less/scss/stylus
export abstract class CssCompatibleStyleBuilder extends AbstractStyleBuilder {
  protected buildArtifacts({
    rootTag: tag,
    rootClass,
    jsxChildren,
    file,
  }: TSpec): IStyleBuildArtifacts {
    const content = this.buildStyles(rootClass);
    return {
      standalone: {
        filename: file.nameWithExt,
        content,
      },
      imports: [j.importDeclaration([], j.literal(`./${file.nameWithExt}`))],
      jsx: j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier(tag), [
          j.jsxAttribute(
            j.jsxIdentifier('className'),
            j.stringLiteral(rootClass)
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
