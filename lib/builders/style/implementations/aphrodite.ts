import { IStyleBuildSpec, IStyleBuildArtifacts } from '../interface';
import { AbstractStyleBuilder } from './abstract';

export class AphroditeStyleBuilder extends AbstractStyleBuilder {
  build(rawSpec: IStyleBuildSpec): IStyleBuildArtifacts {
    const { rootClass, ts, rootTag: tag } = this.normalizeSpec(rawSpec);
    return {
      standalone: {
        filename: `styles.${ts ? 'ts' : 'js'}`,
        content: `
          import { StyleSheet } from 'aphrodite';

          export const styles = StyleSheet.create({
            ${rootClass}: {}
          });
				`,
      },
      headImport: `
        import { css } from 'aphrodite';
        import { styles } from './styles';
      `,
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
