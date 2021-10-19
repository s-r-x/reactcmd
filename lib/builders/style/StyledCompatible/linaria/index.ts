import j from 'jscodeshift';
import { StyledCompatibleStyleBuilder } from '..';

export class LinariaStyleBuilder extends StyledCompatibleStyleBuilder {
  get styledImport() {
    return j.importDeclaration(
      [j.importSpecifier(j.identifier('styled'))],
      j.literal('@linaria/react')
    );
  }
}
