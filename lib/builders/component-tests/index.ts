import { injectable } from 'inversify';
import { reactTestingLibraryTemplate as rtlTmpl } from './templates/react-testing-library';
import { enzymeTemplate as enzymeTmpl } from './templates/enzyme';
import type {
  IBuildComponentTestsSpec,
  IComponentTestsBuilder,
} from './interface';
import { TTestLib } from '../../typings/testing';
import { TemplateExecutor } from 'lodash';

@injectable()
export class ComponentTestsBuilder implements IComponentTestsBuilder {
  build(spec: IBuildComponentTestsSpec): string {
    return this.getTmpl(spec.lib)({
      componentName: spec.name,
      importPath: spec.importPath,
    });
  }
  private getTmpl(lib: TTestLib): TemplateExecutor {
    switch (lib) {
      case 'enzyme':
        return enzymeTmpl;
      case 'rtl':
        return rtlTmpl;
      default:
        return rtlTmpl;
    }
  }
}
