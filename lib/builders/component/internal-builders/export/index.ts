type TExportMode = 'named' | 'default';

export class ComponentExportBuilder {
  private hocs: string[] = [];
  private name = '';
  private exportMode: TExportMode = 'default';
  render(): string {
    return this.exportTmpl`${this.finalExportName}`;
  }
  addHoc(hoc: string) {
    this.hocs.push(hoc);
    return this;
  }
  removeHoc(hoc: string) {
    this.hocs = this.hocs.filter(target => target !== hoc);
    return this;
  }
  setExportMode(mode: TExportMode) {
    this.exportMode = mode;
  }
  setName(name: string) {
    this.name = name;
    return this;
  }
  reset() {
    this.hocs = [];
    this.name = '';
    this.exportMode = 'default';
  }
  private get exportTmpl() {
    return this.exportMode === 'default'
      ? this.defaultExportTmpl
      : this.namedExportTmpl;
  }
  private defaultExportTmpl(_str: any, name: string): string {
    return `export default ${name}`;
  }
  private namedExportTmpl(_str: any, name: string): string {
    if (this.hocs.length > 0) {
      return `export { ${name} as ${this.name} }`;
    } else {
      return `export { ${name} }`;
    }
  }
  private get finalExportName(): string {
    return this.hocs.reduce((acc, hoc) => {
      return `${hoc}(${acc})`;
    }, this.name);
  }
}
