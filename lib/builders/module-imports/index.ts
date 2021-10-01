import { IModuleImportSpec } from './interface';
import _ from 'lodash';

export class ModuleImportsBuilder {
  private imports: IModuleImportSpec[] = [];
  render(): string {
    return this.imports.map(this.renderRow).join('');
  }
  addImport(spec: IModuleImportSpec) {
    this.imports.push(spec);
  }
  removeImport(from: string) {
    this.imports = this.imports.filter(i => i.from !== from);
  }
  reset() {
    this.imports = [];
  }
  private renderRow = (spec: IModuleImportSpec) => {
    let final = `import ${spec.default || ''}`;
    if (!_.isEmpty(spec.named)) {
      final += `${spec.default ? ',' : ''} { ${spec.named!.join(', ')} }`;
    }
    return final + ` from "${spec.from}";`;
  };
}
