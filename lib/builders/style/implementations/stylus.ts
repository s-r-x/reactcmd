import { IStyleBuildSpec, IStyleBuildArtifacts } from '../interface';
import { AbstractStyleBuilder } from './abstract';

export class StylusStyleBuilder extends AbstractStyleBuilder {
  build(rawSpec: IStyleBuildSpec): IStyleBuildArtifacts {
    const { rootClass, rootTag: tag } = this.normalizeSpec(rawSpec);
    const filename = 'styles.styl';
    return {
      standalone: {
        filename,
        content: `
          .${rootClass}
            cursor: inherit
				`,
      },
      imports: [
        {
          from: `./${filename}`,
        },
      ],
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
