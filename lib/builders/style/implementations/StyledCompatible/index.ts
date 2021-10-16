import type {
  TNormalizedStyleBuildSpec as TSpec,
  IStyleBuildArtifacts,
} from '../../interface';
import { AbstractStyleBuilder } from '../abstract';
import j from 'jscodeshift';
import { DEFAULT_CSS_RULES } from '../../constants';

// abstract class for styled-components/linaria/emotion
export abstract class StyledCompatibleStyleBuilder extends AbstractStyleBuilder {
  readonly nsExport = 'S';
  protected abstract styledImport: j.ImportDeclaration;
  protected override usePascalCaseForRootClass = true;
  protected override defaultFilename = 'styled';
  protected buildArtifacts({
    rootTag: tag,
    rootClass,
    file,
    jsxChildren,
  }: TSpec): IStyleBuildArtifacts {
    const jsxTag = `${this.nsExport}.${rootClass}`;
    return {
      standalone: {
        filename: file.nameWithExt,
        content: `
					${j(this.styledImport).toSource()};

					export const ${rootClass} = styled.${tag}\`
            ${DEFAULT_CSS_RULES} 
          \`;
				`,
      },
      imports: [
        j.importDeclaration(
          [j.importNamespaceSpecifier(j.identifier(this.nsExport))],
          j.literal(`./${file.name}`)
        ),
      ],
      jsx: j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier(jsxTag), []),
        j.jsxClosingElement(j.jsxIdentifier(jsxTag)),
        jsxChildren
      ),
    };
  }
}
