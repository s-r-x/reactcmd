import { expect } from 'chai';
import { ModuleImportsBuilder } from '.';
import { expectCodeToEq } from '../../tests/expect-generated-code-to-eq';

describe('ModuleImportsBuilder', () => {
  describe('build', () => {
    it('should generate correct output with default imports', () => {
      const expected = `import React from "react"`;
      const builder = new ModuleImportsBuilder();
      builder.addImport({
        from: 'react',
        default: 'React',
      });
      expectCodeToEq(builder.render(), expected);
    });
    it('should generate correct output with named imports', () => {
      const expected = `import {useEffect, useState} from "react"`;
      const builder = new ModuleImportsBuilder();
      builder.addImport({
        from: 'react',
        named: ['useEffect', 'useState'],
      });
      expectCodeToEq(builder.render(), expected);
    });
    it('should generate correct output with mixed imports', () => {
      const expected = `import React, {useEffect, useState} from "react"`;
      const builder = new ModuleImportsBuilder();
      builder.addImport({
        from: 'react',
        default: 'React',
        named: ['useEffect', 'useState'],
      });
      expectCodeToEq(builder.render(), expected);
    });
    it('should generate correct output with multiple imports', () => {
      const expected = `
				import React, {useEffect, useState} from "react";
				import _ from "lodash";
			`;
      const builder = new ModuleImportsBuilder();
      builder.addImport({
        from: 'react',
        default: 'React',
        named: ['useEffect', 'useState'],
      });
      builder.addImport({
        from: 'lodash',
        default: '_',
      });
      expectCodeToEq(builder.render(), expected);
    });
    it('should return empty string if there are no imports', () => {
      const builder = new ModuleImportsBuilder();
      expect(builder.render()).to.be.empty.string;
    });
  });
  describe('reset', () => {
    it('should reset imports', () => {
      const builder = new ModuleImportsBuilder();
      builder.addImport({ default: '_', from: 'lodash' });
      builder.reset();
      expect(builder.render()).to.be.empty.string;
    });
  });
});
