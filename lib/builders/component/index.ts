import { injectable } from 'inversify';
import j from 'jscodeshift';
import _ from 'lodash';
import { Maybe, TStringDict } from '../../typings/utils';
import {
  DEFAULT_COMPONENT_NAME,
  DEFAULT_IMPORTS,
  DEFAULT_PROPS,
  DEFAULT_TAG,
  ENABLE_TS_BY_DEFAULT,
  IS_CLASS_BY_DEFAULT,
  IS_PURE_BY_DEFAULT,
  PROPS_TYPE_IDENTIFIER,
  USE_MOBX_BY_DEFAULT,
  USE_REDUX_BY_DEFAULT,
} from './constants';

@injectable()
export class ComponentBuilder {
  private imports: j.ImportDeclaration[] = DEFAULT_IMPORTS;
  private hocs: string[] = [];
  private jsx: Maybe<j.JSXElement> = null;
  private componentName = DEFAULT_COMPONENT_NAME;
  private isClass = IS_CLASS_BY_DEFAULT;
  private isPure = IS_PURE_BY_DEFAULT;
  private useTs = ENABLE_TS_BY_DEFAULT;
  private props = DEFAULT_PROPS;
  private useMobx = USE_MOBX_BY_DEFAULT;
  private useRedux = USE_REDUX_BY_DEFAULT;
  private tag = DEFAULT_TAG;

  static new() {
    return new this();
  }
  static buildDefaultJsx(tag: string = DEFAULT_TAG): j.JSXElement {
    return j.jsxElement(
      j.jsxOpeningElement(j.jsxIdentifier(tag), []),
      j.jsxClosingElement(j.jsxIdentifier(tag)),
      [j.stringLiteral('^_^')]
    );
  }
  reset() {
    this.hocs = [];
    this.jsx = null;
    this.imports = DEFAULT_IMPORTS;
    this.componentName = DEFAULT_COMPONENT_NAME;
    this.isClass = IS_CLASS_BY_DEFAULT;
    this.isPure = IS_PURE_BY_DEFAULT;
    this.useTs = ENABLE_TS_BY_DEFAULT;
    this.useMobx = USE_MOBX_BY_DEFAULT;
    this.useRedux = USE_REDUX_BY_DEFAULT;
    this.props = DEFAULT_PROPS;
    this.tag = DEFAULT_TAG;
    return this;
  }
  withMobx() {
    this.useMobx = true;
    return this;
  }
  withRedux() {
    this.useRedux = true;
    return this;
  }
  withJsx(jsx: j.JSXElement) {
    this.jsx = jsx;
    return this;
  }
  withTag(tag: string) {
    this.tag = tag;
    return this;
  }
  makePure() {
    this.isPure = true;
    return this;
  }
  withProps(props: TStringDict) {
    this.props = props;
    return this;
  }
  withTypescript() {
    this.useTs = true;
    return this;
  }
  withComponentName(name: string) {
    this.componentName = name;
    return this;
  }
  asClassComponent() {
    this.isClass = true;
    return this;
  }
  asFC() {
    this.isClass = false;
    return this;
  }
  withExtraImports(imports: j.ImportDeclaration[]) {
    this.imports = this.imports.concat(imports);
    return this;
  }
  withExtraHocs(hocs: string[]) {
    this.hocs = this.hocs.concat(hocs);
    return this;
  }
  build(): string {
    return [
      this.buildImports(),
      this.useTs && this.buildPropsDeclaration(),
      this.buildComponentDeclaration(),
      this.buildDefaultExport(),
    ]
      .filter(Boolean)
      .join('\n\n');
  }
  buildImports(): string {
    return this.stringifyAst(this.finalImports);
  }
  buildDefaultExport() {
    const ast = this.finalHocs.reduceRight((acc, exp) => {
      return j.callExpression(j.identifier(exp), [acc]);
    }, j.identifier(this.componentName) as j.Identifier | j.CallExpression);
    return this.stringifyAst(j.exportDefaultDeclaration(ast));
  }
  private stringifyAst(...args: Parameters<typeof j>): string {
    const source = j(...args).toSource();
    if (Array.isArray(source)) {
      return source.join('\n');
    }
    return source;
  }
  public buildPropsDeclaration(): string {
    const props = j.tsInterfaceDeclaration(
      j.identifier(PROPS_TYPE_IDENTIFIER),
      j.tsInterfaceBody([
        //j.tsPropertySignature(
        //  j.identifier('name'),
        //  j.tsTypeAnnotation(j.tsStringKeyword()),
        //  true
        //),
      ])
    );
    return this.stringifyAst(props);
  }
  public buildComponentDeclaration(): string {
    const component = this.isClass
      ? this.buildClassComponentDeclaration()
      : this.buildFCDeclaration();
    return this.stringifyAst(component);
  }
  private buildFCDeclaration(): j.VariableDeclaration {
    const identifier = j.identifier(this.componentName);
    if (this.useTs) {
      identifier.typeAnnotation = j.typeAnnotation(
        j.genericTypeAnnotation(
          j.identifier('React.FC'),
          j.typeParameterInstantiation([j.typeParameter(PROPS_TYPE_IDENTIFIER)])
        )
      );
    }
    return j.variableDeclaration('const', [
      j.variableDeclarator(
        identifier,
        j.arrowFunctionExpression(
          [j.identifier('props')],
          j.blockStatement([j.returnStatement(this.finalJsx)])
        )
      ),
    ]);
  }
  private buildClassComponentDeclaration(): j.ClassDeclaration {
    {
      const genericProps = this.useTs ? `<${PROPS_TYPE_IDENTIFIER}>` : '';
      const superIdentifier = j.identifier(
        `React.${this.isPure ? `PureComponent` : 'Component'}${genericProps}`
      );
      const cls = j.classDeclaration(
        j.identifier(this.componentName),
        j.classBody([
          j.methodDefinition(
            'method',
            j.identifier('render'),
            j.functionExpression(
              null,
              [],
              j.blockStatement([j.returnStatement(this.finalJsx)])
            )
          ),
        ]),
        superIdentifier
      );
      return cls;
    }
  }
  private get finalImports(): j.ImportDeclaration[] {
    return [
      ...this.imports,
      this.useMobx &&
        j.importDeclaration(
          [j.importSpecifier(j.identifier('observer'))],
          j.literal('mobx')
        ),
      this.useRedux &&
        j.importDeclaration(
          [j.importSpecifier(j.identifier('connect'))],
          j.literal('react-redux')
        ),
    ].filter(Boolean) as j.ImportDeclaration[];
  }
  private get finalJsx(): j.JSXElement {
    if (this.jsx) return this.jsx;
    return ComponentBuilder.buildDefaultJsx(this.tag);
  }
  private get finalHocs(): string[] {
    return [
      ...this.hocs,
      this.useMobx && 'observer',
      // this.useRedux && 'connect((state) => {})',
      this.isPure && !this.isClass && 'React.memo',
    ].filter(Boolean) as string[];
  }
}
