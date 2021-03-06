import type {
  TNormalizedStyleBuildSpec as TSpec,
  IStyleBuildArtifacts,
} from '../interface';
import { AbstractStyleBuilder } from '../abstract';
import j from 'jscodeshift';
import { stringifyAst } from '../../../utils/ast';

// abstract class for styled-components/linaria/emotion
export abstract class StyledCompatibleStyleBuilder extends AbstractStyleBuilder {
  readonly nsExport = 'S';
  abstract readonly styledImport: j.ImportDeclaration;
  protected override usePascalCaseForRootClass = true;
  protected buildArtifacts({
    rootTag: tag,
    rootClass,
    file,
    jsxChildren,
  }: TSpec): IStyleBuildArtifacts {
    const exp = j.exportDeclaration(
      false,
      j.variableDeclaration('const', [
        j.variableDeclarator(
          j.identifier(rootClass),
          j.taggedTemplateExpression(
            j.memberExpression(j.identifier('styled'), j.identifier(tag)),
            j.templateLiteral([], [])
          )
        ),
      ])
    );
    const jsxTag = j.jsxMemberExpression(
      j.jsxIdentifier(this.nsExport),
      j.jsxIdentifier(rootClass)
    );
    const content = [stringifyAst(this.styledImport), stringifyAst(exp)].join(
      '\n\n'
    );
    return {
      standalone: {
        filename: file.nameWithExt,
        content,
      },
      imports: [
        j.importDeclaration(
          [j.importNamespaceSpecifier(j.identifier(this.nsExport))],
          j.literal(`./${file.name}`)
        ),
      ],
      jsx: j.jsxElement(
        j.jsxOpeningElement(jsxTag, []),
        j.jsxClosingElement(jsxTag),
        jsxChildren
      ),
    };
  }
}
