import { IComponentStoriesBuilder } from './interface';
import j from 'jscodeshift';
import { stringifyAst } from '../../utils/ast';
import {
  SB_EXAMPLE_EXPORT_NAME,
  SB_META_EXPORT_NAME,
  SB_META_IMPORT_NAME,
} from './constants';
import { injectable } from 'inversify';

@injectable()
export class ComponentStoriesBuilder implements IComponentStoriesBuilder {
  private componentName = 'Component';
  private componentImportPath = './index';
  private useTs = false;

  withComponentName(name: string) {
    this.componentName = name;
    return this;
  }
  withTypescript() {
    this.useTs = true;
    return this;
  }
  reset() {
    this.componentName = 'Component';
    this.componentImportPath = './index';
    return this;
  }
  withComponentImportPath(path: string) {
    this.componentImportPath = path;
    return this;
  }
  build(): string {
    return [this.buildImports(), this.buildExports()].join('\n\n');
  }
  private buildExports(): string {
    const metaIdentifier = j.identifier(SB_META_EXPORT_NAME);
    if (this.useTs) {
      metaIdentifier.typeAnnotation = j.tsTypeAnnotation(
        j.tsTypeReference(j.identifier(SB_META_IMPORT_NAME))
      );
    }
    const meta = j.variableDeclaration('const', [
      j.variableDeclarator(
        metaIdentifier,
        j.objectExpression([
          j.objectProperty(
            j.identifier('component'),
            j.identifier(this.componentName)
          ),
          j.objectProperty(
            j.identifier('title'),
            j.stringLiteral(this.componentName)
          ),
        ])
      ),
    ]);
    const exampleIdentifier = j.identifier(SB_EXAMPLE_EXPORT_NAME);
    if (this.useTs) {
      exampleIdentifier.typeAnnotation = j.tsTypeAnnotation(
        j.tsTypeReference(j.identifier('React.VFC'))
      );
    }
    const example = j.variableDeclaration('const', [
      j.variableDeclarator(
        exampleIdentifier,
        j.arrowFunctionExpression(
          [],
          j.jsxElement(
            j.jsxOpeningElement(j.jsxIdentifier(this.componentName), [], true)
          )
        )
      ),
    ]);
    return stringifyAst([
      meta,
      j.exportDefaultDeclaration(j.identifier(SB_META_EXPORT_NAME)),
      j.exportDeclaration(false, example),
    ]);
  }
  private buildImports(): string {
    return stringifyAst(
      [
        j.importDeclaration(
          [j.importDefaultSpecifier(j.identifier('React'))],
          j.literal('react')
        ),
        this.useTs &&
          (j.importDeclaration(
            [j.importSpecifier(j.identifier(SB_META_IMPORT_NAME))],
            j.literal('@storybook/react')
          ) as any),
        j.importDeclaration(
          [j.importDefaultSpecifier(j.identifier(this.componentName))],
          j.literal(this.componentImportPath)
        ),
      ].filter(Boolean)
    );
  }
}
