import { IStyleBuildSpec, IStyleBuildArtifacts } from '../interface';
import { AbstractStyleBuilder } from './abstract';

export class StyledJsxStyleBuilder extends AbstractStyleBuilder {
  build(rawSpec: IStyleBuildSpec): IStyleBuildArtifacts {
    const { rootClass, rootTag: tag } = this.normalizeSpec(rawSpec);
    return {
      standalone: null,
      render(children) {
        return `
					<${tag} className="${rootClass}">
						${children}
						<style jsx>{\`
							.${rootClass} {}
						\`}</style>
					</${tag}>
				`;
      },
    };
  }
}
