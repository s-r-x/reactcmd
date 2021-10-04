import { IStyleBuildSpec, IStyleBuildArtifacts } from '../interface';
import { AbstractStyleBuilder } from './abstract';

export class MuiStyleBuilder extends AbstractStyleBuilder {
  build(rawSpec: IStyleBuildSpec): IStyleBuildArtifacts {
    const { ts, rootTag: tag, rootClass } = this.normalizeSpec(rawSpec);
    const hookName = 'useStyles';
    // TODO:: insert useStyles hook somehow somewhere
    return {
      standalone: {
        filename: `styles.${ts ? 'ts' : 'js'}`,
        content: `
          import { makeStyles } from '@material-ui/styles';

          export const ${hookName} = makeStyles({
            ${rootClass}: {}
          });
				`,
      },
      imports: [
        {
          named: [hookName],
          from: './styles',
        },
      ],
      render(children) {
        return `
					<${tag} className={cls.${rootClass}}>
						${children}
					</${tag}>
				`;
      },
    };
  }
}
