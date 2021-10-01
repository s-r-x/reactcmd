import { IStyleBuildSpec, IStyleBuildArtifacts } from '../interface';
import { AbstractStyleBuilder } from './abstract';

export class SassStyleBuilder extends AbstractStyleBuilder {
  build(rawSpec: IStyleBuildSpec): IStyleBuildArtifacts {
    const { rootClass, rootTag: tag } = this.normalizeSpec(rawSpec);
    const filename = 'styles.sass';
    return {
      standalone: {
        filename,
        content: `
          ${rootClass}
            cursor: inherit
				`,
      },
      headImport: `import "./${filename}"`,
      render(children) {
        return `
					<${tag} className="${rootClass}">
						${children}
					</${tag}>
				`;
      },
    };
  }
}
