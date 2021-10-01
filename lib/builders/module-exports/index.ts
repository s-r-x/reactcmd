import {
  IDefaultModuleExportsSpec,
  INamedModuleExportsSpec,
  IRemoveExportDto,
  TModuleExportsSpec,
} from './interface';
import _, { isEmpty } from 'lodash';
import { Maybe } from '../../typings/utils';
import { injectable } from 'inversify';

@injectable()
export class ModuleExportsBuilder {
  private namedExports: INamedModuleExportsSpec[] = [];
  private defaultExport: Maybe<IDefaultModuleExportsSpec> = null;
  render(): string {
    return [this.renderDefaultExport(), this.renderNamedExports()]
      .filter(Boolean)
      .join('');
  }
  addExport(spec: TModuleExportsSpec) {
    if (spec.type === 'default') {
      this.defaultExport = spec;
    } else {
      this.namedExports.push(spec);
    }
    return this;
  }
  removeExport({ type, name }: IRemoveExportDto) {
    if (type === 'default') {
      this.defaultExport = null;
    } else {
      this.namedExports.filter(e => e.type !== type && e.name !== name);
    }
    return this;
  }
  reset() {
    this.namedExports = [];
    this.defaultExport = null;
    return this;
  }
  private applyHocs(hocs: string[], name: string): string {
    return hocs.reduceRight((acc, hoc) => {
      return `${hoc}(${acc})`;
    }, name);
  }
  private renderDefaultExport(): Maybe<string> {
    const spec = this.defaultExport;
    if (!spec) return null;
    const finalName = isEmpty(spec.hocs)
      ? spec.name
      : this.applyHocs(spec.hocs!, spec.name);
    return `export default ${finalName};`;
  }
  private renderNamedExports(): Maybe<string> {
    const specs = this.namedExports;
    if (_.isEmpty(specs)) {
      return null;
    }
    const head = 'export {';
    const payload = specs
      .map(({ name, alias }) => (alias ? `${name} as ${alias}` : name))
      .join(',');
    const tail = ' };';
    return head + payload + tail;
  }
}
