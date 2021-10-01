import { expect } from 'chai';
import { ModuleExportsBuilder as Builder } from '.';
import { expectCodeToEq } from '../../tests/expect-generated-code-to-eq';

describe('ModuleExportsBuilder', () => {
  describe('render', () => {
    it('should generate correct output for default export', () => {
      const expected = 'export default Component';
      const builder = new Builder();
      builder.addExport({
        type: 'default',
        name: 'Component',
      });
      expectCodeToEq(builder.render(), expected);
    });
    it('should and apply hocs to default export', () => {
      const expected =
        'export default connect(state => ({}), {})(withSomething(withRouter(Component)))';
      const builder = new Builder();
      builder.addExport({
        type: 'default',
        name: 'Component',
        hocs: ['connect(state => ({}), {})', 'withSomething', 'withRouter'],
      });
      expectCodeToEq(builder.render(), expected);
    });
    it('should generate correct output for named export', () => {
      const expected = 'export { Component };';
      const builder = new Builder();
      builder.addExport({
        type: 'named',
        name: 'Component',
      });
      expectCodeToEq(builder.render(), expected);
    });
    it('should generate correct output for named export with alias', () => {
      const expected = 'export { Component as Another };';
      const builder = new Builder();
      builder.addExport({
        type: 'named',
        name: 'Component',
        alias: 'Another',
      });
      expectCodeToEq(builder.render(), expected);
    });
    it('should generate correct output for multiple named exports', () => {
      const expected = `export { Component, Component2 };`;
      const builder = new Builder();
      builder
        .addExport({
          type: 'named',
          name: 'Component',
        })
        .addExport({
          type: 'named',
          name: 'Component2',
        });
      expectCodeToEq(builder.render(), expected);
    });
    it('should generate correct output for mixed exports', () => {
      const expected = `
				export default Hoc(Main);
				export { Component as Another, Component2 };
			`;
      const builder = new Builder();
      builder
        .addExport({
          type: 'default',
          name: 'Main',
          hocs: ['Hoc'],
        })
        .addExport({
          type: 'named',
          name: 'Component',
          alias: 'Another',
        })
        .addExport({
          type: 'named',
          name: 'Component2',
        });
      expectCodeToEq(builder.render(), expected);
    });
    it('should filter out multiple default exports', () => {
      const expected = `
				export default Last;
			`;
      const builder = new Builder();
      builder
        .addExport({
          type: 'default',
          name: 'First',
        })
        .addExport({
          type: 'default',
          name: 'Last',
        });
      expectCodeToEq(builder.render(), expected);
    });
  });
  describe('reset', () => {
    it('should reset named and default exports', () => {
      const expected = `export { N3 };`;
      const builder = new Builder();
      builder
        .addExport({
          type: 'default',
          name: 'N1',
        })
        .addExport({
          type: 'named',
          name: 'N2',
        })
        .reset()
        .addExport({
          type: 'named',
          name: 'N3',
        });
      expectCodeToEq(builder.render(), expected);

      builder.reset();
      expect(builder.render()).to.be.empty.string;
    });
  });
});
