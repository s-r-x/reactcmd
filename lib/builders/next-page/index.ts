import { injectable } from 'inversify';
import { ComponentBuilder } from '../component';
import j from 'jscodeshift';
import _ from 'lodash';
import { Maybe } from '../../typings/utils';
import {
  DEFAULT_NEXT_PAGE_NAME,
  NEXT_GET_STATIC_PATHS_TYPE,
  NEXT_GET_STATIC_PROPS_TYPE,
  NEXT_GSSP_TYPE,
} from './constants';

@injectable()
export class NextPageBuilder extends ComponentBuilder {
  static override new() {
    return new this();
  }
  private getStaticProps = false;
  private getStaticPaths = false;
  private getServerSideProps = false;

  override reset() {
    this.getStaticPaths = false;
    this.getStaticProps = false;
    this.getServerSideProps = false;
    return super.reset();
  }
  withGetStaticProps() {
    this.getStaticProps = true;
    return this;
  }
  withGetStaticPaths() {
    this.getStaticPaths = true;
    return this;
  }
  withGetServerSideProps() {
    this.getServerSideProps = true;
    return this;
  }
  override build(): string {
    const { nextImport, declarations } = this;
    this.withComponentName(DEFAULT_NEXT_PAGE_NAME);
    if (nextImport) {
      this.withExtraImports([nextImport]);
    }
    if (!_.isEmpty(declarations)) {
      this.withExtraVarDeclarations(declarations);
    }
    return super.build();
  }
  private get nextImport(): Maybe<j.ImportDeclaration> {
    if (!this.useTs) return null;
    const specifiers: j.ImportSpecifier[] = [];
    if (this.getServerSideProps) {
      specifiers.push(j.importSpecifier(j.identifier(NEXT_GSSP_TYPE)));
    }
    if (this.getStaticPaths) {
      specifiers.push(
        j.importSpecifier(j.identifier(NEXT_GET_STATIC_PATHS_TYPE))
      );
    }
    if (this.getStaticProps) {
      specifiers.push(
        j.importSpecifier(j.identifier(NEXT_GET_STATIC_PROPS_TYPE))
      );
    }
    if (_.isEmpty(specifiers)) return null;
    return j.importDeclaration(specifiers, j.literal('next'));
  }
  private get declarations(): j.ExportDeclaration[] {
    return [
      this.getServerSideProps && this.getServerSidePropsDeclaration,
      this.getStaticProps && this.getStaticPropsDeclaration,
      this.getStaticPaths && this.getStaticPathsDeclaration,
    ]
      .filter(Boolean)
      .map(decl => j.exportDeclaration(false, decl as j.VariableDeclaration));
  }
  private get getStaticPropsDeclaration(): j.VariableDeclaration {
    const identifier = j.identifier('getStaticProps');
    if (this.useTs) {
      identifier.typeAnnotation = j.tsTypeAnnotation(
        j.tsTypeReference(j.identifier(NEXT_GET_STATIC_PROPS_TYPE))
      );
    }
    return j.variableDeclaration('const', [
      j.variableDeclarator(
        identifier,
        j.arrowFunctionExpression([], j.blockStatement([]))
      ),
    ]);
  }
  private get getServerSidePropsDeclaration(): j.VariableDeclaration {
    const identifier = j.identifier('getServerSideProps');
    if (this.useTs) {
      identifier.typeAnnotation = j.tsTypeAnnotation(
        j.tsTypeReference(j.identifier(NEXT_GSSP_TYPE))
      );
    }
    return j.variableDeclaration('const', [
      j.variableDeclarator(
        identifier,
        j.arrowFunctionExpression([], j.blockStatement([]))
      ),
    ]);
  }
  private get getStaticPathsDeclaration(): j.VariableDeclaration {
    const identifier = j.identifier('getStaticPaths');
    if (this.useTs) {
      identifier.typeAnnotation = j.tsTypeAnnotation(
        j.tsTypeReference(j.identifier(NEXT_GET_STATIC_PATHS_TYPE))
      );
    }
    return j.variableDeclaration('const', [
      j.variableDeclarator(
        identifier,
        j.arrowFunctionExpression([], j.blockStatement([]))
      ),
    ]);
  }
}
