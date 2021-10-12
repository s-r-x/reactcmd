import { AbstractStyledStyleBuilder } from '../abstract-styled';
import j from 'jscodeshift';

export class ScStyleBuilder extends AbstractStyledStyleBuilder {
  protected get styledImport() {
    return j.importDeclaration(
      [j.importDefaultSpecifier(j.identifier('styled'))],
      j.literal('styled-components')
    );
  }
}
