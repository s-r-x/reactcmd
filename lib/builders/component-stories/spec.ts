import { ComponentStoriesBuilder as Builder } from '.';
import { expectCodeToEq } from '../../../tests/expect-generated-code-to-eq';
import {
  SB_EXAMPLE_EXPORT_NAME,
  SB_META_EXPORT_NAME,
  SB_META_IMPORT_NAME,
} from './constants';

describe('ComponentStoriesBuilder', () => {
  describe('build', () => {
    it('should build', () => {
      const builder = new Builder();
      const name = 'Name';
      const importPath = './index';
      const stories = builder
        .withTypescript()
        .withComponentName(name)
        .withComponentImportPath(importPath)
        .build();
      expectCodeToEq(
        `
				import React from "react";
				import { ${SB_META_IMPORT_NAME} } from "@storybook/react";
				import ${name} from "${importPath}";

				const ${SB_META_EXPORT_NAME}: ${SB_META_IMPORT_NAME} = {
				    component: ${name},
				    title: "${name}"
				};
				export default ${SB_META_EXPORT_NAME};
				export const ${SB_EXAMPLE_EXPORT_NAME}: React.VFC = () => <${name} />;
			`,
        stories
      );
    });
  });
});
