import { IModuleImportSpec } from './interface';
import _ from 'lodash';
import { injectable } from 'inversify';

@injectable()
export class ModuleImportsBuilder {
  private imports: IModuleImportSpec[] = [];
  render(): string {
    return this.imports.map(this.renderRow).join('');
  }
  addImport(spec: IModuleImportSpec) {
    this.imports.push(spec);
    return this;
  }
  removeImport(from: string) {
    this.imports = this.imports.filter(i => i.from !== from);
    return this;
  }
  reset() {
    this.imports = [];
    return this;
  }
  private renderRow = (spec: IModuleImportSpec) => {
    let final = `import ${spec.default || ''}`;
    if (!_.isEmpty(spec.named)) {
      final += `${spec.default ? ',' : ''} { ${spec.named!.join(', ')} }`;
    }
    return final + ` from "${spec.from}";`;
  };
}
