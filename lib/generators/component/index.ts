import { inject, injectable } from 'inversify';
import { ComponentBuilder } from '../../builders/component';
import {
  IStyleBuildArtifacts,
  TStyleBuilderFactory,
} from '../../builders/style/interface';
import { TOKENS } from '../../ioc/tokens';
import { IComponentGenInputNormalizer } from '../../normalizers/component-gen-input/interface';
import { TStylingStrategy } from '../../typings/styling';
import { Maybe } from '../../typings/utils';
import { IComponentGenerator, IGenerateComponentOptions } from './interface';

@injectable()
export class ComponentGenerator implements IComponentGenerator {
  constructor(
    @inject(TOKENS.styBldrFctry)
    private styleBuilderFactory: TStyleBuilderFactory,
    private componentBuilder: ComponentBuilder,
    @inject(TOKENS.cmpGenInputNrmlz)
    private inputNormalizer: IComponentGenInputNormalizer
  ) {}
  async gen(rawOpts: IGenerateComponentOptions): Promise<void> {
    const { componentBuilder: builder } = this;
    const opts = await this.inputNormalizer.normalize(rawOpts);
    let styleArtifacts: Maybe<IStyleBuildArtifacts> = null;
    builder.withComponentName(opts.name);
    if (opts.style && !opts.nostyle) {
      const styleBuilder = this.styleBuilderFactory(
        opts.style as TStylingStrategy
      );
      styleArtifacts = styleBuilder.build({
        rootTag: opts.tag,
        ts: opts.ts,
      });
    }
    if (opts.fc) {
      builder.asFC();
    }
    if (opts.class) {
      builder.asClassComponent();
    }
    if (opts.ts) {
      builder.withTypescript();
    }
    if (opts.tag) {
      builder.withTag(opts.tag);
    }
    if (opts.mobx) {
      builder.withMobx();
    }
    if (opts.redux) {
      builder.withRedux();
    }
    if (opts.pure) {
      builder.makePure();
    }
    if (styleArtifacts?.imports) {
      builder.withExtraImports(styleArtifacts.imports);
    }
    if (styleArtifacts?.hocs) {
      builder.withExtraHocs(styleArtifacts.hocs);
    }
    if (styleArtifacts?.jsx) {
      builder.withJsx(styleArtifacts.jsx);
    }
    const component = builder.build();
    console.log(component);
    return Promise.resolve();
  }
}
