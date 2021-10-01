import { IStyleBuildSpec, IStyleBuildArtifacts } from '../interface';
import { AbstractStyleBuilder } from './abstract';

export class RadiumStyleBuilder extends AbstractStyleBuilder {
  build(rawSpec: IStyleBuildSpec): IStyleBuildArtifacts {
    const { rootClass, ts, rootTag: tag } = this.normalizeSpec(rawSpec);
    const libDefaultExport = 'Radium';
    // TODO:: type styles
    return {
      standalone: {
        filename: `styles.${ts ? 'ts' : 'js'}`,
        content: `
          export const styles = {
            ${rootClass}: {}
          };
				`,
      },
      headImport: `
        import ${libDefaultExport} from "radium";
        import { styles } from './styles';
      `,
      hoc(component) {
        return `${libDefaultExport}(${component})`;
      },
      render(children) {
        return `
					<${tag} className={css(styles.${rootClass})}>
						${children}
					</${tag}>
				`;
      },
    };
  }
}
