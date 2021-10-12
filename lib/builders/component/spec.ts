import { ComponentBuilder as Builder } from '.';
import j from 'jscodeshift';
import { expectCodeToEq } from '../../tests/expect-generated-code-to-eq';
import { DEFAULT_COMPONENT_NAME } from './constants';

describe.only('ComponentBuilder', () => {
  describe('buildDefaultExport', () => {
    it('should build correct export without hocs', () => {
      const builder = new Builder();
      const exp = builder.withComponentName('MyComponent').buildDefaultExport();
      expectCodeToEq(j(exp).toSource(), 'export default MyComponent');
    });
    it('should build correct export and apply memo HOC if the component is pure and FC', () => {
      expectCodeToEq(
        j(
          Builder.new()
            .withComponentName('MyComponent')
            .makePure()
            .buildDefaultExport()
        ).toSource(),
        'export default React.memo(MyComponent)'
      );
    });
    it('should not apply memo HOC if the component is pure and Class', () => {
      expectCodeToEq(
        j(
          Builder.new().makePure().asClassComponent().buildDefaultExport()
        ).toSource(),
        `export default ${DEFAULT_COMPONENT_NAME}`
      );
    });
    it('should apply all provided hocs', () => {
      expectCodeToEq(
        j(
          Builder.new()
            .makePure()
            .withExtraHocs(['First', 'Second'])
            .buildDefaultExport()
        ).toSource(),
        `export default First(Second(React.memo(${DEFAULT_COMPONENT_NAME})))`
      );
    });
  });
  describe('buildImports', () => {
    it('should include react import by default', () => {
      expectCodeToEq(
        j(Builder.new().buildImports()).toSource(),
        "import React from 'react'"
      );
    });
  });
});
