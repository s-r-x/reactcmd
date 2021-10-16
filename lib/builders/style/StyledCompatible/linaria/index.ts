import j from 'jscodeshift';
import { StyledCompatibleStyleBuilder } from '..';

export class LinariaStyleBuilder extends StyledCompatibleStyleBuilder {
  protected styledImport = j.importDeclaration(
    [j.importSpecifier(j.identifier('styled'))],
    j.literal('@linaria/react')
  );
}
