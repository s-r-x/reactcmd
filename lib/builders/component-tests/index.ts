import { injectable } from 'inversify';
import { reactTestingLibraryTemplate as tmpl } from './templates/react-testing-library';
import type {
  IBuildComponentTestsSpec,
  IComponentTestsBuilder,
} from './interface';

@injectable()
export class ComponentTestsBuilder implements IComponentTestsBuilder {
  build(spec: IBuildComponentTestsSpec): string {
    return tmpl({
      componentName: spec.name,
      importPath: spec.importPath,
    });
  }
}
