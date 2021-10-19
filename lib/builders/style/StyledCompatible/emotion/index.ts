import j from 'jscodeshift';
import { StyledCompatibleStyleBuilder } from '..';

export class EmotionStyleBuilder extends StyledCompatibleStyleBuilder {
  get styledImport() {
    return j.importDeclaration(
      [j.importDefaultSpecifier(j.identifier('styled'))],
      j.literal('@emotion/styled')
    );
  }
}
