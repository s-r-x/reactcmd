import { IStyleBuildSpec, IStyleBuildArtifacts } from '../interface';
import { AbstractStyleBuilder } from './abstract';

export class CssStyleBuilder extends AbstractStyleBuilder {
  build(rawSpec: IStyleBuildSpec): IStyleBuildArtifacts {
    const { rootClass, rootTag: tag } = this.normalizeSpec(rawSpec);
    const filename = 'styles.css';
    return {
      standalone: {
        filename,
        content: `
          .${rootClass} {}
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
