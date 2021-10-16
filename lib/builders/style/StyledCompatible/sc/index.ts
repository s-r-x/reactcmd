import j from 'jscodeshift';
import { StyledCompatibleStyleBuilder } from '..';

export class ScStyleBuilder extends StyledCompatibleStyleBuilder {
  protected get styledImport() {
    return j.importDeclaration(
      [j.importDefaultSpecifier(j.identifier('styled'))],
      j.literal('styled-components')
    );
  }
}
