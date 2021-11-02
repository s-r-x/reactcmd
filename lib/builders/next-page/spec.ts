import { NextPageBuilder } from '.';
import { expectCodeToEq } from '../../../tests/utils/expect-code-to-eq';
import { DEFAULT_NEXT_PAGE_NAME } from './constants';
import j from 'jscodeshift';
import { stringifyAst } from '../../utils/ast';

describe('NextPageBuilder', () => {
  describe('build', () => {
    const jsx = j.jsxElement(
      j.jsxOpeningElement(j.jsxIdentifier('span'), []),
      j.jsxClosingElement(j.jsxIdentifier('span')),
      [j.stringLiteral('final')]
    );
    const children = stringifyAst(jsx);
    it('should build next page with typescript', () => {
      const page = NextPageBuilder.new()
        .withTypescript()
        .withGetServerSideProps()
        .withGetStaticPaths()
        .withGetStaticProps()
        .withJsx(jsx)
        .build();
      expectCodeToEq(
        page,
        `
      import React from "react";
      import { GetServiceSideProps, GetSTaticPaths, GetStaticProps } from "next";
          
      export const getServerSideProps: GetServiceSideProps = () => {};
      export const getStaticProps: GetStaticProps = () => {};
      export const getStaticPaths: GetSTaticPaths = () => {};
          
      interface Props {}
          
      const ${DEFAULT_NEXT_PAGE_NAME}: React.FC<Props> = props => {
          return ${children}
      };
      
      export default ${DEFAULT_NEXT_PAGE_NAME};
 
      `
      );
    });
    it('should build next page with javascript', () => {
      const page = NextPageBuilder.new()
        .withGetServerSideProps()
        .withGetStaticPaths()
        .withGetStaticProps()
        .withJsx(jsx)
        .build();
      expectCodeToEq(
        page,
        `
      import React from "react";
          
      export const getServerSideProps = () => {};
      export const getStaticProps = () => {};
      export const getStaticPaths = () => {};
          
      const ${DEFAULT_NEXT_PAGE_NAME} = props => {
          return ${children}
      };
      
      export default ${DEFAULT_NEXT_PAGE_NAME};
 
      `
      );
    });
  });
});
