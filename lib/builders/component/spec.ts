import { ComponentBuilder as Builder } from '.';
import j from 'jscodeshift';
import { expectCodeToEq } from '../../../tests/utils/expect-code-to-eq';
import {
  DEFAULT_COMPONENT_NAME,
  MOBX_HOC_NAME,
  PROPS_TYPE_IDENTIFIER,
  REDUX_CONNECTOR_NAME,
  REDUX_HOC_NAME,
  REDUX_TYPE_EXTRACTOR_NAME,
} from './constants';

const REDUX_TS_IMPORTS = `import { ${REDUX_HOC_NAME}, ${REDUX_TYPE_EXTRACTOR_NAME} } from 'react-redux'`;
const MOBX_IMPORTS = `import { ${MOBX_HOC_NAME}} from 'mobx'`;
const REDUX_TS_PROPS = `interface ${PROPS_TYPE_IDENTIFIER} extends ${REDUX_TYPE_EXTRACTOR_NAME}<typeof ${REDUX_CONNECTOR_NAME}> {}`;

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
    it(`should apply mobx ${MOBX_HOC_NAME} hoc`, () => {
      expectCodeToEq(
        Builder.new().withMobx().buildDefaultExport(),
        `export default ${MOBX_HOC_NAME}(${DEFAULT_COMPONENT_NAME});`
      );
    });
    it(`should apply redux connector`, () => {
      expectCodeToEq(
        Builder.new().withRedux().buildDefaultExport(),
        `export default ${REDUX_CONNECTOR_NAME}(${DEFAULT_COMPONENT_NAME});`
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
         ${MOBX_IMPORTS};
        `
      );
    });
    it('should include redux imports', () => {
      expectCodeToEq(
        Builder.new().withRedux().buildImports(),
        `import React from 'react';
         import { ${REDUX_HOC_NAME} } from 'react-redux';
        `
      );
    });
    it(`should include redux ${REDUX_TYPE_EXTRACTOR_NAME} import when using with typescript`, () => {
      expectCodeToEq(
        Builder.new().withRedux().withTypescript().buildImports(),
        `import React from 'react';
         ${REDUX_TS_IMPORTS};
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
  describe('buildVariablesDeclaration', () => {
    it(`should include redux ${REDUX_CONNECTOR_NAME} when using with redux`, () => {
      const src = Builder.new().withRedux().buildVariablesDeclaration();
      expectCodeToEq(
        src,
        `
        const ${REDUX_CONNECTOR_NAME} = ${REDUX_HOC_NAME}(state => state) 
      `
      );
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
    it('should extract props from redux', () => {
      const src = Builder.new().withRedux().buildPropsDeclaration();
      expectCodeToEq(src, REDUX_TS_PROPS);
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
          ${MOBX_IMPORTS};
          ${REDUX_TS_IMPORTS};

          const ${REDUX_CONNECTOR_NAME} = ${REDUX_HOC_NAME}(state => state);

          ${REDUX_TS_PROPS};

          class ${name} extends React.PureComponent<${PROPS_TYPE_IDENTIFIER}> {
            render() {
              return ${expectJsx};
            }
          }

          export default hoc1(hoc2(${MOBX_HOC_NAME}(${REDUX_CONNECTOR_NAME}(${name}))));
        `
      );
    });
  });
});
