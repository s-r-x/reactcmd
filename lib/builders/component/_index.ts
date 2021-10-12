import { Maybe } from '../../typings/utils';

export class ComponentBuilder {
  private useMemo = false;
  private styleSpec: Maybe<any> = null;
  private isClass = false;
  private name = 'MyComponent';
  private lang: 'ts' | 'js' = 'js';
  private shouldMemoize = false;
  private shouldUsePT = false;
  private shouldUseRedux = false;

  useTypescript() {
    this.lang = 'ts';
    return this;
  }
  useJavascript() {
    this.lang = 'js';
    return this;
  }
  asClass() {
    this.isClass = true;
    return this;
  }
  asFC() {
    this.isClass = false;
    return this;
  }
  withMemo() {
    this.shouldMemoize = true;
    return this;
  }
  withPropTypes() {
    this.shouldUsePT = true;
    return this;
  }
  withStyleSpec(spec: Maybe<any>) {
    this.styleSpec = spec;
    return this;
  }
  withRedux() {
    this.shouldUseRedux = true;
    return this;
  }
  withName(name: string) {
    this.name = name;
    return this;
  }
  render() {
    return '1';
  }
}
