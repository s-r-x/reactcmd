import { IStyleBuildSpec, IStyleBuildArtifacts } from '../interface';
import { AbstractStyleBuilder } from './abstract';

export class LinariaStyleBuilder extends AbstractStyleBuilder {
  build(rawSpec: IStyleBuildSpec): IStyleBuildArtifacts {
    const {
      ts,
      rootTag: tag,
      rootClass,
    } = this.normalizeSpecAndCapitalizeRootClass(rawSpec);
    return {
      standalone: {
        filename: `styled.${ts ? 'ts' : 'js'}`,
        content: `
          import { styled } from "@linaria/react";

					export const ${rootClass} = styled.${tag}\`\`;
				`,
      },
      headImport: `import {${rootClass}} from "./styled"`,
      render(children) {
        return `
					<${rootClass}>
						${children}
					</${rootClass}>
				`;
      },
    };
  }
}
