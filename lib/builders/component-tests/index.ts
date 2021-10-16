import { injectable } from 'inversify';
import { IBuildComponentTestsSpec, IComponentTestsBuilder } from './interface';
import { reactTestingLibraryTemplate as tmpl } from './templates/react-testing-library';

@injectable()
export class ComponentTestsBuilder implements IComponentTestsBuilder {
  build(spec: IBuildComponentTestsSpec): string {
    return tmpl({
      componentName: spec.name,
      importPath: spec.importPath,
    });
  }
}
