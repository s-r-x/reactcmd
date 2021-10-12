import j from 'jscodeshift';
import { IStyleBuildArtifacts } from '../style/interface';
import _ from 'lodash';
import { Maybe } from '../../typings/utils';
import { DEFAULT_COMPONENT_NAME, DEFAULT_IMPORTS } from './constants';

export class ComponentBuilder {
  private imports: j.ImportDeclaration[] = DEFAULT_IMPORTS;
  private hocs: string[] = [];
  private jsx: Maybe<j.JSXElement> = null;
  private componentName = DEFAULT_COMPONENT_NAME;
  private isClass = false;
  private isPure = false;
  private useTs = false;

  static new() {
    return new this();
  }
  reset() {
    this.hocs = [];
    this.jsx = null;
    this.imports = DEFAULT_IMPORTS;
    this.componentName = DEFAULT_COMPONENT_NAME;
    this.isClass = false;
    this.isPure = false;
    this.useTs = false;
    return this;
  }
  withStyleSpec(spec: IStyleBuildArtifacts) {
    if (!_.isEmpty(spec.imports)) {
      this.imports = this.imports.concat(spec.imports!);
    }
    if (!_.isEmpty(spec.hocs)) {
      this.hocs = this.hocs.concat(spec.hocs!);
    }
    if (spec.jsx) {
      this.jsx = spec.jsx;
    }
    return this;
  }
  makePure() {
    this.isPure = true;
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
  withExtraHocs(hocs: string[]) {
    this.hocs = this.hocs.concat(hocs);
    return this;
  }
  buildImports() {
    return j(this.imports).toSource();
  }
  buildDefaultExport() {
    const ast = this.finalHocs.reduceRight((acc, exp) => {
      return j.callExpression(j.identifier(exp), [acc]);
    }, j.identifier(this.componentName) as j.Identifier | j.CallExpression);
    return j.exportDefaultDeclaration(ast);
  }
  private stringifyAst(...args: Parameters<typeof j>) {
    return j(...args).toSource();
  }
  private get finalHocs() {
    if (this.isClass || !this.isPure) {
      return this.hocs;
    } else {
      return [...this.hocs, 'React.memo'];
    }
  }
}
