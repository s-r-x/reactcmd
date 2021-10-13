import { ComponentBuilder as Builder } from '.';
import j from 'jscodeshift';
import { expectCodeToEq } from '../../tests/expect-generated-code-to-eq';
import { DEFAULT_COMPONENT_NAME, PROPS_TYPE_IDENTIFIER } from './constants';

describe('ComponentBuilder', () => {
  describe('buildDefaultExport', () => {
    it('should build correct export without hocs', () => {
      const builder = new Builder();
      const exp = builder.withComponentName('MyComponent').buildDefaultExport();
      expectCodeToEq(j(exp).toSource(), 'export default MyComponent');
    });
    it('should build correct export and apply memo HOC if the component is pure and FC', () => {
      expectCodeToEq(
        Builder.new()
          .withComponentName('MyComponent')
          .makePure()
          .buildDefaultExport(),
        'export default React.memo(MyComponent)'
      );
    });
    it('should not apply memo HOC if the component is pure and Class', () => {
      expectCodeToEq(
        Builder.new().makePure().asClassComponent().buildDefaultExport(),
        `export default ${DEFAULT_COMPONENT_NAME}`
      );
    });
    it('should apply all provided hocs', () => {
      expectCodeToEq(
        Builder.new()
          .makePure()
          .withExtraHocs(['First', 'Second'])
          .buildDefaultExport(),
        `export default First(Second(React.memo(${DEFAULT_COMPONENT_NAME})))`
      );
    });
  });
  describe('buildImports', () => {
    it('should include react import by default', () => {
      expectCodeToEq(Builder.new().buildImports(), "import React from 'react'");
    });
    it('should include mobx imports', () => {
      expectCodeToEq(
        Builder.new().withMobx().buildImports(),
        `import React from 'react';
         import { observer } from 'mobx';
        `
      );
    });
    it('should include redux imports', () => {
      expectCodeToEq(
        Builder.new().withRedux().buildImports(),
        `import React from 'react';
         import { connect } from 'react-redux';
        `
      );
    });
    it('should include extra imports', () => {
      expectCodeToEq(
        Builder.new()
          .withExtraImports([
            j.importDeclaration(
              [j.importDefaultSpecifier(j.identifier('MyLib'))],
              j.literal('my-lib')
            ),
            j.importDeclaration(
              [j.importDefaultSpecifier(j.identifier('MyLib2'))],
              j.literal('my-lib2')
            ),
          ])
          .buildImports(),
        `import React from 'react';
         import MyLib from 'my-lib';
         import MyLib2 from 'my-lib2';
        `
      );
    });
  });
  describe('buildComponentDeclaration', () => {
    it('should generatate correct jsx with custom tag', () => {
      const tag = 'p';
      const src = Builder.new().withTag(tag).buildComponentDeclaration();
      expectCodeToEq(
        src,
        `
            const ${DEFAULT_COMPONENT_NAME} = props => {
              return ${j(Builder.buildDefaultJsx(tag)).toSource()};
            }
          `
      );
    });
    describe('fc', () => {
      it('should generate correct declaration with typescript', () => {
        const src = Builder.new().withTypescript().buildComponentDeclaration();
        expectCodeToEq(
          src,
          `
            const ${DEFAULT_COMPONENT_NAME}: React.FC<${PROPS_TYPE_IDENTIFIER}> = props => {
              return ${j(Builder.buildDefaultJsx()).toSource()};
            }
          `
        );
      });
      it('should generate correct declaration without typescript', () => {
        const src = Builder.new().buildComponentDeclaration();
        expectCodeToEq(
          src,
          `
            const ${DEFAULT_COMPONENT_NAME} = props => {
              return ${j(Builder.buildDefaultJsx()).toSource()};
            }
          `
        );
      });
    });
    describe('class', () => {
      it('should generate correct declaration with typescript', () => {
        const src = Builder.new()
          .withTypescript()
          .asClassComponent()
          .buildComponentDeclaration();
        expectCodeToEq(
          src,
          `
            class ${DEFAULT_COMPONENT_NAME} extends React.Component<${PROPS_TYPE_IDENTIFIER}> {
              render() {
                return ${j(Builder.buildDefaultJsx()).toSource()};
              }
            }
          `
        );
        console.log(src);
      });
      it('should generate correct declaration for pure component', () => {
        const src = Builder.new()
          .withTypescript()
          .asClassComponent()
          .makePure()
          .buildComponentDeclaration();
        expectCodeToEq(
          src,
          `
            class ${DEFAULT_COMPONENT_NAME} extends React.PureComponent<${PROPS_TYPE_IDENTIFIER}> {
              render() {
                return ${j(Builder.buildDefaultJsx()).toSource()};
              }
            }
          `
        );
      });
      it('should generate correct declaration without typescript', () => {
        const src = Builder.new()
          .asClassComponent()
          .buildComponentDeclaration();
        expectCodeToEq(
          src,
          `
            class ${DEFAULT_COMPONENT_NAME} extends React.Component {
              render() {
                return ${j(Builder.buildDefaultJsx()).toSource()};
              }
            }
          `
        );
      });
    });
  });
  describe('buildPropsDeclaration', () => {
    it('should build correct props declaration', () => {
      const src = Builder.new().buildPropsDeclaration();
      expectCodeToEq(
        src,
        `
        interface ${PROPS_TYPE_IDENTIFIER} {} 
      `
      );
    });
  });
  describe('build', () => {
    it('should build final component', () => {
      const name = 'MyComponent';
      const jsx = j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier('span'), []),
        j.jsxClosingElement(j.jsxIdentifier('span')),
        [j.stringLiteral('final')]
      );
      const expectJsx = j(jsx).toSource();
      const builder = Builder.new()
        .withComponentName(name)
        .withTypescript()
        .asClassComponent()
        .withMobx()
        .withRedux()
        .makePure()
        .withExtraImports([
          j.importDeclaration(
            [j.importDefaultSpecifier(j.identifier('MyLib'))],
            j.literal('my-lib')
          ),
        ])
        .withExtraHocs(['hoc1', 'hoc2'])
        .withJsx(jsx);
      const src = builder.build();
      expectCodeToEq(
        src,
        `
          import React from "react";
          import MyLib from "my-lib";
          import { observer } from 'mobx';
          import { connect } from 'react-redux';

          interface ${PROPS_TYPE_IDENTIFIER} {}

          class ${name} extends React.PureComponent<${PROPS_TYPE_IDENTIFIER}> {
            render() {
              return ${expectJsx};
            }
          }

          export default hoc1(hoc2(observer(${name})));
        `
      );
    });
  });
});
