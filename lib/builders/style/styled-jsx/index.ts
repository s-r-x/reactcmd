import {
  IStyleBuildArtifacts,
  TNormalizedStyleBuildSpec as TSpec,
} from '../interface';
import { AbstractStyleBuilder } from '../abstract';
import j from 'jscodeshift';

export class StyledJsxStyleBuilder extends AbstractStyleBuilder {
  protected buildArtifacts({
    rootClass,
    rootTag: tag,
    jsxChildren,
  }: TSpec): IStyleBuildArtifacts {
    return {
      standalone: null,
      jsx: j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier(tag), [
          j.jsxAttribute(
            j.jsxIdentifier('className'),
            j.stringLiteral(rootClass)
          ),
        ]),
        j.jsxClosingElement(j.jsxIdentifier(tag)),
        [
          ...jsxChildren,
          j.jsxElement(
            j.jsxOpeningElement(
              j.jsxIdentifier('style'),
              [j.jsxAttribute(j.jsxIdentifier('jsx'))],
              true
            ),
            null
          ),
        ]
      ),
    };
  }
}
