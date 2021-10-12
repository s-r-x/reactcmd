import { AbstractStyledStyleBuilder } from '../abstract-styled';
import j from 'jscodeshift';

export class LinariaStyleBuilder extends AbstractStyledStyleBuilder {
  protected styledImport = j.importDeclaration(
    [j.importSpecifier(j.identifier('styled'))],
    j.literal('@linaria/react')
  );
}
